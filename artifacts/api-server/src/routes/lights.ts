import { Router } from 'express';
import { store } from '../victron/dataStore.js';
import { applyLightRelay } from '../lights/lightController.js';

const router = Router();

router.get('/lights', (_req, res) => {
  res.json(store.lights);
});

router.post('/lights/:id', (req, res) => {
  const id = parseInt(req.params['id'] ?? '', 10);
  const light = store.lights.find(l => l.id === id);

  if (!light) {
    res.status(404).json({ error: 'Light not found' });
    return;
  }

  if (typeof req.body.on === 'boolean') {
    light.on = req.body.on;
  } else {
    light.on = !light.on;
  }

  // Drive the relay GPIO pin (no-op if pin not configured)
  applyLightRelay(id, light.on);

  res.json(light);
});

export default router;
