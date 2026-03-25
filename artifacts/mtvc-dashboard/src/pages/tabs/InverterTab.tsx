import { HBar } from '../../components/HBar';
import { StatRow } from '../../components/StatRow';
import { ConnDot } from '../../components/ConnDot';
import { InverterData } from '../../hooks/useLiveData';

interface Props { inverter: InverterData }

function MetricCard({ label, value, unit, sub, subValue, color, pct }: {
  label: string; value: string; unit: string;
  sub: string; subValue: string; color: string; pct: number;
}) {
  return (
    <div className="card" style={{ padding: '16px 16px 14px', flex: 1 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--label3)', marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 12 }}>
        <span style={{ fontSize: 44, fontWeight: 200, color: 'var(--label)', lineHeight: 1, letterSpacing: '-0.03em' }}>
          {value}
        </span>
        <span style={{ fontSize: 18, fontWeight: 300, color: 'var(--label2)', paddingBottom: 6 }}>{unit}</span>
      </div>
      <HBar pct={pct} color={color} height={3} />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 12, color: 'var(--label3)', fontWeight: 500 }}>{sub}</span>
        <span style={{ fontSize: 12, color: color, fontWeight: 500 }}>{subValue}</span>
      </div>
    </div>
  );
}

export function InverterTab({ inverter }: Props) {
  const tempC = inverter.temp < 45 ? 'var(--sys-green)' : inverter.temp < 60 ? 'var(--sys-orange)' : 'var(--sys-red)';

  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <MetricCard label="AC Output" value={inverter.acVoltage.toFixed(1)} unit="V"
          sub="Load" subValue={`${inverter.loadPct}%`}
          color="var(--brand)" pct={inverter.loadPct} />
        <MetricCard label="DC Input" value={inverter.dcVoltage.toFixed(1)} unit="V"
          sub="Current" subValue={`${inverter.dcCurrent.toFixed(1)} A`}
          color="var(--sys-blue)" pct={Math.min(100, (inverter.dcCurrent / 60) * 100)} />
      </div>

      <div>
        <div className="section-header">System Data</div>
        <div className="card">
          <StatRow label="Output Power" value={`${inverter.outputKw.toFixed(2)} kW`} />
          <StatRow label="Frequency"    value={`${inverter.acHz.toFixed(1)} Hz`} />
          <StatRow label="DC Current"   value={`${inverter.dcCurrent.toFixed(1)} A`} />
          <StatRow label="Temperature"  value={`${inverter.temp}°C`} valueColor={tempC} last />
        </div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', padding: '10px 14px', gap: 10 }}>
        <ConnDot connected={inverter.connected} />
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--label)', flex: 1 }}>VE.Bus Status</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: inverter.mode === 'Inverting' ? 'var(--brand)' : 'var(--sys-blue)' }}>
          {inverter.mode}
        </span>
      </div>
    </div>
  );
}
