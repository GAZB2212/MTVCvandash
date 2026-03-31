import { InverterData, BatteryData } from '../../hooks/useLiveData';

interface Props {
  inverter: InverterData;
  battery: BatteryData;
}

/* ═══════════════════════ Icons ═══════════════════════ */
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
function BoltIcon({ size, color }: { size: number; color: string }) {
  const c = size / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
      <polygon
        points={`${c*1.25},${c*0.14} ${c*0.52},${c*1.08} ${c*0.96},${c*1.08} ${c*0.74},${c*1.86} ${c*1.48},${c*0.92} ${c*1.04},${c*0.92}`}
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

/* ═══════════════════════ Sine-wave paths ═══════════════════════
   Horizontal: viewBox 0 0 400 28, 2 full cycles (each 200px wide)
   Vertical:   viewBox 0 0 28 400, 2 full cycles (each 200px tall)
   Quadratic-bezier sine approx: control point at mid-segment, peak/trough ±8 from centre.
══════════════════════════════════════════════════════════════════ */
const SINE_H = 'M 0,14 Q 50,6 100,14 Q 150,22 200,14 Q 250,6 300,14 Q 350,22 400,14';
const SINE_V = 'M 14,0 Q 6,50 14,100 Q 22,150 14,200 Q 6,250 14,300 Q 22,350 14,400';

/* ═══════════════════════ Horizontal connector ═══════════════════════ */
interface HConnProps {
  active: boolean;
  color: string;
  label: string;
  sublabel: string;
  animSpeed: number;  /* 0 = off, 4–9 = kw-proportional  */
  id: string;
  reverse?: boolean;
}

function HConn({ active, color, label, sublabel, animSpeed, id, reverse }: HConnProps) {
  /* animSpeed 4→9 maps to wave period 0.55→1.1 s */
  const period = animSpeed > 0 ? `${(animSpeed * 0.13).toFixed(2)}s` : '0.8s';
  const waveAnim = active && animSpeed > 0
    ? `sine-h ${period} linear infinite ${reverse ? 'reverse' : 'normal'}`
    : 'none';
  const filterId = `hf-${id}`;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', minWidth: 0 }}>

      {/* Labels */}
      <div style={{ textAlign: 'center', marginBottom: 5, lineHeight: 1.2 }}>
        <div style={{ fontSize: 13, fontWeight: 600, fontVariantNumeric: 'tabular-nums',
                      color: active ? color : 'var(--label3)', transition: 'color 0.4s' }}>
          {label}
        </div>
        <div style={{ fontSize: 11, color: 'var(--label3)', marginTop: 1 }}>{sublabel}</div>
      </div>

      {/* Wave track */}
      <div style={{ width: '100%', height: 28, position: 'relative', overflow: 'hidden' }}>

        {/* Inactive — dim static dots */}
        {!active && (
          <svg width="100%" height="28" style={{ position: 'absolute', inset: 0 }}>
            <line x1="3" y1="14" x2="97%" y2="14"
              stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} strokeLinecap="round"
              strokeDasharray="3 8" />
          </svg>
        )}

        {/* Active — scrolling sine wave (3 layers) */}
        {active && (<>
          <svg width="100%" height="28" style={{ position: 'absolute', inset: 0 }}>
            <defs>
              <filter id={filterId} x="-20%" y="-200%" width="140%" height="500%">
                <feGaussianBlur stdDeviation="3" result="b" />
                <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
          </svg>
          {/* Glow layer */}
          <div style={{ position: 'absolute', inset: 0, width: '200%',
                        animation: waveAnim, pointerEvents: 'none' }}>
            <svg width="100%" height="28" viewBox="0 0 400 28" preserveAspectRatio="none">
              <path d={SINE_H} stroke={color} strokeWidth={7}
                fill="none" opacity={0.20} filter={`url(#${filterId})`} />
            </svg>
          </div>
          {/* Main coloured wave */}
          <div style={{ position: 'absolute', inset: 0, width: '200%',
                        animation: waveAnim, pointerEvents: 'none' }}>
            <svg width="100%" height="28" viewBox="0 0 400 28" preserveAspectRatio="none">
              <path d={SINE_H} stroke={color} strokeWidth={2.2} fill="none" opacity={0.90} />
            </svg>
          </div>
          {/* White-core layer */}
          <div style={{ position: 'absolute', inset: 0, width: '200%',
                        animation: waveAnim, pointerEvents: 'none' }}>
            <svg width="100%" height="28" viewBox="0 0 400 28" preserveAspectRatio="none">
              <path d={SINE_H} stroke="white" strokeWidth={0.8} fill="none" opacity={0.50} />
            </svg>
          </div>
        </>)}

        {/* Arrowhead — viewBox 0 0 100 28 so we can use fixed coords */}
        <svg width="100%" height="28" viewBox="0 0 100 28" preserveAspectRatio="none"
             style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {!reverse
            ? <polygon points="97,14 88,8 88,20"
                fill={active ? color : 'rgba(255,255,255,0.09)'} opacity={active ? 0.85 : 1} />
            : <polygon points="3,14 12,8 12,20"
                fill={active ? color : 'rgba(255,255,255,0.09)'} opacity={active ? 0.85 : 1} />
          }
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════ Vertical connector ═══════════════════════ */
interface VConnProps {
  active: boolean;
  color: string;
  animSpeed: number;
  id: string;
  reverse?: boolean; /* reverse=true = bottom-to-top (battery→inverter when inverting) */
}

function VConn({ active, color, animSpeed, id, reverse }: VConnProps) {
  const period = animSpeed > 0 ? `${(animSpeed * 0.13).toFixed(2)}s` : '0.8s';
  const waveAnim = active && animSpeed > 0
    ? `sine-v ${period} linear infinite ${reverse ? 'reverse' : 'normal'}`
    : 'none';
  const filterId = `vf-${id}`;

  return (
    <div style={{ width: '100%', height: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 28, height: '100%', position: 'relative', overflow: 'hidden' }}>

        {/* Inactive */}
        {!active && (
          <svg width="28" height="100%" style={{ position: 'absolute', inset: 0 }}>
            <line x1="14" y1="3" x2="14" y2="97%"
              stroke="rgba(255,255,255,0.10)" strokeWidth={1.5} strokeLinecap="round"
              strokeDasharray="3 8" />
          </svg>
        )}

        {/* Active — scrolling vertical sine (3 layers) */}
        {active && (<>
          {/* Glow */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '200%',
                        animation: waveAnim, pointerEvents: 'none' }}>
            <svg width="28" height="100%" viewBox="0 0 28 400" preserveAspectRatio="none">
              <defs>
                <filter id={filterId} x="-200%" y="-20%" width="500%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path d={SINE_V} stroke={color} strokeWidth={7}
                fill="none" opacity={0.20} filter={`url(#${filterId})`} />
            </svg>
          </div>
          {/* Main */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '200%',
                        animation: waveAnim, pointerEvents: 'none' }}>
            <svg width="28" height="100%" viewBox="0 0 28 400" preserveAspectRatio="none">
              <path d={SINE_V} stroke={color} strokeWidth={2.2} fill="none" opacity={0.90} />
            </svg>
          </div>
          {/* Core */}
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '200%',
                        animation: waveAnim, pointerEvents: 'none' }}>
            <svg width="28" height="100%" viewBox="0 0 28 400" preserveAspectRatio="none">
              <path d={SINE_V} stroke="white" strokeWidth={0.8} fill="none" opacity={0.50} />
            </svg>
          </div>
        </>)}

        {/* Arrowhead — viewBox 0 0 28 100 for fixed coords */}
        <svg width="28" height="100%" viewBox="0 0 28 100" preserveAspectRatio="none"
             style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {reverse
            ? <polygon points="14,3 8,13 20,13"
                fill={active ? color : 'rgba(255,255,255,0.09)'} opacity={active ? 0.85 : 1} />
            : <polygon points="14,97 8,87 20,87"
                fill={active ? color : 'rgba(255,255,255,0.09)'} opacity={active ? 0.85 : 1} />
          }
        </svg>
      </div>
    </div>
  );
}

