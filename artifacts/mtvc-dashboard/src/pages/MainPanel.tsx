import { useState, useEffect } from 'react';
import { ConnDot } from '../components/ConnDot';
import { useLiveData } from '../hooks/useLiveData';
import { useTheme } from '../context/ThemeContext';
import { InverterTab } from './tabs/InverterTab';
import { BatteryTab } from './tabs/BatteryTab';
import { AirTab } from './tabs/AirTab';
import { FansTab } from './tabs/FansTab';
import { LightsTab } from './tabs/LightsTab';
import { StatusTab } from './tabs/StatusTab';

const TABS = [
  { id: 'inverter', label: 'Inverter', icon: '⚡' },
  { id: 'battery',  label: 'Battery',  icon: '🔋' },
  { id: 'air',      label: 'Air',      icon: '💨' },
  { id: 'fans',     label: 'Fans',     icon: '⚙'  },
  { id: 'lights',   label: 'Lights',   icon: '💡' },
  { id: 'status',   label: 'Status',   icon: '📊' },
];

function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  return <span className="mono" style={{ fontSize: 13, color: 'var(--text-mid)', letterSpacing: '0.05em' }}>{time}</span>;
}

export default function MainPanel() {
  const [activeTab, setActiveTab] = useState('inverter');
  const data = useLiveData();
  const { isDark, toggleTheme } = useTheme();
  const brand = isDark ? '#6DC82B' : '#4A8A18';
  const blue  = isDark ? '#38BDF8' : '#0284C7';

  const systemOnline = data.inverter.connected && data.battery.connected;

  return (
    <div style={{
      width: 800, height: 480,
      background: 'var(--bg-grad)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', userSelect: 'none',
    }}>
      {/* ── HEADER ── */}
      <div style={{
        height: 60, display: 'flex', alignItems: 'center', gap: 10,
        padding: '0 14px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0,
      }}>
        {/* Logo */}
        <img src="/mtvc-logo.png" alt="MTVC" style={{ height: 48, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />

        {/* Status pill */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '4px 12px', borderRadius: 100,
          background: systemOnline ? 'rgba(52,211,153,0.10)' : 'rgba(248,113,113,0.10)',
          border: `1px solid ${systemOnline ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`,
        }}>
          <ConnDot connected={systemOnline} size={6} />
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: systemOnline ? 'var(--green)' : 'var(--red)' }}>
            {systemOnline ? 'Systems Online' : 'Fault Detected'}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* SOC pill */}
        <div style={{
          padding: '4px 12px', borderRadius: 100,
          background: 'rgba(109,200,43,0.10)', border: '1px solid rgba(109,200,43,0.25)',
        }}>
          <span className="mono" style={{ fontSize: 12, color: brand }}>SOC {data.battery.soc}%</span>
        </div>

        {/* Load pill */}
        <div style={{
          padding: '4px 12px', borderRadius: 100,
          background: 'rgba(56,189,248,0.10)', border: '1px solid rgba(56,189,248,0.25)',
        }}>
          <span className="mono" style={{ fontSize: 12, color: blue }}>{data.inverter.loadPct}% Load</span>
        </div>

        {/* Theme toggle */}
        <button onClick={toggleTheme} style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)',
          cursor: 'pointer', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {isDark ? '☀️' : '🌙'}
        </button>

        <Clock />
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {TABS.map(tab => (
          <div key={tab.id} style={{
            position: 'absolute', inset: 0,
            padding: '10px 12px',
            overflowY: 'auto',
            display: activeTab === tab.id ? 'block' : 'none',
          }}>
            {tab.id === 'inverter' && <InverterTab inverter={data.inverter} />}
            {tab.id === 'battery'  && <BatteryTab  battery={data.battery} />}
            {tab.id === 'air'      && <AirTab       pressure={data.pressure} />}
            {tab.id === 'fans'     && (
              <FansTab fans={data.fans} fanThreshold={data.fanThreshold}
                inverterTemp={data.inverter.temp} setFans={data.setFans} setFanThreshold={data.setFanThreshold} />
            )}
            {tab.id === 'lights'   && <LightsTab lights={data.lights} setLights={data.setLights} />}
            {tab.id === 'status'   && (
              <StatusTab inverter={data.inverter} battery={data.battery} pressure={data.pressure}
                alerts={data.alerts} uptime={data.uptime} />
            )}
          </div>
        ))}
      </div>

      {/* ── NAV BAR ── */}
      <div style={{
        height: 52, display: 'flex',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        padding: '6px 10px', gap: 4, flexShrink: 0,
      }}>
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center', gap: 2, border: 'none', cursor: 'pointer',
              borderRadius: 10,
              background: isActive ? `${brand}18` : 'transparent',
              boxShadow: isActive ? `inset 0 0 0 1px ${brand}35` : 'none',
              padding: '4px 2px',
            }}>
              <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.35 }}>{tab.icon}</span>
              <span style={{
                fontSize: 9, fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
                letterSpacing: '0.06em', textTransform: 'uppercase',
                color: isActive ? brand : 'var(--text-lo)',
              }}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
