import { useState, useEffect, useRef, useCallback } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { useTheme } from '../context/ThemeContext';
import { useVanConfig } from '../hooks/useVanConfig';
import { ConnDot } from '../components/ConnDot';
import { AdminPanel } from './AdminPanel';
import { InverterTab } from './tabs/InverterTab';
import { BatteryTab } from './tabs/BatteryTab';
import { HomeTab } from './tabs/HomeTab';
import { StatusTab } from './tabs/StatusTab';

const TABS = [
  { id: 'home',     label: 'Home'     },
  { id: 'inverter', label: 'Inverter' },
  { id: 'battery',  label: 'Battery'  },
  { id: 'status',   label: 'Status'   },
];

const HOLD_MS = 2000;

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);
  const time = now.toLocaleTimeString('en-GB', { hour12: false });
  const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--label)', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {time}
      </span>
      <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--label3)', lineHeight: 1 }}>
        {date}
      </span>
    </div>
  );
}

export default function MainPanel() {
  const [tab, setTab] = useState('home');
  const [adminOpen, setAdminOpen] = useState(false);
  const [holdPct, setHoldPct] = useState(0); // 0–100 progress while holding
  const data = useLiveData();
  const vanConfig = useVanConfig();
  const { isDark, toggleTheme } = useTheme();
  const online = data.inverter.connected && data.battery.connected;

  // Long-press on logo
  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(0);

  const cancelHold = useCallback(() => {
    if (holdTimerRef.current) { clearInterval(holdTimerRef.current); holdTimerRef.current = null; }
    setHoldPct(0);
  }, []);

  const startHold = useCallback(() => {
    holdStartRef.current = Date.now();
    setHoldPct(0);
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const pct = Math.min(100, (elapsed / HOLD_MS) * 100);
      setHoldPct(pct);
      if (pct >= 100) {
        cancelHold();
        setAdminOpen(true);
      }
    }, 30);
  }, [cancelHold]);

  // Merge live light/fan data with config names and enabled state
  const activeLights = data.lights
    .map(l => {
      const cfg = vanConfig.config.lights.find(c => c.id === l.id);
      return cfg ? { ...l, name: cfg.name, _enabled: cfg.enabled } : { ...l, _enabled: true };
    })
    .filter(l => l._enabled);

  const setLightsProxy = (next: typeof data.lights) => {
    data.setLights(data.lights.map(orig => {
      const updated = next.find(n => n.id === orig.id);
      return updated ?? orig;
    }));
  };

  // Logo hold indicator — SVG ring
  const LOGO_SIZE = 42;
  const R = 22;
  const CIRC = 2 * Math.PI * R;

  return (
    <div style={{
      width: 800, height: 480,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* ── HEADER ── */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px',
        background: 'rgba(28,28,30,0.92)',
        backdropFilter: 'blur(40px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        borderBottom: '0.5px solid var(--sep)',
        flexShrink: 0,
      }}>
        {/* Logo — long-press target */}
        <div
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          style={{ position: 'relative', width: LOGO_SIZE + 4, height: LOGO_SIZE + 4, flexShrink: 0, cursor: 'pointer', touchAction: 'none' }}
        >
          <img src="/mtvc-logo.png" alt="MTVC" style={{
            position: 'absolute', top: 2, left: 2,
            width: LOGO_SIZE, height: LOGO_SIZE, objectFit: 'contain',
          }} />
          {/* Progress ring */}
          {holdPct > 0 && (
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox={`0 0 ${LOGO_SIZE + 4} ${LOGO_SIZE + 4}`}>
              <circle
                cx={(LOGO_SIZE + 4) / 2} cy={(LOGO_SIZE + 4) / 2} r={R}
                fill="none" stroke="var(--brand)" strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${(holdPct / 100) * CIRC} ${CIRC}`}
                transform={`rotate(-90 ${(LOGO_SIZE + 4) / 2} ${(LOGO_SIZE + 4) / 2})`}
              />
            </svg>
          )}
        </div>

        {/* Van name + status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--label)' }}>{vanConfig.config.vanName}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <ConnDot connected={online} size={5} />
            <span style={{ fontSize: 10, fontWeight: 500, color: online ? 'var(--sys-green)' : 'var(--sys-red)' }}>
              {online ? 'Online' : 'Fault'}
            </span>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Theme */}
        <button onClick={toggleTheme} style={{
          width: 32, height: 32, borderRadius: 8, border: 'none',
          background: 'var(--surface2)', cursor: 'pointer',
          fontSize: 15, color: 'var(--label)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{isDark ? '☀' : '●'}</button>

        <Clock />
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {TABS.map(t => (
          <div key={t.id} style={{
            position: 'absolute', inset: 0,
            padding: '12px 14px',
            overflow: 'hidden',
            display: tab === t.id ? 'flex' : 'none',
            flexDirection: 'column',
          }}>
            {t.id === 'home'     && <HomeTab battery={data.battery} powerKw={data.inverter.outputKw} lights={activeLights} setLights={setLightsProxy} />}
            {t.id === 'inverter' && <InverterTab inverter={data.inverter} onToggle={data.toggleInverter} />}
            {t.id === 'battery'  && <BatteryTab  battery={data.battery} powerKw={data.inverter.outputKw} />}
            {t.id === 'status'   && (
              <StatusTab inverter={data.inverter} battery={data.battery}
                pressure={data.pressure} temps={data.temps} fans={data.fans}
                alerts={data.alerts} uptime={data.uptime} />
            )}
          </div>
        ))}

        {/* Admin overlay */}
        {adminOpen && (
          <AdminPanel api={vanConfig} onClose={() => setAdminOpen(false)} />
        )}
      </div>

      {/* ── TAB BAR ── */}
      <div style={{
        height: 48,
        background: 'rgba(28,28,30,0.92)',
        backdropFilter: 'blur(40px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        borderTop: '0.5px solid var(--sep)',
        display: 'flex', alignItems: 'center', padding: '0 8px', gap: 2,
        flexShrink: 0,
      }}>
        {TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, height: 36, border: 'none', cursor: 'pointer', borderRadius: 9,
              background: active ? 'var(--surface2)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 0.2s',
            }}>
              <span style={{
                fontSize: 11, fontWeight: active ? 600 : 500, letterSpacing: '0.01em',
                color: active ? 'var(--brand)' : 'var(--label3)',
                transition: 'color 0.2s',
              }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
