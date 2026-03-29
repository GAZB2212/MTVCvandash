import { InverterData, BatteryData } from '../../hooks/useLiveData';

interface Props {
  inverter: InverterData;
  battery: BatteryData;
}

/* ── SVG Icons ── */
function BatteryIcon({ size, soc, color }: { size: number; soc: number; color: string }) {
  const bw = size * 0.48, bh = size * 0.72;
  const bx = (size - bw) / 2, by = (size - bh) / 2 + size * 0.04;
  const fillH = Math.max(0, (bh - 5) * (soc / 100));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <rect x={bx + bw * 0.28} y={by - size * 0.07} width={bw * 0.44} height={size * 0.09} rx={2} fill={color} opacity={0.7} />
      <rect x={bx} y={by} width={bw} height={bh} rx={4} stroke={color} strokeWidth={1.5} />
      <rect x={bx + 2.5} y={by + bh - 2.5 - fillH} width={bw - 5} height={fillH} rx={2} fill={color} opacity={0.85} />
    </svg>
  );
}

function BoltIcon({ size, color }: { size: number; color: string }) {
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <polygon
        points={`${c * 1.25},${c * 0.14} ${c * 0.52},${c * 1.08} ${c * 0.96},${c * 1.08} ${c * 0.74},${c * 1.86} ${c * 1.48},${c * 0.92} ${c * 1.04},${c * 0.92}`}
        fill={color} opacity={0.9}
      />
    </svg>
  );
}

function PlugIcon({ size, color }: { size: number; color: string }) {
  const u = size / 24;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x={9.5} y={2} width={5} height={7} rx={1.5} fill={color} opacity={0.85} />
      <rect x={6.5} y={9} width={11} height={7} rx={3} stroke={color} strokeWidth={1.6} />
      <line x1={12} y1={16} x2={12} y2={22} stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <circle cx={9} cy={5.5} r={1.4} fill={color} opacity={0.5} />
      <circle cx={15} cy={5.5} r={1.4} fill={color} opacity={0.5} />
    </svg>
  );
}

/* ── Flow connector with animated dashes ── */
interface ConnectorProps {
  active: boolean;
  color: string;
  label: string;
  sublabel: string;
  animSpeed: number; /* seconds per cycle, 0 = no anim */
}

function FlowConnector({ active, color, label, sublabel, animSpeed }: ConnectorProps) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', minWidth: 0 }}>
      {/* Label above */}
      <div style={{ textAlign: 'center', marginBottom: 6, lineHeight: 1.2 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: active ? color : 'var(--label3)', fontVariantNumeric: 'tabular-nums', transition: 'color 0.4s' }}>
          {label}
        </div>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--label3)', marginTop: 2 }}>
          {sublabel}
        </div>
      </div>

      {/* Animated line — viewBox 0 0 100 20, preserveAspectRatio none so it stretches to fill width */}
      <div style={{ width: '100%', height: 20 }}>
        <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" overflow="visible">
          {/* Base track */}
          <line x1="2" y1="10" x2="94" y2="10"
            stroke="rgba(255,255,255,0.08)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          {/* Animated flow dashes */}
          {active && animSpeed > 0 && (
            <line
              x1="2" y1="10" x2="94" y2="10"
              stroke={color} strokeWidth="2.5" strokeLinecap="round"
              strokeDasharray="9 7"
              vectorEffect="non-scaling-stroke"
              style={{ animation: `flow-right ${animSpeed}s linear infinite`, opacity: 0.9 }}
            />
          )}
          {!active && (
            <line x1="2" y1="10" x2="94" y2="10"
              stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" strokeDasharray="4 8"
              vectorEffect="non-scaling-stroke" />
          )}
          {/* Arrowhead */}
          <polygon
            points="100,10 91,6 91,14"
            fill={active ? color : 'rgba(255,255,255,0.15)'}
            style={{ transition: 'fill 0.4s' }}
          />
        </svg>
      </div>
    </div>
  );
}

/* ── Flow node card ── */
interface NodeProps {
  accent: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  rows: { label: string; value: string; color?: string }[];
  active?: boolean;
}

