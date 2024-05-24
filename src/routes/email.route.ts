import express from "express";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { validate } from "../middlewares/validate";
import {
  emailConfirmSendController,
  emailConfirmVerifyTokenController,
} from "../controllers/email.controller";
import { emailConfirmVerifyTokenSchema } from "../schemas/email.schema";

const router = express.Router();

// Send email confirmation
router.post(
  "/confirm/send",
  [deserializeUser, requireUser],
  emailConfirmSendController
);

// Verify token confirmation
router.get(
  "/confirm/verify/:token",
  validate(emailConfirmVerifyTokenSchema),
  emailConfirmVerifyTokenController
);

export default router;
