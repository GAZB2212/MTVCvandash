import { useState, useCallback } from 'react';

export interface OutputConfig {
  id: number;
  name: string;
  enabled: boolean;
  icon?: string;
}

export interface VanConfig {
  vanName: string;
  lights: OutputConfig[];
  fans: OutputConfig[];
  dateTimeOffset: number;
}

const DEFAULT_LIGHTS: { name: string; icon: string }[] = [
  { name: 'Cab',      icon: 'light'     },
  { name: 'Load Bay', icon: 'light'     },
  { name: 'Work',     icon: 'light'     },
  { name: 'Step',     icon: 'step'      },
  { name: 'Exterior', icon: 'light'     },
  { name: 'Tools',    icon: 'tools'     },
  { name: 'Rear',     icon: 'light'     },
  { name: 'Emergency',icon: 'emergency' },
];

const DEFAULT_FANS = ['Cabinet', 'Exhaust', 'Aux'];

function defaultConfig(): VanConfig {
  return {
    vanName: 'Van 01',
    lights: DEFAULT_LIGHTS.map(({ name, icon }, id) => ({ id, name, enabled: true, icon })),
    fans:   DEFAULT_FANS.map((name, id)              => ({ id, name, enabled: true })),
    dateTimeOffset: 0,
  };
}

const STORAGE_KEY = 'mtvc-van-config';

function loadConfig(): VanConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultConfig();
    const parsed = JSON.parse(raw) as VanConfig;
    const def = defaultConfig();
    return {
      vanName: parsed.vanName ?? def.vanName,
      dateTimeOffset: parsed.dateTimeOffset ?? 0,
      lights: def.lights.map(d => {
        const saved = parsed.lights?.find(l => l.id === d.id);
        return saved ? { ...d, ...saved } : d;
      }),
      fans: def.fans.map(d => {
        const saved = parsed.fans?.find(f => f.id === d.id);
        return saved ? { ...d, ...saved } : d;
      }),
    };
  } catch {
    return defaultConfig();
  }
}

function saveConfig(cfg: VanConfig) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg)); } catch { /* noop */ }
}

export interface VanConfigAPI {
  config: VanConfig;
  setVanName: (name: string) => void;
  setLightConfig: (id: number, patch: Partial<Omit<OutputConfig, 'id'>>) => void;
  setFanConfig:   (id: number, patch: Partial<Omit<OutputConfig, 'id'>>) => void;
  setDateTimeOffset: (offsetMs: number) => void;
  resetConfig: () => void;
}

export function useVanConfig(): VanConfigAPI {
  const [config, setConfig] = useState<VanConfig>(loadConfig);

  const setVanName = useCallback((vanName: string) => {
    setConfig(c => { const n = { ...c, vanName }; saveConfig(n); return n; });
  }, []);

  const setLightConfig = useCallback((id: number, patch: Partial<Omit<OutputConfig, 'id'>>) => {
    setConfig(c => {
      const n = { ...c, lights: c.lights.map(l => l.id === id ? { ...l, ...patch } : l) };
      saveConfig(n); return n;
    });
  }, []);

  const setFanConfig = useCallback((id: number, patch: Partial<Omit<OutputConfig, 'id'>>) => {
    setConfig(c => {
      const n = { ...c, fans: c.fans.map(f => f.id === id ? { ...f, ...patch } : f) };
      saveConfig(n); return n;
    });
  }, []);

  const setDateTimeOffset = useCallback((dateTimeOffset: number) => {
    setConfig(c => { const n = { ...c, dateTimeOffset }; saveConfig(n); return n; });
  }, []);

  const resetConfig = useCallback(() => {
    const n = defaultConfig();
    saveConfig(n);
    setConfig(n);
  }, []);

  return { config, setVanName, setLightConfig, setFanConfig, setDateTimeOffset, resetConfig };
}