function FlowNode({ accent, icon, title, subtitle, rows, active = true }: NodeProps) {
  return (
    <div className="card" style={{
      width: 190, flexShrink: 0, padding: '16px 14px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
      border: `1px solid ${active ? `color-mix(in srgb, ${accent} 30%, rgba(255,255,255,0.08))` : 'rgba(255,255,255,0.07)'}`,
      boxShadow: active ? `0 0 28px color-mix(in srgb, ${accent} 10%, transparent), 0 2px 16px rgba(0,0,0,0.3)` : '0 2px 12px rgba(0,0,0,0.25)',
      transition: 'border-color 0.4s, box-shadow 0.4s',
    }}>
      {/* Icon */}
      <div style={{
        width: 52, height: 52, borderRadius: 14,
        background: active ? `color-mix(in srgb, ${accent} 15%, rgba(255,255,255,0.04))` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? `color-mix(in srgb, ${accent} 22%, rgba(255,255,255,0.08))` : 'rgba(255,255,255,0.07)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.4s, border-color 0.4s',
      }}>
        {icon}
      </div>

      {/* Title */}
      <div style={{ textAlign: 'center', lineHeight: 1.2 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: active ? 'var(--label)' : 'var(--label3)', letterSpacing: '0.01em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 10, color: 'var(--label3)', marginTop: 2 }}>{subtitle}</div>}
      </div>

      {/* Divider */}
      <div style={{ width: '100%', height: 1, background: 'var(--sep)' }} />

      {/* Data rows */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--label3)' }}>{r.label}</span>
            <span style={{ fontSize: 11, fontWeight: 600, color: r.color || 'var(--label)', fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InverterTab({ inverter, battery }: Props) {
  const isOn = inverter.isOn;
  const socC = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const loadC = inverter.loadPct > 80 ? 'var(--sys-red)' : inverter.loadPct > 60 ? 'var(--sys-orange)' : 'var(--label)';
  const tempC = inverter.temp > 55 ? 'var(--sys-red)' : inverter.temp > 40 ? 'var(--sys-orange)' : 'var(--sys-green)';

  /* Animation speed: faster at higher load. 0.5s at 5kW, 1.4s at idle */
  const flowSpeed = isOn && inverter.outputKw > 0.05
    ? Math.max(0.45, 1.4 - inverter.outputKw * 0.18)
    : 0;

  const dcPower = inverter.dcVoltage * inverter.dcCurrent;

  return (
    <>
      {/* Inline keyframes for flow animation */}
      <style>{`
        @keyframes flow-right {
          from { stroke-dashoffset: 16; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', height: '100%', gap: 0, padding: '0 4px' }}>

        {/* ── Battery Node ── */}
        <FlowNode
          accent="var(--sys-blue)"
          active={true}
          title="Battery Pack"
          subtitle="Fogstar Drift 48V 125Ah"
          icon={<BatteryIcon size={32} soc={battery.soc} color="var(--sys-blue)" />}
          rows={[
            { label: 'Voltage',  value: `${battery.voltage.toFixed(1)} V`,            color: 'var(--sys-blue)' },
            { label: 'SOC',      value: `${battery.soc}%`,                            color: socC },
            { label: 'Current',  value: `${Math.abs(battery.current).toFixed(1)} A`,  color: 'var(--label)' },
            { label: 'Remaining', value: `${(battery.remaining / 1000).toFixed(1)} Ah`, color: 'var(--label2)' },
          ]}
        />

        {/* ── DC Connector ── */}
        <FlowConnector
          active={true}
          color="var(--sys-blue)"
          label={`${dcPower > 0 ? dcPower.toFixed(0) : '—'} W`}
          sublabel="DC"
          animSpeed={flowSpeed}
        />

        {/* ── Inverter Node ── */}
        <FlowNode
          accent={isOn ? 'var(--brand)' : 'var(--label3)'}
          active={isOn}
          title="Multiplus 2"
          subtitle="48/5000/70-50"
          icon={<BoltIcon size={28} color={isOn ? 'var(--brand)' : 'var(--label3)'} />}
          rows={[
            { label: 'Mode',   value: inverter.mode,                                   color: isOn ? 'var(--brand)' : 'var(--label3)' },
            { label: 'Temp',   value: inverter.temp > 0 ? `${inverter.temp.toFixed(0)}°C` : '—', color: tempC },
            { label: 'Status', value: inverter.connected ? 'Online' : 'Offline',       color: inverter.connected ? 'var(--sys-green)' : 'var(--sys-red)' },
          ]}
        />

        {/* ── AC Connector ── */}
        <FlowConnector
          active={isOn}
          color="var(--brand)"
          label={isOn ? `${inverter.outputKw.toFixed(2)} kW` : '—'}
          sublabel="AC 230V"
          animSpeed={flowSpeed}
        />

        {/* ── AC Load Node ── */}
        <FlowNode
          accent={isOn ? 'var(--brand)' : 'var(--label3)'}
          active={isOn}
          title="AC Loads"
          subtitle="Van systems"
          icon={<PlugIcon size={30} color={isOn ? 'var(--brand)' : 'var(--label3)'} />}
          rows={[
            { label: 'Voltage',  value: isOn ? `${inverter.acVoltage.toFixed(0)} V`  : '—', color: isOn ? 'var(--label)' : 'var(--label3)' },
            { label: 'Frequency', value: isOn ? `${inverter.acHz.toFixed(1)} Hz`     : '—', color: isOn ? 'var(--label)' : 'var(--label3)' },
            { label: 'Power',    value: isOn ? `${inverter.outputKw.toFixed(2)} kW`  : '—', color: isOn ? 'var(--brand)' : 'var(--label3)' },
            { label: 'Load',     value: isOn ? `${inverter.loadPct}%`                : '—', color: isOn ? loadC          : 'var(--label3)' },
          ]}
        />

      </div>
    </>
  );
}
