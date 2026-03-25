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
      const d = new Date();
      setTime(d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }));
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);
  return <span className="mono" style={{ fontSize: 12, color: 'var(--text-mid)', letterSpacing: '0.05em' }}>{time}</span>;
}

function formatUptime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

const EMOJIS: Record<string, string> = {
  'Cab': '🚗', 'Load Bay': '📦', 'Work': '🔦', 'Step': '👣',
  'Exterior': '💡', 'Tools': '🔧', 'Rear': '🔴', 'Emergency': '🚨',
};

const DIVIDER = (
  <div style={{ width: 1, background: 'rgba(255,255,255,0.07)', flexShrink: 0, margin: '0 0' }} />
);

export default function CabDisplay() {
  const data = useLiveData();
  const { isDark } = useTheme();
  const brand = isDark ? '#6DC82B' : '#4A8A18';
  const blue  = isDark ? '#38BDF8' : '#0284C7';
  const green = isDark ? '#34D399' : '#059669';
  const red   = isDark ? '#F87171' : '#DC2626';
  const amber = isDark ? '#FBB040' : '#D97706';

  const [emergActive, setEmergActive] = useState(false);

  const socColor  = data.battery.soc > 60 ? green : data.battery.soc > 30 ? amber : red;
  const psiPct    = (data.pressure.psi / data.pressure.maxPsi) * 100;
  const psiColor  = psiPct > 60 ? green : psiPct > 40 ? amber : red;
  const tempColor = data.inverter.temp < 45 ? green : data.inverter.temp < 60 ? amber : red;

  const activeLights = data.lights.filter(l => l.on).length;
  const activeFans   = data.fans.filter(f => f.on).length;

  const toggleLight = (id: number) =>
    data.setLights(data.lights.map(l => l.id === id ? { ...l, on: !l.on } : l));

  const toggleFan = (id: number) =>
    data.setFans(data.fans.map(f => f.id === id ? { ...f, on: !f.on } : f));

  const glassHeader: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255,255,255,0.07)',
  };

  return (
    <div style={{
      width: 1280, height: 400,
      background: 'var(--bg-grad)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', userSelect: 'none',
    }}>
      {/* ── HEADER (40px) ── */}
      <div style={{ height: 40, display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px', flexShrink: 0, ...glassHeader }}>
        <img src="/mtvc-logo.png" alt="MTVC" style={{ height: 34, width: 'auto', objectFit: 'contain', flexShrink: 0 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 10px', borderRadius: 100, background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
          <ConnDot connected={data.inverter.connected && data.battery.connected} size={5} />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-lo)', textTransform: 'uppercase' }}>Systems Online</span>
        </div>

        {emergActive && (
          <div className="warn-blink" style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '2px 12px',
            borderRadius: 100, background: 'rgba(248,113,113,0.15)', border: `1px solid ${red}50`,
            fontSize: 10, fontWeight: 700, color: red, letterSpacing: '0.05em',
          }}>⚠ EMERGENCY LIGHTS ACTIVE</div>
        )}

        <div style={{ flex: 1 }} />
        <Clock />
      </div>

      {/* ── COLUMNS (332px) ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* COL 1: Battery (270px) */}
        <div style={{ width: 270, padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div className="label-caps" style={{ alignSelf: 'flex-start' }}>Battery</div>

          <ArcGauge value={data.battery.soc} max={100} size={118} color={socColor} strokeWidth={9}>
            <div style={{ textAlign: 'center' }}>
              <div className="mono" style={{ fontSize: 26, color: socColor, lineHeight: 1 }}>{data.battery.soc}</div>
              <div className="label-caps" style={{ marginTop: 2 }}>SOC %</div>
            </div>
          </ArcGauge>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span className="mono" style={{ fontSize: 14, color: blue }}>{data.battery.voltage.toFixed(1)}V</span>
            <span className="mono" style={{ fontSize: 14, color: data.battery.current < 0 ? amber : green }}>
              {data.battery.current < 0 ? '↓' : '↑'} {Math.abs(data.battery.current).toFixed(1)}A
            </span>
          </div>

          <div style={{ fontSize: 9, color: 'var(--text-lo)', textAlign: 'center', letterSpacing: '0.04em' }}>Fogstar Drift 48V · 125Ah</div>
          <HBar pct={data.battery.soc} color={socColor} />
        </div>

        {DIVIDER}

        {/* COL 2: Inverter (250px) */}
        <div style={{ width: 250, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          <div className="label-caps">Inverter</div>
          <div className="mono" style={{ fontSize: 36, color: brand, lineHeight: 1 }}>
            {data.inverter.acVoltage.toFixed(1)}<span style={{ fontSize: 15, opacity: 0.6, marginLeft: 3 }}>V AC</span>
          </div>
          <HBar pct={data.inverter.loadPct} color={brand} height={5} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="label-caps">Load</span>
            <span className="mono" style={{ fontSize: 11, color: brand }}>{data.inverter.loadPct}%</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginTop: 4 }}>
            {[
              { label: 'Cabinet Temp', value: `${data.inverter.temp}°C`, color: tempColor },
              { label: 'Frequency',    value: `${data.inverter.acHz.toFixed(1)} Hz`, color: 'var(--text-hi)' },
              { label: 'DC Input',     value: `${data.inverter.dcVoltage.toFixed(1)}V`, color: blue },
              { label: 'Load',         value: `${data.inverter.loadPct}%`, color: brand },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '5px 8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="label-caps" style={{ fontSize: 8, marginBottom: 2 }}>{label}</div>
                <div className="mono" style={{ fontSize: 12, color }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {DIVIDER}

        {/* COL 3: Lights + Fans (240px) */}
        <div style={{ width: 240, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          {/* Lighting */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="label-caps">Lighting</div>
            <div style={{ padding: '2px 9px', borderRadius: 100, background: `${brand}18`, border: `1px solid ${brand}35`, fontSize: 10, fontWeight: 700, color: brand }}>
              {activeLights} ON
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3 }}>
            {data.lights.map(light => {
              const isEmerg = light.name === 'Emergency';
              const accent  = isEmerg ? red : brand;
              return (
                <button key={light.id} onClick={() => toggleLight(light.id)} style={{
                  padding: '5px 2px', borderRadius: 8, cursor: 'pointer',
                  background: light.on ? `${accent}12` : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${light.on ? `${accent}40` : 'rgba(255,255,255,0.06)'}`,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                }}>
                  <span style={{ fontSize: 13, opacity: light.on ? 1 : 0.22 }}>{EMOJIS[light.name] || '💡'}</span>
                  <span style={{ fontSize: 7, textTransform: 'uppercase', fontWeight: 700, color: light.on ? accent : 'var(--text-lo)', textAlign: 'center', lineHeight: 1.2 }}>
                    {light.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Fans */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="label-caps">Cabinet Fans</div>
            <span style={{ fontSize: 9, color: 'var(--text-lo)' }}>{activeFans}/{data.fans.length} on</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {data.fans.map(fan => (
              <div key={fan.id} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '5px 8px', borderRadius: 8,
                background: fan.on ? 'rgba(109,200,43,0.07)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${fan.on ? `${brand}30` : 'rgba(255,255,255,0.05)'}`,
              }}>
                <span className={fan.on ? 'spin-active' : ''} style={{ fontSize: 11, display: 'inline-block', color: fan.on ? brand : 'var(--text-lo)' }}>⚙</span>
                <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: fan.on ? 'var(--text-hi)' : 'var(--text-mid)' }}>{fan.name}</span>
                <Toggle on={fan.on} onToggle={() => toggleFan(fan.id)} color={brand} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {DIVIDER}

        {/* COL 4: Emergency (flex-1) */}
        <div style={{
          flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 12, position: 'relative',
          background: emergActive ? 'radial-gradient(ellipse at center, rgba(248,113,113,0.07) 0%, transparent 65%)' : 'transparent',
        }}>
          <div style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: emergActive ? red : 'var(--text-lo)',
          }}>
            {emergActive ? 'ACTIVE' : 'EMERGENCY'}
          </div>

          <button onClick={() => setEmergActive(v => !v)} className={emergActive ? 'emerg-glow' : ''} style={{
            width: 150, height: 150, borderRadius: '50%', cursor: 'pointer',
            border: `2.5px solid ${red}`,
            background: emergActive
              ? 'radial-gradient(circle, #7f1d1d 0%, #450a0a 100%)'
              : 'radial-gradient(circle, rgba(248,113,113,0.08) 0%, rgba(127,29,29,0.15) 100%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            <span style={{ fontSize: 34 }}>🚨</span>
            <span className="mono" style={{ fontSize: 11, color: red, letterSpacing: '0.15em' }}>EMERG</span>
          </button>

          <div style={{ fontSize: 9, color: 'var(--text-lo)', textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center' }}>
            Tap to {emergActive ? 'Deactivate' : 'Activate'}
          </div>

          {emergActive && (
            <div className="warn-blink" style={{
              padding: '4px 14px', borderRadius: 100,
              background: 'rgba(248,113,113,0.12)', border: `1px solid ${red}40`,
              fontSize: 10, color: red, fontWeight: 700, letterSpacing: '0.05em',
            }}>⚠ LIGHTS ON</div>
          )}
        </div>
      </div>

      {/* ── FOOTER (28px) ── */}
      <div style={{ height: 28, flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 0, ...glassHeader, borderBottom: 'none', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {[
          { label: 'SOC',      value: `${data.battery.soc}%`,                         color: socColor },
          { label: 'Pack V',   value: `${data.battery.voltage.toFixed(1)}V`,           color: blue },
          { label: 'Load',     value: `${data.inverter.loadPct}%`,                     color: brand },
          { label: 'AC Out',   value: `${data.inverter.acVoltage.toFixed(1)}V`,        color: brand },
          { label: 'Temp',     value: `${data.inverter.temp}°C`,                       color: tempColor },
          { label: 'Air PSI',  value: `${data.pressure.psi}`,                          color: psiColor },
          { label: 'Uptime',   value: formatUptime(data.uptime),                        color: 'var(--text-mid)' },
        ].map(({ label, value, color }, i) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            paddingRight: 14, marginRight: 14,
            borderRight: i < 6 ? '1px solid rgba(255,255,255,0.07)' : 'none',
          }}>
            <span className="label-caps" style={{ fontSize: 8 }}>{label}</span>
            <span className="mono" style={{ fontSize: 11, color }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
