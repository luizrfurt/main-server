require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { verifyJwt } from "../utils/jwt";
import { sendResponse } from "../utils/sendResponse";
import { ValidateSessionSubInput } from "../schemas/session.schema";
import { getUserByIdService } from "../services/user.service";
import { getSessionService } from "../services/session.service";

// Valid session (main)
export const validateSessionMainController = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    let accessToken = null;

    accessToken = req.cookies.__Acs_tkn;

    if (!accessToken) {
      // Send response
      return sendResponse(req, res, 401, "Acesso negado!", []);
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: string }>(
      accessToken,
      "accessTokenPublicKey"
    );
    if (!decoded) {
      // Send response
      return sendResponse(req, res, 401, "Acesso negado!", []);
    }

    // Check if the user has a valid session
    const session = await getSessionService({
      user: decoded.sub,
      access_token: accessToken,
      active: true,
    });
    if (!session) {
      // Send response
      return sendResponse(req, res, 401, "Acesso negado!", []);
    }

    // Check if the user still exist
    const userId = decoded.sub as unknown as number;
    const user = await getUserByIdService(userId);
    if (!user) {
      // Send response
      return sendResponse(req, res, 401, "Acesso negado!", []);
    }

    // Send response
    return sendResponse(req, res, 200, "Token válido para uso!", [user]);
  } catch (err: any) {
    next(err);
  }
};

// Valid session (sub)
export const validateSessionSubController = async (
  req: Request<{}, {}, ValidateSessionSubInput["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    let accessToken = null;

    accessToken = req.body.accessToken;

    if (!accessToken) {
      // Send response
      return sendResponse(req, res, 401, "Acesso negado!", []);
    }

    // Validate the access token
    const decoded = verifyJwt<{ sub: string }>(
      accessToken,
      "accessTokenPublicKey"
    );
    if (!decoded) {
      // Send response
      return sendResponse(req, res, 401, "Acesso negado!", []);
    }

    // Check if the user has a valid session
    const session = await getSessionService({
      user: decoded.sub,
      access_token: accessToken,
      active: true,
    });
    if (!session) {
      // Send response
      return sendResponse(req, res, 401, "Acesso negado!", []);
    }

    // Check if the user still exist
    const userId = decoded.sub as unknown as number;
    const user = await getUserByIdService(userId);
    if (!user) {
      // Send response
      return sendResponse(req, res, 401, "Acesso negado!", []);
    }

    // Send response
    return sendResponse(req, res, 200, "Token válido para uso!", [user]);
  } catch (err: any) {
    next(err);
  }
};
