import { NextFunction, Request, Response } from "express";
import { addMinutes } from "date-fns";
import { sendResponse } from "../utils/sendResponse";
import {
  ResetChangeInput,
  ResetSendSchemaInput,
  ResetVerifyTokenInput,
} from "../schemas/password.schema";
import { getUserByQueryService } from "../services/user.service";
import { sendMailPasswordResetService } from "../services/mailer.service";
import { createHashTokenService } from "../services/global.service";

// Send email reset password
export const passwordResetSendController = async (
  req: Request<{}, {}, ResetSendSchemaInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    // user
    const userEmail = req.body.email;
    const user = await getUserByQueryService({
      email: userEmail,
      active: true,
    });
    if (!user) {
      return sendResponse(req, res, 403, "Usuário não encontrado!", []);
    }

    /**
     * Envio de email
     */
    const emailSended = await sendMailPasswordResetService(user);
    if (emailSended?.status === "success") {
      user.password_reseted = false;
      user.password_reset_token = emailSended.passwordResetToken;
      user.password_reset_token_expires = emailSended.passwordResetTokenExpires;
      await user.save();

      // Send response
      return sendResponse(
        req,
        res,
        200,
        "Uma mensagem com um link para redefinição foi enviado para o seu email!",
        []
      );
    } else {
      // Send response
      return sendResponse(req, res, 500, emailSended?.message, []);
    }
  } catch (err: any) {
    next(err);
  }
};

// Verify token reset password
export const passwordResetVerifyTokenController = async (
  req: Request<ResetVerifyTokenInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    // params
    const token = await createHashTokenService(
      req.params.token as unknown as string
    );

    // user
    const user = await getUserByQueryService({
      passwordResetToken: token,
      active: true,
    });
    if (!user) {
      return sendResponse(req, res, 403, "Usuário não encontrado!", []);
    }
    // link expires
    if (!user.password_reset_token_expires) {
      return sendResponse(
        req,
        res,
        401,
        "Link para redefinição de senha inválido!",
        []
      );
    } else if (new Date() > user.password_reset_token_expires) {
      return sendResponse(
        req,
        res,
        401,
        "Link para redefinição de senha expirado!",
        []
      );
    }

    // Send response
    return sendResponse(
      req,
      res,
      200,
      "Link para redefinição de senha válido!",
      []
    );
  } catch (err: any) {
    next(err);
  }
};

// Reset password
export const passwordResetChangeController = async (
  req: Request<ResetChangeInput["params"], {}, ResetChangeInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    // params
    const token = await createHashTokenService(
      req.params.token as unknown as string
    );

    // user
    const user = await getUserByQueryService({
      passwordResetToken: token,
      active: true,
    });
    if (!user) {
      return sendResponse(
        req,
        res,
        401,
        "Link para redefinição de senha inválido!",
        []
      );
    }

    // link expires
    if (!user.password_reset_token_expires) {
      return sendResponse(
        req,
        res,
        401,
        "Link para redefinição de senha inválido!",
        []
      );
    } else if (addMinutes(new Date(), 2) > user.password_reset_token_expires) {
      // adiciona 2 minutos ao tempo de expiração, pois pode ser que no momento de validação, esteja válido
      // mas expire em tela... assim a pessoa tem até 2 minutos para requisitar alteração

      return sendResponse(
        req,
        res,
        401,
        "Link para redefinição de senha inválido!",
        []
      );
    }

    const { password } = req.body;

    // Update the password
    user.password = password;
    // Hash the new password before saving
    await user.hashPassword();

    // Update aux fileds
    user.password_reseted = true;
    user.password_reset_token = null;
    user.password_reset_token_expires = null;

    // Save the updated user
    await user.save();

    // Send response
    return sendResponse(req, res, 200, "Senha atualizada com sucesso!", []);
  } catch (err: any) {
    next(err);
  }
};
