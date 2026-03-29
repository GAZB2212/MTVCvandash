import { Router } from 'express';
import { setInverterMode } from '../victron/mk3.js';
import { store } from '../victron/dataStore.js';

const router = Router();

router.post('/inverter/toggle', (_req, res) => {
  const newState = !store.inverter.isOn;
  setInverterMode(newState);
  res.json({ isOn: newState, mode: store.inverter.mode });
});

router.post('/inverter/on', (_req, res) => {
  setInverterMode(true);
  res.json({ isOn: true, mode: store.inverter.mode });
});

router.post('/inverter/off', (_req, res) => {
  setInverterMode(false);
  res.json({ isOn: false, mode: store.inverter.mode });
});

export default router;
