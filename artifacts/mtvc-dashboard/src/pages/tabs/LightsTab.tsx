import { Toggle } from '../../components/Toggle';
import { LightData } from '../../hooks/useLiveData';

interface Props { lights: LightData[]; setLights: (lights: LightData[]) => void; }

const EMERGENCY_ID = 7;

export function LightsTab({ lights, setLights }: Props) {
  const toggle = (id: number) => setLights(lights.map(l => l.id === id ? { ...l, on: !l.on } : l));
  const allOn  = () => setLights(lights.map(l => ({ ...l, on: true  })));
  const allOff = () => setLights(lights.map(l => ({ ...l, on: false })));
  const active = lights.filter(l => l.on).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>

      {/* Action bar */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <button onClick={allOn} style={{
          flex: 1, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
          background: 'var(--brand-dim)', fontSize: 14, fontWeight: 600, color: 'var(--brand)',
        }}>All On</button>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '0 14px', fontSize: 12, fontWeight: 600, color: 'var(--label3)',
          letterSpacing: '0.04em',
        }}>
          {active}/{lights.length}
        </div>
        <button onClick={allOff} style={{
          flex: 1, height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
          background: 'var(--surface1)', fontSize: 14, fontWeight: 600, color: 'var(--label2)',
        }}>All Off</button>
      </div>

      {/* Zone grid — fills all remaining height */}
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
          const glowC   = isEmerg ? 'rgba(255,69,58,0.12)' : 'rgba(109,200,43,0.10)';
          return (
            <div
              key={light.id}
              onClick={() => toggle(light.id)}
              style={{
                boxSizing: 'border-box',
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '0 18px',
                borderRadius: 14,
                background: light.on ? glowC : 'var(--surface1)',
                border: `1px solid ${light.on ? (isEmerg ? 'rgba(255,69,58,0.3)' : 'rgba(109,200,43,0.25)') : 'transparent'}`,
                cursor: 'pointer',
                transition: 'background 0.2s, border-color 0.2s',
              }}
            >
              {/* Status dot */}
              <div style={{
                width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                background: light.on ? accentC : 'var(--surface3)',
                boxShadow: light.on ? `0 0 10px ${isEmerg ? 'rgba(255,69,58,0.7)' : 'rgba(109,200,43,0.7)'}` : 'none',
                transition: 'background 0.2s, box-shadow 0.2s',
              }} />

              {/* Name */}
              <span style={{
                flex: 1, fontSize: 15, fontWeight: 600,
                color: light.on ? 'var(--label)' : 'var(--label2)',
                textAlign: 'left',
                transition: 'color 0.2s',
              }}>
                {light.name}
              </span>

              {/* Toggle */}
              <Toggle on={light.on} onToggle={() => toggle(light.id)} color={accentC} size="md" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
