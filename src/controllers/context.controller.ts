require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { getContextsService } from "../services/context.service";

// Get contexts
export const getContextsController = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const contexts = await getContextsService();

    // Send response
    return sendResponse(req, res, 200, "", contexts);
  } catch (err: any) {
    next(err);
  }
};
