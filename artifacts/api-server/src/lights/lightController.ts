import { logger } from '../lib/logger.js';
import { store } from '../victron/dataStore.js';

/**
 * GPIO pin for each light ID.
 * Set via environment variables: LIGHT_0_GPIO, LIGHT_1_GPIO … LIGHT_7_GPIO
 * Leave unset (or set to 0) to skip GPIO for that light (software-only toggle).
 *
 * Default light IDs:
 *   0 = Cab          4 = Exterior
 *   1 = Load Bay     5 = Tools
 *   2 = Work         6 = Rear
 *   3 = Step         7 = Emergency
 */
const LIGHT_GPIO_PINS: (number | null)[] = store.lights.map((_, id) => {
  const raw = process.env[`LIGHT_${id}_GPIO`];
  const pin = raw ? parseInt(raw, 10) : 0;
  return pin > 0 ? pin : null;
});

type GpioHandle = { digitalWrite(level: 0 | 1): void };
const gpioHandles: (GpioHandle | null)[] = store.lights.map(() => null);
let pigpioAvailable = false;

/**
 * Drive the GPIO pin for a light. Called whenever a light is toggled.
 * Relay boards are typically active-LOW, so we invert the signal by default.
 * Set RELAY_ACTIVE_HIGH=true in env if your board is active-high.
 */
const ACTIVE_HIGH = process.env['RELAY_ACTIVE_HIGH'] === 'true';

export function applyLightRelay(lightId: number, on: boolean) {
  if (!pigpioAvailable) return;
  const handle = gpioHandles[lightId];
  if (!handle) return;

  const level = ACTIVE_HIGH ? (on ? 1 : 0) : (on ? 0 : 1);
  try {
    handle.digitalWrite(level as 0 | 1);
  } catch (err) {
    logger.error({ err, lightId }, 'Light: GPIO write error');
  }
}

export async function startLightController() {
  const assignedPins = LIGHT_GPIO_PINS.filter(p => p !== null);

  if (assignedPins.length === 0) {
    logger.info('Light controller: no GPIO pins configured — software-only mode');
    return;
  }

  try {
    const pigpioMod = await import('pigpio');
    const Gpio = pigpioMod.Gpio ?? pigpioMod.default?.Gpio;

    LIGHT_GPIO_PINS.forEach((pin, id) => {
      if (pin === null) return;
      try {
        gpioHandles[id] = new Gpio(pin, { mode: Gpio.OUTPUT });
        // Ensure relay starts in the OFF state
        const offLevel = ACTIVE_HIGH ? 0 : 1;
        gpioHandles[id]!.digitalWrite(offLevel as 0 | 1);
        logger.info({ pin, lightId: id, name: store.lights[id]?.name }, 'Light: GPIO initialised');
      } catch (err) {
        logger.warn({ err, pin, lightId: id }, 'Light: GPIO pin init failed');
      }
    });

    pigpioAvailable = true;
    logger.info('Light controller: pigpio ready');
  } catch {
    logger.warn('Light controller: pigpio unavailable — software-only mode');
    pigpioAvailable = false;
  }
}
