import { SerialPort } from 'serialport';
import { logger } from '../lib/logger.js';
import { store } from './dataStore.js';

const PORT_PATH = process.env['MK3_PORT'] ?? '/dev/ttyUSB1';
const BAUD_RATE = 2400;

const MODE_MAP: Record<number, string> = {
  1: 'Charging',
  2: 'Inverting',
  3: 'Passthrough',
  4: 'Off',
};

function buildFrame(command: number, ...data: number[]): Buffer {
  const payload = [command, ...data];
  const length = payload.length + 1;
  const sum = [length, ...payload].reduce((a, b) => a + b, 0);
  const checksum = (0x55 - sum) & 0xff;
  return Buffer.from([length, ...payload, checksum]);
}

let activePort: SerialPort | null = null;
let simulationMode = false;

export function setInverterMode(on: boolean) {
  store.inverter.isOn = on;
  store.inverter.mode = on ? 'Inverting' : 'Off';

  if (simulationMode) return;

  if (activePort?.isOpen) {
    const modeByte = on ? 0x04 : 0x00;
    const frame = buildFrame(0xFF, 0x37, modeByte);
    activePort.write(frame);
  }
}

export function startMk3Reader() {
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
    logger.warn({ err, path: PORT_PATH }, 'MK3: failed to create port — running in simulation mode');
    startSimulation();
    return;
  }

  const rxBuf: number[] = [];

  port.open((err) => {
    if (err) {
      logger.warn({ err, path: PORT_PATH }, 'MK3: port not available — running in simulation mode');
      startSimulation();
      return;
    }
    logger.info({ path: PORT_PATH }, 'MK3: port open');
    activePort = port;
    store.inverter.connected = true;
    pollMk3(port);
  });

  port.on('data', (chunk: Buffer) => {
    for (const byte of chunk) rxBuf.push(byte);
    parseRxBuffer(rxBuf);
  });

  port.on('error', (err) => {
    logger.error({ err }, 'MK3: serial error');
    store.inverter.connected = false;
  });

  port.on('close', () => {
    logger.warn('MK3: port closed — reconnecting in 5s');
    store.inverter.connected = false;
    setTimeout(startMk3Reader, 5000);
  });
}

function pollMk3(port: SerialPort) {
  const versionReq = buildFrame(0xff, 0x01);
  port.write(versionReq);
  setTimeout(() => pollMk3(port), 5000);
}

function parseRxBuffer(buf: number[]) {
  while (buf.length >= 2) {
    const length = buf[0];
    if (buf.length < length + 1) break;

    const frame = buf.splice(0, length + 1);
    const command = frame[1];

    if (command === 0x56) {
      const modeByte = frame[2] ?? 2;
      store.inverter.mode = MODE_MAP[modeByte] ?? 'Inverting';
    }

    if (command === 0x8f) {
      const acVoltage = ((frame[3] ?? 0) | ((frame[4] ?? 0) << 8)) / 100;
      const acHz = ((frame[5] ?? 0) | ((frame[6] ?? 0) << 8)) / 100;
      const acCurrentOut = ((frame[7] ?? 0) | ((frame[8] ?? 0) << 8)) / 10;
      store.inverter.acVoltage = acVoltage;
      store.inverter.acHz = acHz;
      store.inverter.outputKw = parseFloat((acVoltage * acCurrentOut / 1000).toFixed(2));
      store.inverter.loadPct = Math.min(100, Math.round((acCurrentOut / 16) * 100));
    }

    // MK3 temperature frame (0x20 = device info, byte index 5 = temp in °C)
    if (command === 0x20 && frame.length >= 6) {
      const tempC = frame[5] ?? 0;
      if (tempC > 0 && tempC < 120) {
        store.inverter.temp = tempC;
        store.temps.inverter = tempC;
      }
    }
  }
}

function startSimulation() {
  simulationMode = true;
  logger.info('MK3: simulation mode active');

  let invTemp = 35;

  setInterval(() => {
    store.inverter.connected = true;
    invTemp = parseFloat((invTemp + (Math.random() - 0.48) * 0.3).toFixed(1));
    store.inverter.temp = invTemp;
    store.temps.inverter = invTemp;

    if (!store.inverter.isOn) {
      store.inverter.acVoltage = 0;
      store.inverter.acHz = 0;
      store.inverter.outputKw = 0;
      store.inverter.loadPct = 0;
      store.inverter.mode = 'Off';
      return;
    }

    const acVoltage = parseFloat((229 + Math.random() * 3).toFixed(1));
    const acHz = parseFloat((49.8 + Math.random() * 0.4).toFixed(1));
    const outputKw = parseFloat((1.6 + Math.random() * 0.4).toFixed(2));

    store.inverter.acVoltage = acVoltage;
    store.inverter.acHz = acHz;
    store.inverter.dcVoltage = store.battery.voltage;
    store.inverter.dcCurrent = Math.abs(store.battery.current);
    store.inverter.outputKw = outputKw;
    store.inverter.loadPct = Math.round((outputKw / 5) * 100);
    store.inverter.mode = 'Inverting';
  }, 2000);
}
