import { Card } from '../../components/Card';
import { Toggle } from '../../components/Toggle';
import { FanData, InverterData } from '../../hooks/useLiveData';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  fans: FanData[];
  fanThreshold: number;
  inverterTemp: number;
  setFans: (fans: FanData[]) => void;
  setFanThreshold: (v: number) => void;
}

export function FansTab({ fans, fanThreshold, inverterTemp, setFans, setFanThreshold }: Props) {
  const { isDark } = useTheme();
  const amber = isDark ? '#E8A020' : '#B45309';
  const blue = isDark ? '#38BDF8' : '#0369A1';
  const green = isDark ? '#22C55E' : '#15803D';
  const red = isDark ? '#EF4444' : '#B91C1C';

  const tempColor = inverterTemp < 45 ? green : inverterTemp < 60 ? amber : red;
  const activeFans = fans.filter(f => f.on).length;
  const autoActive = fans.some(f => f.on && f.auto);

  const toggleFan = (id: number) => {
    setFans(fans.map(f => f.id === id ? { ...f, on: !f.on } : f));
  };

  const toggleAuto = (id: number) => {
    setFans(fans.map(f => f.id === id ? { ...f, auto: !f.auto } : f));
  };

  const adjustThreshold = (delta: number) => {
    const next = Math.max(30, Math.min(70, fanThreshold + delta));
    setFanThreshold(next);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {/* Top: Temp + Threshold */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Card accent={tempColor}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 6, fontWeight: 700 }}>
            CABINET TEMPERATURE
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 36, color: tempColor, lineHeight: 1 }}>
            {inverterTemp}<span style={{ fontSize: 16, marginLeft: 3 }}>°C</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 4 }}>SOURCE: VICTRON MULTIPLUS 2</div>
        </Card>

        <Card accent={amber}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 6, fontWeight: 700 }}>
            AUTO THRESHOLD
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <button
              onClick={() => adjustThreshold(-1)}
              style={{
                width: 32, height: 32, borderRadius: 4,
                background: 'var(--surface2)',
                border: '1px solid var(--border-color)',
                color: 'var(--text)', fontSize: 18, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
              }}
            >−</button>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 28, color: amber, minWidth: 60, textAlign: 'center' }}>
              {fanThreshold}°C
            </div>
            <button
              onClick={() => adjustThreshold(1)}
              style={{
                width: 32, height: 32, borderRadius: 4,
                background: 'var(--surface2)',
                border: '1px solid var(--border-color)',
                color: 'var(--text)', fontSize: 18, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Rajdhani, sans-serif', fontWeight: 700,
              }}
            >+</button>
          </div>
        </Card>
      </div>

      {/* Fan Control */}
      <Card accent={amber} title="FAN CONTROL">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {fans.map(fan => (
            <div
              key={fan.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 10px',
                borderRadius: 4,
                background: fan.on ? 'rgba(232,160,32,0.06)' : 'var(--surface2)',
                border: `1px solid ${fan.on ? amber : 'var(--border-color)'}`,
                transition: 'all 0.3s ease',
              }}
            >
              <span
                className={fan.on ? 'spin-active' : ''}
                style={{ fontSize: 16, display: 'inline-block', color: fan.on ? amber : 'var(--text-dim)' }}
              >⚙</span>
              <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: fan.on ? 'var(--text)' : 'var(--text-dim)' }}>
                {fan.name}
              </span>
              <button
                onClick={() => toggleAuto(fan.id)}
                style={{
                  padding: '2px 10px',
                  borderRadius: 20,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  background: fan.auto ? 'rgba(56,189,248,0.15)' : 'var(--surface)',
                  border: `1px solid ${fan.auto ? blue : 'var(--border-color)'}`,
                  color: fan.auto ? blue : 'var(--text-dim)',
                }}
              >
                AUTO
              </button>
              <Toggle on={fan.on} onToggle={() => toggleFan(fan.id)} color={amber} />
            </div>
          ))}
        </div>
      </Card>

      {/* Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 12px',
          background: 'var(--surface)',
          border: '1px solid var(--border-color)',
          borderRadius: 4,
        }}
      >
        <span style={{ fontSize: 11, color: 'var(--text-dim)', fontWeight: 600 }}>
          {activeFans} of {fans.length} fans active
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: autoActive ? blue : 'var(--text-dim)',
            letterSpacing: '0.05em',
          }}
        >
          {autoActive ? '● AUTO COOLING ACTIVE' : '○ STANDBY'}
        </span>
      </div>
    </div>
  );
}
