import { Toggle } from '../../components/Toggle';
import { LightData } from '../../hooks/useLiveData';

interface Props { lights: LightData[]; setLights: (lights: LightData[]) => void; }

export function LightsTab({ lights, setLights }: Props) {
  const toggle  = (id: number) => setLights(lights.map(l => l.id === id ? { ...l, on: !l.on } : l));
  const allOn   = () => setLights(lights.map(l => ({ ...l, on: true  })));
  const allOff  = () => setLights(lights.map(l => ({ ...l, on: false })));
  const active  = lights.filter(l => l.on).length;

  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={allOn} style={{
          flex: 1, padding: '11px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'var(--brand-dim)',
          fontSize: 13, fontWeight: 600, color: 'var(--brand)',
        }}>All On</button>
        <button onClick={allOff} style={{
          flex: 1, padding: '11px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: 'var(--surface1)',
          fontSize: 13, fontWeight: 600, color: 'var(--label2)',
        }}>All Off</button>
      </div>

      {/* Zone grid */}
      <div>
        <div className="section-header">Zones — {active} of {lights.length} On</div>
        <div className="card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {lights.map((light, i) => {
            const isEmerg = light.name === 'Emergency';
            const accentC  = isEmerg ? 'var(--sys-red)' : 'var(--brand)';
            const isOdd = i % 2 === 1;
            return (
              <div key={light.id} onClick={() => toggle(light.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 14px', cursor: 'pointer',
                borderBottom: i < lights.length - 2 ? '0.5px solid var(--sep)' : 'none',
                borderRight: !isOdd ? '0.5px solid var(--sep)' : 'none',
                background: light.on ? `color-mix(in srgb, ${isEmerg ? '#FF453A' : '#6DC82B'} 8%, transparent)` : 'transparent',
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                  background: light.on ? accentC : 'var(--surface3)',
                  boxShadow: light.on ? `0 0 8px ${isEmerg ? 'rgba(255,69,58,0.6)' : 'rgba(109,200,43,0.6)'}` : 'none',
                }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: light.on ? 'var(--label)' : 'var(--label2)' }}>
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
