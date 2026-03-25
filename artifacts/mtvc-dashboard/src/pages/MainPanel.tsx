import { useState, useEffect } from 'react';
import { ConnDot } from '../components/ConnDot';
import { Toggle } from '../components/Toggle';
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
  { id: 'battery', label: 'Battery', icon: '🔋' },
  { id: 'air', label: 'Air', icon: '💨' },
  { id: 'fans', label: 'Fans', icon: '⚙' },
  { id: 'lights', label: 'Lights', icon: '💡' },
  { id: 'status', label: 'Status', icon: '📊' },
];

function Clock() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  return (
    <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 14, color: 'var(--text)' }}>
      {time}
    </span>
  );
}

function MtvcLogo() {
  return (
    <img
      src="/mtvc-logo.png"
      alt="MTVC Logo"
      style={{ width: 80, height: 80, objectFit: 'contain', flexShrink: 0 }}
    />
  );
}

export default function MainPanel() {
  const [activeTab, setActiveTab] = useState('inverter');
  const data = useLiveData();
  const { isDark, toggleTheme } = useTheme();
  const amber = isDark ? '#6DC82B' : '#4A8A18';

  const systemOnline = data.inverter.connected && data.battery.connected;

  return (
    <div
      style={{
        width: 800,
        height: 480,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Header — 88px */}
      <div
        style={{
          height: 88,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 12px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border-color)',
          flexShrink: 0,
        }}
      >
        {/* Left: Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 10 }}>
          <MtvcLogo />
        </div>

        {/* System Status Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 10px',
            borderRadius: 20,
            background: 'var(--surface2)',
            border: '1px solid var(--border-color)',
          }}
        >
          <ConnDot connected={systemOnline} />
          <span style={{ fontSize: 10, fontWeight: 700, color: systemOnline ? 'var(--green)' : 'var(--red)', letterSpacing: '0.05em' }}>
            {systemOnline ? 'Systems Online' : 'Fault Detected'}
          </span>
        </div>

        <div style={{ flex: 1 }} />

        {/* SOC Pill */}
        <div
          style={{
            padding: '3px 10px',
            borderRadius: 20,
            background: `${amber}20`,
            border: `1px solid ${amber}`,
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 12,
            color: amber,
          }}
        >
          SOC {data.battery.soc}%
        </div>

        {/* Load Pill */}
        <div
          style={{
            padding: '3px 10px',
            borderRadius: 20,
            background: isDark ? 'rgba(56,189,248,0.12)' : 'rgba(3,105,161,0.1)',
            border: `1px solid ${isDark ? '#38BDF8' : '#0369A1'}`,
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 12,
            color: isDark ? '#38BDF8' : '#0369A1',
          }}
        >
          {data.inverter.loadPct}% Load
        </div>

        {/* Theme Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 12 }}>🌙</span>
          <Toggle on={!isDark} onToggle={toggleTheme} color={amber} size="sm" />
          <span style={{ fontSize: 12 }}>☀️</span>
        </div>

        {/* Clock */}
        <Clock />
      </div>

      {/* Content — flex-1 */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {TABS.map(tab => (
          <div
            key={tab.id}
            style={{
              position: 'absolute',
              inset: 0,
              padding: '10px 12px',
              overflowY: 'auto',
              display: activeTab === tab.id ? 'block' : 'none',
            }}
          >
            {tab.id === 'inverter' && <InverterTab inverter={data.inverter} />}
            {tab.id === 'battery' && <BatteryTab battery={data.battery} />}
            {tab.id === 'air' && <AirTab pressure={data.pressure} />}
            {tab.id === 'fans' && (
              <FansTab
                fans={data.fans}
                fanThreshold={data.fanThreshold}
                inverterTemp={data.inverter.temp}
                setFans={data.setFans}
                setFanThreshold={data.setFanThreshold}
              />
            )}
            {tab.id === 'lights' && <LightsTab lights={data.lights} setLights={data.setLights} />}
            {tab.id === 'status' && (
              <StatusTab
                inverter={data.inverter}
                battery={data.battery}
                pressure={data.pressure}
                alerts={data.alerts}
                uptime={data.uptime}
              />
            )}
          </div>
        ))}
      </div>

      {/* Nav Bar — 44px */}
      <div
        style={{
          height: 44,
          display: 'flex',
          background: 'var(--surface)',
          borderTop: '1px solid var(--border-color)',
          flexShrink: 0,
        }}
      >
        {TABS.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                background: isActive ? `${amber}10` : 'transparent',
                border: 'none',
                borderTop: isActive ? `2px solid ${amber}` : '2px solid transparent',
                cursor: 'pointer',
                padding: '4px 0',
              }}
            >
              <span style={{ fontSize: 13, opacity: isActive ? 1 : 0.4 }}>{tab.icon}</span>
              <span
                style={{
                  fontSize: 9,
                  fontFamily: 'Rajdhani, sans-serif',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: isActive ? amber : 'var(--text-dim)',
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
