require("dotenv").config();
import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import {
  GetUserInput,
  CreateUserInput,
  UpdateUserInput,
  DeleteUserInput,
} from "../schemas/user.schema";
import { sendMailEmailConfirm } from "../services/mailer.service";
import {
  getUserByIdService,
  getUsersService,
  createUserService,
  updateUserService,
  deleteUserService,
  comparePasswords,
} from "../services/user.service";
import { deleteSessionsByUserService } from "../services/session.service";
import { uploadToS3Service } from "../services/s3.service";
import { validStringBase64Service } from "../services/global.service";

// Get user
export const getUserController = async (
  req: Request<GetUserInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    // params
    const userId = req.params.userId as unknown as number;

    const user = await getUserByIdService(userId);
    if (!user) {
      return sendResponse(req, res, 403, "Usuário não encontrado!", []);
    }

    // Send response
    return sendResponse(req, res, 200, "", [user]);
  } catch (err: any) {
    next(err);
  }
};

// Get users
export const getUsersController = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await getUsersService();

    // Send response
    return sendResponse(req, res, 200, "", users);
  } catch (err: any) {
    next(err);
  }
};

// Create user
export const createUserController = async (
  req: Request<{}, {}, CreateUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    // params
    const userId = res.locals.user.id as unknown as number;
    let user = await getUserByIdService(userId);
    if (!user) {
      return sendResponse(req, res, 403, "Usuário não encontrado!", []);
    }

    const { name, email, login, password, leader } = req.body;

    const newUser = await createUserService({
      name,
      email: email.toLowerCase(),
      login,
      password,
      main: false,
      leader,
      createdBy: user.id,
    });

    /**
     * Envio de email
     */
    const emailSended = await sendMailEmailConfirm(newUser);
    if (emailSended?.status === "success") {
      newUser.emailConfirmed = false;
      newUser.emailConfirmToken = emailSended.emailConfirmToken;
      newUser.emailConfirmTokenExpires = emailSended.emailConfirmTokenExpires;
    }

    await newUser.save();

    // Send response
    return sendResponse(
      req,
      res,
      201,
      "Uma mensagem com um link para confirmação foi enviado para o email do usuário!",
      [newUser]
    );
  } catch (err: any) {
    if (err.code === "23505") {
      // Send response
      return sendResponse(req, res, 409, err.message, []);
    }
    next(err);
  }
};

// Update user
export const updateUserController = async (
  req: Request<UpdateUserInput["params"], {}, UpdateUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  // params
  const userId = req.params.userId as unknown as number;

  let user = await getUserByIdService(userId);
  if (!user) {
    return sendResponse(req, res, 403, "Usuário não encontrado!", []);
  }

  /**
   * Se email na base for diferente do campo passado para atualização
   * exige uma nova confirmação de email
   */
  if (user.email.toLowerCase() !== req.body.email.toLowerCase()) {
    /**
     * Envio de email
     */
    const emailSended = await sendMailEmailConfirm(user);
    if (emailSended?.status === "success") {
      user.emailConfirmToken = emailSended.emailConfirmToken;
      user.emailConfirmTokenExpires = emailSended.emailConfirmTokenExpires;
    }
  }

  const photo = req.body.photo;
  if (photo !== undefined) {
    if (photo === null) {
      req.body.photo =
        "https://prime-repo.s3.sa-east-1.amazonaws.com/main/users/default-user-photo.jpeg";
    } else if (photo !== user.photo) {
      const validImage = await validStringBase64Service(photo);
      if (validImage) {
        // Save on S3
        const s3Save = await uploadToS3Service("users", photo);
        if (s3Save.status !== "success") {
          // Send response
          return sendResponse(req, res, 500, s3Save.message, []);
        }

        req.body.photo = s3Save.url;
      } else {
        req.body.photo = user.photo;
      }
    }
  }

  // Verificar se o campo passwordOld foi fornecido e corresponde à senha atual
  const { passwordOld, passwordNew } = req.body;
  if (passwordOld !== undefined && passwordNew !== undefined) {
    if (!(await comparePasswords(passwordOld, user.password))) {
      return sendResponse(
        req,
        res,
        403,
        "A senha antiga fornecida é inválida!",
        []
      );
    }

    req.body.password = await bcrypt.hash(passwordNew, 12);
  } else {
    req.body.password = user.password;
  }

  user = await updateUserService(user, req.body);

  // Send response
  return sendResponse(req, res, 200, "Usuário atualizado com sucesso!", [user]);
};

// Inactive user
export const deleteUserController = async (
  req: Request<DeleteUserInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    // params
    const userId = req.params.userId as unknown as number;

    let user = await getUserByIdService(userId);
    if (!user) {
      return sendResponse(req, res, 403, "Usuário não encontrado!", []);
    }

    user = await deleteUserService(user);

    // Inativar sessões
    if (user) {
      await deleteSessionsByUserService(user);
    }

    // Send response
    return sendResponse(req, res, 200, "Usuário inativado com sucesso!", [
      user,
    ]);
  } catch (err: any) {
    next(err);
  }
};
