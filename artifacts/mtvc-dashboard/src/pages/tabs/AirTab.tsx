import { Card } from '../../components/Card';
import { ArcGauge } from '../../components/ArcGauge';
import { HBar } from '../../components/HBar';
import { StatRow } from '../../components/StatRow';
import { ConnDot } from '../../components/ConnDot';
import { PressureData } from '../../hooks/useLiveData';
import { useTheme } from '../../context/ThemeContext';

interface Props { pressure: PressureData }

export function AirTab({ pressure }: Props) {
  const { isDark } = useTheme();
  const green = isDark ? '#34D399' : '#059669';
  const amber = isDark ? '#FBB040' : '#D97706';
  const red   = isDark ? '#F87171' : '#DC2626';

  const pct = (pressure.psi / pressure.maxPsi) * 100;
  const gaugeColor = pct > 60 ? green : pct > 40 ? amber : red;
  const usablePct = Math.round(pct);

  return (
    <div className="fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, height: '100%' }}>
      {/* Gauge */}
      <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <div className="label-caps">Air Pressure</div>
        <ArcGauge value={pressure.psi} max={pressure.maxPsi} size={148} color={gaugeColor} strokeWidth={11}>
          <div style={{ textAlign: 'center' }}>
            <div className="mono" style={{ fontSize: 36, color: gaugeColor, lineHeight: 1 }}>{pressure.psi}</div>
            <div className="label-caps" style={{ marginTop: 3 }}>PSI</div>
          </div>
        </ArcGauge>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <ConnDot connected={pressure.connected} />
          <span style={{ fontSize: 11, color: 'var(--text-mid)' }}>
            Sensor {pressure.connected ? 'Online' : 'Offline'}
          </span>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Card accent={gaugeColor} title="Tank Pressure">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span className="label-caps">0 PSI</span>
            <span className="label-caps">{pressure.maxPsi} MAX</span>
          </div>
          <HBar pct={pct} color={gaugeColor} height={8} />
          <div className="mono" style={{ fontSize: 36, color: gaugeColor, marginTop: 10, lineHeight: 1 }}>
            {pressure.psi}<span style={{ fontSize: 16, opacity: 0.7, marginLeft: 4 }}>PSI</span>
          </div>
        </Card>

        <Card title="Status">
          <StatRow label="Current"  value={`${pressure.psi} PSI`}     valueColor={gaugeColor} />
          <StatRow label="Maximum"  value={`${pressure.maxPsi} PSI`} />
          <StatRow label="Usable %" value={`${usablePct}%`}          valueColor={gaugeColor} />
        </Card>
      </div>
    </div>
  );
}
