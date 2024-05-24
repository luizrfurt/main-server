require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import {
  DisableContextApplicationInput,
  EnableContextApplicationInput,
} from "../schemas/contextApplication.schema";
import {
  enableContextApplicationService,
  disableContextApplicationService,
} from "../services/contextApplication.service";
import { getContextByIdService } from "../services/context.service";
import { getApplicationByIdService } from "../services/application.service";

// Enabled context application
export const enableContextApplicationController = async (
  req: Request<EnableContextApplicationInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    // params
    const contextId = req.params.contextId as unknown as number;
    const applicationId = req.params.applicationId as unknown as number;

    const context = await getContextByIdService(contextId);
    if (!context) {
      return sendResponse(req, res, 403, "Contexto não encontrado!", []);
    }

    const application = await getApplicationByIdService(applicationId);
    if (!application) {
      return sendResponse(req, res, 403, "Applicativo não encontrado!", []);
    }

    const contextFound = await enableContextApplicationService(
      contextId,
      applicationId
    );

    // Send response
    return sendResponse(
      req,
      res,
      200,
      "Aplicativo ativado com sucesso!",
      contextFound
    );
  } catch (err: any) {
    next(err);
  }
};

// Disable context application
export const disableContextApplicationController = async (
  req: Request<DisableContextApplicationInput["params"], {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    // params
    const contextId = req.params.contextId as unknown as number;
    const applicationId = req.params.applicationId as unknown as number;

    const context = await getContextByIdService(contextId);
    if (!context) {
      return sendResponse(req, res, 403, "Contexto não encontrado!", []);
    }

    const application = await getApplicationByIdService(applicationId);
    if (!application) {
      return sendResponse(req, res, 403, "Applicativo não encontrado!", []);
    }

    const contextFound = await disableContextApplicationService(
      contextId,
      applicationId
    );

    // Send response
    return sendResponse(
      req,
      res,
      200,
      "Aplicativo desativado com sucesso!",
      contextFound
    );
  } catch (err: any) {
    next(err);
  }
};
