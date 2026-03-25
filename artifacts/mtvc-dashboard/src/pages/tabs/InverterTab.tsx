import { HBar } from '../../components/HBar';
import { ConnDot } from '../../components/ConnDot';
import { InverterData } from '../../hooks/useLiveData';

interface Props { inverter: InverterData }

function Row({ label, value, color, last }: { label: string; value: string; color?: string; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px', flex: 1,
      borderBottom: last ? 'none' : '0.5px solid var(--sep)',
    }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--label)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 400, color: color || 'var(--label2)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

function MetricCard({ label, value, unit, sub, subValue, color, pct, flex }: {
  label: string; value: string; unit: string;
  sub: string; subValue: string; color: string; pct: number; flex?: number;
}) {
  return (
    <div className="card" style={{ padding: '12px 16px', flex: flex ?? 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        <span style={{ fontSize: 38, fontWeight: 200, color: 'var(--label)', lineHeight: 1, letterSpacing: '-0.03em' }}>{value}</span>
        <span style={{ fontSize: 16, fontWeight: 300, color: 'var(--label2)', paddingBottom: 4 }}>{unit}</span>
      </div>
      <div>
        <HBar pct={pct} color={color} height={3} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 5 }}>
          <span style={{ fontSize: 11, color: 'var(--label3)', fontWeight: 500 }}>{sub}</span>
          <span style={{ fontSize: 11, color, fontWeight: 600 }}>{subValue}</span>
        </div>
      </div>
    </div>
  );
}

export function InverterTab({ inverter }: Props) {
  const tempC = inverter.temp < 45 ? 'var(--sys-green)' : inverter.temp < 60 ? 'var(--sys-orange)' : 'var(--sys-red)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {/* Top metric cards */}
      <div style={{ display: 'flex', gap: 8, height: 108, flexShrink: 0 }}>
        <MetricCard label="AC Output" value={inverter.acVoltage.toFixed(1)} unit="V"
          sub="Load" subValue={`${inverter.loadPct}%`}
          color="var(--brand)" pct={inverter.loadPct} />
        <MetricCard label="DC Input" value={inverter.dcVoltage.toFixed(1)} unit="V"
          sub="Current" subValue={`${inverter.dcCurrent.toFixed(1)} A`}
          color="var(--sys-blue)" pct={Math.min(100, (inverter.dcCurrent / 60) * 100)} />
      </div>

      {/* System data — grows to fill remaining height */}
      <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <div style={{ padding: '8px 14px 0', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>
          System Data
        </div>
        <Row label="Output Power" value={`${inverter.outputKw.toFixed(2)} kW`} />
        <Row label="DC Current"   value={`${inverter.dcCurrent.toFixed(1)} A`} />
        <Row label="Temperature"  value={`${inverter.temp}°C`}  color={tempC} />
        <div style={{
          display: 'flex', alignItems: 'center', padding: '0 14px', flex: 1,
          borderTop: '0.5px solid var(--sep)', gap: 10,
        }}>
          <ConnDot connected={inverter.connected} />
          <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--label)', flex: 1 }}>VE.Bus Status</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: inverter.mode === 'Inverting' ? 'var(--brand)' : 'var(--sys-blue)' }}>
            {inverter.mode}
          </span>
        </div>
      </div>
    </div>
  );
}
