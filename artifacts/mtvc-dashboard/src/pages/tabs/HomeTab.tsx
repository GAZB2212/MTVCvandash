import { ArcGauge } from '../../components/ArcGauge';
import { LightData, BatteryData } from '../../hooks/useLiveData';
import { calcTimeRemaining } from './BatteryTab';

const EMERGENCY_ID = 7;

interface Props {
  battery: BatteryData;
  powerKw: number;
  lights: (LightData & { _enabled?: boolean })[];
  setLights: (lights: LightData[]) => void;
  inverterOn: boolean;
  onToggleInverter: () => void;
}

/* Lightbulb icon for normal zones */
function BulbIcon({ on, color }: { on: boolean; color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M9 21h6M12 3a6 6 0 0 1 4.243 10.243C15.368 14.12 15 15.03 15 16v1H9v-1c0-.97-.368-1.88-1.243-2.757A6 6 0 0 1 12 3z"
        fill={on ? `${color}40` : 'none'}
        stroke={on ? color : 'rgba(255,255,255,0.22)'}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <line x1="9" y1="17" x2="15" y2="17"
        stroke={on ? color : 'rgba(255,255,255,0.22)'}
        strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/* Warning icon for Emergency zone */
function AlertIcon({ on, color }: { on: boolean; color: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
        fill={on ? `${color}35` : 'none'}
        stroke={on ? color : 'rgba(255,255,255,0.22)'}
        strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      />
      <line x1="12" y1="9" x2="12" y2="13"
        stroke={on ? color : 'rgba(255,255,255,0.22)'}
        strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.9"
        fill={on ? color : 'rgba(255,255,255,0.22)'} />
    </svg>
  );
}

/* A single light zone tile */
function ZoneTile({ light, onToggle }: {
  light: LightData & { name: string }; onToggle: () => void;
}) {
  const isEmerg  = light.id === EMERGENCY_ID;
  const accent   = isEmerg ? 'var(--sys-red)' : 'var(--brand)';
  const glowRgb  = isEmerg ? '255,69,58' : '109,200,43';

  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 7,
        borderRadius: 16, cursor: 'pointer',
        background: light.on
          ? `linear-gradient(145deg, rgba(${glowRgb},0.20) 0%, rgba(${glowRgb},0.06) 100%)`
          : 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)',
        border: `1px solid ${light.on ? `rgba(${glowRgb},0.40)` : 'rgba(255,255,255,0.08)'}`,
        borderTopColor: light.on ? `rgba(${glowRgb},0.55)` : 'rgba(255,255,255,0.13)',
        boxShadow: light.on
          ? `0 0 24px rgba(${glowRgb},0.18), 0 0 48px rgba(${glowRgb},0.07), inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 20px rgba(0,0,0,0.45)`
          : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.40)',
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}
    >
      {isEmerg
        ? <AlertIcon on={light.on} color={accent} />
        : <BulbIcon  on={light.on} color={accent} />
      }
      <span style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
        textTransform: 'uppercase', textAlign: 'center',
        color: light.on ? 'var(--label)' : 'var(--label3)',
        lineHeight: 1.2, transition: 'color 0.2s',
      }}>
        {light.name}
      </span>
      <span style={{
        fontSize: 8, fontWeight: 800, letterSpacing: '0.14em',
        color: light.on ? accent : 'rgba(255,255,255,0.16)',
        transition: 'color 0.22s',
      }}>
        {light.on ? '● ON' : '○ OFF'}
      </span>
    </div>
  );
}