/* ═══════════════════════ Node card ═══════════════════════ */
interface NodeProps {
  accent: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  primary?: string;
  primaryColor?: string;
  rows: { label: string; value: string; color?: string }[];
  active?: boolean;
  tall?: boolean;
}

function Node({ accent, icon, title, subtitle, primary, primaryColor, rows, active = true, tall }: NodeProps) {
  return (
    <div style={{
      width: '100%', height: '100%',
      padding: tall ? '16px 14px' : '12px 12px',
      display: 'flex', flexDirection: 'column', gap: tall ? 10 : 6,
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{
          width: tall ? 36 : 30, height: tall ? 36 : 30, borderRadius: tall ? 10 : 8, flexShrink: 0,
          background: active ? `color-mix(in srgb, ${accent} 14%, rgba(255,255,255,0.04))` : 'rgba(255,255,255,0.04)',
          border: `1px solid ${active ? `color-mix(in srgb, ${accent} 20%, rgba(255,255,255,0.07))` : 'rgba(255,255,255,0.06)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: active ? 'var(--label)' : 'var(--label3)',
                        letterSpacing: '0.01em', lineHeight: 1.2 }}>{title}</div>
          {subtitle && <div style={{ fontSize: 12, color: 'var(--label3)', marginTop: 2, lineHeight: 1.2 }}>{subtitle}</div>}
        </div>
      </div>

      {primary !== undefined && (
        <div style={{
          fontSize: tall ? 32 : 26, fontWeight: 200,
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

      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5, flex: 1, justifyContent: 'center' }}>
        {rows.map(r => (
          <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--label3)' }}>{r.label}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: r.color || 'var(--label)',
                           fontVariantNumeric: 'tabular-nums' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════ Battery water-tank (compact) ═══════════════════════ */
function BatteryTank({ battery, isCharging, remStr }: {
  battery: BatteryData; isCharging: boolean; remStr: string;
}) {
  const soc   = battery.soc;
  const rgb   = soc > 60 ? '48,209,88' : soc > 30 ? '255,159,10' : '255,69,58';
  const socC  = soc > 60 ? 'var(--sys-green)' : soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';

  const wH       = 24;
  const amp      = isCharging ? 9 : 3;
  const wDur     = isCharging ? '1.8s' : '5s';
  const fillY    = wH - amp;
  const wavePath =
    `M0,${fillY} Q50,${fillY - amp} 100,${fillY} Q150,${fillY + amp} 200,${fillY} ` +
    `Q250,${fillY - amp} 300,${fillY} Q350,${fillY + amp} 400,${fillY} ` +
    `L400,${wH} L0,${wH} Z`;

  const bubbles = [
    { left: '18%', size: 4, dur: '2.0s', delay: '0s'   },
    { left: '44%', size: 5, dur: '2.5s', delay: '0.6s' },
    { left: '70%', size: 3, dur: '1.9s', delay: '1.1s' },
  ];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em',
                      textTransform: 'uppercase', color: 'var(--label3)' }}>Battery Pack</div>
        <div style={{ flex: 1 }} />
        <div style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
          color: isCharging ? 'var(--sys-orange)' : 'var(--label3)',
          padding: '2px 8px', borderRadius: 5,
          background: isCharging ? 'rgba(255,159,10,0.12)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${isCharging ? 'rgba(255,159,10,0.28)' : 'rgba(255,255,255,0.08)'}`,
        }}>
          {isCharging ? '⚡ Charging' : 'Discharging'}
        </div>
      </div>

      {/* Tank */}
      <div style={{
        flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 14,
        border: `1.5px solid rgba(${rgb},0.35)`,
        borderTopColor: `rgba(${rgb},0.55)`,
        background: `linear-gradient(160deg, rgba(${rgb},0.06) 0%, rgba(0,0,0,0.30) 100%)`,
        boxShadow: `0 0 30px rgba(${rgb},0.14), inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.50)`,
      }}>
        {/* Water fill */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: `${Math.max(3, soc)}%`,
          transition: 'height 2s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* Wave surface */}
          <div style={{
            position: 'absolute', top: -(wH - 4), left: 0, width: '200%', height: wH,
            animation: `wave-flow ${wDur} linear infinite`,
          }}>
            <svg width="100%" height={wH} viewBox={`0 0 400 ${wH}`} preserveAspectRatio="none">
              <path d={wavePath} fill={`rgba(${rgb},0.80)`} />
            </svg>
          </div>
          {/* Solid body */}
          <div style={{
            position: 'absolute', top: wH / 2, left: 0, right: 0, bottom: 0,
            background: `linear-gradient(to top, rgba(${rgb},0.55), rgba(${rgb},0.28))`,
          }} />
        </div>

        {/* Charging bubbles */}
        {isCharging && bubbles.map((b, i) => (
          <div key={i} style={{
            position: 'absolute', bottom: `${Math.max(3, soc) + 1}%`, left: b.left,
            width: b.size, height: b.size, borderRadius: '50%',
            background: `rgba(${rgb},0.65)`,
            animation: `bubble-rise ${b.dur} ease-in ${b.delay} infinite`,
          }} />
        ))}

        {/* Scale ticks */}
        {[25, 50, 75].map(t => (
          <div key={t} style={{
            position: 'absolute', right: 8, bottom: `${t}%`,
            display: 'flex', alignItems: 'center', gap: 3, zIndex: 5, pointerEvents: 'none',
          }}>
            <div style={{ width: 10, height: 1, background: 'rgba(255,255,255,0.14)' }} />
            <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', fontWeight: 600 }}>{t}%</span>
          </div>
        ))}

        {/* Stats overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 3, zIndex: 10, pointerEvents: 'none',
        }}>
          <div style={{
            fontSize: 56, fontWeight: 200, lineHeight: 1,
            color: 'white', letterSpacing: '-0.04em',
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 2px 16px rgba(0,0,0,0.9), 0 0 40px rgba(0,0,0,0.7)',
          }}>{soc}</div>
          <div style={{ fontSize: 18, fontWeight: 300, color: 'rgba(255,255,255,0.45)', lineHeight: 1 }}>%</div>
          <div style={{
            marginTop: 8, padding: '5px 14px', borderRadius: 8,
            background: 'rgba(0,0,0,0.50)', border: '1px solid rgba(255,255,255,0.09)',
            display: 'flex', gap: 14, alignItems: 'center',
          }}>
            {[
              { lbl: 'V',    val: battery.voltage.toFixed(1), color: 'var(--sys-blue)'  },
              { lbl: 'A',    val: Math.abs(battery.current).toFixed(1), color: 'var(--sys-teal)' },
              { lbl: 'LEFT', val: remStr, color: socC },
            ].map(s => (
              <div key={s.lbl} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                              color: 'rgba(255,255,255,0.35)' }}>{s.lbl}</div>
                <div style={{ fontSize: 15, fontWeight: 300, color: s.color,
                              fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: 'var(--label3)', textAlign: 'center', flexShrink: 0 }}>
        Fogstar Drift 48V · 125Ah
      </div>
    </div>
  );
}

/* ═══════════════════════ Helpers ═══════════════════════ */
const SHORE_MODES = new Set(['Bulk', 'Absorption', 'Float', 'Storage', 'Equalize', 'Passthrough', 'Charger Only']);

/* ═══════════════════════ Main tab ═══════════════════════ */
export function InverterTab({ inverter, battery }: Props) {
  const isOn       = inverter.isOn;
  const shoreConn  = SHORE_MODES.has(inverter.mode);
  const isCharging = shoreConn && battery.current < 0;
  const batToMulti = !shoreConn;   /* true = inverting (bat→multiplus); false = charging */

  /* Power calcs */
  const batKw      = inverter.dcVoltage * Math.abs(inverter.dcCurrent) / 1000;
  const chargeKw   = isCharging ? Math.abs(battery.current) * battery.voltage / 1000 : 0;
  const shoreKw    = shoreConn ? (inverter.outputKw + chargeKw) : 0;
  const dcLoadAmps = Math.max(0, battery.current - (batToMulti ? inverter.dcCurrent : 0));
  const dcLoadW    = dcLoadAmps * battery.voltage;
  const dcActive   = dcLoadAmps > 0.5;

  /* Colours */
  const loadC  = inverter.loadPct > 80 ? 'var(--sys-red)' : inverter.loadPct > 60 ? 'var(--sys-orange)' : 'var(--label)';
  const tempC  = inverter.temp > 55   ? 'var(--sys-red)' : inverter.temp > 40     ? 'var(--sys-orange)' : 'var(--sys-green)';
  const hubCol = shoreConn ? 'var(--sys-orange)' : isOn ? 'var(--brand)' : 'var(--label3)';
  const batDir = batToMulti ? 'var(--sys-blue)' : 'var(--sys-orange)';

  /* Animation speeds (kW → seconds, slower = more power) */
  const spd = (kw: number) => kw > 0.05 ? Math.max(4.0, 9.0 - kw * 1.2) : 0;
  const shoreSpd = shoreConn ? spd(shoreKw)           : 0;
  const acSpd    = isOn      ? spd(inverter.outputKw) : 0;
  const dcSpd    = dcActive  ? spd(dcLoadW / 1000)   : 0;
  const batSpd   = (isOn || shoreConn || dcActive) ? spd(batKw || 0.5) : 0;

  /* Time remaining */
  const remH   = Math.floor(battery.remaining / 1000 / 3600);
  const remM   = Math.floor((battery.remaining / 1000 % 3600) / 60);
  const remStr = battery.remaining > 0 ? `${remH}h ${remM}m` : '—';

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '2fr 1.1fr 2.6fr 1.1fr 2fr',
      gridTemplateRows: '1fr 40px 1fr',
      gap: 8,
      height: '100%',
      minWidth: 0,
    }}>

      {/* ── Shore Power — full left column ── */}
      <div style={{ gridColumn: 1, gridRow: '1 / span 3', minWidth: 0 }}>
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
                { label: 'Mode',    value: inverter.mode, color: 'var(--sys-orange)' },
                { label: 'Status',  value: 'Connected',   color: 'var(--sys-green)' },
              ]
            : [
                { label: 'Status',  value: 'No Mains',    color: 'var(--label3)' },
                { label: 'Voltage', value: '—',           color: 'var(--label3)' },
                { label: 'Freq',    value: '—',           color: 'var(--label3)' },
              ]
          }
        />
      </div>

      {/* ── Shore → Multiplus (top-row sine wave) ── */}
      <div style={{ gridColumn: 2, gridRow: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
        <HConn
          active={shoreConn}
          color="var(--sys-orange)"
          label={shoreConn ? `${shoreKw.toFixed(1)} kW` : '—'}
          sublabel="AC Input"
          animSpeed={shoreSpd}
          id="shore-h"
        />
      </div>

      {/* ── Multiplus 2 — top centre ── */}
      <div style={{ gridColumn: 3, gridRow: 1, minWidth: 0 }}>
        <Node
          accent={hubCol}
          active={isOn || shoreConn}
          icon={<BoltIcon size={18} color={(isOn || shoreConn) ? hubCol : 'var(--label3)'} />}
          title="Multiplus 2"
          subtitle="48/5000/70-50"
          primary={inverter.mode}
          primaryColor={hubCol}
          rows={[
            { label: 'AC',    value: isOn ? `${inverter.acVoltage.toFixed(0)} V · ${inverter.acHz.toFixed(1)} Hz` : '—' },
            { label: 'Load',  value: isOn ? `${inverter.loadPct}%` : '—', color: isOn ? loadC : 'var(--label3)' },
            { label: 'Temp',  value: `${inverter.temp.toFixed(0)}°C`,      color: tempC },
          ]}
        />
      </div>

      {/* ── Multiplus → AC Loads ── */}
      <div style={{ gridColumn: 4, gridRow: 1, display: 'flex', alignItems: 'center', minWidth: 0 }}>
        <HConn
          active={isOn}
          color="var(--brand)"
          label={isOn ? `${inverter.outputKw.toFixed(2)} kW` : '—'}
          sublabel="AC Output"
          animSpeed={acSpd}
          id="ac-h"
        />
      </div>

      {/* ── AC Loads — top right ── */}
      <div style={{ gridColumn: 5, gridRow: 1, minWidth: 0 }}>
        <Node
          accent={isOn ? 'var(--brand)' : 'var(--label3)'}
          active={isOn}
          icon={<PlugIcon size={18} color={isOn ? 'var(--brand)' : 'var(--label3)'} />}
          title="AC Loads"
          subtitle="Van systems"
          primary={isOn ? `${inverter.outputKw.toFixed(2)} kW` : '—'}
          primaryColor="var(--brand)"
          rows={[
            { label: 'Voltage', value: isOn ? `${inverter.acVoltage.toFixed(0)} V` : '—',
              color: isOn ? 'var(--label)' : 'var(--label3)' },
            { label: 'Load',    value: isOn ? `${inverter.loadPct}%` : '—',
              color: isOn ? loadC : 'var(--label3)' },
          ]}
        />
      </div>

      {/* ── Vertical sine — Multiplus ↔ Battery ── */}
      <div style={{ gridColumn: 3, gridRow: 2, minWidth: 0 }}>
        <VConn
          active={isOn || shoreConn || dcActive}
          color={batDir}
          animSpeed={batSpd}
          id="bat-v"
          reverse={batToMulti}   /* inverting = battery→top (upward) */
        />
      </div>

      {/* ── Battery Tank — bottom centre ── */}
      <div style={{ gridColumn: 3, gridRow: 3, minWidth: 0 }}>
        <BatteryTank battery={battery} isCharging={isCharging} remStr={remStr} />
      </div>

      {/* ── Battery → DC Loads ── */}
      <div style={{ gridColumn: 4, gridRow: 3, display: 'flex', alignItems: 'center', minWidth: 0 }}>
        <HConn
          active={dcActive}
          color="var(--sys-blue)"
          label={dcLoadW > 1 ? `${dcLoadW.toFixed(0)} W` : '—'}
          sublabel="DC Bus 48V"
          animSpeed={dcSpd}
          id="dc-h"
        />
      </div>

      {/* ── DC Loads — bottom right ── */}
      <div style={{ gridColumn: 5, gridRow: 3, minWidth: 0 }}>
        <Node
          accent={dcActive ? 'var(--sys-blue)' : 'var(--label3)'}
          active={dcActive}
          icon={<LightbulbIcon size={18} color={dcActive ? 'var(--sys-blue)' : 'var(--label3)'} />}
          title="DC Loads"
          subtitle="Lights · Fans · Pi"
          primary={dcLoadW > 1 ? `${dcLoadW.toFixed(0)} W` : '—'}
          primaryColor="var(--sys-blue)"
          rows={[
            { label: 'Current', value: dcActive ? `${dcLoadAmps.toFixed(1)} A` : '—', color: 'var(--label)' },
            { label: 'Voltage', value: `${battery.voltage.toFixed(1)} V`,              color: 'var(--sys-blue)' },
            { label: 'Power',   value: dcLoadW > 1 ? `${(dcLoadW/1000).toFixed(2)} kW` : '—', color: 'var(--sys-teal)' },
          ]}
        />
      </div>

    </div>
  );
}
