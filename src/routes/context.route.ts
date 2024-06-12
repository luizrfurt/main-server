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

/**
 * @swagger
 * /api/main/contexts:
 *   get:
 *     summary: Get contexts
 *     tags:
 *       - Context
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           contexts/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "ok message"
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
 *       201:
 *         description: Created
 *         content:
 *           contexts/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "created message"
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
 *           contexts/json:
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
 *         contexts: Unauthorized
 *         content:
 *           contexts/json:
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
 *           contexts/json:
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

router.get("/", getContextsController);

// Enable application context
/**
 * @swagger
 * /api/main/contexts/{contextId}/{applicationId}:
 *   post:
 *     summary: Enable application context
 *     tags:
 *       - Context
 *     parameters:
 *       - in: path
 *         name: contextId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the context
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the application
 *     responses:
 *       200:
 *         description: OK
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
 *                   example: "ok message"
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
 *       201:
 *         description: Created
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
 *                   example: "created message"
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
router.post(
  "/:contextId/:applicationId",
  validate(enabledContextApplicationSchema),
  enableContextApplicationController
);

// Disable application context
/**
 * @swagger
 * /api/main/contexts/{contextId}/{applicationId}:
 *   delete:
 *     summary: Disable application context
 *     tags:
 *       - Context
 *     parameters:
 *       - in: path
 *         name: contextId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the context
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the application
 *     responses:
 *       200:
 *         description: OK
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
 *                   example: "ok message"
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
 *       201:
 *         description: Created
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
 *                   example: "created message"
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
router.delete(
  "/:contextId/:applicationId",
  validate(disableContextApplicationSchema),
  disableContextApplicationController
);

export default router;
