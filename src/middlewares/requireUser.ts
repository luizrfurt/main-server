import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";

export const requireUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = res.locals.user;

    if (!user) {
      return sendResponse(
        req,
        res,
        401,
        "Acesso negado!",
        []
      );
    }

    next();
  } catch (err: any) {
    next(err);
  }
};