export function HomeTab({ battery, powerKw, lights, setLights, inverterOn, onToggleInverter }: Props) {
  const socC     = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const timeLeft = calcTimeRemaining(battery.remaining, battery.voltage, powerKw);
  const onCount  = lights.filter(l => l.on).length;

  const toggle = (id: number) =>
    setLights(lights.map(l => l.id === id ? { ...l, on: !l.on } : l));

  const COLS = Math.min(4, lights.length);
  const ROWS = Math.ceil(lights.length / COLS);

  return (
    <div style={{ display: 'flex', gap: 10, height: '100%', minHeight: 0 }}>

      {/* ── LEFT: Battery Instrument ── */}
      <div style={{ width: 214, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>

        {/* Battery card */}
        <div className="card" style={{
          flex: 1, padding: '14px 14px 12px',
          display: 'flex', flexDirection: 'column', gap: 0,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.035) 100%)',
        }}>
          <div style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--label3)', marginBottom: 10,
          }}>Battery</div>

          {/* Arc gauge */}
          <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <ArcGauge value={battery.soc} max={100} size={114} color={socC} strokeWidth={8}>
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <div style={{ fontSize: 44, fontWeight: 200, color: socC, letterSpacing: '-0.03em' }}>
                  {battery.soc}
                </div>
                <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--label3)', marginTop: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>SOC %</div>
              </div>
            </ArcGauge>
          </div>

          {/* Voltage / Amps pills */}
          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {[
              { val: battery.voltage.toFixed(1), unit: 'V', color: 'var(--sys-blue)' },
              { val: Math.abs(battery.current).toFixed(1), unit: 'A', color: 'var(--sys-teal)' },
            ].map(p => (
              <div key={p.unit} style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '6px 8px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 15, fontWeight: 300, color: p.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {p.val}
                </div>
                <div style={{ fontSize: 9, color: 'var(--label3)', fontWeight: 700, letterSpacing: '0.06em', marginTop: 3 }}>
                  {p.unit}
                </div>
              </div>
            ))}
          </div>

          {/* Time remaining */}
          <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--sep)' }}>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--label3)' }}>
              Time Remaining
            </div>
            <div style={{
              fontSize: 38, fontWeight: 200, color: timeLeft.color,
              lineHeight: 1, letterSpacing: '-0.03em', marginTop: 4,
              fontVariantNumeric: 'tabular-nums',
              textShadow: `0 0 30px ${timeLeft.color}55`,
            }}>
              {timeLeft.label}
            </div>
            <div style={{ fontSize: 10, color: 'var(--label3)', marginTop: 4, fontWeight: 500 }}>
              @ {(powerKw * 1000).toFixed(0)} W draw
            </div>
          </div>
        </div>

        {/* Inverter button */}
        <button onClick={onToggleInverter} style={{
          padding: '13px 14px', borderRadius: 'var(--r-card)', flexShrink: 0,
          border: `1px solid ${inverterOn ? 'rgba(109,200,43,0.38)' : 'rgba(255,255,255,0.09)'}`,
          borderTopColor: inverterOn ? 'rgba(109,200,43,0.55)' : 'rgba(255,255,255,0.14)',
          background: inverterOn
            ? 'linear-gradient(145deg, rgba(109,200,43,0.16) 0%, rgba(109,200,43,0.05) 100%)'
            : 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)',
          boxShadow: inverterOn
            ? '0 0 24px rgba(109,200,43,0.15), inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 16px rgba(0,0,0,0.4)'
            : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', gap: 10,
          cursor: 'pointer', width: '100%', fontFamily: 'inherit',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* Power dot */}
          <div style={{
            width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
            background: inverterOn ? 'var(--brand)' : 'rgba(255,255,255,0.20)',
            boxShadow: inverterOn ? '0 0 10px rgba(109,200,43,1), 0 0 20px rgba(109,200,43,0.5)' : 'none',
            transition: 'all 0.3s',
          }} />
          <span style={{
            flex: 1, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: inverterOn ? 'var(--label)' : 'var(--label3)',
            textAlign: 'left', transition: 'color 0.3s',
          }}>
            Inverter
          </span>
          <span style={{
            fontSize: 11, fontWeight: 800, letterSpacing: '0.10em',
            color: inverterOn ? 'var(--brand)' : 'var(--label3)',
            transition: 'color 0.3s',
          }}>
            {inverterOn ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* ── RIGHT: Lighting Zone Tiles ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--label3)',
          }}>Lighting</span>
          <div style={{
            padding: '2px 10px', borderRadius: 99, fontSize: 10, fontWeight: 800,
            background: onCount > 0 ? 'var(--brand-dim)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${onCount > 0 ? 'rgba(109,200,43,0.28)' : 'rgba(255,255,255,0.09)'}`,
            color: onCount > 0 ? 'var(--brand)' : 'var(--label3)',
            letterSpacing: '0.06em',
          }}>
            {onCount} on
          </div>
          <div style={{ flex: 1 }} />
          {onCount > 0 && (
            <button
              onClick={() => setLights(lights.map(l => ({ ...l, on: false })))}
              style={{
                padding: '4px 14px', borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.10)',
                cursor: 'pointer', background: 'rgba(255,255,255,0.06)',
                fontSize: 10, fontWeight: 700, color: 'var(--label3)',
                fontFamily: 'inherit', letterSpacing: '0.06em',
              }}>
              All Off
            </button>
          )}
        </div>

        {/* Zone tiles grid */}
        <div style={{
          flex: 1, minHeight: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${COLS}, 1fr)`,
          gridTemplateRows: `repeat(${ROWS}, 1fr)`,
          gap: 8,
        }}>
          {lights.map(light => (
            <ZoneTile
              key={light.id}
              light={light as LightData & { name: string }}
              onToggle={() => toggle(light.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
