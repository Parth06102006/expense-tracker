import { healthCheck } from "../controllers/healthcheck.contoller.js";
import { Router } from "express";

const router = Router();

router.get('/healthcheck',healthCheck);

export default router;