import { Router } from 'express';
import { store } from '../victron/dataStore.js';

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

  res.json(light);
});

export default router;
