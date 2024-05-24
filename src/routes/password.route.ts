import express from "express";
import { validate } from "../middlewares/validate";
import {
  passwordResetSendController,
  passwordResetVerifyTokenController,
  passwordResetChangeController,
} from "../controllers/password.controller";
import {
  passwordResetSendSchema,
  passwordResetVerifyTokenSchema,
  passwordResetChangeSchema,
} from "../schemas/password.schema";

const router = express.Router();

// Send email reset password
router.post(
  "/reset/send",
  validate(passwordResetSendSchema),
  passwordResetSendController
);

// Verify token reset password
router.get(
  "/reset/verify/:token",
  validate(passwordResetVerifyTokenSchema),
  passwordResetVerifyTokenController
);

// Reset password
router.put(
  "/reset/change/:token",
  validate(passwordResetChangeSchema),
  passwordResetChangeController
);

export default router;
