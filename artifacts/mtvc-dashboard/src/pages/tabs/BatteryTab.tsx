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

export function BatteryTab({ battery, powerKw }: Props) {
  const socC = battery.soc > 30 ? 'var(--sys-green)' : battery.soc > 10 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const timeLeft = calcTimeRemaining(battery.remaining, battery.voltage, powerKw);
  const voltC = battery.voltage > 50 ? 'var(--sys-green)' : battery.voltage > 47 ? 'var(--sys-orange)' : 'var(--sys-red)';

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly', height: '100%', gap: 12 }}>

      {/* Percentage */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 28px', gap: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>
          Battery
        </div>
        <ArcGauge value={battery.soc} max={100} size={130} color={socC} strokeWidth={9}>
          <div style={{ textAlign: 'center', lineHeight: 1 }}>
            <div style={{ fontSize: 40, fontWeight: 200, color: socC, letterSpacing: '-0.03em' }}>{battery.soc}</div>
            <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--label3)', marginTop: 4 }}>%</div>
          </div>
        </ArcGauge>
      </div>

      {/* Time remaining */}
      <div className="card" style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px 36px', gap: 8,
        background: `color-mix(in srgb, ${timeLeft.color} 10%, var(--surface1))`,
        border: `1px solid color-mix(in srgb, ${timeLeft.color} 22%, transparent)`,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>
          Time Remaining
        </div>
        <div style={{ fontSize: 58, fontWeight: 200, color: timeLeft.color, lineHeight: 1, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
          {timeLeft.label}
        </div>
        <div style={{ fontSize: 12, color: 'var(--label3)', fontWeight: 500 }}>
          @ {(powerKw * 1000).toFixed(0)} W current draw
        </div>
      </div>

      {/* Voltage */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px 28px', gap: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>
          Pack Voltage
        </div>
        <div style={{ textAlign: 'center', lineHeight: 1 }}>
          <div style={{ fontSize: 52, fontWeight: 200, color: voltC, letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums' }}>
            {battery.voltage.toFixed(1)}
          </div>
          <div style={{ fontSize: 18, fontWeight: 300, color: 'var(--label3)', marginTop: 6 }}>V</div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--label3)', fontWeight: 500 }}>
          {Math.abs(battery.current).toFixed(1)} A · {(battery.remaining / 1000).toFixed(1)} Ah left
        </div>
      </div>

    </div>
  );
}
