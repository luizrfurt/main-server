import express from "express";
import { deserializeUser } from "../middlewares/deserializeUser";
import { requireUser } from "../middlewares/requireUser";
import { validate } from "../middlewares/validate";
import {
  getUserController,
  getUsersController,
  createUserController,
  updateUserController,
  deleteUserController,
} from "../controllers/user.controller";
import {
  getUserSchema,
  createUserSchema,
  updateUserSchema,
} from "../schemas/user.schema";

const router = express.Router();

router.use(deserializeUser, requireUser);

// Get user
router.get("/:userId", validate(getUserSchema), getUserController);

// Get users
router.get("/", getUsersController);

// Create user
router.post("/", validate(createUserSchema), createUserController);

// Update user
router.put("/:userId", validate(updateUserSchema), updateUserController);

// Inactive user
router.delete("/:userId", deleteUserController);

export default router;
