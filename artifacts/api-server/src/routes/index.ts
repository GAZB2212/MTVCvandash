import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import dataRouter from "./data.js";
import lightsRouter from "./lights.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dataRouter);
router.use(lightsRouter);

export default router;
