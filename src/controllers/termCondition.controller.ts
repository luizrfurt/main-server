require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../utils/sendResponse";
import { getTermsConditionsService } from "../services/termCondition.service";

// Get terms and conditions
export const getTermsConditionsController = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const termsConditions = await getTermsConditionsService();

    // Send response
    return sendResponse(req, res, 200, "", termsConditions);
  } catch (err: any) {
    next(err);
  }
};
