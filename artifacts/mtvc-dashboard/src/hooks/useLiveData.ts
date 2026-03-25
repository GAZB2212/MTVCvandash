import { useState, useEffect } from 'react';

export interface InverterData {
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

export interface BatteryData {
  soc: number;
  voltage: number;
  current: number;
  remaining: number;
  fullCap: number;
  cycles: number;
  cellMin: number;
  cellMax: number;
  delta: number;
  temp: number;
  chargeMos: boolean;
  dischargeMos: boolean;
  balancing: boolean;
  cells: number[];
  connected: boolean;
}

export interface PressureData {
  psi: number;
  maxPsi: number;
  connected: boolean;
}

export interface FanData {
  id: number;
  name: string;
  on: boolean;
  auto: boolean;
}

export interface LightData {
  id: number;
  name: string;
  on: boolean;
}

export interface AlertData {
  id: number;
  type: 'ok' | 'warn' | 'error';
  msg: string;
  time: string;
}

export interface LiveData {
  inverter: InverterData;
  battery: BatteryData;
  pressure: PressureData;
  fans: FanData[];
  fanThreshold: number;
  lights: LightData[];
  alerts: AlertData[];
  uptime: number;
  setFans: (fans: FanData[]) => void;
  setFanThreshold: (v: number) => void;
  setLights: (lights: LightData[]) => void;
}

function randomBetween(min: number, max: number, decimals = 2) {
  const val = Math.random() * (max - min) + min;
  return Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

const LIGHT_NAMES = ['Cab', 'Load Bay', 'Work', 'Step', 'Exterior', 'Tools', 'Rear', 'Emergency'];

const INITIAL_CELLS: number[] = Array.from({ length: 16 }, (_, i) =>
  3.244 + (i % 3 === 0 ? 0.005 : i % 3 === 1 ? 0.002 : 0.007)
);

export function useLiveData(): LiveData {
  const [inverter, setInverter] = useState<InverterData>({
    acVoltage: 230.4,
    acHz: 49.9,
    dcVoltage: 51.8,
    dcCurrent: 34.2,
    outputKw: 1.77,
    loadPct: 38,
    mode: 'Inverting',
    temp: 42,
    connected: true,
  });

  const [battery] = useState<BatteryData>({
    soc: 74,
    voltage: 52.1,
    current: -34.2,
    remaining: 92500,
    fullCap: 125000,
    cycles: 12,
    cellMin: 3.244,
    cellMax: 3.251,
    delta: 7,
    temp: 24,
    chargeMos: true,
    dischargeMos: true,
    balancing: false,
    cells: INITIAL_CELLS,
    connected: true,
  });

  const [pressure, setPressure] = useState<PressureData>({
    psi: 94,
    maxPsi: 150,
    connected: true,
  });

  const [fans, setFans] = useState<FanData[]>([
    { id: 0, name: 'Cabinet', on: true, auto: true },
    { id: 1, name: 'Exhaust', on: false, auto: true },
    { id: 2, name: 'Aux', on: false, auto: false },
  ]);

  const [fanThreshold, setFanThreshold] = useState(45);

  const [lights, setLights] = useState<LightData[]>(
    LIGHT_NAMES.map((name, id) => ({ id, name, on: false }))
  );

  const [alerts] = useState<AlertData[]>([
    { id: 1, type: 'ok', msg: 'System boot complete', time: '14:32:01' },
    { id: 2, type: 'ok', msg: 'BMS connected via Bluetooth', time: '14:32:04' },
    { id: 3, type: 'warn', msg: 'Pressure sensor: low signal', time: '14:45:12' },
    { id: 4, type: 'error', msg: 'Cell delta exceeded 10mV threshold', time: '15:01:33' },
  ]);

  const [uptime, setUptime] = useState(15737);

  useEffect(() => {
    const uptimeInterval = setInterval(() => {
      setUptime(u => u + 1);
    }, 1000);

    const dataInterval = setInterval(() => {
      setInverter(prev => ({
        ...prev,
        acVoltage: randomBetween(228, 232, 1),
        acHz: randomBetween(49.7, 50.2, 1),
        dcVoltage: randomBetween(51.2, 52.4, 1),
        dcCurrent: randomBetween(31, 37, 1),
        outputKw: randomBetween(1.6, 1.95, 2),
        loadPct: Math.round(randomBetween(34, 43, 0)),
      }));

      setPressure(prev => ({
        ...prev,
        psi: Math.round(randomBetween(90, 98, 0)),
      }));
    }, 2000);

    return () => {
      clearInterval(uptimeInterval);
      clearInterval(dataInterval);
    };
  }, []);

  return {
    inverter,
    battery,
    pressure,
    fans,
    fanThreshold,
    lights,
    alerts,
    uptime,
    setFans,
    setFanThreshold,
    setLights,
  };
}
