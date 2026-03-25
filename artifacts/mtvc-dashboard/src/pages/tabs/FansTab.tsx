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
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {/* Temperature */}
        <div className="card" style={{ flex: 1, padding: '16px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--label3)', marginBottom: 10 }}>
            Cabinet Temp
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
            <span style={{ fontSize: 48, fontWeight: 200, color: tempC, lineHeight: 1, letterSpacing: '-0.03em' }}>{inverterTemp}</span>
            <span style={{ fontSize: 20, fontWeight: 300, color: 'var(--label2)', paddingBottom: 8 }}>°C</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--label3)', marginTop: 8, fontWeight: 500 }}>
            SOURCE: VICTRON MULTIPLUS 2
          </div>
        </div>

        {/* Threshold */}
        <div className="card" style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--label3)', marginBottom: 10 }}>
            Auto Threshold
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
            <button onClick={() => setFanThreshold(Math.max(30, fanThreshold - 1))} style={{
              width: 34, height: 34, borderRadius: 8, border: 'none',
              background: 'var(--surface2)', color: 'var(--label)', fontSize: 22,
              fontWeight: 200, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>−</button>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 38, fontWeight: 200, color: 'var(--brand)', lineHeight: 1, letterSpacing: '-0.02em' }}>
                {fanThreshold}°
              </div>
            </div>
            <button onClick={() => setFanThreshold(Math.min(70, fanThreshold + 1))} style={{
              width: 34, height: 34, borderRadius: 8, border: 'none',
              background: 'var(--surface2)', color: 'var(--label)', fontSize: 22,
              fontWeight: 200, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>+</button>
          </div>
        </div>
      </div>

      {/* Fan list */}
      <div>
        <div className="section-header">Fan Control — {activeFans} of {fans.length} Active</div>
        <div className="card">
          {fans.map((fan, i) => (
            <div key={fan.id} className="list-row" style={{
              borderBottom: i < fans.length - 1 ? undefined : 'none',
              gap: 12,
            }}>
              <span className={fan.on ? 'spin' : ''} style={{ fontSize: 16, color: fan.on ? 'var(--brand)' : 'var(--label3)', flexShrink: 0 }}>◎</span>
              <span className="list-row-label" style={{ flex: 1, color: fan.on ? 'var(--label)' : 'var(--label2)' }}>{fan.name}</span>
              <button onClick={() => setFans(fans.map(f => f.id === fan.id ? { ...f, auto: !f.auto } : f))}
                style={{
                  padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                  border: 'none', cursor: 'pointer', letterSpacing: '0.03em',
                  background: fan.auto ? 'rgba(10,132,255,0.15)' : 'var(--surface2)',
                  color: fan.auto ? 'var(--sys-blue)' : 'var(--label3)',
                }}>Auto</button>
              <Toggle on={fan.on} onToggle={() => setFans(fans.map(f => f.id === fan.id ? { ...f, on: !f.on } : f))} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
