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

  // Emergency light — find by ID so renaming doesn't break it
  const emergLight = data.lights.find(l => l.id === EMERGENCY_LIGHT_ID);
  const emergActive = emergLight?.on ?? false;
  const toggleEmerg = () =>
    emergLight && data.setLights(data.lights.map(l => l.id === EMERGENCY_LIGHT_ID ? { ...l, on: !l.on } : l));

  const socC  = data.battery.soc > 60 ? 'var(--sys-green)' : data.battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const online = data.inverter.connected && data.battery.connected;

  const toggleLight = (id: number) => data.setLights(data.lights.map(l => l.id === id ? { ...l, on: !l.on } : l));

  const colHead = (label: string) => (
    <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.06em', textTransform: 'uppercase', paddingBottom: 10 }}>
      {label}
    </div>
  );

  return (
    <div style={{ width: 1280, height: 400, background: 'var(--bg)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── HEADER (56px) ── */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
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
        <Clock offset={config.dateTimeOffset ?? 0} />
      </div>

      {/* ── COLUMNS (334px) ── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        {/* COL 1: Battery */}
        <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 0, minWidth: 0, position: 'relative' }}>
          <img src="/mtvc-logo.png" aria-hidden="true" style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'contain', opacity: 0.04, pointerEvents: 'none',
            userSelect: 'none', filter: 'grayscale(1)',
          }} />
          {colHead('Battery Percentage')}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, justifyContent: 'center' }}>
            <ArcGauge value={data.battery.soc} max={100} size={140} color={socC} strokeWidth={8}>
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <div style={{ fontSize: 46, fontWeight: 200, color: socC, letterSpacing: '-0.03em' }}>{data.battery.soc}</div>
                <div style={{ fontSize: 14, fontWeight: 400, color: 'var(--label3)', marginTop: 4 }}>%</div>
              </div>
            </ArcGauge>
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
              const glowC   = isEmerg ? 'rgba(255,69,58,0.10)' : 'rgba(109,200,43,0.08)';
              return (
                <div
                  key={light.id}
                  onClick={() => toggleLight(light.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
                    borderRadius: 12, cursor: 'pointer',
                    background: light.on ? glowC : 'var(--surface1)',
                    border: `1px solid ${light.on
                      ? (isEmerg ? 'rgba(255,69,58,0.28)' : 'rgba(109,200,43,0.22)')
                      : 'transparent'}`,
                    transition: 'background 0.2s, border-color 0.2s',
                  }}
                >
                  <div style={{
                    width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                    background: light.on ? accentC : 'var(--surface3)',
                    boxShadow: light.on ? `0 0 10px ${isEmerg ? 'rgba(255,69,58,0.8)' : 'rgba(109,200,43,0.8)'}` : 'none',
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

    </div>
  );
}
