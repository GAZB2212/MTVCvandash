import { InverterData, BatteryData } from '../../hooks/useLiveData';

interface Props {
  inverter: InverterData;
  battery: BatteryData;
}

/* ───────────────── Icons ───────────────── */
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

function ShoreIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x={3} y={4} width={18} height={16} rx={3} stroke={color} strokeWidth={1.6} />
      <rect x={7} y={9.5} width={2.2} height={5} rx={1.1} fill={color} opacity={0.8} />
      <rect x={14.8} y={9.5} width={2.2} height={5} rx={1.1} fill={color} opacity={0.8} />
      <path d="M8 16.5 Q9.5 15 11 16.5 Q12.5 18 14 16.5 Q15.5 15 17 16.5"
        stroke={color} strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
    </svg>
  );
}

/* ───────────────── Shared glow defs (injected once) ───────────────── */
const GLOW_DEFS = `
  <defs>
    <filter id="fg" x="-200%" y="-200%" width="500%" height="500%">
      <feGaussianBlur stdDeviation="1.2" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
`;

/* ───────────────── Horizontal flow connector ───────────────── */
interface HConnProps {
  active: boolean;
  color: string;
  label: string;
  sublabel: string;
  animSpeed: number;
  pathId: string;
  reverse?: boolean;
}

function HConn({ active, color, label, sublabel, animSpeed, pathId, reverse }: HConnProps) {
  const t = (animSpeed / 3).toFixed(2);
  const t2 = ((animSpeed / 3) * 2).toFixed(2);
  const path = reverse ? `M 97 12 H 3` : `M 3 12 H 97`;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>
      <div style={{ textAlign: 'center', marginBottom: 5, lineHeight: 1.2 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: active ? color : 'var(--label3)', fontVariantNumeric: 'tabular-nums', transition: 'color 0.4s' }}>{label}</div>
        <div style={{ fontSize: 10, color: 'var(--label3)', marginTop: 1 }}>{sublabel}</div>
      </div>
      <div style={{ width: '100%', height: 20 }}>
        <svg width="100%" height="20" viewBox="0 0 100 20" preserveAspectRatio="none" overflow="visible">
          <defs>
            <path id={pathId} d={path} />
          </defs>
          <line x1="3" y1="10" x2="97" y2="10"
            stroke={active ? color : 'rgba(255,255,255,0.09)'}
            strokeWidth={active ? 2 : 1.5} strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={active ? 0.35 : 1}
            style={{ transition: 'stroke 0.4s' }}
          />
          {!reverse
            ? <polygon points="100,10 91,5.5 91,14.5" fill={active ? color : 'rgba(255,255,255,0.10)'} opacity={active ? 0.75 : 1} />
            : <polygon points="0,10 9,5.5 9,14.5"    fill={active ? color : 'rgba(255,255,255,0.10)'} opacity={active ? 0.75 : 1} />
          }
          {active && animSpeed > 0 && (<>
            <ellipse rx="5" ry="2" fill={color} opacity="0.7">
              <animateMotion dur={`${animSpeed}s`} repeatCount="indefinite" rotate="none"><mpath href={`#${pathId}`} /></animateMotion>
            </ellipse>
            <ellipse rx="5" ry="2" fill={color} opacity="0.7">
              <animateMotion dur={`${animSpeed}s`} begin={`-${t}s`} repeatCount="indefinite" rotate="none"><mpath href={`#${pathId}`} /></animateMotion>
            </ellipse>
            <ellipse rx="5" ry="2" fill={color} opacity="0.7">
              <animateMotion dur={`${animSpeed}s`} begin={`-${t2}s`} repeatCount="indefinite" rotate="none"><mpath href={`#${pathId}`} /></animateMotion>
            </ellipse>
          </>)}
        </svg>
      </div>
    </div>
  );
}

/* ───────────────── Vertical flow connector ───────────────── */
interface VConnProps {
  active: boolean;
  color: string;
  animSpeed: number;
  pathId: string;
  reverse?: boolean; /* reverse = bottom-to-top (inverting: bat→multi) */
}

