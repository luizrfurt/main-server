require("dotenv").config();
import { addMinutes } from "date-fns";
import AppError from "../utils/appError";
import Mailer from "../utils/mailer";
import { User } from "../entities/user.entity";
import { createTokenService } from "./global.service";

// Custom

export const sendMailEmailConfirm = async (user: User) => {
  try {
    const userMail = user;

    const { hashedToken, token } = await createTokenService();
    const emailConfirmToken = hashedToken;
    const emailConfirmTokenExpires = addMinutes(new Date(), 10);

    // Get correct url frontend (development or production)
    const urlFrontend =
      (process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL_PRODUCTION
        : process.env.CLIENT_URL_DEVELOPMENT) +
      ":" +
      process.env.PORT_CLIENT;

    const redirectUrl = `${urlFrontend}/email/confirm/verify/${token}`;

    try {
      await new Mailer(userMail, redirectUrl).sendEmailConfirm();

      const emailSended = {
        status: "success",
        message:
          "Uma mensagem com um link de confirmação foi enviado para seu email!",
        emailConfirmToken,
        emailConfirmTokenExpires,
      };

      return emailSended;
    } catch (error) {
      const emailSended = {
        status: "error",
        message: `Erro ao enviar email: ${error}`,
        emailConfirmToken: null,
        emailConfirmTokenExpires: null,
      };

      return emailSended;
    }
  } catch (err: any) {
    throw new AppError(
      500,
      `Erro ao enviar confirmação de email: ${err.message}`
    );
  }
};

export const sendMailPasswordResetService = async (user: User) => {
  try {
    const userMail = user;

    const { hashedToken, token } = await createTokenService();
    const passwordResetToken = hashedToken;
    const passwordResetTokenExpires = addMinutes(new Date(), 10);

    // Get correct url frontend (development or production)
    const urlFrontend =
      (process.env.NODE_ENV === "production"
        ? process.env.CLIENT_URL_PRODUCTION
        : process.env.CLIENT_URL_DEVELOPMENT) +
      ":" +
      process.env.PORT_CLIENT;

    const redirectUrl = `${urlFrontend}/password/reset/verify/${token}`;

    try {
      await new Mailer(userMail, redirectUrl).sendPasswordReset();

      const emailSended = {
        status: "success",
        message:
          "Uma mensagem com um link de confirmação foi enviado para seu email!",
        passwordResetToken,
        passwordResetTokenExpires,
      };

      return emailSended;
    } catch (error) {
      const emailSended = {
        status: "error",
        message: `Erro ao enviar email: ${error}`,
        passwordResetToken: null,
        passwordResetTokenExpires: null,
      };

      return emailSended;
    }
  } catch (err: any) {
    throw new AppError(
      500,
      `Erro ao enviar email de redefinição de senha: ${err.message}`
    );
  }
};
