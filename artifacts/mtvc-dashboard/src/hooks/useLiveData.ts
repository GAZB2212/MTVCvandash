import { useState, useEffect, useCallback, useRef } from 'react';

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

const LIGHT_NAMES = ['Cab', 'Load Bay', 'Work', 'Step', 'Exterior', 'Tools', 'Rear', 'Emergency'];
const INITIAL_CELLS: number[] = Array.from({ length: 16 }, (_, i) =>
  3.244 + (i % 3 === 0 ? 0.005 : i % 3 === 1 ? 0.002 : 0.007)
);

function randomBetween(min: number, max: number, decimals = 2) {
  const val = Math.random() * (max - min) + min;
  return Math.round(val * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

const SIM_BATTERY: BatteryData = {
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
};

const SIM_INVERTER: InverterData = {
  acVoltage: 230.4,
  acHz: 49.9,
  dcVoltage: 51.8,
  dcCurrent: 34.2,
  outputKw: 1.77,
  loadPct: 38,
  mode: 'Inverting',
  temp: 42,
  connected: true,
};

function apiBatteryToData(api: Record<string, number | boolean>, prev: BatteryData): BatteryData {
  return {
    ...prev,
    soc: (api['soc'] as number) ?? prev.soc,
    voltage: (api['voltage'] as number) ?? prev.voltage,
    current: (api['current'] as number) ?? prev.current,
    remaining: (api['remaining'] as number) ?? prev.remaining,
    fullCap: (api['fullCap'] as number) ?? prev.fullCap,
    connected: (api['connected'] as boolean) ?? prev.connected,
  };
}

function apiInverterToData(api: Record<string, number | boolean | string>, prev: InverterData): InverterData {
  return {
    ...prev,
    acVoltage: (api['acVoltage'] as number) ?? prev.acVoltage,
    acHz: (api['acHz'] as number) ?? prev.acHz,
    dcVoltage: (api['dcVoltage'] as number) ?? prev.dcVoltage,
    dcCurrent: (api['dcCurrent'] as number) ?? prev.dcCurrent,
    outputKw: (api['outputKw'] as number) ?? prev.outputKw,
    loadPct: (api['loadPct'] as number) ?? prev.loadPct,
    mode: (api['mode'] as string) ?? prev.mode,
    connected: (api['connected'] as boolean) ?? prev.connected,
  };
}

export function useLiveData(): LiveData {
  const [inverter, setInverter] = useState<InverterData>(SIM_INVERTER);
  const [battery, setBattery] = useState<BatteryData>(SIM_BATTERY);
  const [pressure] = useState<PressureData>({ psi: 94, maxPsi: 150, connected: true });
  const [fans, setFans] = useState<FanData[]>([
    { id: 0, name: 'Cabinet', on: true, auto: true },
    { id: 1, name: 'Exhaust', on: false, auto: true },
    { id: 2, name: 'Aux', on: false, auto: false },
  ]);
  const [fanThreshold, setFanThreshold] = useState(45);
  const [lights, setLightsState] = useState<LightData[]>(
    LIGHT_NAMES.map((name, id) => ({ id, name, on: false }))
  );
  const [alerts] = useState<AlertData[]>([
    { id: 1, type: 'ok', msg: 'System boot complete', time: '14:32:01' },
    { id: 2, type: 'ok', msg: 'VE.Direct reader started', time: '14:32:04' },
    { id: 3, type: 'ok', msg: 'MK3 reader started', time: '14:32:05' },
  ]);
  const [uptime, setUptime] = useState(0);

  const apiAvailable = useRef(false);
  const simIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startSimulation = useCallback(() => {
    if (simIntervalRef.current) return;
    simIntervalRef.current = setInterval(() => {
      setInverter(prev => ({
        ...prev,
        acVoltage: randomBetween(228, 232, 1),
        acHz: randomBetween(49.7, 50.2, 1),
        dcVoltage: randomBetween(51.2, 52.4, 1),
        dcCurrent: randomBetween(31, 37, 1),
        outputKw: randomBetween(1.6, 1.95, 2),
        loadPct: Math.round(randomBetween(34, 43, 0)),
      }));
    }, 2000);
  }, []);

  const stopSimulation = useCallback(() => {
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        const res = await fetch('/api/data', { signal: AbortSignal.timeout(3000) });
        if (!res.ok) throw new Error('bad response');
        const json = await res.json() as {
          battery: Record<string, number | boolean>;
          inverter: Record<string, number | boolean | string>;
          uptime: number;
        };
        if (cancelled) return;

        if (!apiAvailable.current) {
          apiAvailable.current = true;
          stopSimulation();
        }

        setBattery(prev => apiBatteryToData(json.battery, prev));
        setInverter(prev => apiInverterToData(json.inverter, prev));
        setUptime(json.uptime);
      } catch {
        if (!apiAvailable.current && !simIntervalRef.current) {
          startSimulation();
        }
      }
    }

    async function fetchLights() {
      try {
        const res = await fetch('/api/lights', { signal: AbortSignal.timeout(3000) });
        if (!res.ok) throw new Error('bad response');
        const json = await res.json() as LightData[];
        if (!cancelled) setLightsState(json);
      } catch {
        // keep local state
      }
    }

    fetchData();
    fetchLights();

    const dataInterval = setInterval(fetchData, 2000);

    const uptimeInterval = setInterval(() => {
      if (!apiAvailable.current) {
        setUptime(u => u + 1);
      }
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(dataInterval);
      clearInterval(uptimeInterval);
      stopSimulation();
    };
  }, [startSimulation, stopSimulation]);

  const setLights = useCallback((newLights: LightData[]) => {
    const changed = newLights.find((l, i) => l.on !== lights[i]?.on);
    if (!changed) {
      setLightsState(newLights);
      return;
    }

    setLightsState(newLights);

    fetch(`/api/lights/${changed.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ on: changed.on }),
    }).catch(() => {
      // ignore — local state already updated
    });
  }, [lights]);

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