function VConn({ active, color, animSpeed, pathId, reverse }: VConnProps) {
  const t = (animSpeed / 3).toFixed(2);
  const t2 = ((animSpeed / 3) * 2).toFixed(2);
  const path = reverse ? `M 12 34 V 2` : `M 12 2 V 34`;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="24" height="100%" viewBox="0 0 24 36" preserveAspectRatio="none" overflow="visible">
        <defs>
          <path id={pathId} d={path} />
        </defs>
        <line x1="12" y1="2" x2="12" y2="34"
          stroke={active ? color : 'rgba(255,255,255,0.09)'}
          strokeWidth={active ? 2 : 1.5} strokeLinecap="round"
          opacity={active ? 0.35 : 1}
          style={{ transition: 'stroke 0.4s' }}
        />
        {reverse
          ? <polygon points="12,0 7,9 17,9"    fill={active ? color : 'rgba(255,255,255,0.10)'} opacity={active ? 0.75 : 1} />
          : <polygon points="12,36 7,27 17,27" fill={active ? color : 'rgba(255,255,255,0.10)'} opacity={active ? 0.75 : 1} />
        }
        {active && animSpeed > 0 && (<>
          <ellipse rx="2" ry="5" fill={color} opacity="0.7">
            <animateMotion dur={`${animSpeed}s`} repeatCount="indefinite" rotate="none"><mpath href={`#${pathId}`} /></animateMotion>
          </ellipse>
          <ellipse rx="2" ry="5" fill={color} opacity="0.7">
            <animateMotion dur={`${animSpeed}s`} begin={`-${t}s`} repeatCount="indefinite" rotate="none"><mpath href={`#${pathId}`} /></animateMotion>
          </ellipse>
          <ellipse rx="2" ry="5" fill={color} opacity="0.7">
            <animateMotion dur={`${animSpeed}s`} begin={`-${t2}s`} repeatCount="indefinite" rotate="none"><mpath href={`#${pathId}`} /></animateMotion>
          </ellipse>
        </>)}
      </svg>
    </div>
  );
}

/* ───────────────── Node card ───────────────── */
interface NodeProps {
  accent: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  primary?: string;         /* big headline value */
  primaryColor?: string;
  rows: { label: string; value: string; color?: string }[];
  active?: boolean;
  tall?: boolean;           /* spans full left column height */
}

function Node({ accent, icon, title, subtitle, primary, primaryColor, rows, active = true, tall }: NodeProps) {
  return (
    <div style={{
      width: '100%', height: '100%',
      padding: tall ? '16px 14px' : '12px 12px',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: tall ? 10 : 6,
      borderRadius: 'var(--r-card)', overflow: 'hidden',
      background: active
        ? `linear-gradient(145deg, color-mix(in srgb, ${accent} 12%, rgba(255,255,255,0.08)) 0%, rgba(255,255,255,0.03) 100%)`
        : 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)',
      border: `1px solid ${active ? `color-mix(in srgb, ${accent} 35%, rgba(255,255,255,0.08))` : 'rgba(255,255,255,0.08)'}`,
      borderTopColor: active ? `color-mix(in srgb, ${accent} 50%, rgba(255,255,255,0.12))` : 'rgba(255,255,255,0.13)',
      boxShadow: active
        ? `0 0 30px color-mix(in srgb, ${accent} 12%, transparent), inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.45)`
        : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 24px rgba(0,0,0,0.4)',
      transition: 'border-color 0.4s, box-shadow 0.4s, background 0.4s',
    }}>
      {/* Icon + title row */}
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{
          width: tall ? 36 : 30, height: tall ? 36 : 30, borderRadius: tall ? 10 : 8, flexShrink: 0,
          background: active ? `color-mix(in srgb, ${accent} 14%, rgba(255,255,255,0.04))` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${active ? `color-mix(in srgb, ${accent} 20%, rgba(255,255,255,0.07))` : 'rgba(255,255,255,0.06)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.4s',
        }}>
          {icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: active ? 'var(--label)' : 'var(--label3)', letterSpacing: '0.01em', lineHeight: 1.2 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 10, color: 'var(--label3)', marginTop: 1, lineHeight: 1.2 }}>{subtitle}</div>}
        </div>
      </div>

      {/* Primary headline */}
      {primary !== undefined && (
        <div style={{
          fontSize: tall ? 28 : 22, fontWeight: 200,
          color: primaryColor || 'var(--label)',
          letterSpacing: '-0.02em', lineHeight: 1, flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
          textShadow: active ? `0 0 20px color-mix(in srgb, ${primaryColor || accent} 40%, transparent)` : 'none',
          transition: 'color 0.4s, text-shadow 0.4s',
        }}>
          {primary}
        </div>
      )}

      <div style={{ width: '100%', height: 1, background: 'var(--sep)', flexShrink: 0 }} />

      {/* Data rows */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5, flex: 1, justifyContent: 'center' }}>
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

/* ───────────────── Shore mode detection ───────────────── */
const SHORE_MODES = new Set(['Bulk', 'Absorption', 'Float', 'Storage', 'Equalize', 'Passthrough', 'Charger Only']);

