import express from "express";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { validate } from "../middlewares/validate";
import {
  registerUserController,
  loginUserController,
  refreshAccessTokenController,
  logoutController,
  userController,
} from "../controllers/auth.controller";
import { registerUserSchema, loginUserSchema } from "../schemas/auth.schema";

const router = express.Router();

// Register user
router.post("/register", validate(registerUserSchema), registerUserController);

// Login user
router.post("/login", validate(loginUserSchema), loginUserController);

// Refresh access token
router.post("/refresh", refreshAccessTokenController);

router.use(deserializeUser, requireUser);

// Logout user
router.post("/logout", logoutController);

// Data user
router.post("/user", userController);

export default router;
