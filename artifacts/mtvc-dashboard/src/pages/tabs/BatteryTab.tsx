import { ArcGauge } from '../../components/ArcGauge';
import { BatteryData } from '../../hooks/useLiveData';

interface Props { battery: BatteryData; powerKw: number }

function cellColor(v: number) {
  return v >= 3.25 ? 'var(--sys-green)' : v >= 3.20 ? 'var(--sys-orange)' : 'var(--sys-red)';
}

function DRow({ label, value, color, last }: { label: string; value: string; color?: string; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 12px', flex: 1,
      borderBottom: last ? 'none' : '0.5px solid var(--sep)',
      minHeight: 0,
    }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--label2)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: color || 'var(--label)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

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
  const socC   = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const deltaC = battery.delta > 10 ? 'var(--sys-red)' : battery.delta > 5 ? 'var(--sys-orange)' : 'var(--sys-green)';
  const remainAh = (battery.remaining / 1000).toFixed(1);
  const timeLeft = calcTimeRemaining(battery.remaining, battery.voltage, powerKw);

  return (
    <div style={{ display: 'flex', gap: 8, height: '100%', minHeight: 0 }}>

      {/* LEFT: Gauge + time remaining + key stats */}
      <div style={{ width: 210, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
        {/* Gauge + time remaining card */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 16px', gap: 5, flexShrink: 0 }}>
          <ArcGauge value={battery.soc} max={100} size={96} color={socC} strokeWidth={7}>
            <div style={{ textAlign: 'center', lineHeight: 1 }}>
              <div style={{ fontSize: 26, fontWeight: 200, color: socC, letterSpacing: '-0.02em' }}>{battery.soc}</div>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--label3)', marginTop: 2, letterSpacing: '0.05em', textTransform: 'uppercase' }}>SOC %</div>
            </div>
          </ArcGauge>

          {/* Time remaining — prominent */}
          <div style={{
            width: '100%', padding: '8px 10px', borderRadius: 10, marginTop: 2,
            background: `color-mix(in srgb, ${timeLeft.color} 12%, transparent)`,
            border: `1px solid color-mix(in srgb, ${timeLeft.color} 25%, transparent)`,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1,
          }}>
            <div style={{ fontSize: 9, fontWeight: 700, color: 'var(--label3)', letterSpacing: '0.10em', textTransform: 'uppercase' }}>
              Time Remaining
            </div>
            <div style={{ fontSize: 28, fontWeight: 200, color: timeLeft.color, lineHeight: 1, letterSpacing: '-0.02em', fontVariantNumeric: 'tabular-nums' }}>
              {timeLeft.label}
            </div>
            <div style={{ fontSize: 9, color: 'var(--label3)', fontWeight: 500 }}>
              @ {(powerKw * 1000).toFixed(0)} W draw
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 2 }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--label)' }}>Fogstar Drift</div>
            <div style={{ fontSize: 9, color: 'var(--label3)' }}>48V · 125Ah</div>
          </div>
        </div>

        {/* Pack stats */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '7px 12px 0', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>Pack</div>
          <DRow label="Voltage"   value={`${battery.voltage.toFixed(1)} V`}               color="var(--sys-blue)" />
          <DRow label="Current"   value={`${Math.abs(battery.current).toFixed(1)} A`} />
          <DRow label="Remaining" value={`${remainAh} Ah`}                                color="var(--sys-green)" />
          <DRow label="Cycles"    value={`${battery.cycles}`} />
          <DRow label="Temp"      value={`${battery.temp}°C`}                              last />
        </div>
      </div>

      {/* RIGHT: Cells + protection */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        {/* Cell voltage mini-bars */}
        <div className="card" style={{ padding: '10px 12px', flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)', marginBottom: 8 }}>Cell Voltages — 16S</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
            {battery.cells.map((v, i) => {
              const c = cellColor(v);
              const pct = Math.max(0, Math.min(100, ((v - 3.0) / (3.65 - 3.0)) * 100));
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
                  <div style={{ fontSize: 8, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.03em' }}>C{i + 1}</div>
                  <div style={{ width: 7, height: 24, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${pct}%`, background: c, borderRadius: 4, transition: 'height 0.5s' }} />
                  </div>
                  <div style={{ fontSize: 8, color: c, fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}>{v.toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cell stats */}
        <div className="card" style={{ flexShrink: 0 }}>
          <div style={{ padding: '7px 12px 0', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>Cells</div>
          <DRow label="Min Cell" value={`${battery.cellMin.toFixed(3)} V`} color="var(--sys-green)" />
          <DRow label="Max Cell" value={`${battery.cellMax.toFixed(3)} V`} />
          <DRow label="Delta"    value={`${battery.delta} mV`}             color={deltaC} last />
        </div>

        {/* Protection — grows to fill remaining */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '7px 12px 0', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>Protection</div>
          <DRow label="Charge MOS"    value={battery.chargeMos    ? 'ON' : 'OFF'} color={battery.chargeMos    ? 'var(--sys-green)' : 'var(--label3)'} />
          <DRow label="Discharge MOS" value={battery.dischargeMos ? 'ON' : 'OFF'} color={battery.dischargeMos ? 'var(--sys-green)' : 'var(--label3)'} />
          <DRow label="Balancing"     value={battery.balancing    ? 'Active' : 'Idle'} color={battery.balancing ? 'var(--sys-orange)' : 'var(--label3)'} last />
        </div>
      </div>
    </div>
  );
}
