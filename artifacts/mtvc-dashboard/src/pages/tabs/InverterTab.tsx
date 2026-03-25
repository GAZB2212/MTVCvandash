import { Card } from '../../components/Card';
import { HBar } from '../../components/HBar';
import { StatRow } from '../../components/StatRow';
import { ConnDot } from '../../components/ConnDot';
import { InverterData } from '../../hooks/useLiveData';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  inverter: InverterData;
}

export function InverterTab({ inverter }: Props) {
  const { isDark } = useTheme();
  const amber = isDark ? '#6DC82B' : '#4A8A18';
  const blue = isDark ? '#38BDF8' : '#0369A1';
  const green = isDark ? '#22C55E' : '#15803D';
  const red = isDark ? '#EF4444' : '#B91C1C';

  const tempColor = inverter.temp < 45 ? green : inverter.temp < 60 ? amber : red;
  const modeColor = inverter.mode === 'Inverting' ? amber : green;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {/* Top row: AC Output + DC Input */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {/* AC Output Card */}
        <Card accent={amber}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 6, fontWeight: 700 }}>
            AC OUTPUT
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 28, color: amber, lineHeight: 1, marginBottom: 6 }}>
            {inverter.acVoltage.toFixed(1)}<span style={{ fontSize: 14, marginLeft: 3 }}>V</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4 }}>Load</div>
          <HBar pct={inverter.loadPct} color={amber} />
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: amber, marginTop: 4 }}>
            {inverter.loadPct}%
          </div>
        </Card>

        {/* DC Input Card */}
        <Card accent={blue}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 6, fontWeight: 700 }}>
            DC INPUT
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 28, color: blue, lineHeight: 1, marginBottom: 6 }}>
            {inverter.dcVoltage.toFixed(1)}<span style={{ fontSize: 14, marginLeft: 3 }}>V</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 4 }}>Current</div>
          <HBar pct={Math.min(100, (inverter.dcCurrent / 60) * 100)} color={blue} />
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: blue, marginTop: 4 }}>
            {inverter.dcCurrent.toFixed(1)} A
          </div>
        </Card>
      </div>

      {/* System Data */}
      <Card accent={amber} title="SYSTEM DATA">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          <StatRow label="Output Power" value={`${inverter.outputKw.toFixed(2)} kW`} />
          <StatRow label="Frequency" value={`${inverter.acHz.toFixed(1)} Hz`} />
          <StatRow label="DC Current" value={`${inverter.dcCurrent.toFixed(1)} A`} />
          <StatRow label="Temperature" value={`${inverter.temp}°C`} valueColor={tempColor} accent />
        </div>
      </Card>

      {/* VE.Bus Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          background: 'var(--surface)',
          borderTop: `1px solid ${amber}`,
          borderRadius: 4,
          border: `1px solid var(--border-color)`,
          borderTopColor: amber,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <ConnDot connected={inverter.connected} />
          <span style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', fontWeight: 700 }}>
            VE.BUS STATUS
          </span>
        </div>
        <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: modeColor }}>
          {inverter.mode}
        </span>
      </div>
    </div>
  );
}
