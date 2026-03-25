import { useState, useEffect } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { useVanConfig } from '../hooks/useVanConfig';
import { ConnDot } from '../components/ConnDot';
import { ArcGauge } from '../components/ArcGauge';
import { HBar } from '../components/HBar';
import { Toggle } from '../components/Toggle';
import { StatRow } from '../components/StatRow';

function Clock() {
  const [t, setT] = useState('');
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString('en-GB', { hour12: false }));
    tick(); const iv = setInterval(tick, 1000); return () => clearInterval(iv);
  }, []);
  return (
    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--label2)', fontVariantNumeric: 'tabular-nums' }}>{t}</span>
  );
}

function formatUptime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

const VDIV = <div style={{ width: '0.5px', background: 'var(--sep)', alignSelf: 'stretch', margin: '10px 0' }} />;

const EMERGENCY_LIGHT_ID = 7;

export default function CabDisplay() {
  const data = useLiveData();
  const { config } = useVanConfig();

  // Merge config names + enabled into live data
  const activeLights = data.lights
    .map(l => {
      const cfg = config.lights.find(c => c.id === l.id);
      return cfg ? { ...l, name: cfg.name, _enabled: cfg.enabled } : { ...l, _enabled: true };
    })
    .filter(l => l._enabled);

  const activeFans = data.fans
    .map(f => {
      const cfg = config.fans.find(c => c.id === f.id);
      return cfg ? { ...f, name: cfg.name, _enabled: cfg.enabled } : { ...f, _enabled: true };
    })
    .filter(f => f._enabled);

  // Emergency light — find by ID so renaming doesn't break it
  const emergLight = data.lights.find(l => l.id === EMERGENCY_LIGHT_ID);
  const emergActive = emergLight?.on ?? false;
  const toggleEmerg = () =>
    emergLight && data.setLights(data.lights.map(l => l.id === EMERGENCY_LIGHT_ID ? { ...l, on: !l.on } : l));

  const socC  = data.battery.soc > 60 ? 'var(--sys-green)' : data.battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const psiPct = (data.pressure.psi / data.pressure.maxPsi) * 100;
  const psiC  = psiPct > 60 ? 'var(--sys-green)' : psiPct > 40 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const tmpC  = data.inverter.temp < 45 ? 'var(--sys-green)' : data.inverter.temp < 60 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const online = data.inverter.connected && data.battery.connected;

  const toggleLight = (id: number) => data.setLights(data.lights.map(l => l.id === id ? { ...l, on: !l.on } : l));
  const toggleFan   = (id: number) => data.setFans(data.fans.map(f => f.id === id ? { ...f, on: !f.on } : f));

  const colHead = (label: string) => (
    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.06em', textTransform: 'uppercase', paddingBottom: 10 }}>
      {label}
    </div>
  );

  return (
    <div style={{ width: 1280, height: 400, background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── HEADER (38px) ── */}
      <div style={{
        height: 38, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
        background: 'rgba(28,28,30,0.92)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderBottom: '0.5px solid var(--sep)',
        flexShrink: 0,
      }}>
        <img src="/mtvc-logo.png" alt="MTVC" style={{ height: 28, width: 'auto', objectFit: 'contain' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 99, background: online ? 'rgba(48,209,88,0.10)' : 'rgba(255,69,58,0.10)' }}>
          <ConnDot connected={online} size={5} />
          <span style={{ fontSize: 10, fontWeight: 600, color: online ? 'var(--sys-green)' : 'var(--sys-red)' }}>
            {online ? 'Systems Online' : 'Fault Detected'}
          </span>
        </div>
        {emergActive && (
          <div className="blink" style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(255,69,58,0.15)', fontSize: 10, fontWeight: 700, color: 'var(--sys-red)' }}>
            ⚠ EMERGENCY ACTIVE
          </div>
        )}
        <div style={{ flex: 1 }} />
        <Clock />
      </div>

      {/* ── COLUMNS (334px) ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* COL 1: Battery (240px) */}
        <div style={{ width: 240, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 0, flexShrink: 0 }}>
          {colHead('Battery')}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', gap: 10 }}>
            <ArcGauge value={data.battery.soc} max={100} size={110} color={socC} strokeWidth={7}>
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <div style={{ fontSize: 28, fontWeight: 200, color: socC, letterSpacing: '-0.02em' }}>{data.battery.soc}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 2 }}>SOC %</div>
              </div>
            </ArcGauge>
            <div style={{ width: '100%' }}>
              <HBar pct={data.battery.soc} color={socC} height={3} />
            </div>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 300, color: 'var(--sys-blue)', fontVariantNumeric: 'tabular-nums' }}>
                {data.battery.voltage.toFixed(1)}V
              </span>
              <span style={{ fontSize: 14, fontWeight: 300, color: 'var(--label2)', fontVariantNumeric: 'tabular-nums' }}>
                {Math.abs(data.battery.current).toFixed(1)}A
              </span>
            </div>
            <div style={{ fontSize: 10, color: 'var(--label3)', fontWeight: 500 }}>Fogstar Drift 48V · 125Ah</div>
          </div>
        </div>

        {VDIV}

        {/* COL 2: Inverter (250px) */}
        <div style={{ width: 250, padding: '12px 14px', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          {colHead('Inverter')}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 40, fontWeight: 200, color: 'var(--label)', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {data.inverter.acVoltage.toFixed(1)}
              <span style={{ fontSize: 17, fontWeight: 300, color: 'var(--label2)', marginLeft: 3 }}>V</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--label3)', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>AC Output</div>
            <div style={{ marginTop: 10 }}>
              <HBar pct={data.inverter.loadPct} color="var(--brand)" height={3} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
                <span style={{ fontSize: 11, color: 'var(--label3)', fontWeight: 500 }}>Load</span>
                <span style={{ fontSize: 11, color: 'var(--brand)', fontWeight: 600 }}>{data.inverter.loadPct}%</span>
              </div>
            </div>
          </div>
          <div className="card" style={{ borderRadius: 10 }}>
            <StatRow label="DC Input"   value={`${data.inverter.dcVoltage.toFixed(1)} V`}  valueColor="var(--sys-blue)" />
            <StatRow label="Frequency"  value={`${data.inverter.acHz.toFixed(1)} Hz`} />
            <StatRow label="Temp"       value={`${data.inverter.temp}°C`}             valueColor={tmpC} />
            <StatRow label="Mode"       value={data.inverter.mode}                    valueColor="var(--brand)" last />
          </div>
        </div>

        {VDIV}

        {/* COL 3: Lights + Fans (260px) */}
        <div style={{ width: 260, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
          {/* Lights */}
          <div>
            {colHead(`Lighting — ${activeLights.filter(l=>l.on).length} On`)}
            <div className="card" style={{ borderRadius: 10 }}>
              {activeLights.map((light, i) => {
                const isEmerg = light.id === EMERGENCY_LIGHT_ID;
                const accentC = isEmerg ? 'var(--sys-red)' : 'var(--brand)';
                return (
                  <div key={light.id} className="list-row" style={{
                    padding: '7px 12px', minHeight: 34,
                    borderBottom: i < activeLights.length - 1 ? undefined : 'none',
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: light.on ? accentC : 'var(--surface3)', flexShrink: 0 }} />
                    <span className="list-row-label" style={{ flex: 1, fontSize: 12, marginLeft: 8, color: light.on ? 'var(--label)' : 'var(--label2)' }}>{light.name}</span>
                    <Toggle on={light.on} onToggle={() => toggleLight(light.id)} color={accentC} size="sm" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fans */}
          <div>
            {colHead(`Fans — ${activeFans.filter(f=>f.on).length} On`)}
            <div className="card" style={{ borderRadius: 10 }}>
              {activeFans.map((fan, i) => (
                <div key={fan.id} className="list-row" style={{
                  padding: '7px 12px', minHeight: 34,
                  borderBottom: i < activeFans.length - 1 ? undefined : 'none', gap: 8,
                }}>
                  <span className={fan.on ? 'spin' : ''} style={{ fontSize: 13, color: fan.on ? 'var(--brand)' : 'var(--label3)', flexShrink: 0 }}>◎</span>
                  <span className="list-row-label" style={{ flex: 1, fontSize: 12, color: fan.on ? 'var(--label)' : 'var(--label2)' }}>{fan.name}</span>
                  <Toggle on={fan.on} onToggle={() => toggleFan(fan.id)} size="sm" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {VDIV}

        {/* COL 4: Emergency */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '12px 14px', gap: 12, position: 'relative', overflow: 'hidden',
          background: emergActive
            ? 'radial-gradient(ellipse at 50% 55%, rgba(255,69,58,0.14) 0%, rgba(255,69,58,0.04) 50%, transparent 75%)'
            : 'transparent',
          transition: 'background 0.5s ease',
        }}>
          {/* Title */}
          <div style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: emergActive ? 'var(--sys-red)' : 'var(--label3)',
            transition: 'color 0.3s',
          }}>
            Emergency Lights
          </div>

          {/* Button — layered ring design */}
          <button
            onClick={toggleEmerg}
            style={{
              all: 'unset', cursor: 'pointer', position: 'relative',
              width: 160, height: 160, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {/* Outer glow ring — only when active */}
            {emergActive && (
              <div className="emerg-pulse" style={{
                position: 'absolute', inset: -8,
                borderRadius: '50%',
                border: '1.5px solid rgba(255,69,58,0.4)',
                pointerEvents: 'none',
              }} />
            )}

            {/* Ring 1 — outermost track */}
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `1.5px solid ${emergActive ? 'rgba(255,69,58,0.5)' : 'rgba(255,255,255,0.08)'}`,
              transition: 'border-color 0.4s',
            }} />

            {/* Ring 2 — middle track */}
            <div style={{
              position: 'absolute', inset: 14, borderRadius: '50%',
              border: `1px solid ${emergActive ? 'rgba(255,69,58,0.35)' : 'rgba(255,255,255,0.06)'}`,
              transition: 'border-color 0.4s',
            }} />

            {/* Main button face */}
            <div style={{
              width: 110, height: 110, borderRadius: '50%',
              background: emergActive
                ? 'radial-gradient(circle at 38% 35%, #c0392b 0%, #7f1d1d 45%, #3d0000 100%)'
                : 'radial-gradient(circle at 38% 35%, #2c2c2e 0%, #1c1c1e 60%, #141414 100%)',
              border: `2px solid ${emergActive ? 'rgba(255,120,100,0.5)' : 'rgba(255,69,58,0.25)'}`,
              boxShadow: emergActive
                ? '0 0 30px rgba(255,69,58,0.5), 0 0 60px rgba(255,69,58,0.2), inset 0 2px 4px rgba(255,180,160,0.15), inset 0 -2px 6px rgba(0,0,0,0.6)'
                : 'inset 0 2px 4px rgba(255,255,255,0.04), inset 0 -2px 4px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.5)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
              transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
              flexShrink: 0,
            }}>
              {/* Icon — lightning bolt */}
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13L13 2Z"
                  fill={emergActive ? 'rgba(255,200,180,0.9)' : 'rgba(255,69,58,0.6)'}
                  stroke={emergActive ? 'rgba(255,140,120,0.4)' : 'none'}
                  strokeWidth="0.5"
                />
              </svg>
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: '0.16em',
                color: emergActive ? 'rgba(255,200,190,0.9)' : 'rgba(255,69,58,0.7)',
                transition: 'color 0.3s',
              }}>EMERG</span>
            </div>
          </button>

          {/* Status badge */}
          <div style={{
            padding: '5px 14px', borderRadius: 99,
            background: emergActive ? 'rgba(255,69,58,0.15)' : 'var(--surface1)',
            border: `1px solid ${emergActive ? 'rgba(255,69,58,0.35)' : 'var(--surface3)'}`,
            transition: 'all 0.3s',
          }}>
            <span className={emergActive ? 'blink' : ''} style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
              color: emergActive ? 'var(--sys-red)' : 'var(--label3)',
              textTransform: 'uppercase',
            }}>
              {emergActive ? '● Lights Active' : '○ Standby'}
            </span>
          </div>

          <div style={{ fontSize: 10, color: 'var(--label3)', fontWeight: 400, letterSpacing: '0.03em' }}>
            Tap to {emergActive ? 'deactivate' : 'activate'}
          </div>
        </div>
      </div>

      {/* ── FOOTER (28px) ── */}
      <div style={{
        height: 28, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 0,
        background: 'rgba(28,28,30,0.92)',
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)',
        borderTop: '0.5px solid var(--sep)',
        flexShrink: 0,
      }}>
        {[
          { label: 'SOC',    value: `${data.battery.soc}%`,                         color: socC },
          { label: 'Pack',   value: `${data.battery.voltage.toFixed(1)}V`,           color: 'var(--sys-blue)' },
          { label: 'AC',     value: `${data.inverter.acVoltage.toFixed(1)}V`,        color: 'var(--brand)' },
          { label: 'Load',   value: `${data.inverter.loadPct}%`,                     color: 'var(--brand)' },
          { label: 'Temp',   value: `${data.inverter.temp}°C`,                       color: tmpC },
          { label: 'Air',    value: `${data.pressure.psi} PSI`,                      color: psiC },
          { label: 'Uptime', value: formatUptime(data.uptime),                        color: 'var(--label2)' },
        ].map(({ label, value, color }, i, arr) => (
          <div key={label} style={{
            display: 'flex', alignItems: 'center', gap: 5,
            paddingRight: 14, marginRight: 14,
            borderRight: i < arr.length - 1 ? '0.5px solid var(--sep)' : 'none',
          }}>
            <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--label3)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
