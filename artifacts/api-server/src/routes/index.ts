import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import dataRouter from "./data.js";
import lightsRouter from "./lights.js";
import inverterRouter from "./inverter.js";
import fansRouter from "./fans.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(dataRouter);
router.use(lightsRouter);
router.use(inverterRouter);
router.use(fansRouter);

export default router;
