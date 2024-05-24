import express from "express";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { validate } from "../middlewares/validate";
import {
  validateSessionMainController,
  validateSessionSubController,
} from "../controllers/session.controller";
import { validateSessionSubSchema } from "../schemas/session.schema";

const router = express.Router();

// Validate session (main)
router.get(
  "/validate",
  [deserializeUser, requireUser],
  validateSessionMainController
);

// Validate session (sub)
router.post(
  "/validate",
  validate(validateSessionSubSchema),
  validateSessionSubController
);

export default router;
