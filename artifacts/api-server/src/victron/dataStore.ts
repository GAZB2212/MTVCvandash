export interface InverterState {
  acVoltage: number;
  acHz: number;
  dcVoltage: number;
  dcCurrent: number;
  outputKw: number;
  loadPct: number;
  mode: string;
  temp: number;
  connected: boolean;
  isOn: boolean;
}

export interface BatteryState {
  soc: number;
  voltage: number;
  current: number;
  power: number;
  remaining: number;
  fullCap: number;
  ttgMinutes: number;
  temp: number;
  connected: boolean;
}

export interface TempState {
  cabinet: number;
  battery: number;
  inverter: number;
}

export interface FanState {
  id: number;
  name: string;
  on: boolean;
  auto: boolean;
  speed: number;
  gpioPin: number;
}

export interface LightState {
  id: number;
  name: string;
  on: boolean;
}

const LIGHT_NAMES = ['Cab', 'Load Bay', 'Work', 'Step', 'Exterior', 'Tools', 'Rear', 'Emergency'];

const FAN_DEFS = [
  { id: 0, name: 'Cabinet',  gpioPin: 18 },
  { id: 1, name: 'Exhaust',  gpioPin: 19 },
  { id: 2, name: 'Aux',      gpioPin: 12 },
];

export const store = {
  battery: {
    soc: 0,
    voltage: 0,
    current: 0,
    power: 0,
    remaining: 0,
    fullCap: 125000,
    ttgMinutes: -1,
    temp: 0,
    connected: false,
  } as BatteryState,

  inverter: {
    acVoltage: 0,
    acHz: 0,
    dcVoltage: 0,
    dcCurrent: 0,
    outputKw: 0,
    loadPct: 0,
    mode: 'Inverting',
    temp: 0,
    connected: false,
    isOn: true,
  } as InverterState,

  temps: {
    cabinet: 28,
    battery: 0,
    inverter: 0,
  } as TempState,

  fans: FAN_DEFS.map(f => ({ ...f, on: false, auto: true, speed: 0 })) as FanState[],

  lights: LIGHT_NAMES.map((name, id) => ({ id, name, on: false })) as LightState[],
};
