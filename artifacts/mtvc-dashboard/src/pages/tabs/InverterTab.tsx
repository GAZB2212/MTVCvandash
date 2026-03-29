import { InverterData, BatteryData } from '../../hooks/useLiveData';

interface Props {
  inverter: InverterData;
  battery: BatteryData;
}

/* ── Icons ── */
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

function LightbulbIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 21h6M12 3a6 6 0 0 1 4.243 10.243C15.368 14.119 15 15.03 15 16v1H9v-1c0-.97-.368-1.881-1.243-2.757A6 6 0 0 1 12 3z"
        stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 17h6" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </svg>
  );
}

/* ── Flow connector — solid pipe with travelling bulges ── */
interface ConnectorProps {
  active: boolean;
  color: string;
  label: string;
  sublabel: string;
  animSpeed: number;
  pathId: string;
}

function FlowConnector({ active, color, label, sublabel, animSpeed, pathId }: ConnectorProps) {
  const half = animSpeed > 0 ? animSpeed / 2 : 0;
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
      <div style={{ textAlign: 'center', marginBottom: 6, lineHeight: 1.2 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: active ? color : 'var(--label3)', fontVariantNumeric: 'tabular-nums', transition: 'color 0.4s' }}>
          {label}
        </div>
        <div style={{ fontSize: 10, fontWeight: 500, color: 'var(--label3)', marginTop: 1 }}>
          {sublabel}
        </div>
      </div>

      <div style={{ width: '100%', height: 24 }}>
        <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none" overflow="visible">
          <defs>
            <path id={pathId} d="M 3 12 H 97" />
            <filter id={`glow-${pathId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Solid base pipe */}
          <line x1="3" y1="12" x2="97" y2="12"
            stroke={active ? color : 'rgba(255,255,255,0.10)'}
            strokeWidth={active ? 2.5 : 1.5}
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={active ? 0.30 : 1}
            style={{ transition: 'stroke 0.4s, opacity 0.4s' }}
          />

          {/* Arrowhead */}
          <polygon points="100,12 91,7 91,17"
            fill={active ? color : 'rgba(255,255,255,0.12)'}
            opacity={active ? 0.8 : 1}
            style={{ transition: 'fill 0.4s' }}
          />

          {/* Two staggered oval bulges */}
          {active && animSpeed > 0 && (<>
            <ellipse rx="10" ry="5" fill={color} opacity="0.95" filter={`url(#glow-${pathId})`}>
              <animateMotion dur={`${animSpeed}s`} repeatCount="indefinite" rotate="none">
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </ellipse>
            <ellipse rx="10" ry="5" fill={color} opacity="0.95" filter={`url(#glow-${pathId})`}>
              <animateMotion dur={`${animSpeed}s`} begin={`-${half}s`} repeatCount="indefinite" rotate="none">
                <mpath href={`#${pathId}`} />
              </animateMotion>
            </ellipse>
          </>)}
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
  nodeWidth: number;
  compact?: boolean;
}

