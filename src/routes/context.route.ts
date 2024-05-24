import express from "express";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { validate } from "../middlewares/validate";
import { getContextsController } from "../controllers/context.controller";
import {
  enableContextApplicationController,
  disableContextApplicationController,
} from "../controllers/contextApplication.controller";
import {
  enabledContextApplicationSchema,
  disableContextApplicationSchema,
} from "../schemas/contextApplication.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get contexts
router.get("/", getContextsController);

// Enable application context
router.post(
  "/:contextId/:applicationId",
  validate(enabledContextApplicationSchema),
  enableContextApplicationController
);

// Get application context
router.delete(
  "/:contextId/:applicationId",
  validate(disableContextApplicationSchema),
  disableContextApplicationController
);

export default router;
