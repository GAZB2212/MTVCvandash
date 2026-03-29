import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import { logger } from '../lib/logger.js';
import { store } from './dataStore.js';

const PORT_PATH = process.env['VEDIRECT_PORT'] ?? '/dev/ttyUSB0';
const BAUD_RATE = 19200;
const FULL_CAP_MAH = 125000;

let block: Record<string, string> = {};

function processBlock(kv: Record<string, string>) {
  const v = parseFloat(kv['V'] ?? '0');
  const i = parseFloat(kv['I'] ?? '0');
  const p = parseFloat(kv['P'] ?? '0');
  const soc = parseFloat(kv['SOC'] ?? '-1');
  const ttg = parseInt(kv['TTG'] ?? '-1', 10);
  const ce = parseFloat(kv['CE'] ?? '0');

  if (soc >= 0) {
    store.battery.soc = Math.round(soc / 10);
  }
  if (v > 0) {
    store.battery.voltage = v / 1000;
  }
  store.battery.current = i / 1000;
  store.battery.power = p;
  store.battery.ttgMinutes = ttg;
  store.battery.remaining = Math.max(0, FULL_CAP_MAH - Math.abs(ce));
  store.battery.connected = true;
}

export function startVeDirectReader() {
  let port: SerialPort;

  try {
    port = new SerialPort({
      path: PORT_PATH,
      baudRate: BAUD_RATE,
      dataBits: 8,
      stopBits: 1,
      parity: 'none',
      autoOpen: false,
    });
  } catch (err) {
    logger.warn({ err, path: PORT_PATH }, 'VE.Direct: failed to create port — running in simulation mode');
    startSimulation();
    return;
  }

  const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

  port.open((err) => {
    if (err) {
      logger.warn({ err, path: PORT_PATH }, 'VE.Direct: port not available — running in simulation mode');
      startSimulation();
      return;
    }
    logger.info({ path: PORT_PATH }, 'VE.Direct: port open');
  });

  parser.on('data', (line: string) => {
    if (line.startsWith(':')) return;

    const [key, value] = line.split('\t');
    if (!key) return;

    if (key === 'Checksum') {
      if (Object.keys(block).length > 0) {
        processBlock(block);
      }
      block = {};
    } else if (value !== undefined) {
      block[key.trim()] = value.trim();
    }
  });

  port.on('error', (err) => {
    logger.error({ err }, 'VE.Direct: serial error');
    store.battery.connected = false;
  });

  port.on('close', () => {
    logger.warn('VE.Direct: port closed — reconnecting in 5s');
    store.battery.connected = false;
    setTimeout(startVeDirectReader, 5000);
  });
}

function startSimulation() {
  logger.info('VE.Direct: simulation mode active');

  let soc = 74;
  let current = -34.2;

  setInterval(() => {
    current = parseFloat((current + (Math.random() - 0.5) * 0.5).toFixed(1));
    const voltage = parseFloat((51.2 + Math.random() * 1.2).toFixed(1));
    const power = Math.round(voltage * Math.abs(current));

    store.battery.soc = soc;
    store.battery.voltage = voltage;
    store.battery.current = current;
    store.battery.power = -power;
    store.battery.ttgMinutes = Math.round((soc / 100) * 6400 * 1000 / power * 60);
    store.battery.remaining = Math.round((soc / 100) * FULL_CAP_MAH);
    store.battery.connected = true;
  }, 2000);
}