/* ───────────────── Main component ───────────────── */
export function InverterTab({ inverter, battery }: Props) {
  const isOn          = inverter.isOn;
  const shoreConn     = SHORE_MODES.has(inverter.mode);
  const isCharging    = shoreConn && battery.current < 0;
  const batToMulti    = !shoreConn;          // true = inverting (bat→multi), false = charging (multi→bat)

  /* Power calcs */
  const batKw         = inverter.dcVoltage * Math.abs(inverter.dcCurrent) / 1000;
  const chargeKw      = isCharging ? Math.abs(battery.current) * battery.voltage / 1000 : 0;
  const shoreKw       = shoreConn ? (inverter.outputKw + chargeKw) : 0;
  const dcLoadAmps    = Math.max(0, battery.current - (batToMulti ? inverter.dcCurrent : 0));
  const dcLoadWatts   = dcLoadAmps * battery.voltage;
  const dcActive      = dcLoadAmps > 0.5;

  /* Colour helpers */
  const socC   = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const loadC  = inverter.loadPct > 80 ? 'var(--sys-red)' : inverter.loadPct > 60 ? 'var(--sys-orange)' : 'var(--label)';
  const tempC  = inverter.temp > 55 ? 'var(--sys-red)' : inverter.temp > 40 ? 'var(--sys-orange)' : 'var(--sys-green)';
  const hubCol = shoreConn ? 'var(--sys-orange)' : isOn ? 'var(--brand)' : 'var(--label3)';
  const batDir = batToMulti ? 'var(--sys-blue)' : 'var(--sys-orange)';

  /* Animation speeds */
  const spd = (kw: number) => kw > 0.05 ? Math.max(0.5, 1.5 - kw * 0.18) : 0;
  const shoreSpd  = shoreConn ? spd(shoreKw) : 0;
  const batSpd    = (isOn || shoreConn || dcActive) ? spd(batKw || 0.5) : 0;
  const invSpd    = isOn ? spd(inverter.outputKw) : 0;
  const dcSpd     = dcActive ? spd(dcLoadWatts / 1000) : 0;

  /* Time remaining string */
  const remH = Math.floor(battery.remaining / 1000 / 3600);
  const remM = Math.floor((battery.remaining / 1000 % 3600) / 60);
  const remStr = battery.remaining > 0 ? `${remH}h ${remM}m` : '—';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '155px 1fr 200px 1fr 155px',
      gridTemplateRows: '1fr 38px 1fr',
      gap: '8px',
      height: '100%',
      padding: '0 4px',
    }}>

      {/* ── Shore Power — full left column ── */}
      <div style={{ gridColumn: 1, gridRow: '1 / span 3' }}>
        <Node
          tall
          accent="var(--sys-orange)"
          active={shoreConn}
          icon={<ShoreIcon size={22} color={shoreConn ? 'var(--sys-orange)' : 'var(--label3)'} />}
          title="Shore Power"
          subtitle="AC Mains Input"
          primary={shoreConn ? `${shoreKw.toFixed(1)} kW` : 'Off'}
          primaryColor={shoreConn ? 'var(--sys-orange)' : 'var(--label3)'}
          rows={shoreConn
            ? [
                { label: 'Voltage', value: `${inverter.acVoltage.toFixed(0)} V`,  color: 'var(--sys-orange)' },
                { label: 'Freq',    value: `${inverter.acHz.toFixed(1)} Hz` },
                { label: 'Status',  value: 'Connected',    color: 'var(--sys-green)' },
              ]
            : [
                { label: 'Status',  value: 'Disconnected', color: 'var(--label3)' },
                { label: 'Voltage', value: '—',            color: 'var(--label3)' },
                { label: 'Freq',    value: '—',            color: 'var(--label3)' },
              ]
          }
        />
      </div>

      {/* ── Shore → Multiplus connector ── */}
      <div style={{ gridColumn: 2, gridRow: 1, display: 'flex', alignItems: 'center' }}>
        <HConn
          active={shoreConn}
          color="var(--sys-orange)"
          label={shoreConn ? `${shoreKw.toFixed(2)} kW` : '—'}
          sublabel="AC Input"
          animSpeed={shoreSpd}
          pathId="shore-h"
        />
      </div>

      {/* ── Multiplus 2 — top-centre ── */}
      <div style={{ gridColumn: 3, gridRow: 1 }}>
        <Node
          accent={hubCol}
          active={isOn || shoreConn}
          icon={<BoltIcon size={18} color={(isOn || shoreConn) ? hubCol : 'var(--label3)'} />}
          title="Multiplus 2"
          subtitle="48/5000/70-50"
          primary={inverter.mode}
          primaryColor={hubCol}
          rows={shoreConn
            ? [
                { label: 'AC In',  value: `${inverter.acVoltage.toFixed(0)} V · ${inverter.acHz.toFixed(1)} Hz` },
                { label: 'Load',   value: isOn ? `${inverter.loadPct}%` : '—', color: isOn ? loadC : 'var(--label3)' },
                { label: 'Temp',   value: `${inverter.temp.toFixed(0)}°C`,     color: tempC },
              ]
            : [
                { label: 'AC Out', value: isOn ? `${inverter.acVoltage.toFixed(0)} V · ${inverter.acHz.toFixed(1)} Hz` : '—' },
                { label: 'Load',   value: isOn ? `${inverter.loadPct}%` : '—', color: isOn ? loadC : 'var(--label3)' },
                { label: 'Temp',   value: `${inverter.temp.toFixed(0)}°C`,     color: tempC },
              ]
          }
        />
      </div>

      {/* ── Multiplus → AC Loads connector ── */}
      <div style={{ gridColumn: 4, gridRow: 1, display: 'flex', alignItems: 'center' }}>
        <HConn
          active={isOn}
          color="var(--brand)"
          label={isOn ? `${inverter.outputKw.toFixed(2)} kW` : '—'}
          sublabel="AC Output"
          animSpeed={invSpd}
          pathId="ac-h"
        />
      </div>

      {/* ── AC Loads — top-right ── */}
      <div style={{ gridColumn: 5, gridRow: 1 }}>
        <Node
          accent={isOn ? 'var(--brand)' : 'var(--label3)'}
          active={isOn}
          icon={<PlugIcon size={18} color={isOn ? 'var(--brand)' : 'var(--label3)'} />}
          title="AC Loads"
          subtitle="Van systems"
          primary={isOn ? `${inverter.outputKw.toFixed(2)} kW` : '—'}
          primaryColor="var(--brand)"
          rows={[
            { label: 'Voltage', value: isOn ? `${inverter.acVoltage.toFixed(0)} V` : '—', color: isOn ? 'var(--label)' : 'var(--label3)' },
            { label: 'Load',    value: isOn ? `${inverter.loadPct}%`                : '—', color: isOn ? loadC          : 'var(--label3)' },
          ]}
        />
      </div>

      {/* ── Vertical connector: Multiplus ↔ Battery ── */}
      <div style={{ gridColumn: 3, gridRow: 2 }}>
        <VConn
          active={isOn || shoreConn || dcActive}
          color={batDir}
          animSpeed={batSpd}
          pathId="bat-v"
          reverse={batToMulti}
        />
      </div>

      {/* ── Battery — bottom-centre ── */}
      <div style={{ gridColumn: 3, gridRow: 3 }}>
        <Node
          accent="var(--sys-blue)"
          active={true}
          icon={<BatteryIcon size={18} soc={battery.soc} color="var(--sys-blue)" />}
          title="Battery Pack"
          subtitle="Fogstar 48V · 125Ah"
          primary={`${battery.soc}%`}
          primaryColor={socC}
          rows={[
            { label: batToMulti ? 'Discharging' : 'Charging', value: remStr,                             color: batToMulti ? 'var(--label2)' : 'var(--sys-orange)' },
            { label: 'Voltage',                               value: `${battery.voltage.toFixed(1)} V`,  color: 'var(--sys-blue)' },
            { label: 'Current',                               value: `${Math.abs(battery.current).toFixed(1)} A` },
          ]}
        />
      </div>

      {/* ── Battery → DC Loads connector ── */}
      <div style={{ gridColumn: 4, gridRow: 3, display: 'flex', alignItems: 'center' }}>
        <HConn
          active={dcActive}
          color="var(--sys-blue)"
          label={dcLoadWatts > 1 ? `${dcLoadWatts.toFixed(0)} W` : '—'}
          sublabel="DC Bus · 48V"
          animSpeed={dcSpd}
          pathId="dc-h"
        />
      </div>

      {/* ── DC Loads — bottom-right ── */}
      <div style={{ gridColumn: 5, gridRow: 3 }}>
        <Node
          accent={dcActive ? 'var(--sys-blue)' : 'var(--label3)'}
          active={dcActive}
          icon={<LightbulbIcon size={18} color={dcActive ? 'var(--sys-blue)' : 'var(--label3)'} />}
          title="DC Loads"
          subtitle="Lighting · Fans · Pi"
          primary={dcLoadWatts > 1 ? `${dcLoadWatts.toFixed(0)} W` : '—'}
          primaryColor="var(--sys-blue)"
          rows={[
            { label: 'Current', value: dcActive ? `${dcLoadAmps.toFixed(1)} A` : '—', color: 'var(--label)' },
            { label: 'Voltage', value: `${battery.voltage.toFixed(1)} V`,              color: 'var(--sys-blue)' },
          ]}
        />
      </div>

    </div>
  );
}
