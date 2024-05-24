import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";
import { getUserByIdService } from "../services/user.service";

import {
  deleteSessionsByAccessTokenService,
  getSessionsService,
} from "../services/session.service";
import { sendResponse } from "../utils/sendResponse";

export const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let accessToken = null;

    // Chave para pegar accessToken via header
    // rotas /refresh (post) e /logout (post)
    // rota /user (get)
    if (req.headers["x-mobile-app"]?.toString() === "true") {
      accessToken = req.headers["x-access-token"]
        ? req.headers["x-access-token"]
        : null;
    } else {
      accessToken = req.cookies.__Acs_tkn;
    }

    if (!accessToken) {
      return sendResponse(req, res, 400, "Acesso negado!", []);
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: string }>(
      accessToken,
      "accessTokenPublicKey"
    );

    const message = "Acesso negado!";

    if (!decoded) {
      await deleteSessionsByAccessTokenService(accessToken);
      return sendResponse(req, res, 401, message, []);
    }

    // Check if the user has a valid session
    const session = await getSessionsService({
      user: decoded.sub,
      accessToken,
      active: true,
    });

    if (!session) {
      return sendResponse(req, res, 401, message, []);
    }

    // Check if the user still exist
    const userId = decoded.sub as unknown as number;
    const user = await getUserByIdService(userId);

    if (!user) {
      return sendResponse(req, res, 401, message, []);
    }

    // Add user to res.locals
    res.locals.user = user;

    next();
  } catch (err: any) {
    next(err);
  }
};
