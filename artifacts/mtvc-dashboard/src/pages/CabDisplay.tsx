import { useState, useEffect } from 'react';
import { ConnDot } from '../components/ConnDot';
import { ArcGauge } from '../components/ArcGauge';
import { HBar } from '../components/HBar';
import { Toggle } from '../components/Toggle';
import { useLiveData } from '../hooks/useLiveData';
import { useTheme } from '../context/ThemeContext';

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
  return <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: 'var(--text)' }}>{time}</span>;
}

function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function MtvcLogo() {
  return (
    <img
      src="/mtvc-logo.png"
      alt="MTVC Logo"
      style={{ width: 30, height: 30, objectFit: 'contain', flexShrink: 0 }}
    />
  );
}

const LIGHT_EMOJIS: Record<string, string> = {
  'Cab': '🚗', 'Load Bay': '📦', 'Work': '🔦', 'Step': '👣',
  'Exterior': '💡', 'Tools': '🔧', 'Rear': '🔴', 'Emergency': '🚨',
};

export default function CabDisplay() {
  const data = useLiveData();
  const { isDark } = useTheme();
  const amber = isDark ? '#6DC82B' : '#4A8A18';
  const blue = isDark ? '#38BDF8' : '#0369A1';
  const green = isDark ? '#22C55E' : '#15803D';
  const red = isDark ? '#EF4444' : '#B91C1C';

  const [emergencyActive, setEmergencyActive] = useState(false);

  const socColor = data.battery.soc > 60 ? green : data.battery.soc > 30 ? amber : red;
  const psiPct = (data.pressure.psi / data.pressure.maxPsi) * 100;
  const psiColor = psiPct > 60 ? green : psiPct > 40 ? amber : red;
  const tempColor = data.inverter.temp < 45 ? green : data.inverter.temp < 60 ? amber : red;

  const activeLight = data.lights.filter(l => l.on).length;
  const activeFans = data.fans.filter(f => f.on).length;

  const toggleEmergency = () => setEmergencyActive(v => !v);

  const toggleLight = (id: number) => {
    data.setLights(data.lights.map(l => l.id === id ? { ...l, on: !l.on } : l));
  };

  return (
    <div
      style={{
        width: 1280,
        height: 400,
        background: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Header — 36px */}
      <div
        style={{
          height: 36,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 12px',
          background: 'var(--surface)',
          borderBottom: '1px solid var(--border-color)',
          flexShrink: 0,
        }}
      >
        <MtvcLogo />
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', color: 'var(--text)', fontFamily: 'Rajdhani, sans-serif' }}>MTVC</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '2px 8px', borderRadius: 20, background: 'var(--surface2)', border: '1px solid var(--border-color)' }}>
          <ConnDot connected={data.inverter.connected && data.battery.connected} size={6} />
          <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-dim)' }}>SYSTEMS ONLINE</span>
        </div>

        {/* Emergency Banner */}
        {emergencyActive && (
          <div
            className="warning-blink"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '2px 12px',
              background: 'rgba(239,68,68,0.2)',
              border: `1px solid ${red}`,
              borderRadius: 20,
              color: red,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            ⚠ EMERGENCY LIGHTS ACTIVE
          </div>
        )}

        <div style={{ flex: 1 }} />
        <Clock />
      </div>

      {/* Main — 4 columns */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* Column 1: Battery (280px) */}
        <div style={{ width: 280, borderRight: '1px solid var(--border-color)', padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', fontWeight: 700, alignSelf: 'flex-start' }}>BATTERY</div>
          <ArcGauge value={data.battery.soc} max={100} size={120} color={socColor} strokeWidth={10}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 22, color: socColor, lineHeight: 1 }}>{data.battery.soc}</div>
              <div style={{ fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase' }}>SOC %</div>
            </div>
          </ArcGauge>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 14, color: blue }}>{data.battery.voltage.toFixed(1)}V</div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 14, color: data.battery.current < 0 ? amber : green }}>
              {data.battery.current < 0 ? '↓' : '↑'} {Math.abs(data.battery.current).toFixed(1)}A
            </div>
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', textAlign: 'center' }}>Fogstar Drift 48V · 125Ah</div>
          <HBar pct={data.battery.soc} color={socColor} />
        </div>

        {/* Column 2: Inverter (260px) */}
        <div style={{ width: 260, borderRight: '1px solid var(--border-color)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', fontWeight: 700 }}>INVERTER</div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 32, color: amber, lineHeight: 1 }}>
            {data.inverter.acVoltage.toFixed(1)}<span style={{ fontSize: 14, marginLeft: 3 }}>V AC</span>
          </div>
          <HBar pct={data.inverter.loadPct} color={amber} />
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color: amber }}>Load: {data.inverter.loadPct}%</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginTop: 4 }}>
            {[
              { label: 'Cabinet Temp', value: `${data.inverter.temp}°C`, color: tempColor },
              { label: 'Hz', value: `${data.inverter.acHz.toFixed(1)}`, color: 'var(--text)' },
              { label: 'DC Input', value: `${data.inverter.dcVoltage.toFixed(1)}V`, color: blue },
              { label: 'Load', value: `${data.inverter.loadPct}%`, color: amber },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'var(--surface2)', borderRadius: 3, padding: '5px 6px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: 8, textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: 2, letterSpacing: '0.05em' }}>{label}</div>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Lights + Fans (240px) */}
        <div style={{ width: 240, borderRight: '1px solid var(--border-color)', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          {/* Lighting */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', fontWeight: 700 }}>LIGHTING</div>
            <div style={{ padding: '1px 8px', borderRadius: 20, background: `${amber}20`, border: `1px solid ${amber}`, fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: amber }}>
              {activeLight} ON
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
            {data.lights.map(light => {
              const isEmergency = light.name === 'Emergency';
              const accentColor = isEmergency ? red : amber;
              return (
                <button
                  key={light.id}
                  onClick={() => toggleLight(light.id)}
                  style={{
                    padding: '5px 3px',
                    borderRadius: 4,
                    border: `1px solid ${light.on ? accentColor : 'var(--border-color)'}`,
                    background: light.on ? `${accentColor}15` : 'var(--surface2)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <span style={{ fontSize: 12, opacity: light.on ? 1 : 0.3 }}>{LIGHT_EMOJIS[light.name] || '💡'}</span>
                  <span style={{ fontSize: 7, textTransform: 'uppercase', color: light.on ? accentColor : 'var(--text-dim)', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
                    {light.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Fans */}
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', fontWeight: 700, marginTop: 4 }}>CABINET FANS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {data.fans.map(fan => (
              <div
                key={fan.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 8px',
                  background: fan.on ? 'rgba(232,160,32,0.07)' : 'var(--surface2)',
                  border: `1px solid ${fan.on ? amber : 'var(--border-color)'}`,
                  borderRadius: 4,
                }}
              >
                <span className={fan.on ? 'spin-active' : ''} style={{ fontSize: 12, color: fan.on ? amber : 'var(--text-dim)', display: 'inline-block' }}>⚙</span>
                <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: fan.on ? 'var(--text)' : 'var(--text-dim)' }}>{fan.name}</span>
                <Toggle on={fan.on} onToggle={() => data.setFans(data.fans.map(f => f.id === fan.id ? { ...f, on: !f.on } : f))} color={amber} size="sm" />
              </div>
            ))}
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', textAlign: 'center' }}>
            {activeFans} of {data.fans.length} fans active
          </div>
        </div>

        {/* Column 4: Emergency */}
        <div
          style={{
            flex: 1,
            padding: '10px 12px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            position: 'relative',
            background: emergencyActive ? 'radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, transparent 70%)' : 'transparent',
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: emergencyActive ? red : 'var(--text-dim)', fontFamily: 'Rajdhani, sans-serif' }}>
            {emergencyActive ? 'ACTIVE' : 'EMERGENCY'}
          </div>

          <button
            onClick={toggleEmergency}
            className={emergencyActive ? 'emergency-active' : ''}
            style={{
              width: 160,
              height: 160,
              borderRadius: '50%',
              border: `3px solid ${red}`,
              background: emergencyActive
                ? 'radial-gradient(circle, #7f1d1d 0%, #450a0a 100%)'
                : 'radial-gradient(circle, #3f0a0a 0%, #1c0606 100%)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              transition: 'all 0.3s ease',
            }}
          >
            <span style={{ fontSize: 36 }}>🚨</span>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13, fontWeight: 900, color: red, letterSpacing: '0.15em' }}>EMERG</span>
          </button>

          <div style={{ fontSize: 9, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>
            TAP TO {emergencyActive ? 'DEACTIVATE' : 'ACTIVATE'}
          </div>

          {emergencyActive && (
            <div
              className="warning-blink"
              style={{
                padding: '4px 12px',
                borderRadius: 20,
                background: `${red}20`,
                border: `1px solid ${red}`,
                fontSize: 10,
                color: red,
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}
            >
              ⚠ LIGHTS ON
            </div>
          )}
        </div>
      </div>

      {/* Footer — 28px */}
      <div
        style={{
          height: 28,
          background: 'var(--surface)',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          gap: 4,
          flexShrink: 0,
        }}
      >
        {[
          { label: 'SOC', value: `${data.battery.soc}%`, color: socColor },
          { label: 'Pack V', value: `${data.battery.voltage.toFixed(1)}V`, color: blue },
          { label: 'Load', value: `${data.inverter.loadPct}%`, color: amber },
          { label: 'AC Out', value: `${data.inverter.acVoltage.toFixed(1)}V`, color: amber },
          { label: 'Temp', value: `${data.inverter.temp}°C`, color: tempColor },
          { label: 'Air PSI', value: `${data.pressure.psi}`, color: psiColor },
          { label: 'Uptime', value: formatUptime(data.uptime), color: 'var(--text)' },
        ].map(({ label, value, color }, i) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 5, paddingRight: 8, marginRight: i < 6 ? 4 : 0, borderRight: i < 6 ? '1px solid var(--border-color)' : 'none' }}>
            <span style={{ fontSize: 8, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.05em' }}>{label}</span>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 11, color }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
