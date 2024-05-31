import { Router } from "express";
import authRouter from "./routes/auth.route";
import userRouter from "./routes/user.route";
import emailRouter from "./routes/email.route";
import passwordRouter from "./routes/password.route";
import sessionRouter from "./routes/session.route";
import applicationRouter from "./routes/application.route";
import contextRouter from "./routes/context.route";
import termConditionRouter from "./routes/termCondition.route";

const router = Router();

/**
 * Auth: Only operations with authentication
 */

router.use("/api/main/auth", authRouter);
router.use("/api/main/users", userRouter);
router.use("/api/main/email", emailRouter);
router.use("/api/main/password", passwordRouter);
router.use("/api/main/sessions", sessionRouter);
router.use("/api/main/applications", applicationRouter);
router.use("/api/main/contexts", contextRouter);
router.use("/api/main/terms-conditions", termConditionRouter);

/**
 * No auth: Only operations without authentication
 */

export default router;
