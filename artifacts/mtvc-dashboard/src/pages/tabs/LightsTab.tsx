import { Toggle } from '../../components/Toggle';
import { LightData } from '../../hooks/useLiveData';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  lights: LightData[];
  setLights: (lights: LightData[]) => void;
}

const LIGHT_EMOJIS: Record<string, string> = {
  'Cab': '🚗',
  'Load Bay': '📦',
  'Work': '🔦',
  'Step': '👣',
  'Exterior': '💡',
  'Tools': '🔧',
  'Rear': '🔴',
  'Emergency': '🚨',
};

export function LightsTab({ lights, setLights }: Props) {
  const { isDark } = useTheme();
  const amber = isDark ? '#E8A020' : '#B45309';
  const red = isDark ? '#EF4444' : '#B91C1C';

  const activeCount = lights.filter(l => l.on).length;

  const toggleLight = (id: number) => {
    setLights(lights.map(l => l.id === id ? { ...l, on: !l.on } : l));
  };

  const allOn = () => setLights(lights.map(l => ({ ...l, on: true })));
  const allOff = () => setLights(lights.map(l => ({ ...l, on: false })));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {/* All On / All Off */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button
          onClick={allOn}
          style={{
            padding: '10px',
            borderRadius: 4,
            border: `1px solid ${amber}`,
            background: 'transparent',
            color: amber,
            fontSize: 13,
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
        >
          ALL ON
        </button>
        <button
          onClick={allOff}
          style={{
            padding: '10px',
            borderRadius: 4,
            border: '1px solid var(--border-color)',
            background: 'transparent',
            color: 'var(--text-dim)',
            fontSize: 13,
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
        >
          ALL OFF
        </button>
      </div>

      {/* Zone Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6, flex: 1 }}>
        {lights.map(light => {
          const isEmergency = light.name === 'Emergency';
          const accentColor = isEmergency ? red : amber;
          return (
            <div
              key={light.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 6px',
                borderRadius: 4,
                background: light.on ? `rgba(${isEmergency ? '239,68,68' : '232,160,32'},0.07)` : 'var(--surface)',
                border: `1px solid ${light.on ? accentColor : 'var(--border-color)'}`,
                borderTop: `2px solid ${light.on ? accentColor : 'var(--border-color)'}`,
                cursor: 'pointer',
                gap: 4,
                transition: 'all 0.3s ease',
              }}
              onClick={() => toggleLight(light.id)}
            >
              <div style={{ fontSize: 22, opacity: light.on ? 1 : 0.3, filter: light.on ? 'none' : 'saturate(0)' }}>
                {LIGHT_EMOJIS[light.name] || '💡'}
              </div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: light.on ? 'var(--text)' : 'var(--text-dim)', textAlign: 'center' }}>
                {light.name}
              </div>
              <div style={{ fontSize: 10, color: light.on ? accentColor : 'var(--text-dim)' }}>
                {light.on ? '● ON' : '○ OFF'}
              </div>
              <Toggle on={light.on} onToggle={() => toggleLight(light.id)} color={accentColor} size="sm" />
            </div>
          );
        })}
      </div>

      {/* Count Bar */}
      <div
        style={{
          padding: '6px 12px',
          background: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>
          {activeCount} of {lights.length} zones active
        </span>
        <span style={{ fontSize: 11, color: activeCount > 0 ? amber : 'var(--text-dim)', fontWeight: 700 }}>
          {activeCount > 0 ? '● LIGHTING ON' : '○ ALL OFF'}
        </span>
      </div>
    </div>
  );
}
