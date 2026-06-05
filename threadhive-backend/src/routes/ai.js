import express from "express";
import authHandler from "../middleware/authHandler.js";
import { getSummary, getRephrase } from "../controllers/aiController.js";

const router = express.Router();

router.get("/summarize/:threadId", authHandler, getSummary);
router.post("/rephrase", authHandler, getRephrase);

export default router;
