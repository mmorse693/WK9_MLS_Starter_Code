import express from "express";
import authHandler from "../middleware/authHandler.js";
import { getSummary } from "../controllers/aiController.js";

const router = express.Router();

router.get("/summarize/:threadId", authHandler, getSummary);

export default router;
