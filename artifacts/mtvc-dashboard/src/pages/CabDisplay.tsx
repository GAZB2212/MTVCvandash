import { useState, useEffect } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { useVanConfig } from '../hooks/useVanConfig';
import { ConnDot } from '../components/ConnDot';
import { ArcGauge } from '../components/ArcGauge';
import { Toggle } from '../components/Toggle';

function Clock({ offset }: { offset: number }) {
  const [now, setNow] = useState(() => new Date(Date.now() + offset));
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date(Date.now() + offset)), 1000);
    return () => clearInterval(iv);
  }, [offset]);

  const time = now.toLocaleTimeString('en-GB', { hour12: false });
  const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ textAlign: 'right', lineHeight: 1 }}>
      <div style={{ fontSize: 26, fontWeight: 200, color: 'var(--label)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }}>{time}</div>
      <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--label3)', marginTop: 3, letterSpacing: '0.02em' }}>{date}</div>
    </div>
  );
}


const VDIV = <div style={{ width: '1px', background: 'rgba(255,255,255,0.07)', alignSelf: 'stretch', margin: '10px 0' }} />;

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

  // Emergency light — find by ID so renaming doesn't break it
  const emergLight = data.lights.find(l => l.id === EMERGENCY_LIGHT_ID);
  const emergActive = emergLight?.on ?? false;
  const toggleEmerg = () =>
    emergLight && data.setLights(data.lights.map(l => l.id === EMERGENCY_LIGHT_ID ? { ...l, on: !l.on } : l));

  const soc = data.battery.soc;
  const socC  = soc > 30 ? 'var(--sys-green)' : soc > 10 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const isCritical = soc <= 10;
  const online = data.inverter.connected && data.battery.connected;

  const toggleLight = (id: number) => data.setLights(data.lights.map(l => l.id === id ? { ...l, on: !l.on } : l));

  const colHead = (label: string) => (
    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.06em', textTransform: 'uppercase', paddingBottom: 10 }}>
      {label}
    </div>
  );

  return (
    <div style={{ width: 1280, height: 400, background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative' }}>

      {/* ── AMBIENT GLOW BLOBS ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', bottom: -140, left: -100, width: 560, height: 560,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,200,43,0.10) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', top: -120, right: -80, width: 480, height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,132,255,0.08) 0%, transparent 65%)',
        }} />
        <div style={{
          position: 'absolute', top: '30%', left: '42%', width: 380, height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,200,43,0.04) 0%, transparent 70%)',
        }} />
      </div>

      {/* ── HEADER (56px) ── */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
        background: 'rgba(7,11,19,0.65)',
        backdropFilter: 'blur(40px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0, zIndex: 10, position: 'relative',
      }}>
        <img src="/mtvc-logo.png" alt="MTVC" style={{ height: 40, width: 'auto', objectFit: 'contain' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 99, background: online ? 'rgba(48,209,88,0.10)' : 'rgba(255,69,58,0.10)' }}>
          <ConnDot connected={online} size={5} />
          <span style={{ fontSize: 10, fontWeight: 600, color: online ? 'var(--sys-green)' : 'var(--sys-red)' }}>
            {online ? 'Systems Online' : 'Fault Detected'}
          </span>
        </div>
        {emergActive && (
          <div className="blink" style={{ padding: '3px 10px', borderRadius: 99, background: 'rgba(255,159,10,0.15)', border: '1px solid rgba(255,159,10,0.35)', fontSize: 10, fontWeight: 700, color: 'var(--sys-orange)', letterSpacing: '0.06em' }}>
            ◈ BEACONS ACTIVE
          </div>
        )}
        <div style={{ flex: 1 }} />
        <Clock offset={config.dateTimeOffset ?? 0} />
      </div>

      {/* ── COLUMNS (334px) ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative', zIndex: 5 }}>

        {/* COL 1: Battery */}
        <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 0, minWidth: 0, position: 'relative' }}>
          {colHead('Battery Percentage')}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center', position: 'relative' }}>
            {/* Radial glow — breathes behind the gauge */}
            <div style={{
              position: 'absolute',
              width: 220, height: 220,
              borderRadius: '50%',
              background: `radial-gradient(circle, color-mix(in srgb, ${socC} 18%, transparent) 0%, transparent 70%)`,
              animation: `${isCritical ? 'battery-critical' : 'battery-breathe'} ${isCritical ? '0.85s' : '3s'} ease-in-out infinite`,
              pointerEvents: 'none',
            }} />
            <div className={isCritical ? 'battery-critical' : 'battery-breathe'}>
              <ArcGauge value={soc} max={100} size={220} color={socC} strokeWidth={10}>
                <div style={{ textAlign: 'center', lineHeight: 1 }}>
                  <div style={{ fontSize: 68, fontWeight: 200, color: socC, letterSpacing: '-0.03em' }}>{soc}</div>
                  <div style={{ fontSize: 18, fontWeight: 400, color: 'var(--label3)', marginTop: 6 }}>%</div>
                </div>
              </ArcGauge>
            </div>
          </div>
        </div>

        {VDIV}

        {/* COL 2: Lights */}
        <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexShrink: 0 }}>
            <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Lighting
            </span>
            <div style={{
              padding: '2px 9px', borderRadius: 99, fontSize: 10, fontWeight: 700,
              background: activeLights.filter(l => l.on).length > 0 ? 'var(--brand-dim)' : 'var(--surface1)',
              color: activeLights.filter(l => l.on).length > 0 ? 'var(--brand)' : 'var(--label3)',
            }}>
              {activeLights.filter(l => l.on).length} on
            </div>
          </div>

          {/* 2-column grid — fills remaining height */}
          <div style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: `repeat(${Math.ceil(activeLights.length / 2)}, 1fr)`,
            gap: 6,
            minHeight: 0,
          }}>
            {activeLights.map(light => {
              const isEmerg = light.id === EMERGENCY_LIGHT_ID;
              const accentC = isEmerg ? 'var(--sys-red)' : 'var(--brand)';
              const glowRgb = isEmerg ? '255,69,58' : '109,200,43';
              return (
                <div
                  key={light.id}
                  onClick={() => toggleLight(light.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
                    borderRadius: 12, cursor: 'pointer',
                    background: light.on ? `rgba(${glowRgb},0.09)` : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${light.on
                      ? `rgba(${glowRgb},0.25)`
                      : 'rgba(255,255,255,0.07)'}`,
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)',
                    boxShadow: light.on ? `inset 0 1px 0 rgba(255,255,255,0.08)` : 'none',
                    transition: 'background 0.2s, border-color 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                    background: light.on ? accentC : 'rgba(255,255,255,0.18)',
                    boxShadow: light.on ? `0 0 10px rgba(${glowRgb},0.8)` : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }} />
                  <span style={{
                    flex: 1, fontSize: 15, fontWeight: 600,
                    color: light.on ? 'var(--label)' : 'var(--label2)',
                    transition: 'color 0.2s',
                  }}>
                    {light.name}
                  </span>
                  <Toggle on={light.on} onToggle={() => toggleLight(light.id)} color={accentC} size="md" />
                </div>
              );
            })}
          </div>
        </div>

        {VDIV}

        {/* COL 4: Emergency Beacon */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '12px 14px', gap: 10, position: 'relative', overflow: 'hidden',
          background: emergActive
            ? 'radial-gradient(ellipse at 50% 45%, rgba(255,159,10,0.13) 0%, rgba(255,159,10,0.04) 50%, transparent 75%)'
            : 'transparent',
          transition: 'background 0.5s ease',
        }}>
          {/* Title */}
          <div style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: emergActive ? 'var(--sys-orange)' : 'var(--label3)',
            transition: 'color 0.3s',
          }}>
            Emergency Lights
          </div>

          {/* Button */}
          <button
            onClick={toggleEmerg}
            style={{
              all: 'unset', cursor: 'pointer', position: 'relative',
              width: 160, height: 160, flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {/* Outer pulsing ring — active only */}
            <div className={emergActive ? 'beacon-ring-pulse' : ''} style={{
              position: 'absolute', inset: -6, borderRadius: '50%',
              border: `1.5px solid ${emergActive ? 'rgba(255,159,10,0.5)' : 'rgba(255,255,255,0.06)'}`,
              transition: 'border-color 0.4s',
              pointerEvents: 'none',
            }} />

            {/* Mid ring */}
            <div style={{
              position: 'absolute', inset: 10, borderRadius: '50%',
              border: `1px solid ${emergActive ? 'rgba(255,159,10,0.28)' : 'rgba(255,255,255,0.05)'}`,
              transition: 'border-color 0.5s',
            }} />

            {/* Main button face */}
            <div
              className={emergActive ? 'beacon-flash' : ''}
              style={{
                width: 114, height: 114, borderRadius: '50%', position: 'relative', overflow: 'hidden',
                background: emergActive
                  ? 'radial-gradient(circle at 38% 32%, #b87200 0%, #6b3f00 45%, #2d1a00 100%)'
                  : 'radial-gradient(circle at 38% 32%, #282828 0%, #1a1a1a 60%, #111111 100%)',
                border: `2px solid ${emergActive ? 'rgba(255,180,60,0.55)' : 'rgba(255,159,10,0.20)'}`,
                boxShadow: emergActive
                  ? 'inset 0 2px 6px rgba(255,200,80,0.18), inset 0 -2px 6px rgba(0,0,0,0.65)'
                  : 'inset 0 2px 4px rgba(255,255,255,0.04), inset 0 -2px 4px rgba(0,0,0,0.5), 0 4px 20px rgba(0,0,0,0.5)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5,
                transition: 'background 0.35s, border-color 0.35s',
                flexShrink: 0,
              }}
            >
              {/* Rotating sweep beam — active only */}
              <div
                className={emergActive ? 'beacon-sweep' : ''}
                style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: 'conic-gradient(from 0deg, rgba(255,159,10,0.50) 0deg, rgba(255,159,10,0.12) 40deg, transparent 72deg, transparent 360deg)',
                  opacity: emergActive ? 1 : 0,
                  transition: 'opacity 0.3s',
                  pointerEvents: 'none',
                }}
              />

              {/* Beacon icon */}
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" style={{ position: 'relative', zIndex: 1 }}>
                {/* Base plate */}
                <rect x="10" y="27" width="14" height="3.5" rx="1.75"
                  fill={emergActive ? 'rgba(255,200,80,0.55)' : 'rgba(255,159,10,0.35)'} />
                {/* Post */}
                <rect x="15" y="20" width="4" height="7" rx="2"
                  fill={emergActive ? 'rgba(255,200,80,0.65)' : 'rgba(255,159,10,0.40)'} />
                {/* Dome body */}
                <path d="M7 20 Q7 8 17 8 Q27 8 27 20 Z"
                  fill={emergActive ? 'rgba(255,185,40,0.95)' : 'rgba(255,159,10,0.45)'} />
                {/* Dome highlight */}
                <ellipse cx="13" cy="13.5" rx="3.5" ry="2.5"
                  fill="white" opacity={emergActive ? 0.35 : 0.12} />
                {/* Light rays — left */}
                <line x1="2" y1="14" x2="7.5" y2="16.5" stroke={emergActive ? 'rgba(255,200,60,0.85)' : 'rgba(255,159,10,0.25)'}
                  strokeWidth="2" strokeLinecap="round" />
                {/* Light rays — right */}
                <line x1="32" y1="14" x2="26.5" y2="16.5" stroke={emergActive ? 'rgba(255,200,60,0.85)' : 'rgba(255,159,10,0.25)'}
                  strokeWidth="2" strokeLinecap="round" />
                {/* Light rays — top */}
                <line x1="17" y1="2" x2="17" y2="6.5" stroke={emergActive ? 'rgba(255,200,60,0.85)' : 'rgba(255,159,10,0.25)'}
                  strokeWidth="2" strokeLinecap="round" />
                {/* Light rays — top-left */}
                <line x1="5" y1="5" x2="9.5" y2="9.5" stroke={emergActive ? 'rgba(255,200,60,0.75)' : 'rgba(255,159,10,0.20)'}
                  strokeWidth="1.5" strokeLinecap="round" />
                {/* Light rays — top-right */}
                <line x1="29" y1="5" x2="24.5" y2="9.5" stroke={emergActive ? 'rgba(255,200,60,0.75)' : 'rgba(255,159,10,0.20)'}
                  strokeWidth="1.5" strokeLinecap="round" />
              </svg>

              <span style={{
                fontSize: 8, fontWeight: 800, letterSpacing: '0.18em', position: 'relative', zIndex: 1,
                color: emergActive ? 'rgba(255,220,120,0.95)' : 'rgba(255,159,10,0.55)',
                transition: 'color 0.3s',
              }}>BEACON</span>
            </div>
          </button>

          {/* Status badge */}
          <div style={{
            padding: '5px 14px', borderRadius: 99,
            background: emergActive ? 'rgba(255,159,10,0.14)' : 'var(--surface1)',
            border: `1px solid ${emergActive ? 'rgba(255,159,10,0.35)' : 'var(--surface3)'}`,
            transition: 'all 0.3s',
          }}>
            <span className={emergActive ? 'blink' : ''} style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.10em',
              color: emergActive ? 'var(--sys-orange)' : 'var(--label3)',
              textTransform: 'uppercase',
            }}>
              {emergActive ? '● Beacons Active' : '○ Standby'}
            </span>
          </div>

          <div style={{ fontSize: 10, color: 'var(--label3)', fontWeight: 400, letterSpacing: '0.03em' }}>
            Tap to {emergActive ? 'deactivate' : 'activate'}
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{
        height: 26, display: 'flex', alignItems: 'center', padding: '0 16px',
        background: 'rgba(7,11,19,0.60)',
        backdropFilter: 'blur(40px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.6)',
        borderTop: '1px solid rgba(255,255,255,0.07)',
        flexShrink: 0, zIndex: 10, position: 'relative',
      }}>
        <img src="/gajo-tech-logo.png" alt="GAJO Technologies" style={{ height: 26, width: 'auto', objectFit: 'contain', opacity: 0.75 }} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--label3)', fontVariantNumeric: 'tabular-nums' }}>
          v1.0.0
        </span>
      </div>

    </div>
  );
}
