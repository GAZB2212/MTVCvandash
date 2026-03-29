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
}

export interface BatteryState {
  soc: number;
  voltage: number;
  current: number;
  power: number;
  remaining: number;
  fullCap: number;
  ttgMinutes: number;
  connected: boolean;
}

export interface LightState {
  id: number;
  name: string;
  on: boolean;
}

const LIGHT_NAMES = ['Cab', 'Load Bay', 'Work', 'Step', 'Exterior', 'Tools', 'Rear', 'Emergency'];

export const store = {
  battery: {
    soc: 0,
    voltage: 0,
    current: 0,
    power: 0,
    remaining: 0,
    fullCap: 125000,
    ttgMinutes: -1,
    connected: false,
  } as BatteryState,

  inverter: {
    acVoltage: 0,
    acHz: 0,
    dcVoltage: 0,
    dcCurrent: 0,
    outputKw: 0,
    loadPct: 0,
    mode: 'Off',
    temp: 0,
    connected: false,
  } as InverterState,

  lights: LIGHT_NAMES.map((name, id) => ({ id, name, on: false })) as LightState[],
};
