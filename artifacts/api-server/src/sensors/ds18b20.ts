import { readdir, readFile } from 'node:fs/promises';
import { logger } from '../lib/logger.js';
import { store } from '../victron/dataStore.js';

const W1_BASE = process.env['DS18B20_BASE'] ?? '/sys/bus/w1/devices';
const POLL_MS = 10_000;

async function readSensorTemp(devicePath: string): Promise<number | null> {
  try {
    const raw = await readFile(`${devicePath}/w1_slave`, 'utf8');
    if (!raw.includes('YES')) return null;
    const match = raw.match(/t=(-?\d+)/);
    if (!match) return null;
    return parseInt(match[1], 10) / 1000;
  } catch {
    return null;
  }
}

async function findSensor(): Promise<string | null> {
  try {
    const entries = await readdir(W1_BASE);
    const sensor = entries.find(e => e.startsWith('28-'));
    return sensor ? `${W1_BASE}/${sensor}` : null;
  } catch {
    return null;
  }
}

export function startDs18b20Reader() {
  let sensorPath: string | null = null;
  let simMode = false;

  async function poll() {
    if (!sensorPath) {
      sensorPath = await findSensor();
      if (!sensorPath) {
        if (!simMode) {
          simMode = true;
          logger.warn({ base: W1_BASE }, 'DS18B20: no sensor found — simulation mode');
          store.temps.cabinet = 28 + Math.random() * 4;
        }
        setTimeout(poll, POLL_MS);
        return;
      }
      logger.info({ path: sensorPath }, 'DS18B20: sensor found');
    }

    const temp = await readSensorTemp(sensorPath);
    if (temp !== null) {
      store.temps.cabinet = parseFloat(temp.toFixed(1));
      simMode = false;
    } else {
      sensorPath = null;
    }

    setTimeout(poll, POLL_MS);
  }

  // Simulation drift when no hardware
  setInterval(() => {
    if (simMode) {
      store.temps.cabinet = parseFloat((store.temps.cabinet + (Math.random() - 0.48) * 0.3).toFixed(1));
    }
  }, 5000);

  poll();
}
