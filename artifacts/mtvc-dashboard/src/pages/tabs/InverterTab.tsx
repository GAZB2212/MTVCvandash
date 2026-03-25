import { Card } from '../../components/Card';
import { HBar } from '../../components/HBar';
import { StatRow } from '../../components/StatRow';
import { ConnDot } from '../../components/ConnDot';
import { InverterData } from '../../hooks/useLiveData';
import { useTheme } from '../../context/ThemeContext';

interface Props { inverter: InverterData }

export function InverterTab({ inverter }: Props) {
  const { isDark } = useTheme();
  const brand = isDark ? '#6DC82B' : '#4A8A18';
  const blue  = isDark ? '#38BDF8' : '#0284C7';
  const green = isDark ? '#34D399' : '#059669';
  const red   = isDark ? '#F87171' : '#DC2626';
  const amber = isDark ? '#FBB040' : '#D97706';

  const tempColor = inverter.temp < 45 ? green : inverter.temp < 60 ? amber : red;
  const modeColor = inverter.mode === 'Inverting' ? brand : blue;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {/* Top row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {/* AC Output */}
        <Card accent={brand}>
          <div className="label-caps" style={{ marginBottom: 6, marginTop: 6 }}>AC Output</div>
          <div className="mono" style={{ fontSize: 34, color: brand, lineHeight: 1, marginBottom: 8 }}>
            {inverter.acVoltage.toFixed(1)}<span style={{ fontSize: 15, opacity: 0.7, marginLeft: 3 }}>V</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span className="label-caps">Load</span>
            <span className="mono" style={{ fontSize: 12, color: brand }}>{inverter.loadPct}%</span>
          </div>
          <HBar pct={inverter.loadPct} color={brand} height={4} />
        </Card>

        {/* DC Input */}
        <Card accent={blue}>
          <div className="label-caps" style={{ marginBottom: 6, marginTop: 6 }}>DC Input</div>
          <div className="mono" style={{ fontSize: 34, color: blue, lineHeight: 1, marginBottom: 8 }}>
            {inverter.dcVoltage.toFixed(1)}<span style={{ fontSize: 15, opacity: 0.7, marginLeft: 3 }}>V</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span className="label-caps">Current</span>
            <span className="mono" style={{ fontSize: 12, color: blue }}>{inverter.dcCurrent.toFixed(1)} A</span>
          </div>
          <HBar pct={Math.min(100, (inverter.dcCurrent / 60) * 100)} color={blue} height={4} />
        </Card>
      </div>

      {/* System data */}
      <Card title="System Data">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          <StatRow label="Output Power" value={`${inverter.outputKw.toFixed(2)} kW`} />
          <StatRow label="Frequency"    value={`${inverter.acHz.toFixed(1)} Hz`} />
          <StatRow label="DC Current"   value={`${inverter.dcCurrent.toFixed(1)} A`} />
          <StatRow label="Temperature"  value={`${inverter.temp}°C`} valueColor={tempColor} />
        </div>
      </Card>

      {/* VE.Bus status strip */}
      <div className="glass-card" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        borderTop: `1.5px solid ${brand}40`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ConnDot connected={inverter.connected} />
          <span className="label-caps" style={{ color: 'var(--text-mid)' }}>VE.BUS Status</span>
        </div>
        <span className="mono" style={{ fontSize: 14, color: modeColor, fontWeight: 600 }}>
          {inverter.mode}
        </span>
      </div>
    </div>
  );
}
