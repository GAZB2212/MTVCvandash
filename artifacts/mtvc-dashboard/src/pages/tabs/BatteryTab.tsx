import { ArcGauge } from '../../components/ArcGauge';
import { StatRow } from '../../components/StatRow';
import { BatteryData } from '../../hooks/useLiveData';

interface Props { battery: BatteryData }

function cellColor(v: number) {
  return v >= 3.25 ? 'var(--sys-green)' : v >= 3.20 ? 'var(--sys-orange)' : 'var(--sys-red)';
}

export function BatteryTab({ battery }: Props) {
  const socC = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const deltaC = battery.delta > 10 ? 'var(--sys-red)' : battery.delta > 5 ? 'var(--sys-orange)' : 'var(--sys-green)';
  const remainAh = (battery.remaining / 1000).toFixed(1);

  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <div style={{ display: 'flex', gap: 10 }}>
        {/* Gauge */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '14px 16px', gap: 8, minWidth: 160 }}>
          <ArcGauge value={battery.soc} max={100} size={112} color={socC} strokeWidth={7}>
            <div style={{ textAlign: 'center', lineHeight: 1 }}>
              <div style={{ fontSize: 30, fontWeight: 200, color: socC, letterSpacing: '-0.02em' }}>{battery.soc}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--label3)', marginTop: 3, letterSpacing: '0.05em', textTransform: 'uppercase' }}>SOC %</div>
            </div>
          </ArcGauge>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--label)' }}>Fogstar Drift</div>
            <div style={{ fontSize: 11, color: 'var(--label3)', marginTop: 1 }}>48V · 125Ah LiFePO₄</div>
          </div>
        </div>

        {/* Pack stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div>
            <div className="section-header">Pack</div>
            <div className="card">
              <StatRow label="Voltage"   value={`${battery.voltage.toFixed(1)} V`}  valueColor="var(--sys-blue)" />
              <StatRow label="Current"   value={`${Math.abs(battery.current).toFixed(1)} A`} />
              <StatRow label="Remaining" value={`${remainAh} Ah`} valueColor="var(--sys-green)" />
              <StatRow label="Cycles"    value={`${battery.cycles}`} last />
            </div>
          </div>
          <div>
            <div className="section-header">Cells</div>
            <div className="card">
              <StatRow label="Min Cell" value={`${battery.cellMin.toFixed(3)} V`} valueColor="var(--sys-green)" />
              <StatRow label="Max Cell" value={`${battery.cellMax.toFixed(3)} V`} />
              <StatRow label="Delta"    value={`${battery.delta} mV`} valueColor={deltaC} last />
            </div>
          </div>
        </div>
      </div>

      {/* Cell grid */}
      <div>
        <div className="section-header">Cell Voltages — 16S</div>
        <div className="card" style={{ padding: '10px 12px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 6 }}>
            {battery.cells.map((v, i) => {
              const c = cellColor(v);
              const pct = ((v - 3.0) / (3.65 - 3.0)) * 100;
              return (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.04em' }}>C{i + 1}</div>
                  <div style={{ width: 6, height: 28, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${pct}%`, background: c, borderRadius: 3, transition: 'height 0.5s' }} />
                  </div>
                  <div style={{ fontSize: 9, color: c, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{v.toFixed(2)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MOS status */}
      <div>
        <div className="section-header">Protection</div>
        <div className="card">
          {[
            { label: 'Charge MOS',    on: battery.chargeMos },
            { label: 'Discharge MOS', on: battery.dischargeMos },
            { label: 'Balancing',     on: battery.balancing,    color: 'var(--sys-orange)' },
          ].map(({ label, on, color }, i, arr) => (
            <StatRow key={label} label={label} value={on ? 'ON' : 'OFF'}
              valueColor={on ? (color || 'var(--sys-green)') : 'var(--label3)'}
              last={i === arr.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
