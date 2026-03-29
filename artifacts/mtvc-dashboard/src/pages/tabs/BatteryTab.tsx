import { ArcGauge } from '../../components/ArcGauge';
import { BatteryData } from '../../hooks/useLiveData';

interface Props { battery: BatteryData; powerKw: number }

export function calcTimeRemaining(remainingMah: number, voltageV: number, powerKw: number) {
  const powerW = powerKw * 1000;
  if (powerW < 10) return { label: '∞', color: 'var(--sys-green)' };
  const remainingWh = (remainingMah / 1000) * voltageV;
  const hoursLeft = remainingWh / powerW;
  const minutesLeft = hoursLeft * 60;
  const color = minutesLeft > 120 ? 'var(--sys-green)' : minutesLeft > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  if (hoursLeft > 99) return { label: '∞', color: 'var(--sys-green)' };
  const h = Math.floor(hoursLeft);
  const m = Math.floor((hoursLeft - h) * 60);
  const label = h === 0 ? `${m}m` : h >= 24 ? `${Math.floor(h / 24)}d ${h % 24}h` : `${h}h ${m}m`;
  return { label, color };
}

function StatCard({ label, value, unit, color, wide }: {
  label: string; value: string; unit?: string; color: string; wide?: boolean;
}) {
  return (
    <div style={{
      flex: wide ? 2 : 1,
      background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderTopColor: 'rgba(255,255,255,0.14)',
      borderRadius: 'var(--r-card)',
      padding: '16px 18px',
      display: 'flex', flexDirection: 'column', gap: 6,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 8px 32px rgba(0,0,0,0.45)',
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--label3)' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
        <span style={{
          fontSize: wide ? 64 : 52, fontWeight: 200, color,
          letterSpacing: '-0.03em', lineHeight: 1,
          fontVariantNumeric: 'tabular-nums',
          textShadow: `0 0 40px ${color}55`,
        }}>
          {value}
        </span>
        {unit && (
          <span style={{ fontSize: 20, fontWeight: 300, color: 'var(--label3)', lineHeight: 1 }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

export function BatteryTab({ battery, powerKw }: Props) {
  const socC     = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const voltC    = battery.voltage > 50 ? 'var(--sys-green)' : battery.voltage > 47 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const timeLeft = calcTimeRemaining(battery.remaining, battery.voltage, powerKw);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>

      {/* Top row: time | SOC hero | voltage */}
      <div style={{ flex: 1, display: 'flex', gap: 8, minHeight: 0 }}>

        {/* LEFT: Time remaining */}
        <div style={{
          width: 290, flexShrink: 0,
          background: `linear-gradient(145deg, color-mix(in srgb, ${timeLeft.color} 14%, rgba(255,255,255,0.05)) 0%, rgba(255,255,255,0.03) 100%)`,
          border: `1px solid color-mix(in srgb, ${timeLeft.color} 30%, rgba(255,255,255,0.07))`,
          borderTopColor: `color-mix(in srgb, ${timeLeft.color} 50%, rgba(255,255,255,0.10))`,
          borderRadius: 'var(--r-card)',
          padding: '24px 28px',
          display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 10,
          boxShadow: `0 0 40px color-mix(in srgb, ${timeLeft.color} 10%, transparent), inset 0 1px 0 rgba(255,255,255,0.09), 0 8px 32px rgba(0,0,0,0.45)`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--label3)' }}>
            Time Remaining
          </div>
          <div style={{
            fontSize: 72, fontWeight: 200, color: timeLeft.color, lineHeight: 1,
            letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums',
            textShadow: `0 0 50px ${timeLeft.color}66`,
          }}>
            {timeLeft.label}
          </div>
          <div style={{ fontSize: 14, color: 'var(--label3)', fontWeight: 500 }}>
            @ {(powerKw * 1000).toFixed(0)} W draw
          </div>
          {/* V + A pills */}
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {[
              { val: battery.voltage.toFixed(1), unit: 'V', color: 'var(--sys-blue)' },
              { val: Math.abs(battery.current).toFixed(1), unit: 'A', color: 'var(--sys-teal)' },
            ].map(p => (
              <div key={p.unit} style={{
                flex: 1, background: 'rgba(0,0,0,0.20)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, padding: '7px 10px', textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, fontWeight: 300, color: p.color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{p.val}</div>
                <div style={{ fontSize: 12, color: 'var(--label3)', fontWeight: 700, letterSpacing: '0.06em', marginTop: 3 }}>{p.unit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CENTRE: SOC Gauge — hero */}
        <div className="card" style={{
          flex: 1,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '24px 28px', gap: 14,
          background: `linear-gradient(145deg, color-mix(in srgb, ${socC} 10%, rgba(255,255,255,0.07)) 0%, rgba(255,255,255,0.03) 100%)`,
          border: `1px solid color-mix(in srgb, ${socC} 25%, rgba(255,255,255,0.07))`,
          borderTopColor: `color-mix(in srgb, ${socC} 40%, rgba(255,255,255,0.10))`,
          boxShadow: `0 0 50px color-mix(in srgb, ${socC} 12%, transparent), inset 0 1px 0 rgba(255,255,255,0.09), 0 8px 32px rgba(0,0,0,0.45)`,
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--label3)' }}>
            State of Charge
          </div>
          <ArcGauge value={battery.soc} max={100} size={240} color={socC} strokeWidth={12}>
            <div style={{ textAlign: 'center', lineHeight: 1 }}>
              <div style={{ fontSize: 88, fontWeight: 200, color: socC, letterSpacing: '-0.04em', textShadow: `0 0 50px ${socC}66` }}>
                {battery.soc}
              </div>
              <div style={{ fontSize: 22, fontWeight: 400, color: 'var(--label3)', marginTop: 6 }}>%</div>
            </div>
          </ArcGauge>
          <div style={{ fontSize: 14, color: 'var(--label3)', fontWeight: 500, textAlign: 'center' }}>
            Fogstar Drift 48V · 125Ah
          </div>
          <div style={{ fontSize: 14, color: 'var(--label3)', fontWeight: 500, textAlign: 'center' }}>
            {(battery.remaining / 1000).toFixed(1)} Ah remaining
          </div>
        </div>

        {/* RIGHT: Voltage card */}
        <div className="card" style={{
          width: 210, flexShrink: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '20px 22px', gap: 10,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: 'var(--label3)' }}>
            Pack Voltage
          </div>
          <div style={{ textAlign: 'center', lineHeight: 1 }}>
            <div style={{
              fontSize: 64, fontWeight: 200, color: voltC,
              letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums',
              textShadow: `0 0 36px ${voltC}55`,
            }}>
              {battery.voltage.toFixed(1)}
            </div>
            <div style={{ fontSize: 22, fontWeight: 300, color: 'var(--label3)', marginTop: 6 }}>V</div>
          </div>
          <div style={{ fontSize: 13, color: 'var(--label3)', fontWeight: 500, textAlign: 'center', lineHeight: 1.6 }}>
            {Math.abs(battery.current).toFixed(1)} A
            <br />
            {(battery.remaining / 1000).toFixed(1)} Ah left
          </div>
        </div>
      </div>

      {/* Bottom row: stat pills */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {[
          { label: 'Current',   value: `${Math.abs(battery.current).toFixed(1)}`, unit: 'A', color: 'var(--sys-teal)' },
          { label: 'Power',     value: `${(battery.voltage * Math.abs(battery.current) / 1000).toFixed(2)}`, unit: 'kW', color: 'var(--sys-blue)' },
          { label: 'Capacity',  value: `${(battery.remaining / 1000).toFixed(1)}`, unit: 'Ah', color: 'var(--sys-green)' },
          { label: 'Temp',      value: `—`,   unit: '°C', color: 'var(--label3)' },
        ].map(s => (
          <div key={s.label} style={{
            flex: 1,
            background: 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
            border: '1px solid rgba(255,255,255,0.08)', borderTopColor: 'rgba(255,255,255,0.12)',
            borderRadius: 14, padding: '14px 16px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.35)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--label3)' }}>
              {s.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 300, color: s.color, fontVariantNumeric: 'tabular-nums', marginTop: 6, lineHeight: 1 }}>
              {s.value} <span style={{ fontSize: 16, fontWeight: 500, color: 'var(--label3)' }}>{s.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
