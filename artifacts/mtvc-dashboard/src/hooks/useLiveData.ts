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
  isOn: boolean;
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

export interface TempData {
  cabinet: number;
  battery: number;
  inverter: number;
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
  speed: number;
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
  temps: TempData;
  fans: FanData[];
  lights: LightData[];
  alerts: AlertData[];
  uptime: number;
  setFans: (fans: FanData[]) => void;
  setLights: (lights: LightData[]) => void;
  toggleInverter: () => void;
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
  temp: 22,
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
  temp: 35,
  connected: true,
  isOn: true,
};

const SIM_TEMPS: TempData = {
  cabinet: 28,
  battery: 22,
  inverter: 35,
};

function apiBatteryToData(api: Record<string, number | boolean>, prev: BatteryData): BatteryData {
  return {
    ...prev,
    soc: (api['soc'] as number) ?? prev.soc,
    voltage: (api['voltage'] as number) ?? prev.voltage,
    current: (api['current'] as number) ?? prev.current,
    remaining: (api['remaining'] as number) ?? prev.remaining,
    fullCap: (api['fullCap'] as number) ?? prev.fullCap,
    temp: (api['temp'] as number) ?? prev.temp,
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
    temp: (api['temp'] as number) ?? prev.temp,
    connected: (api['connected'] as boolean) ?? prev.connected,
    isOn: (api['isOn'] as boolean) ?? prev.isOn,
  };
}

export function useLiveData(): LiveData {
  const [inverter, setInverter] = useState<InverterData>(SIM_INVERTER);
  const [battery, setBattery] = useState<BatteryData>(SIM_BATTERY);
  const [pressure] = useState<PressureData>({ psi: 94, maxPsi: 150, connected: true });
  const [temps, setTemps] = useState<TempData>(SIM_TEMPS);
  const [fans, setFansState] = useState<FanData[]>([
    { id: 0, name: 'Cabinet', on: false, auto: true, speed: 0 },
    { id: 1, name: 'Exhaust', on: false, auto: true, speed: 0 },
    { id: 2, name: 'Aux',     on: false, auto: true, speed: 0 },
  ]);
  const [lights, setLightsState] = useState<LightData[]>(
    LIGHT_NAMES.map((name, id) => ({ id, name, on: false }))
  );
  const [alerts] = useState<AlertData[]>([
    { id: 1, type: 'ok', msg: 'System boot complete', time: '14:32:01' },
    { id: 2, type: 'ok', msg: 'VE.Direct reader started', time: '14:32:04' },
    { id: 3, type: 'ok', msg: 'MK3 reader started', time: '14:32:05' },
    { id: 4, type: 'ok', msg: 'DS18B20 cabinet sensor started', time: '14:32:06' },
    { id: 5, type: 'ok', msg: 'Fan controller started', time: '14:32:07' },
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
        temp: prev.temp + (Math.random() - 0.48) * 0.3,
      }));
      setTemps(prev => ({
        cabinet:  parseFloat((prev.cabinet  + (Math.random() - 0.48) * 0.3).toFixed(1)),
        battery:  parseFloat((prev.battery  + (Math.random() - 0.48) * 0.2).toFixed(1)),
        inverter: parseFloat((prev.inverter + (Math.random() - 0.48) * 0.3).toFixed(1)),
      }));
      setFansState(prev => prev.map(f => {
        const hottest = Math.max(SIM_TEMPS.cabinet, SIM_TEMPS.battery, SIM_TEMPS.inverter);
        const speed = hottest <= 30 ? 0 : hottest >= 60 ? 100 : Math.round(((hottest - 30) / 30) * 100);
        return f.auto ? { ...f, speed, on: speed > 0 } : f;
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
          temps: Record<string, number>;
          uptime: number;
        };
        if (cancelled) return;

        if (!apiAvailable.current) {
          apiAvailable.current = true;
          stopSimulation();
        }

        setBattery(prev => apiBatteryToData(json.battery, prev));
        setInverter(prev => apiInverterToData(json.inverter, prev));
        if (json.temps) {
          setTemps({
            cabinet:  json.temps['cabinet']  ?? 0,
            battery:  json.temps['battery']  ?? 0,
            inverter: json.temps['inverter'] ?? 0,
          });
        }
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
      } catch { /* keep local state */ }
    }

    async function fetchFans() {
      try {
        const res = await fetch('/api/fans', { signal: AbortSignal.timeout(3000) });
        if (!res.ok) throw new Error('bad response');
        const json = await res.json() as FanData[];
        if (!cancelled) setFansState(json);
      } catch { /* keep local state */ }
    }

    fetchData();
    fetchLights();
    fetchFans();

    const dataInterval  = setInterval(fetchData,  2000);
    const fansInterval  = setInterval(fetchFans,  3000);

    const uptimeInterval = setInterval(() => {
      if (!apiAvailable.current) setUptime(u => u + 1);
    }, 1000);

    return () => {
      cancelled = true;
      clearInterval(dataInterval);
      clearInterval(fansInterval);
      clearInterval(uptimeInterval);
      stopSimulation();
    };
  }, [startSimulation, stopSimulation]);

  const toggleInverter = useCallback(() => {
    setInverter(prev => {
      const newIsOn = !prev.isOn;
      fetch('/api/inverter/toggle', { method: 'POST' }).catch(() => {});
      return {
        ...prev,
        isOn: newIsOn,
        mode: newIsOn ? 'Inverting' : 'Off',
        acVoltage: newIsOn ? prev.acVoltage : 0,
        acHz: newIsOn ? prev.acHz : 0,
        outputKw: newIsOn ? prev.outputKw : 0,
        loadPct: newIsOn ? prev.loadPct : 0,
      };
    });
  }, []);

  const setFans = useCallback((newFans: FanData[]) => {
    setFansState(newFans);
    newFans.forEach(f => {
      fetch(`/api/fans/${f.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auto: f.auto, speed: f.speed }),
      }).catch(() => {});
    });
  }, []);

  const setLights = useCallback((newLights: LightData[]) => {
    const changed = newLights.find((l, i) => l.on !== lights[i]?.on);
    if (!changed) { setLightsState(newLights); return; }
    setLightsState(newLights);
    fetch(`/api/lights/${changed.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ on: changed.on }),
    }).catch(() => {});
  }, [lights]);

  return {
    inverter, battery, pressure, temps, fans, lights, alerts, uptime,
    setFans, setLights, toggleInverter,
  };
}
