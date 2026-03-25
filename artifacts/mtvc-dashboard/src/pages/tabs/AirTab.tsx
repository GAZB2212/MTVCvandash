import { ArcGauge } from '../../components/ArcGauge';
import { ConnDot } from '../../components/ConnDot';
import { PressureData } from '../../hooks/useLiveData';

interface Props { pressure: PressureData }

function DRow({ label, value, color, last }: { label: string; value: string; color?: string; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px', flex: 1,
      borderBottom: last ? 'none' : '0.5px solid var(--sep)',
    }}>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--label2)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: color || 'var(--label)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

export function AirTab({ pressure }: Props) {
  const pct   = (pressure.psi / pressure.maxPsi) * 100;
  const color = pct > 60 ? 'var(--sys-green)' : pct > 40 ? 'var(--sys-orange)' : 'var(--sys-red)';

  return (
    <div style={{ display: 'flex', gap: 8, height: '100%', minHeight: 0 }}>

      {/* Gauge column */}
      <div className="card" style={{ width: 240, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px 20px', gap: 14, flexShrink: 0 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>
          Air Pressure
        </div>
        <ArcGauge value={pressure.psi} max={pressure.maxPsi} size={150} color={color} strokeWidth={10}>
          <div style={{ textAlign: 'center', lineHeight: 1 }}>
            <div style={{ fontSize: 42, fontWeight: 200, color, letterSpacing: '-0.02em' }}>{pressure.psi}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--label3)', marginTop: 4, letterSpacing: '0.05em', textTransform: 'uppercase' }}>PSI</div>
          </div>
        </ArcGauge>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <ConnDot connected={pressure.connected} size={6} />
          <span style={{ fontSize: 12, color: 'var(--label2)', fontWeight: 500 }}>
            Sensor {pressure.connected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Stats column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        {/* Reading card — grows */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '8px 14px 0', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>Reading</div>
          <DRow label="Current PSI" value={`${pressure.psi} PSI`} color={color} />
          <DRow label="Maximum"     value={`${pressure.maxPsi} PSI`} />
          <DRow label="Level"       value={`${Math.round(pct)}%`}  color={color} last />
        </div>

        {/* Range card — fixed */}
        <div className="card" style={{ padding: '14px 16px', flexShrink: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)', marginBottom: 10 }}>Range</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--label3)', fontWeight: 500 }}>0 PSI</span>
            <span style={{ fontSize: 11, color: 'var(--label3)', fontWeight: 500 }}>{pressure.maxPsi} PSI MAX</span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width 0.6s' }} />
          </div>
        </div>

        {/* Status card — fixed */}
        <div className="card" style={{ padding: '14px 16px', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--label2)' }}>System Status</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: pct > 60 ? 'var(--sys-green)' : 'var(--sys-orange)' }}>
              {pct > 80 ? 'Full' : pct > 60 ? 'Good' : pct > 40 ? 'Low' : 'Critical'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
