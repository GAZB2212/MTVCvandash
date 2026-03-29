import { Router } from 'express';
import { store } from '../victron/dataStore.js';

const router = Router();

router.get('/data', (_req, res) => {
  res.json({
    battery: store.battery,
    inverter: store.inverter,
    temps: store.temps,
    uptime: Math.floor(process.uptime()),
  });
});

export default router;
