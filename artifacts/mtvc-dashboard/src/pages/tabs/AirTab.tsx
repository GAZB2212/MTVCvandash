import { Card } from '../../components/Card';
import { ArcGauge } from '../../components/ArcGauge';
import { HBar } from '../../components/HBar';
import { StatRow } from '../../components/StatRow';
import { ConnDot } from '../../components/ConnDot';
import { PressureData } from '../../hooks/useLiveData';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  pressure: PressureData;
}

export function AirTab({ pressure }: Props) {
  const { isDark } = useTheme();
  const green = isDark ? '#22C55E' : '#15803D';
  const amber = isDark ? '#E8A020' : '#B45309';
  const red = isDark ? '#EF4444' : '#B91C1C';

  const pct = (pressure.psi / pressure.maxPsi) * 100;
  const gaugeColor = pct > 60 ? green : pct > 40 ? amber : red;
  const usablePct = Math.round((pressure.psi / pressure.maxPsi) * 100);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, height: '100%' }}>
      {/* Left: Gauge Card */}
      <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', fontWeight: 700 }}>
          AIR PRESSURE
        </div>
        <ArcGauge value={pressure.psi} max={pressure.maxPsi} size={150} color={gaugeColor} strokeWidth={12}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 32, color: gaugeColor, lineHeight: 1 }}>
              {pressure.psi}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', textTransform: 'uppercase', marginTop: 2 }}>PSI</div>
          </div>
        </ArcGauge>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ConnDot connected={pressure.connected} />
          <span style={{ fontSize: 10, color: 'var(--text-dim)' }}>Sensor {pressure.connected ? 'Online' : 'Offline'}</span>
        </div>
      </Card>

      {/* Right: Stats */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Card accent={gaugeColor} title="TANK PRESSURE">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--text-dim)' }}>0</span>
            <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--text-dim)' }}>MAX</span>
          </div>
          <HBar pct={pct} color={gaugeColor} height={10} />
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 28, color: gaugeColor, marginTop: 8, lineHeight: 1 }}>
            {pressure.psi}<span style={{ fontSize: 14, marginLeft: 3 }}>PSI</span>
          </div>
        </Card>

        <Card title="STATUS">
          <StatRow label="Current" value={`${pressure.psi} PSI`} valueColor={gaugeColor} />
          <StatRow label="Maximum" value={`${pressure.maxPsi} PSI`} />
          <StatRow label="Usable %" value={`${usablePct}%`} valueColor={gaugeColor} accent />
        </Card>
      </div>
    </div>
  );
}
