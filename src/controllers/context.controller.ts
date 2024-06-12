require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { GetContextInput } from "../schemas/context.schema";
import {
  getContextByIdService,
  getContextsService,
} from "../services/context.service";

// Get context
export const getContextController = async (
  req: Request<GetContextInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    // params
    const contextId = req.params.contextId as unknown as number;

    const context = await getContextByIdService(contextId);
    if (!context) {
      return sendResponse(req, res, 403, "Centro de custo não encontrado!", []);
    }

    // Send response
    return sendResponse(req, res, 200, "", context);
  } catch (err: any) {
    next(err);
  }
};

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
