require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { ConfirmVerifyTokenInput } from "../schemas/email.schema";
import {
  getUserByIdService,
  getUserByQueryService,
} from "../services/user.service";
import { sendMailEmailConfirm } from "../services/mailer.service";
import { createHashTokenService } from "../services/global.service";

// Send email confirmation
export const emailConfirmSendController = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    // params
    const userId = res.locals.user.id as unknown as number;

    // user
    const user = await getUserByIdService(userId);
    if (!user) {
      return sendResponse(req, res, 403, "Usuário não encontrado!", []);
    }

    /**
     * Envio de email
     */
    const emailSended = await sendMailEmailConfirm(user);
    if (emailSended?.status === "success") {
      user.email_confirmed = false;
      user.email_confirm_token = emailSended.emailConfirmToken;
      user.email_confirm_token_expires = emailSended.emailConfirmTokenExpires;
      await user.save();

      // Send response
      return sendResponse(
        req,
        res,
        200,
        "Uma mensagem com um link para confirmação foi enviado para o seu email!",
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

// Verify token confirmation
export const emailConfirmVerifyTokenController = async (
  req: Request<ConfirmVerifyTokenInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    // params
    const token = createHashTokenService(req.params.token as unknown as string);

    //user
    const user = await getUserByQueryService({
      emailConfirmToken: token,
      active: true,
    });
    if (!user) {
      return sendResponse(req, res, 403, "Usuário não encontrado!", []);
    }

    // link expires
    if (!user.email_confirm_token_expires) {
      return sendResponse(
        req,
        res,
        401,
        "Link para confirmação de email inválido!",
        []
      );
    } else if (new Date() > user.email_confirm_token_expires) {
      return sendResponse(
        req,
        res,
        401,
        "Link para confirmação de email expirado!",
        []
      );
    }

    // Update aux fileds
    user.email_confirmed = true;
    user.email_confirm_token = null;
    user.email_confirm_token_expires = null;

    // Save the updated user
    await user.save();

    // Send response
    return sendResponse(req, res, 200, "Email confirmado com sucesso!", []);
  } catch (err: any) {
    next(err);
  }
};
