require("dotenv").config();
import config from "config";
import crypto from "crypto";
import { CookieOptions, NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { signJwt, verifyJwt } from "../utils/jwt";
import { RegisterUserInput, LoginUserInput } from "../schemas/auth.schema";
import {
  createUserService,
  getUserByIdService,
  getUserByQueryService,
  formatDateExpiresInService,
  signTokensService,
  comparePasswords,
} from "../services/user.service";
import {
  getSessionService,
  createSessionService,
  deleteSessionsService,
} from "../services/session.service";
import { sendMailEmailConfirm } from "../services/mailer.service";
import { initContextService } from "../services/context.service";

const cookiesOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  path: "/",
};

/**
 * Cookies
 */
if (process.env.NODE_ENV === "production") cookiesOptions.secure = true;

const accessTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("accessTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("accessTokenExpiresIn") * 60 * 1000,
};

const refreshTokenCookieOptions: CookieOptions = {
  ...cookiesOptions,
  expires: new Date(
    Date.now() + config.get<number>("refreshTokenExpiresIn") * 60 * 1000
  ),
  maxAge: config.get<number>("refreshTokenExpiresIn") * 60 * 1000,
};

const loggedIn = "loggedIn";

// Register user
export const registerUserController = async (
  req: Request<{}, {}, RegisterUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, login, password } = req.body;

    const newUser = await createUserService({
      name,
      email: email.toLowerCase(),
      login,
      password,
      main: true,
      leader: true,
    });

    // Atribui o ID de si mesmo como sendo o createBy
    newUser.created_by = newUser.id;
    await newUser.save();

    /**
     * Envio de email
     */
    const emailSended = await sendMailEmailConfirm(newUser);
    if (emailSended?.status === "success") {
      newUser.email_confirmed = false;
      newUser.email_confirm_token = emailSended.emailConfirmToken;
      newUser.email_confirm_token_expires =
        emailSended.emailConfirmTokenExpires;
    }

    await newUser.save();

    const context = await initContextService(newUser);

    // Send response
    return sendResponse(
      req,
      res,
      201,
      "Uma mensagem com um link para confirmação foi enviado para o seu email!",
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

// Login user
export const loginUserController = async (
  req: Request<{}, {}, LoginUserInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { login, password } = req.body;
    const user = await getUserByQueryService({ login: login, active: true });

    // Check if user exist
    if (!user) {
      return sendResponse(req, res, 403, "Credenciais inválidas!", []);
    }

    // Check if password is valid
    if (!(await comparePasswords(password, user.password))) {
      return sendResponse(req, res, 403, "Credenciais inválidas!", []);
    }

    // Sign Access and Refresh Tokens
    const {
      accessToken,
      accessTokenExpiresIn,
      refreshToken,
      refreshTokenExpiresIn,
    } = await signTokensService(user);

    // Create Session
    const session = await createSessionService({
      user,
      access_token: accessToken,
      access_token_expires_in: await formatDateExpiresInService(
        accessTokenExpiresIn
      ),
      refresh_token: refreshToken,
      refresh_token_expires_in: await formatDateExpiresInService(
        refreshTokenExpiresIn
      ),
    });

    // Add Cookies
    res.cookie("__Acs_tkn", accessToken, accessTokenCookieOptions);
    res.cookie("__Rfh_tkn", refreshToken, refreshTokenCookieOptions);
    res.cookie("__Ssn_stt", loggedIn, {
      ...accessTokenCookieOptions,
      httpOnly: false,
    });

    let isMobile = false;
    try {
      isMobile = req.headers["x-mobile-app"]?.toString() === "true";
    } catch (err: any) {
      next(err);
    }

    let data: any[] = [user];
    if (isMobile) {
      data = [
        user,
        {
          accessToken: { value: accessToken, expiresIn: accessTokenExpiresIn },
          refreshToken: {
            value: refreshToken,
            expiresIn: refreshTokenExpiresIn,
          },
          loggedIn: loggedIn,
        },
      ];
    }

    // Send response
    return sendResponse(req, res, 200, "Login realizado com sucesso!", data);
  } catch (err: any) {
    next(err);
  }
};

// Refresh access token
export const refreshAccessTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let refreshToken = null;

    refreshToken = req.cookies.__Rfh_tkn;

    const message = "Não foi possível atualizar o access token!";

    if (!refreshToken) {
      return sendResponse(req, res, 403, message, []);
    }

    // Validate refresh token
    const decoded = verifyJwt<{ sub: string }>(
      refreshToken,
      "refreshTokenPublicKey"
    );

    if (!decoded) {
      return sendResponse(req, res, 403, message, []);
    }

    // Check if user has a valid session with refreshToken
    const foundSession = await getSessionService({
      active: true,
      refresh_token: refreshToken,
    });

    if (!foundSession) {
      return sendResponse(req, res, 403, message, []);
    }

    // Check if user still exist
    const user = await getUserByIdService(foundSession.user.id);

    if (!user) {
      return sendResponse(req, res, 403, message, []);
    }

    // Inativar sessões
    const sessions = await deleteSessionsService(
      user,
      foundSession.access_token
    );

    // Sign new access token
    let accessTokenExpiresInMinutes = config.get<number>(
      "accessTokenExpiresIn"
    );
    const accessTokenExpiresIn = new Date();
    accessTokenExpiresIn.setMinutes(
      accessTokenExpiresIn.getMinutes() + accessTokenExpiresInMinutes
    );
    const accessToken = signJwt({ sub: user.id }, "accessTokenPrivateKey", {
      expiresIn: `${accessTokenExpiresInMinutes}m`,
    });

    const newSession = await createSessionService({
      user,
      access_token: accessToken,
      access_token_expires_in: await formatDateExpiresInService(
        accessTokenExpiresIn
      ),
      refresh_token: refreshToken,
      refresh_token_expires_in: foundSession.refresh_token_expires_in,
    });

    // Add Cookies
    res.cookie("__Acs_tkn", accessToken, accessTokenCookieOptions);
    res.cookie("__Ssn_stt", loggedIn, accessTokenCookieOptions);

    let isMobile = false;
    try {
      isMobile = req.headers["x-mobile-app"]?.toString() === "true";
    } catch (err: any) {
      next(err);
    }

    let data: any[] = [user];
    if (isMobile) {
      data = [
        user,
        {
          accessToken: { value: accessToken, expiresIn: accessTokenExpiresIn },
          loggedIn: loggedIn,
        },
      ];
    }

    // Send response
    return sendResponse(req, res, 200, "Token atualizado com sucesso!", data);
  } catch (err: any) {
    next(err);
  }
};

const logout = (res: Response) => {
  res.cookie("__Acs_tkn", "", { maxAge: -1 });
  res.cookie("__Rfh_tkn", "", { maxAge: -1 });
  res.cookie("__Ssn_stt", "", { maxAge: -1 });
};

// Logout user
export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;
    let accessToken = null;

    if (req.headers["x-mobile-app"]?.toString() === "true") {
      accessToken = req.headers["x-access-token"]
        ? req.headers["x-access-token"]
        : null;
    } else {
      accessToken = req.cookies.__Acs_tkn;
    }

    // Inativar sessões
    const sessions = await deleteSessionsService(user, accessToken);

    logout(res);

    // Send response
    return sendResponse(req, res, 200, "Logout realizado com sucesso!", [user]);
  } catch (err: any) {
    next(err);
  }
};

// Get user
export const userController = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    // params
    const userId = res.locals.user.id as unknown as number;

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
