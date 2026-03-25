import { Card } from '../../components/Card';
import { ArcGauge } from '../../components/ArcGauge';
import { StatRow } from '../../components/StatRow';
import { BatteryData } from '../../hooks/useLiveData';
import { useTheme } from '../../context/ThemeContext';

interface Props { battery: BatteryData }

function getCellColor(v: number, isDark: boolean) {
  const green = isDark ? '#34D399' : '#059669';
  const amber = isDark ? '#FBB040' : '#D97706';
  const red   = isDark ? '#F87171' : '#DC2626';
  return v >= 3.25 ? green : v >= 3.20 ? amber : red;
}

export function BatteryTab({ battery }: Props) {
  const { isDark } = useTheme();
  const brand = isDark ? '#6DC82B' : '#4A8A18';
  const blue  = isDark ? '#38BDF8' : '#0284C7';
  const green = isDark ? '#34D399' : '#059669';
  const red   = isDark ? '#F87171' : '#DC2626';
  const amber = isDark ? '#FBB040' : '#D97706';

  const socColor = battery.soc > 60 ? green : battery.soc > 30 ? amber : red;
  const remainAh = (battery.remaining / 1000).toFixed(1);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {/* Gauge card */}
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px' }}>
          <ArcGauge value={battery.soc} max={100} size={120} color={socColor} strokeWidth={9}>
            <div style={{ textAlign: 'center' }}>
              <div className="mono" style={{ fontSize: 28, color: socColor, lineHeight: 1 }}>{battery.soc}</div>
              <div className="label-caps" style={{ marginTop: 2 }}>SOC %</div>
            </div>
          </ArcGauge>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-hi)' }}>Fogstar Drift 48V</div>
            <div style={{ fontSize: 10, color: 'var(--text-lo)', marginTop: 1 }}>125Ah LiFePO₄</div>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Card title="Pack">
            <StatRow label="Voltage"   value={`${battery.voltage.toFixed(1)} V`} valueColor={blue} />
            <StatRow label="Current"   value={`${battery.current.toFixed(1)} A`} />
            <StatRow label="Remaining" value={`${remainAh} Ah`} valueColor={green} />
            <StatRow label="Cycles"    value={`${battery.cycles}`} />
          </Card>
          <Card title="Cells">
            <StatRow label="Min Cell" value={`${battery.cellMin.toFixed(3)} V`} valueColor={green} />
            <StatRow label="Max Cell" value={`${battery.cellMax.toFixed(3)} V`} />
            <StatRow label="Delta"    value={`${battery.delta} mV`} valueColor={battery.delta > 10 ? red : battery.delta > 5 ? amber : green} />
            <StatRow label="Temp"     value={`${battery.temp}°C`} />
          </Card>
        </div>
      </div>

      {/* Cell voltage grid */}
      <Card title="Cell Voltages — 16S">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 4 }}>
          {battery.cells.map((v, i) => {
            const cellColor = getCellColor(v, isDark);
            const pct = ((v - 3.0) / (3.65 - 3.0)) * 100;
            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: 'rgba(255,255,255,0.03)', borderRadius: 8,
                padding: '5px 2px 4px', border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <div className="label-caps" style={{ fontSize: 8, marginBottom: 2 }}>C{i + 1}</div>
                <div className="mono" style={{ fontSize: 9, color: cellColor }}>{v.toFixed(3)}</div>
                <div style={{ width: '80%', height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, marginTop: 3 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: cellColor, borderRadius: 2 }} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* MOS tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { label: 'Charge MOS',    val: battery.chargeMos,    color: battery.chargeMos ? green : red },
          { label: 'Discharge MOS', val: battery.dischargeMos, color: battery.dischargeMos ? green : red },
          { label: 'Balancing',     val: battery.balancing,    color: battery.balancing ? amber : 'var(--text-lo)' },
        ].map(({ label, val, color }) => (
          <div key={label} className="glass-card-mid" style={{ padding: '8px 10px', textAlign: 'center', borderTop: `2px solid ${color}` }}>
            <div className="label-caps" style={{ marginBottom: 5 }}>{label}</div>
            <div className="mono" style={{ fontSize: 15, color, fontWeight: 600 }}>{val ? 'ON' : 'OFF'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
