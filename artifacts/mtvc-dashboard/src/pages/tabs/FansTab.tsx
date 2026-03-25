import { Toggle } from '../../components/Toggle';
import { FanData } from '../../hooks/useLiveData';

interface Props {
  fans: FanData[];
  fanThreshold: number;
  inverterTemp: number;
  setFans: (fans: FanData[]) => void;
  setFanThreshold: (v: number) => void;
}

export function FansTab({ fans, fanThreshold, inverterTemp, setFans, setFanThreshold }: Props) {
  const tempC = inverterTemp < 45 ? 'var(--sys-green)' : inverterTemp < 60 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const activeFans = fans.filter(f => f.on).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>

      {/* Stat cards row */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {/* Temperature */}
        <div className="card" style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--label3)', marginBottom: 4 }}>
            Cabinet Temp
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
            <span style={{ fontSize: 44, fontWeight: 200, color: tempC, lineHeight: 1, letterSpacing: '-0.03em' }}>{inverterTemp}</span>
            <span style={{ fontSize: 18, fontWeight: 300, color: 'var(--label2)', paddingBottom: 6 }}>°C</span>
          </div>
        </div>

        {/* Threshold */}
        <div className="card" style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--label3)' }}>
            Auto Threshold
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setFanThreshold(Math.max(30, fanThreshold - 1))} style={{
              width: 42, height: 42, borderRadius: 10, border: 'none',
              background: 'var(--surface2)', color: 'var(--label)', fontSize: 26,
              fontWeight: 200, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>−</button>
            <div style={{ fontSize: 40, fontWeight: 200, color: 'var(--brand)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {fanThreshold}°
            </div>
            <button onClick={() => setFanThreshold(Math.min(70, fanThreshold + 1))} style={{
              width: 42, height: 42, borderRadius: 10, border: 'none',
              background: 'var(--surface2)', color: 'var(--label)', fontSize: 26,
              fontWeight: 200, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>+</button>
          </div>
        </div>
      </div>

      {/* Fan rows — fill remaining height */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
          Fan Control — {activeFans} of {fans.length} Active
        </div>

        {fans.map(fan => (
          <div key={fan.id} style={{
            flex: 1,
            display: 'flex', alignItems: 'center', gap: 16,
            padding: '0 20px',
            borderRadius: 14,
            background: fan.on ? 'rgba(109,200,43,0.08)' : 'var(--surface1)',
            border: `1px solid ${fan.on ? 'rgba(109,200,43,0.2)' : 'transparent'}`,
            transition: 'background 0.2s, border-color 0.2s',
            cursor: 'pointer',
          }} onClick={() => setFans(fans.map(f => f.id === fan.id ? { ...f, on: !f.on } : f))}>

            {/* Spin icon */}
            <span className={fan.on ? 'spin' : ''} style={{
              fontSize: 24, color: fan.on ? 'var(--brand)' : 'var(--surface3)',
              flexShrink: 0, lineHeight: 1,
              transition: 'color 0.2s',
            }}>◎</span>

            {/* Name */}
            <span style={{
              flex: 1, fontSize: 16, fontWeight: 600,
              color: fan.on ? 'var(--label)' : 'var(--label2)',
              transition: 'color 0.2s',
            }}>
              {fan.name}
            </span>

            {/* Auto badge */}
            <button
              onClick={e => { e.stopPropagation(); setFans(fans.map(f => f.id === fan.id ? { ...f, auto: !f.auto } : f)); }}
              style={{
                padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
                border: 'none', cursor: 'pointer', letterSpacing: '0.03em',
                background: fan.auto ? 'rgba(10,132,255,0.18)' : 'var(--surface2)',
                color: fan.auto ? 'var(--sys-blue)' : 'var(--label3)',
                transition: 'background 0.2s, color 0.2s',
              }}>
              Auto
            </button>

            {/* Toggle */}
            <Toggle
              on={fan.on}
              onToggle={() => setFans(fans.map(f => f.id === fan.id ? { ...f, on: !f.on } : f))}
              size="md"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
