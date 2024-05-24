require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { getApplicationsService } from "../services/application.service";

// Get applications
export const getApplicationsController = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const applications = await getApplicationsService();

    // Send response
    return sendResponse(req, res, 200, "", applications);
  } catch (err: any) {
    next(err);
  }
};
