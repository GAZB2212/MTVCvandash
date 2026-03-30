import { ArcGauge } from '../../components/ArcGauge';
import { ZoneIcon, IconType } from '../../components/ZoneIcon';
import { LightData, BatteryData } from '../../hooks/useLiveData';
import { calcTimeRemaining } from './BatteryTab';

const EMERGENCY_ID = 7;

interface Props {
  battery: BatteryData;
  powerKw: number;
  lights: (LightData & { _enabled?: boolean; icon?: string })[];
  setLights: (lights: LightData[]) => void;
  inverterOn: boolean;
  onToggleInverter: () => void;
}

/* A single zone control tile */
function ZoneTile({ light, onToggle }: {
  light: LightData & { name: string; icon?: string }; onToggle: () => void;
}) {
  const isEmerg  = light.id === EMERGENCY_ID;
  const accent   = isEmerg ? 'var(--sys-red)' : 'var(--brand)';
  const glowRgb  = isEmerg ? '255,69,58' : '109,200,43';
  const iconType = (light.icon as IconType | undefined) ?? (isEmerg ? 'emergency' : 'light');
  const iconColor = light.on ? accent : 'rgba(255,255,255,0.22)';

  return (
    <div
      onClick={onToggle}
      style={{
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 12,
        padding: '12px 8px',
        borderRadius: 16, cursor: 'pointer',
        background: light.on
          ? `linear-gradient(145deg, rgba(${glowRgb},0.22) 0%, rgba(${glowRgb},0.06) 100%)`
          : 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)',
        border: `1px solid ${light.on ? `rgba(${glowRgb},0.42)` : 'rgba(255,255,255,0.08)'}`,
        borderTopColor: light.on ? `rgba(${glowRgb},0.58)` : 'rgba(255,255,255,0.13)',
        boxShadow: light.on
          ? `0 0 28px rgba(${glowRgb},0.20), 0 0 56px rgba(${glowRgb},0.08), inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 20px rgba(0,0,0,0.45)`
          : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.40)',
        transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}
    >
      <div style={{
        filter: light.on
          ? `drop-shadow(0 0 12px ${isEmerg ? 'rgba(255,69,58,0.7)' : 'rgba(109,200,43,0.7)'})`
          : 'none',
        transition: 'filter 0.22s',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ZoneIcon type={iconType} color={iconColor} size={72} />
      </div>
      <span style={{
        fontSize: 19, fontWeight: 700, letterSpacing: '0.05em',
        textTransform: 'uppercase', textAlign: 'center', padding: '0 6px',
        color: light.on ? 'var(--label)' : 'var(--label3)',
        lineHeight: 1.2, transition: 'color 0.2s',
      }}>
        {light.name}
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
      <div style={{ width: 290, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>

        {/* Battery card */}
        <div className="card" style={{
          flex: 1, padding: '18px 18px 14px',
          display: 'flex', flexDirection: 'column', gap: 0,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.035) 100%)',
        }}>
          <div style={{
            fontSize: 13, fontWeight: 700, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--label3)', marginBottom: 12,
          }}>Battery</div>

          {/* Arc gauge */}
          <div style={{ display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
            <ArcGauge value={battery.soc} max={100} size={150} color={socC} strokeWidth={9}>
              <div style={{ textAlign: 'center', lineHeight: 1 }}>
                <div style={{ fontSize: 56, fontWeight: 200, color: socC, letterSpacing: '-0.03em' }}>
                  {battery.soc}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--label3)', marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>SOC %</div>
              </div>
            </ArcGauge>
          </div>

          {/* Voltage / Amps pills */}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            {[
              { val: battery.voltage.toFixed(1), unit: 'V', color: 'var(--sys-blue)' },
              { val: Math.abs(battery.current).toFixed(1), unit: 'A', color: 'var(--sys-teal)' },
            ].map(p => (
              <div key={p.unit} style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, padding: '8px 10px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, fontWeight: 300, color: p.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {p.val}
                </div>
                <div style={{ fontSize: 12, color: 'var(--label3)', fontWeight: 700, letterSpacing: '0.06em', marginTop: 4 }}>
                  {p.unit}
                </div>
              </div>
            ))}
          </div>

          {/* Time remaining */}
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--sep)' }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--label3)' }}>
              Time Remaining
            </div>
            <div style={{
              fontSize: 52, fontWeight: 200, color: timeLeft.color,
              lineHeight: 1, letterSpacing: '-0.03em', marginTop: 6,
              fontVariantNumeric: 'tabular-nums',
              textShadow: `0 0 36px ${timeLeft.color}55`,
            }}>
              {timeLeft.label}
            </div>
            <div style={{ fontSize: 12, color: 'var(--label3)', marginTop: 6, fontWeight: 500 }}>
              @ {(powerKw * 1000).toFixed(0)} W draw
            </div>
          </div>
        </div>

        {/* Inverter button */}
        <button onClick={onToggleInverter} style={{
          padding: '16px 18px', borderRadius: 'var(--r-card)', flexShrink: 0,
          border: `1px solid ${inverterOn ? 'rgba(109,200,43,0.38)' : 'rgba(255,255,255,0.09)'}`,
          borderTopColor: inverterOn ? 'rgba(109,200,43,0.55)' : 'rgba(255,255,255,0.14)',
          background: inverterOn
            ? 'linear-gradient(145deg, rgba(109,200,43,0.16) 0%, rgba(109,200,43,0.05) 100%)'
            : 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)',
          boxShadow: inverterOn
            ? '0 0 24px rgba(109,200,43,0.15), inset 0 1px 0 rgba(255,255,255,0.09), 0 4px 16px rgba(0,0,0,0.4)'
            : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.35)',
          display: 'flex', alignItems: 'center', gap: 12,
          cursor: 'pointer', width: '100%', fontFamily: 'inherit',
          transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{
            width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
            background: inverterOn ? 'var(--brand)' : 'rgba(255,255,255,0.20)',
            boxShadow: inverterOn ? '0 0 10px rgba(109,200,43,1), 0 0 22px rgba(109,200,43,0.5)' : 'none',
            transition: 'all 0.3s',
          }} />
          <span style={{
            flex: 1, fontSize: 14, fontWeight: 700, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: inverterOn ? 'var(--label)' : 'var(--label3)',
            textAlign: 'left', transition: 'color 0.3s',
          }}>
            Inverter
          </span>
          <span style={{
            fontSize: 13, fontWeight: 800, letterSpacing: '0.10em',
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
            fontSize: 13, fontWeight: 700, letterSpacing: '0.10em',
            textTransform: 'uppercase', color: 'var(--label3)',
          }}>Zones</span>
          <div style={{
            padding: '3px 12px', borderRadius: 99, fontSize: 13, fontWeight: 800,
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
                padding: '6px 16px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.10)',
                cursor: 'pointer', background: 'rgba(255,255,255,0.06)',
                fontSize: 13, fontWeight: 700, color: 'var(--label3)',
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
              light={light as LightData & { name: string; icon?: string }}
              onToggle={() => toggle(light.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
