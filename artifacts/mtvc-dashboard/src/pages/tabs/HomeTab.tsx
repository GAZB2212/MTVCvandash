import { ArcGauge } from '../../components/ArcGauge';
import { Toggle } from '../../components/Toggle';
import { LightData, BatteryData } from '../../hooks/useLiveData';
import { calcTimeRemaining } from './BatteryTab';

const EMERGENCY_ID = 7;

interface Props {
  battery: BatteryData;
  powerKw: number;
  lights: (LightData & { _enabled?: boolean })[];
  setLights: (lights: LightData[]) => void;
}

export function HomeTab({ battery, powerKw, lights, setLights }: Props) {
  const socC     = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const timeLeft = calcTimeRemaining(battery.remaining, battery.voltage, powerKw);
  const onCount  = lights.filter(l => l.on).length;

  const toggle = (id: number) =>
    setLights(lights.map(l => l.id === id ? { ...l, on: !l.on } : l));

  return (
    <div style={{ display: 'flex', gap: 10, height: '100%', minHeight: 0 }}>

      {/* LEFT: Battery snapshot */}
      <div style={{ width: 228, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>

        {/* SOC Gauge */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 16px', gap: 6, flexShrink: 0 }}>
          <ArcGauge value={battery.soc} max={100} size={90} color={socC} strokeWidth={7}>
            <div style={{ textAlign: 'center', lineHeight: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 200, color: socC, letterSpacing: '-0.02em' }}>{battery.soc}</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--label3)', marginTop: 2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>SOC %</div>
            </div>
          </ArcGauge>
          <div style={{ fontSize: 10, color: 'var(--label3)', fontWeight: 500 }}>Fogstar Drift 48V · 125Ah</div>
        </div>

        {/* Time remaining — hero stat */}
        <div style={{
          padding: '14px 16px', borderRadius: 'var(--r-card)', flexShrink: 0,
          background: `color-mix(in srgb, ${timeLeft.color} 9%, rgba(255,255,255,0.04))`,
          border: `1px solid color-mix(in srgb, ${timeLeft.color} 28%, rgba(255,255,255,0.06))`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: `0 0 32px color-mix(in srgb, ${timeLeft.color} 8%, transparent), 0 2px 12px rgba(0,0,0,0.25)`,
          display: 'flex', flexDirection: 'column', gap: 3,
        }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--label3)' }}>
            Time Remaining
          </div>
          <div style={{ fontSize: 42, fontWeight: 200, color: timeLeft.color, lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
            {timeLeft.label}
          </div>
          <div style={{ fontSize: 10, color: 'var(--label3)', fontWeight: 500, marginTop: 1 }}>
            @ {(powerKw * 1000).toFixed(0)} W current draw
          </div>
        </div>

        {/* Pack stats */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '8px 12px 0', fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--label3)' }}>Pack</div>
          {[
            { label: 'Voltage',   value: `${battery.voltage.toFixed(1)} V`,              color: 'var(--sys-blue)' },
            { label: 'Current',   value: `${Math.abs(battery.current).toFixed(1)} A`,    color: undefined },
            { label: 'Remaining', value: `${(battery.remaining / 1000).toFixed(1)} Ah`,  color: 'var(--sys-green)' },
          ].map(({ label, value, color }, i, arr) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 12px', flex: 1,
              borderBottom: i < arr.length - 1 ? '0.5px solid var(--sep)' : 'none',
            }}>
              <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--label2)' }}>{label}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: color || 'var(--label)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Lighting snapshot */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, padding: '0 2px' }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>
            Lighting
          </span>
          <div style={{
            padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700,
            background: onCount > 0 ? 'var(--brand-dim)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${onCount > 0 ? 'rgba(109,200,43,0.22)' : 'rgba(255,255,255,0.08)'}`,
            color: onCount > 0 ? 'var(--brand)' : 'var(--label3)',
          }}>
            {onCount} on
          </div>
          <div style={{ flex: 1 }} />
          {onCount > 0 && (
            <button onClick={() => setLights(lights.map(l => ({ ...l, on: false })))} style={{
              padding: '4px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.10)',
              cursor: 'pointer', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)',
              fontSize: 11, fontWeight: 600, color: 'var(--label2)', fontFamily: 'inherit',
            }}>All Off</button>
          )}
        </div>

        {/* Light grid */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: `repeat(${Math.ceil(lights.length / 2)}, 1fr)`,
          gap: 6,
          minHeight: 0,
        }}>
          {lights.map(light => {
            const isEmerg = light.id === EMERGENCY_ID;
            const accentC = isEmerg ? 'var(--sys-red)' : 'var(--brand)';
            const glowRgb = isEmerg ? '255,69,58' : '109,200,43';
            return (
              <div
                key={light.id}
                onClick={() => toggle(light.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '0 14px',
                  borderRadius: 12, cursor: 'pointer',
                  background: light.on
                    ? `rgba(${glowRgb},0.09)`
                    : 'rgba(255,255,255,0.04)',
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
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: light.on ? accentC : 'rgba(255,255,255,0.18)',
                  boxShadow: light.on ? `0 0 8px rgba(${glowRgb},0.8)` : 'none',
                  transition: 'background 0.2s, box-shadow 0.2s',
                }} />
                <span style={{
                  flex: 1, fontSize: 13, fontWeight: 600,
                  color: light.on ? 'var(--label)' : 'var(--label2)',
                  transition: 'color 0.2s',
                }}>
                  {light.name}
                </span>
                <Toggle on={light.on} onToggle={() => toggle(light.id)} color={accentC} size="sm" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
