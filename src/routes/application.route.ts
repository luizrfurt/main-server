import express from "express";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { getApplicationsController } from "../controllers/application.controller";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get applications
router.get("/", getApplicationsController);

export default router;
