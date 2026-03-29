import { FanData, TempData } from '../../hooks/useLiveData';

interface Props {
  fans: FanData[];
  temps: TempData;
  setFans: (fans: FanData[]) => void;
}

function tempColor(t: number) {
  return t < 35 ? 'var(--sys-green)' : t < 50 ? 'var(--sys-orange)' : 'var(--sys-red)';
}

function TempCard({ label, value }: { label: string; value: number }) {
  const c = tempColor(value);
  return (
    <div className="card" style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--label3)' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
        <span style={{ fontSize: 38, fontWeight: 200, color: c, lineHeight: 1, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>{value.toFixed(1)}</span>
        <span style={{ fontSize: 16, fontWeight: 300, color: 'var(--label2)', paddingBottom: 5 }}>°C</span>
      </div>
    </div>
  );
}

export function FansTab({ fans, temps, setFans }: Props) {
  const activeFans = fans.filter(f => f.on).length;
  const hottest = Math.max(temps.cabinet, temps.battery, temps.inverter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 8 }}>

      {/* Temperature row */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <TempCard label="Cabinet"  value={temps.cabinet} />
        <TempCard label="Battery"  value={temps.battery} />
        <TempCard label="Inverter" value={temps.inverter} />
        <div className="card" style={{ flex: 1, padding: '14px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--label3)' }}>
            Hottest
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3 }}>
            <span style={{ fontSize: 38, fontWeight: 200, color: tempColor(hottest), lineHeight: 1, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
              {hottest.toFixed(1)}
            </span>
            <span style={{ fontSize: 16, fontWeight: 300, color: 'var(--label2)', paddingBottom: 5 }}>°C</span>
          </div>
          <div style={{ fontSize: 9, color: 'var(--label3)' }}>
            Fans ramp 30–60°C
          </div>
        </div>
      </div>

      {/* Fan rows */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, minHeight: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.06em', textTransform: 'uppercase', flexShrink: 0 }}>
          Fans — {activeFans} of {fans.length} running
        </div>

        {fans.map(fan => (
          <div key={fan.id} style={{
            flex: 1,
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '0 20px',
            borderRadius: 14,
            background: fan.on ? 'rgba(109,200,43,0.08)' : 'var(--surface1)',
            border: `1px solid ${fan.on ? 'rgba(109,200,43,0.2)' : 'transparent'}`,
            transition: 'background 0.2s, border-color 0.2s',
          }}>

            {/* Spin icon */}
            <span className={fan.on ? 'spin' : ''} style={{
              fontSize: 22, color: fan.on ? 'var(--brand)' : 'var(--surface3)',
              flexShrink: 0, lineHeight: 1, transition: 'color 0.2s',
            }}>◎</span>

            {/* Name + speed bar */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: fan.on ? 'var(--label)' : 'var(--label2)', transition: 'color 0.2s' }}>
                {fan.name}
              </span>
              <div style={{ height: 4, borderRadius: 2, background: 'var(--surface2)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: `${fan.speed}%`,
                  background: fan.speed > 0 ? 'var(--brand)' : 'transparent',
                  transition: 'width 1s ease',
                }} />
              </div>
            </div>

            {/* Speed % */}
            <div style={{ width: 52, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
              <span style={{ fontSize: 22, fontWeight: 200, color: fan.on ? 'var(--brand)' : 'var(--label3)' }}>{fan.speed}</span>
              <span style={{ fontSize: 11, color: 'var(--label3)', fontWeight: 500 }}>%</span>
            </div>

            {/* Auto badge */}
            <button
              onClick={() => setFans(fans.map(f => f.id === fan.id ? { ...f, auto: !f.auto } : f))}
              style={{
                padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                border: 'none', cursor: 'pointer', letterSpacing: '0.03em',
                background: fan.auto ? 'rgba(10,132,255,0.18)' : 'var(--surface2)',
                color: fan.auto ? 'var(--sys-blue)' : 'var(--label3)',
                transition: 'background 0.2s, color 0.2s',
              }}>
              Auto
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
