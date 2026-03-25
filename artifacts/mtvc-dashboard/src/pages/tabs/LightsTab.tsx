import { Toggle } from '../../components/Toggle';
import { LightData } from '../../hooks/useLiveData';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  lights: LightData[];
  setLights: (lights: LightData[]) => void;
}

const EMOJIS: Record<string, string> = {
  'Cab': '🚗', 'Load Bay': '📦', 'Work': '🔦', 'Step': '👣',
  'Exterior': '💡', 'Tools': '🔧', 'Rear': '🔴', 'Emergency': '🚨',
};

export function LightsTab({ lights, setLights }: Props) {
  const { isDark } = useTheme();
  const brand = isDark ? '#6DC82B' : '#4A8A18';
  const red   = isDark ? '#F87171' : '#DC2626';

  const activeCount = lights.filter(l => l.on).length;

  const toggle = (id: number) => setLights(lights.map(l => l.id === id ? { ...l, on: !l.on } : l));
  const allOn  = () => setLights(lights.map(l => ({ ...l, on: true  })));
  const allOff = () => setLights(lights.map(l => ({ ...l, on: false })));

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {/* Controls */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button onClick={allOn} style={{
          padding: '10px', borderRadius: 10,
          background: `${brand}15`, border: `1px solid ${brand}40`,
          color: brand, fontSize: 13, fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer',
        }}>ALL ON</button>
        <button onClick={allOff} style={{
          padding: '10px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          color: 'var(--text-mid)', fontSize: 13, fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 700, letterSpacing: '0.08em', cursor: 'pointer',
        }}>ALL OFF</button>
      </div>

      {/* Zone grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 7, flex: 1 }}>
        {lights.map(light => {
          const isEmerg = light.name === 'Emergency';
          const accent  = isEmerg ? red : brand;
          return (
            <div key={light.id} onClick={() => toggle(light.id)} className="glass-card" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'space-between', padding: '10px 6px', cursor: 'pointer',
              borderTop: `2px solid ${light.on ? accent : 'transparent'}`,
              background: light.on ? `${accent}0c` : 'var(--glass-heavy)',
            }}>
              <div style={{ fontSize: 24, opacity: light.on ? 1 : 0.2, filter: light.on ? 'none' : 'saturate(0)', transition: 'opacity 0.3s, filter 0.3s' }}>
                {EMOJIS[light.name] || '💡'}
              </div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: light.on ? 'var(--text-hi)' : 'var(--text-lo)', textAlign: 'center', lineHeight: 1.3 }}>
                {light.name}
              </div>
              <div style={{ fontSize: 10, color: light.on ? accent : 'var(--text-lo)' }}>
                {light.on ? '● ON' : '○ OFF'}
              </div>
              <Toggle on={light.on} onToggle={() => toggle(light.id)} color={accent} size="sm" />
            </div>
          );
        })}
      </div>

      {/* Count bar */}
      <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 14px' }}>
        <span style={{ fontSize: 12, color: 'var(--text-mid)', fontWeight: 600 }}>
          {activeCount} of {lights.length} zones active
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: activeCount > 0 ? brand : 'var(--text-lo)' }}>
          {activeCount > 0 ? '● LIGHTING ON' : '○ ALL OFF'}
        </span>
      </div>
    </div>
  );
}
