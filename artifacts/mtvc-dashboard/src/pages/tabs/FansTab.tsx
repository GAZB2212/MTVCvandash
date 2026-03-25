import { Card } from '../../components/Card';
import { Toggle } from '../../components/Toggle';
import { FanData } from '../../hooks/useLiveData';
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
  const brand = isDark ? '#6DC82B' : '#4A8A18';
  const blue  = isDark ? '#38BDF8' : '#0284C7';
  const green = isDark ? '#34D399' : '#059669';
  const red   = isDark ? '#F87171' : '#DC2626';
  const amber = isDark ? '#FBB040' : '#D97706';

  const tempColor = inverterTemp < 45 ? green : inverterTemp < 60 ? amber : red;
  const activeFans = fans.filter(f => f.on).length;
  const autoActive = fans.some(f => f.on && f.auto);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {/* Temp + Threshold */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Card accent={tempColor}>
          <div className="label-caps" style={{ marginTop: 4, marginBottom: 6 }}>Cabinet Temperature</div>
          <div className="mono" style={{ fontSize: 42, color: tempColor, lineHeight: 1 }}>
            {inverterTemp}<span style={{ fontSize: 18, opacity: 0.7, marginLeft: 2 }}>°C</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--text-lo)', marginTop: 6, letterSpacing: '0.06em' }}>
            SOURCE: VICTRON MULTIPLUS 2
          </div>
        </Card>

        <Card accent={brand}>
          <div className="label-caps" style={{ marginTop: 4, marginBottom: 8 }}>Auto Threshold</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <button onClick={() => setFanThreshold(Math.max(30, fanThreshold - 1))} style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)',
              color: 'var(--text-hi)', fontSize: 20, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: 300,
            }}>−</button>
            <div className="mono" style={{ fontSize: 30, color: brand, minWidth: 70, textAlign: 'center', lineHeight: 1 }}>
              {fanThreshold}°<span style={{ fontSize: 14 }}>C</span>
            </div>
            <button onClick={() => setFanThreshold(Math.min(70, fanThreshold + 1))} style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)',
              color: 'var(--text-hi)', fontSize: 20, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontWeight: 300,
            }}>+</button>
          </div>
        </Card>
      </div>

      {/* Fan rows */}
      <Card title="Fan Control">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {fans.map(fan => (
            <div key={fan.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10,
              background: fan.on ? 'rgba(109,200,43,0.08)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${fan.on ? `${brand}30` : 'rgba(255,255,255,0.06)'}`,
            }}>
              <span className={fan.on ? 'spin-active' : ''} style={{
                fontSize: 16, display: 'inline-block',
                color: fan.on ? brand : 'var(--text-lo)',
              }}>⚙</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: fan.on ? 'var(--text-hi)' : 'var(--text-mid)' }}>
                {fan.name}
              </span>
              <button onClick={() => setFans(fans.map(f => f.id === fan.id ? { ...f, auto: !f.auto } : f))}
                style={{
                  padding: '3px 12px', borderRadius: 20, fontSize: 10, fontWeight: 700,
                  letterSpacing: '0.06em', textTransform: 'uppercase', cursor: 'pointer',
                  background: fan.auto ? 'rgba(56,189,248,0.12)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${fan.auto ? `${blue}60` : 'rgba(255,255,255,0.08)'}`,
                  color: fan.auto ? blue : 'var(--text-lo)',
                }}>AUTO</button>
              <Toggle on={fan.on} onToggle={() => setFans(fans.map(f => f.id === fan.id ? { ...f, on: !f.on } : f))} color={brand} />
            </div>
          ))}
        </div>
      </Card>

      {/* Status bar */}
      <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 14px' }}>
        <span style={{ fontSize: 12, color: 'var(--text-mid)', fontWeight: 600 }}>
          {activeFans} of {fans.length} fans active
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: autoActive ? blue : 'var(--text-lo)', letterSpacing: '0.04em' }}>
          {autoActive ? '● AUTO COOLING ACTIVE' : '○ STANDBY'}
        </span>
      </div>
    </div>
  );
}
