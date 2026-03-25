import { Card } from '../../components/Card';
import { ArcGauge } from '../../components/ArcGauge';
import { StatRow } from '../../components/StatRow';
import { BatteryData } from '../../hooks/useLiveData';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  battery: BatteryData;
}

function getCellColor(v: number, isDark: boolean) {
  const green = isDark ? '#22C55E' : '#15803D';
  const amber = isDark ? '#6DC82B' : '#4A8A18';
  const red = isDark ? '#EF4444' : '#B91C1C';
  if (v >= 3.25) return green;
  if (v >= 3.20) return amber;
  return red;
}

export function BatteryTab({ battery }: Props) {
  const { isDark } = useTheme();
  const amber = isDark ? '#6DC82B' : '#4A8A18';
  const green = isDark ? '#22C55E' : '#15803D';
  const blue = isDark ? '#38BDF8' : '#0369A1';
  const red = isDark ? '#EF4444' : '#B91C1C';

  const socColor = battery.soc > 60 ? green : battery.soc > 30 ? amber : red;
  const remainingAh = (battery.remaining / 1000).toFixed(1);
  const fullCapAh = (battery.fullCap / 1000).toFixed(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {/* Top: Gauge + Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {/* Left: ArcGauge */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <ArcGauge value={battery.soc} max={100} size={128} color={socColor}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 26, color: socColor, lineHeight: 1 }}>
                {battery.soc}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-dim)', textTransform: 'uppercase' }}>SOC %</div>
            </div>
          </ArcGauge>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text)', fontWeight: 700 }}>Fogstar Drift 48V</div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)' }}>125Ah LiFePO₄</div>
          </div>
        </Card>

        {/* Right: Pack + Cells */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Card title="PACK">
            <StatRow label="Voltage" value={`${battery.voltage.toFixed(1)} V`} valueColor={blue} />
            <StatRow label="Current" value={`${battery.current.toFixed(1)} A`} />
            <StatRow label="Remaining" value={`${remainingAh} Ah`} valueColor={green} />
            <StatRow label="Cycles" value={`${battery.cycles}`} />
          </Card>
          <Card title="CELLS">
            <StatRow label="Min Cell" value={`${battery.cellMin.toFixed(3)} V`} valueColor={green} />
            <StatRow label="Max Cell" value={`${battery.cellMax.toFixed(3)} V`} />
            <StatRow label="Delta" value={`${battery.delta} mV`} valueColor={battery.delta > 10 ? red : battery.delta > 5 ? amber : green} />
            <StatRow label="Temp" value={`${battery.temp}°C`} />
          </Card>
        </div>
      </div>

      {/* Cell Voltages Grid */}
      <Card title="CELL VOLTAGES — 16S">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
          {battery.cells.map((v, i) => {
            const cellColor = getCellColor(v, isDark);
            const pct = ((v - 3.0) / (3.65 - 3.0)) * 100;
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'var(--surface2)',
                  borderRadius: 3,
                  padding: '4px 2px 2px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ fontSize: 9, color: 'var(--text-dim)', marginBottom: 2 }}>C{i + 1}</div>
                <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: cellColor }}>{v.toFixed(3)}</div>
                <div style={{ width: '100%', height: 3, background: 'var(--border-color)', borderRadius: 2, marginTop: 3 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: cellColor, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Status Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { label: 'Charge MOS', value: battery.chargeMos, color: battery.chargeMos ? green : red },
          { label: 'Discharge MOS', value: battery.dischargeMos, color: battery.dischargeMos ? green : red },
          { label: 'Balancing', value: battery.balancing, color: battery.balancing ? amber : 'var(--text-dim)' },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border-color)',
              borderTop: `2px solid ${color}`,
              borderRadius: 4,
              padding: '6px 8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: 4, fontWeight: 700 }}>
              {label}
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 14, color }}>
              {value ? 'ON' : 'OFF'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
