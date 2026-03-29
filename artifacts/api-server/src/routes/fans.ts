import { Router } from 'express';
import { store } from '../victron/dataStore.js';
import { setFanSpeed, setFanAuto } from '../fans/fanController.js';

const router = Router();

router.get('/fans', (_req, res) => {
  res.json(store.fans);
});

router.post('/fans/:id', (req, res) => {
  const id = parseInt(req.params['id'] ?? '', 10);
  const fan = store.fans[id];
  if (!fan) {
    res.status(404).json({ error: 'Fan not found' });
    return;
  }

  const { auto, speed } = req.body as { auto?: boolean; speed?: number };

  if (auto === true) {
    setFanAuto(id, true);
  } else if (auto === false) {
    setFanAuto(id, false);
    if (typeof speed === 'number') {
      setFanSpeed(id, speed, false);
    }
  }

  if (typeof speed === 'number' && auto !== true) {
    setFanSpeed(id, speed, false);
  }

  res.json(store.fans[id]);
});

export default router;
