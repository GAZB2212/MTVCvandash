import { logger } from '../lib/logger.js';
import { store } from '../victron/dataStore.js';

const MIN_TEMP   = parseFloat(process.env['FAN_MIN_TEMP']   ?? '30');
const MAX_TEMP   = parseFloat(process.env['FAN_MAX_TEMP']   ?? '60');
const MIN_SPEED  = parseFloat(process.env['FAN_MIN_SPEED']  ?? '20');
const POLL_MS    = 5_000;

const FAN_GPIO_PINS = [
  parseInt(process.env['FAN_0_GPIO'] ?? '18', 10),
  parseInt(process.env['FAN_1_GPIO'] ?? '19', 10),
  parseInt(process.env['FAN_2_GPIO'] ?? '12', 10),
];

const PWM_FREQ = 25_000;

type GpioHandle = { hardwarePwmWrite(freq: number, duty: number): void };
const gpioHandles: (GpioHandle | null)[] = [null, null, null];
let pigpioAvailable = false;

function speedToDuty(pct: number): number {
  return Math.round((pct / 100) * 1_000_000);
}

function calcAutoSpeed(tempC: number): number {
  if (tempC <= MIN_TEMP) return 0;
  if (tempC >= MAX_TEMP) return 100;
  const raw = ((tempC - MIN_TEMP) / (MAX_TEMP - MIN_TEMP)) * 100;
  return Math.max(MIN_SPEED, Math.round(raw));
}

function applyFanSpeed(fanId: number, speed: number) {
  const fan = store.fans[fanId];
  if (!fan) return;
  fan.speed = speed;
  fan.on = speed > 0;

  if (pigpioAvailable && gpioHandles[fanId]) {
    try {
      gpioHandles[fanId]!.hardwarePwmWrite(PWM_FREQ, speedToDuty(speed));
    } catch (err) {
      logger.error({ err, fanId }, 'Fan: PWM write error');
    }
  }
}

function runAutoControl() {
  const temps = [store.temps.cabinet, store.temps.battery, store.temps.inverter].filter(t => t > 0);
  if (temps.length === 0) return;
  const hottest = Math.max(...temps);
  const targetSpeed = calcAutoSpeed(hottest);

  store.fans.forEach(fan => {
    if (fan.auto) {
      applyFanSpeed(fan.id, targetSpeed);
    }
  });
}

export function setFanSpeed(fanId: number, speed: number, auto = false) {
  const fan = store.fans[fanId];
  if (!fan) return;
  fan.auto = auto;
  applyFanSpeed(fanId, Math.max(0, Math.min(100, speed)));
}

export function setFanAuto(fanId: number, auto: boolean) {
  const fan = store.fans[fanId];
  if (!fan) return;
  fan.auto = auto;
}

export async function startFanController() {
  try {
    const pigpioMod = await import('pigpio');
    const Gpio = pigpioMod.Gpio ?? pigpioMod.default?.Gpio;

    FAN_GPIO_PINS.forEach((pin, i) => {
      try {
        gpioHandles[i] = new Gpio(pin, { mode: Gpio.OUTPUT });
        logger.info({ pin, fanId: i }, 'Fan: GPIO initialised');
      } catch (err) {
        logger.warn({ err, pin, fanId: i }, 'Fan: GPIO pin init failed');
      }
    });

    pigpioAvailable = true;
    logger.info('Fan controller: pigpio ready');
  } catch {
    logger.warn('Fan controller: pigpio unavailable — simulation mode');
    pigpioAvailable = false;
    // Simulate temp-driven fan speed changes
    setInterval(() => {
      store.temps.cabinet  = parseFloat((store.temps.cabinet  + (Math.random() - 0.48) * 0.5).toFixed(1));
      store.temps.inverter = parseFloat((store.temps.inverter + (Math.random() - 0.48) * 0.3).toFixed(1));
    }, 5000);
  }

  // Auto-control loop
  setInterval(runAutoControl, POLL_MS);
  runAutoControl();
}
