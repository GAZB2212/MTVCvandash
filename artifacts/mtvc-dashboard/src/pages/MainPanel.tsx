import { useState, useEffect } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { useTheme } from '../context/ThemeContext';
import { ConnDot } from '../components/ConnDot';
import { InverterTab } from './tabs/InverterTab';
import { BatteryTab } from './tabs/BatteryTab';
import { AirTab } from './tabs/AirTab';
import { FansTab } from './tabs/FansTab';
import { LightsTab } from './tabs/LightsTab';
import { StatusTab } from './tabs/StatusTab';

const TABS = [
  { id: 'inverter', label: 'Inverter' },
  { id: 'battery',  label: 'Battery'  },
  { id: 'air',      label: 'Air'      },
  { id: 'fans',     label: 'Fans'     },
  { id: 'lights',   label: 'Lights'   },
  { id: 'status',   label: 'Status'   },
];

function Clock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv);
  }, []);
  return (
    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--label2)', fontVariantNumeric: 'tabular-nums' }}>
      {t}
    </span>
  );
}

export default function MainPanel() {
  const [tab, setTab] = useState('inverter');
  const data = useLiveData();
  const { isDark, toggleTheme } = useTheme();
  const online = data.inverter.connected && data.battery.connected;

  return (
    <div style={{
      width: 800, height: 480,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* ── HEADER (52px) ── */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 16px',
        background: 'rgba(28,28,30,0.92)',
        backdropFilter: 'blur(40px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
        borderBottom: '0.5px solid var(--sep)',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <img src="/mtvc-logo.png" alt="MTVC" style={{ height: 38, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />

        {/* Status */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 10px', borderRadius: 99,
          background: online ? 'rgba(48,209,88,0.12)' : 'rgba(255,69,58,0.12)',
        }}>
          <ConnDot connected={online} size={6} />
          <span style={{ fontSize: 11, fontWeight: 600, color: online ? 'var(--sys-green)' : 'var(--sys-red)' }}>
            {online ? 'Online' : 'Fault'}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* SOC chip */}
        <div style={{ padding: '4px 12px', borderRadius: 99, background: 'var(--brand-dim)' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--brand)' }}>SOC {data.battery.soc}%</span>
        </div>

        {/* Load chip */}
        <div style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(10,132,255,0.12)' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--sys-blue)' }}>{data.inverter.loadPct}% Load</span>
        </div>

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
            overflowY: 'auto',
            display: tab === t.id ? 'block' : 'none',
          }}>
            {t.id === 'inverter' && <InverterTab inverter={data.inverter} />}
            {t.id === 'battery'  && <BatteryTab  battery={data.battery} />}
            {t.id === 'air'      && <AirTab       pressure={data.pressure} />}
            {t.id === 'fans'     && (
              <FansTab fans={data.fans} fanThreshold={data.fanThreshold}
                inverterTemp={data.inverter.temp}
                setFans={data.setFans} setFanThreshold={data.setFanThreshold} />
            )}
            {t.id === 'lights' && <LightsTab lights={data.lights} setLights={data.setLights} />}
            {t.id === 'status' && (
              <StatusTab inverter={data.inverter} battery={data.battery}
                pressure={data.pressure} alerts={data.alerts} uptime={data.uptime} />
            )}
          </div>
        ))}
      </div>

      {/* ── TAB BAR (48px) ── */}
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
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0,
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