function FlowNode({ accent, icon, title, subtitle, rows, active = true, nodeWidth, compact }: NodeProps) {
  const pad = compact ? '12px 12px' : '16px 14px';
  const iconSize = compact ? 42 : 52;
  const iconR = compact ? 11 : 14;
  const fontSize = compact ? 11 : 12;
  const titleSize = compact ? 11 : 12;
  return (
    <div className="card" style={{
      width: nodeWidth, flexShrink: 0, height: '100%',
      padding: pad, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: compact ? 7 : 10,
      border: `1px solid ${active ? `color-mix(in srgb, ${accent} 30%, rgba(255,255,255,0.08))` : 'rgba(255,255,255,0.07)'}`,
      boxShadow: active ? `0 0 28px color-mix(in srgb, ${accent} 10%, transparent), 0 2px 16px rgba(0,0,0,0.3)` : '0 2px 12px rgba(0,0,0,0.25)',
      transition: 'border-color 0.4s, box-shadow 0.4s',
    }}>
      <div style={{
        width: iconSize, height: iconSize, borderRadius: iconR,
        background: active ? `color-mix(in srgb, ${accent} 15%, rgba(255,255,255,0.04))` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? `color-mix(in srgb, ${accent} 22%, rgba(255,255,255,0.08))` : 'rgba(255,255,255,0.07)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.4s, border-color 0.4s', flexShrink: 0,
      }}>
        {icon}
      </div>

      <div style={{ textAlign: 'center', lineHeight: 1.2, flexShrink: 0 }}>
        <div style={{ fontSize: titleSize, fontWeight: 700, color: active ? 'var(--label)' : 'var(--label3)', letterSpacing: '0.01em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 10, color: 'var(--label3)', marginTop: 2 }}>{subtitle}</div>}
      </div>

      <div style={{ width: '100%', height: 1, background: 'var(--sep)', flexShrink: 0 }} />

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: compact ? 5 : 7, flex: 1, justifyContent: 'center' }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize, fontWeight: 500, color: 'var(--label3)' }}>{r.label}</span>
            <span style={{ fontSize, fontWeight: 600, color: r.color || 'var(--label)', fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function InverterTab({ inverter, battery }: Props) {
  const isOn    = inverter.isOn;
  const socC    = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const loadC   = inverter.loadPct > 80 ? 'var(--sys-red)' : inverter.loadPct > 60 ? 'var(--sys-orange)' : 'var(--label)';
  const tempC   = inverter.temp > 55 ? 'var(--sys-red)' : inverter.temp > 40 ? 'var(--sys-orange)' : 'var(--sys-green)';

  /* DC load = total battery discharge minus inverter's own DC draw */
  const dcLoadAmps  = Math.max(0, battery.current - inverter.dcCurrent);
  const dcLoadWatts = dcLoadAmps * battery.voltage;
  const dcActive    = dcLoadAmps > 0.5;

  /* Animation speeds: faster = more power */
  const speed = (kw: number) => kw > 0.05 ? Math.max(0.45, 1.4 - kw * 0.18) : 0;
  const invSpeed    = isOn ? speed(inverter.outputKw) : 0;
  const dcLoadSpeed = dcActive ? speed(dcLoadWatts / 1000) : 0;
  const dcBatSpeed  = isOn ? speed(inverter.dcVoltage * inverter.dcCurrent / 1000) : (dcLoadSpeed || 0.9);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '190px 1fr',
      gridTemplateRows: '1fr 1fr',
      height: '100%',
      gap: 8,
      padding: '0 4px',
    }}>

      {/* ── Battery — spans both rows ── */}
      <div style={{ gridColumn: 1, gridRow: '1 / span 2', display: 'flex' }}>
        <FlowNode
          nodeWidth={190}
          accent="var(--sys-blue)"
          active={true}
          title="Battery Pack"
          subtitle="Fogstar Drift 48V · 125Ah"
          icon={<BatteryIcon size={32} soc={battery.soc} color="var(--sys-blue)" />}
          rows={[
            { label: 'Voltage',   value: `${battery.voltage.toFixed(1)} V`,             color: 'var(--sys-blue)' },
            { label: 'SOC',       value: `${battery.soc}%`,                             color: socC },
            { label: 'Current',   value: `${Math.abs(battery.current).toFixed(1)} A`,   color: 'var(--label)' },
            { label: 'Remaining', value: `${(battery.remaining / 1000).toFixed(1)} Ah`, color: 'var(--label2)' },
          ]}
        />
      </div>

      {/* ── Row 1: Battery → DC Loads ── */}
      <div style={{ gridColumn: 2, gridRow: 1, display: 'flex', alignItems: 'center' }}>
        <FlowConnector
          active={dcActive}
          color="var(--sys-blue)"
          label={dcLoadWatts > 1 ? `${dcLoadWatts.toFixed(0)} W` : '—'}
          sublabel="DC Direct"
          animSpeed={dcLoadSpeed}
          pathId="dc-load-flow"
        />
        <FlowNode
          nodeWidth={190}
          compact
          accent="var(--sys-blue)"
          active={dcActive}
          title="DC Loads"
          subtitle="Lighting · Fans · Pi"
          icon={<LightbulbIcon size={24} color={dcActive ? 'var(--sys-blue)' : 'var(--label3)'} />}
          rows={[
            { label: 'Power',   value: dcLoadWatts > 1 ? `${dcLoadWatts.toFixed(0)} W`   : '—', color: dcActive ? 'var(--sys-blue)' : 'var(--label3)' },
            { label: 'Current', value: dcActive        ? `${dcLoadAmps.toFixed(1)} A`     : '—', color: 'var(--label)' },
            { label: 'Voltage', value: `${battery.voltage.toFixed(1)} V`,                        color: 'var(--label2)' },
          ]}
        />
      </div>

      {/* ── Row 2: Battery → Inverter → AC Loads ── */}
      <div style={{ gridColumn: 2, gridRow: 2, display: 'flex', alignItems: 'center' }}>
        <FlowConnector
          active={isOn || dcActive}
          color="var(--sys-blue)"
          label={`${(inverter.dcVoltage * inverter.dcCurrent).toFixed(0)} W`}
          sublabel="DC"
          animSpeed={dcBatSpeed}
          pathId="dc-inv-flow"
        />
        <FlowNode
          nodeWidth={158}
          compact
          accent={isOn ? 'var(--brand)' : 'var(--label3)'}
          active={isOn}
          title="Multiplus 2"
          subtitle="48/5000/70-50"
          icon={<BoltIcon size={22} color={isOn ? 'var(--brand)' : 'var(--label3)'} />}
          rows={[
            { label: 'Mode', value: inverter.mode,                                                     color: isOn ? 'var(--brand)' : 'var(--label3)' },
            { label: 'Temp', value: inverter.temp > 0 ? `${inverter.temp.toFixed(0)}°C` : '—',        color: tempC },
            { label: 'Status', value: inverter.connected ? 'Online' : 'Offline',                      color: inverter.connected ? 'var(--sys-green)' : 'var(--sys-red)' },
          ]}
        />
        <FlowConnector
          active={isOn}
          color="var(--brand)"
          label={isOn ? `${inverter.outputKw.toFixed(2)} kW` : '—'}
          sublabel="AC 230V"
          animSpeed={invSpeed}
          pathId="ac-flow"
        />
        <FlowNode
          nodeWidth={158}
          compact
          accent={isOn ? 'var(--brand)' : 'var(--label3)'}
          active={isOn}
          title="AC Loads"
          subtitle="Van systems"
          icon={<PlugIcon size={22} color={isOn ? 'var(--brand)' : 'var(--label3)'} />}
          rows={[
            { label: 'Voltage', value: isOn ? `${inverter.acVoltage.toFixed(0)} V`  : '—', color: isOn ? 'var(--label)' : 'var(--label3)' },
            { label: 'Power',   value: isOn ? `${inverter.outputKw.toFixed(2)} kW`  : '—', color: isOn ? 'var(--brand)' : 'var(--label3)' },
            { label: 'Load',    value: isOn ? `${inverter.loadPct}%`                : '—', color: isOn ? loadC          : 'var(--label3)' },
          ]}
        />
      </div>

    </div>
  );
}
