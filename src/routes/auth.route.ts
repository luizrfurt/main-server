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
/**
 * @swagger
 * /api/main/auth/login:
 *   post:
 *     summary: Login user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               login:
 *                 type: string
 *                 example: "userexample"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Returns user data on successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "success message"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-05-31T13:28:54.111Z"
 *                       updated_at:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-05-31T13:28:57.685Z"
 *                       active:
 *                         type: boolean
 *                         example: true
 *                       additionalProperties:
 *                         type: object
 *                 meta:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: string
 *                       example: "127.0.0.1"
 *                     now:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-01T12:01:26.461Z"
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "bad request message"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 meta:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: string
 *                       example: "127.0.0.1"
 *                     now:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-01T12:12:14.654Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "unauthorized message"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 meta:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: string
 *                       example: "127.0.0.1"
 *                     now:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-01T12:12:14.654Z"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "fail"
 *                 message:
 *                   type: string
 *                   example: "forbidden message"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 meta:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: string
 *                       example: "127.0.0.1"
 *                     now:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-01T12:12:14.654Z"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "internal server error message"
 *                 data:
 *                   type: array
 *                   items: {}
 *                 meta:
 *                   type: object
 *                   properties:
 *                     ip:
 *                       type: string
 *                       example: "127.0.0.1"
 *                     now:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-06-01T12:12:14.654Z"
 */
router.post("/login", validate(loginUserSchema), loginUserController);

// Refresh access token
router.post("/refresh", refreshAccessTokenController);

router.use(deserializeUser, requireUser);

// Logout user
router.post("/logout", logoutController);

// Data user
router.post("/user", userController);

export default router;
