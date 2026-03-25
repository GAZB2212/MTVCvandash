import { ArcGauge } from '../../components/ArcGauge';
import { StatRow } from '../../components/StatRow';
import { ConnDot } from '../../components/ConnDot';
import { PressureData } from '../../hooks/useLiveData';

interface Props { pressure: PressureData }

export function AirTab({ pressure }: Props) {
  const pct = (pressure.psi / pressure.maxPsi) * 100;
  const color = pct > 60 ? 'var(--sys-green)' : pct > 40 ? 'var(--sys-orange)' : 'var(--sys-red)';

  return (
    <div className="slide-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, height: '100%', alignItems: 'start' }}>
      {/* Gauge */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 20px', gap: 16 }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'var(--label3)' }}>
          Air Pressure
        </div>
        <ArcGauge value={pressure.psi} max={pressure.maxPsi} size={136} color={color} strokeWidth={9}>
          <div style={{ textAlign: 'center', lineHeight: 1 }}>
            <div style={{ fontSize: 38, fontWeight: 200, color, letterSpacing: '-0.02em' }}>{pressure.psi}</div>
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

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <div className="section-header">Reading</div>
          <div className="card">
            <StatRow label="Current PSI" value={`${pressure.psi} PSI`} valueColor={color} />
            <StatRow label="Maximum"     value={`${pressure.maxPsi} PSI`} />
            <StatRow label="Level"       value={`${Math.round(pct)}%`}    valueColor={color} last />
          </div>
        </div>

        <div>
          <div className="section-header">Range</div>
          <div className="card" style={{ padding: '14px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 11, color: 'var(--label3)', fontWeight: 500 }}>0 PSI</span>
              <span style={{ fontSize: 11, color: 'var(--label3)', fontWeight: 500 }}>{pressure.maxPsi} PSI MAX</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 3, transition: 'width 0.6s' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
