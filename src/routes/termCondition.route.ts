import express from "express";
import { getTermsConditionsController } from "../controllers/termCondition.controller";

const router = express.Router();

// Get terms-conditions
router.get("/", getTermsConditionsController);

export default router;
