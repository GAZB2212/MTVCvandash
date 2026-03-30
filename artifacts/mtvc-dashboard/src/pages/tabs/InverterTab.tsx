import { InverterData, BatteryData } from '../../hooks/useLiveData';

interface Props {
  inverter: InverterData;
  battery: BatteryData;
}

/* ───────────────────────────── Icons ───────────────────────────── */
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

function LightbulbIcon({ size, color }: { size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M9 21h6M12 3a6 6 0 0 1 4.243 10.243C15.368 14.119 15 15.03 15 16v1H9v-1c0-.97-.368-1.881-1.243-2.757A6 6 0 0 1 12 3z"
        stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 17h6" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
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

/* ───────────────────────────── Flow connector ───────────────────────────── */
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
  const t  = (animSpeed / 3).toFixed(2);
  const t2 = ((animSpeed / 3) * 2).toFixed(2);
  const path     = reverse ? `M 97 10 H 3` : `M 3 10 H 97`;
  const filterId = `glow-h-${pathId}`;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', minWidth:0 }}>
      <div style={{ textAlign:'center', marginBottom:4, lineHeight:1.2 }}>
        <div style={{ fontSize:13, fontWeight:600, color: active ? color : 'var(--label3)', fontVariantNumeric:'tabular-nums', transition:'color 0.4s' }}>{label}</div>
        <div style={{ fontSize:11, color:'var(--label3)', marginTop:1 }}>{sublabel}</div>
      </div>
      <div style={{ width:'100%', height:24 }}>
        <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none" overflow="visible">
          <defs>
            <path id={pathId} d={path} />
            <filter id={filterId} x="-80%" y="-300%" width="260%" height="700%">
              <feGaussianBlur stdDeviation="2.2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <line x1="3" y1="12" x2="97" y2="12"
            stroke={active ? color : 'rgba(255,255,255,0.09)'}
            strokeWidth={1.5} strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={active ? 0.30 : 0.6}
            style={{ transition:'stroke 0.4s, opacity 0.4s' }}
          />
          {!reverse
            ? <polygon points="100,12 91,7.5 91,16.5" fill={active ? color : 'rgba(255,255,255,0.10)'} opacity={active ? 0.70 : 1} />
            : <polygon points="0,12 9,7.5 9,16.5"    fill={active ? color : 'rgba(255,255,255,0.10)'} opacity={active ? 0.70 : 1} />
          }
          {active && animSpeed > 0 && (<>
            <ellipse rx="5.5" ry="2.5" fill={color} opacity="0.90" filter={`url(#${filterId})`}>
              <animateMotion dur={`${animSpeed}s`} repeatCount="indefinite" rotate="none"><mpath href={`#${pathId}`} /></animateMotion>
            </ellipse>
            <ellipse rx="5.5" ry="2.5" fill={color} opacity="0.90" filter={`url(#${filterId})`}>
              <animateMotion dur={`${animSpeed}s`} begin={`-${t}s`} repeatCount="indefinite" rotate="none"><mpath href={`#${pathId}`} /></animateMotion>
            </ellipse>
            <ellipse rx="5.5" ry="2.5" fill={color} opacity="0.90" filter={`url(#${filterId})`}>
              <animateMotion dur={`${animSpeed}s`} begin={`-${t2}s`} repeatCount="indefinite" rotate="none"><mpath href={`#${pathId}`} /></animateMotion>
            </ellipse>
          </>)}
        </svg>
      </div>
    </div>
  );
}

/* ───────────────────────────── Node card ───────────────────────────── */
interface NodeProps {
  accent: string;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  primary?: string;
  primaryColor?: string;
  rows: { label: string; value: string; color?: string }[];
  active?: boolean;
}

function Node({ accent, icon, title, subtitle, primary, primaryColor, rows, active = true }: NodeProps) {
  return (
    <div style={{
      width:'100%', height:'100%',
      padding:'12px 13px',
      display:'flex', flexDirection:'column', gap:6,
      borderRadius:'var(--r-card)', overflow:'hidden',
      background: active
        ? `linear-gradient(145deg, color-mix(in srgb, ${accent} 12%, rgba(255,255,255,0.08)) 0%, rgba(255,255,255,0.03) 100%)`
        : 'linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.025) 100%)',
      border:`1px solid ${active ? `color-mix(in srgb, ${accent} 35%, rgba(255,255,255,0.08))` : 'rgba(255,255,255,0.08)'}`,
      borderTopColor: active ? `color-mix(in srgb, ${accent} 50%, rgba(255,255,255,0.12))` : 'rgba(255,255,255,0.13)',
      boxShadow: active
        ? `0 0 30px color-mix(in srgb, ${accent} 12%, transparent), inset 0 1px 0 rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.45)`
        : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 6px 24px rgba(0,0,0,0.4)',
      transition:'border-color 0.4s, box-shadow 0.4s, background 0.4s',
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        <div style={{
          width:30, height:30, borderRadius:8, flexShrink:0,
          background: active ? `color-mix(in srgb, ${accent} 14%, rgba(255,255,255,0.04))` : 'rgba(255,255,255,0.04)',
          border:`1px solid ${active ? `color-mix(in srgb, ${accent} 20%, rgba(255,255,255,0.07))` : 'rgba(255,255,255,0.06)'}`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          {icon}
        </div>
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:14, fontWeight:700, color: active ? 'var(--label)' : 'var(--label3)', letterSpacing:'0.01em', lineHeight:1.2 }}>{title}</div>
          {subtitle && <div style={{ fontSize:12, color:'var(--label3)', marginTop:2, lineHeight:1.2 }}>{subtitle}</div>}
        </div>
      </div>

      {primary !== undefined && (
        <div style={{
          fontSize:28, fontWeight:200,
          color: primaryColor || 'var(--label)',
          letterSpacing:'-0.02em', lineHeight:1, flexShrink:0,
          fontVariantNumeric:'tabular-nums',
          textShadow: active ? `0 0 20px color-mix(in srgb, ${primaryColor||accent} 40%, transparent)` : 'none',
          transition:'color 0.4s, text-shadow 0.4s',
        }}>
          {primary}
        </div>
      )}

      <div style={{ width:'100%', height:1, background:'var(--sep)', flexShrink:0 }} />

      <div style={{ width:'100%', display:'flex', flexDirection:'column', gap:5, flex:1, justifyContent:'center' }}>
        {rows.map(r => (
          <div key={r.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:12, fontWeight:500, color:'var(--label3)' }}>{r.label}</span>
            <span style={{ fontSize:12, fontWeight:600, color: r.color||'var(--label)', fontVariantNumeric:'tabular-nums' }}>{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────── Battery water-tank ───────────────────────────── */
interface TankProps {
  battery: BatteryData;
  isCharging: boolean;
  remStr: string;
}

function BatteryTank({ battery, isCharging, remStr }: TankProps) {
  const soc      = battery.soc;
  const socColor = soc > 60 ? 'var(--sys-green)' : soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const rgb      = soc > 60 ? '48,209,88'        : soc > 30 ? '255,159,10'        : '255,69,58';

  /* Wave geometry */
  const wH    = 28;                                        /* wave SVG height */
  const amp   = isCharging ? 10 : 4;                      /* wave amplitude  */
  const wDur  = isCharging ? '1.8s' : '5s';               /* scroll speed    */
  const fillY = wH - amp;                                  /* wave baseline   */

  /* Seamless 2-cycle sine path — 400px wide, scroll -50% for seamless loop */
  const wavePath =
    `M0,${fillY} Q50,${fillY - amp} 100,${fillY} Q150,${fillY + amp} 200,${fillY} ` +
    `Q250,${fillY - amp} 300,${fillY} Q350,${fillY + amp} 400,${fillY} ` +
    `L400,${wH} L0,${wH} Z`;

  const bubbles = [
    { left:'18%', size:5, dur:'2.0s', delay:'0s'   },
    { left:'42%', size:4, dur:'2.6s', delay:'0.5s' },
    { left:'66%', size:6, dur:'1.8s', delay:'1.1s' },
    { left:'82%', size:3, dur:'2.3s', delay:'0.3s' },
  ];

  return (
    <div style={{ width:'100%', height:'100%', display:'flex', flexDirection:'column', gap:8 }}>

      {/* Header row */}
      <div style={{ display:'flex', alignItems:'center', flexShrink:0 }}>
        <div style={{ fontSize:12, fontWeight:700, letterSpacing:'0.10em', textTransform:'uppercase', color:'var(--label3)' }}>
          Battery Pack
        </div>
        <div style={{ flex:1 }} />
        {isCharging ? (
          <div style={{
            fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase',
            color:'var(--sys-orange)', padding:'2px 9px', borderRadius:6,
            background:'rgba(255,159,10,0.12)', border:'1px solid rgba(255,159,10,0.28)',
          }}>
            ⚡ Charging
          </div>
        ) : (
          <div style={{
            fontSize:11, fontWeight:700, letterSpacing:'0.07em', textTransform:'uppercase',
            color:'var(--label3)', padding:'2px 9px', borderRadius:6,
            background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
          }}>
            Discharging
          </div>
        )}
      </div>

      {/* Tank body */}
      <div style={{
        flex:1, position:'relative', overflow:'hidden',
        borderRadius:16,
        border:`1.5px solid rgba(${rgb},0.35)`,
        borderTopColor:`rgba(${rgb},0.55)`,
        background:`linear-gradient(160deg, rgba(${rgb},0.06) 0%, rgba(0,0,0,0.30) 100%)`,
        boxShadow:`0 0 40px rgba(${rgb},0.14), inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.50)`,
      }}>

        {/* Water fill — rises from bottom */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          height:`${Math.max(3, soc)}%`,
          transition:'height 2s cubic-bezier(0.4,0,0.2,1)',
        }}>
          {/* Animated wave surface */}
          <div style={{
            position:'absolute',
            top: -(wH - 5),
            left:0,
            width:'200%',
            height:wH,
            animation:`wave-flow ${wDur} linear infinite`,
          }}>
            <svg width="100%" height={wH} viewBox={`0 0 400 ${wH}`} preserveAspectRatio="none">
              <path d={wavePath} fill={`rgba(${rgb},0.80)`} />
            </svg>
          </div>

          {/* Solid gradient body below wave */}
          <div style={{
            position:'absolute',
            top: wH / 2,
            left:0, right:0, bottom:0,
            background:`linear-gradient(to top, rgba(${rgb},0.55), rgba(${rgb},0.28))`,
          }} />
        </div>

        {/* Charging bubbles */}
        {isCharging && bubbles.map((b, i) => (
          <div key={i} style={{
            position:'absolute',
            bottom:`${Math.max(3, soc) + 1}%`,
            left: b.left,
            width: b.size, height: b.size,
            borderRadius:'50%',
            background:`rgba(${rgb},0.65)`,
            animation:`bubble-rise ${b.dur} ease-in ${b.delay} infinite`,
          }} />
        ))}

        {/* Scale ticks */}
        {[25, 50, 75].map(tick => (
          <div key={tick} style={{
            position:'absolute', right:10, bottom:`${tick}%`,
            display:'flex', alignItems:'center', gap:4, zIndex:5, pointerEvents:'none',
          }}>
            <div style={{ width:12, height:1, background:'rgba(255,255,255,0.14)' }} />
            <span style={{ fontSize:9, color:'rgba(255,255,255,0.22)', fontWeight:600 }}>{tick}%</span>
          </div>
        ))}

        {/* Central data overlay */}
        <div style={{
          position:'absolute', inset:0,
          display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          gap:4, zIndex:10, pointerEvents:'none',
        }}>
          {/* SOC hero */}
          <div style={{
            fontSize:82, fontWeight:200, lineHeight:1,
            color:'white', letterSpacing:'-0.04em',
            fontVariantNumeric:'tabular-nums',
            textShadow:'0 2px 16px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.7)',
          }}>
            {soc}
          </div>
          <div style={{ fontSize:22, fontWeight:300, color:'rgba(255,255,255,0.45)', lineHeight:1 }}>%</div>

          {/* Stats pill */}
          <div style={{
            marginTop:10, padding:'8px 18px', borderRadius:10,
            background:'rgba(0,0,0,0.50)',
            border:'1px solid rgba(255,255,255,0.09)',
            display:'flex', gap:18, alignItems:'center',
          }}>
            {[
              { lbl:'VOLT',  val: battery.voltage.toFixed(1), color:'var(--sys-blue)'  },
              { lbl:'AMPS',  val: Math.abs(battery.current).toFixed(1), color:'var(--sys-teal)' },
              { lbl:'LEFT',  val: remStr,  color: socColor },
            ].map((s, i) => (
              <div key={s.lbl} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                {i > 0 && (
                  <div style={{
                    position:'absolute',
                    width:1, height:28,
                    background:'rgba(255,255,255,0.09)',
                    transform:`translateX(${i === 1 ? -10 : 10}px)`,
                  }} />
                )}
                <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.08em', color:'rgba(255,255,255,0.38)' }}>{s.lbl}</div>
                <div style={{ fontSize:17, fontWeight:300, color:s.color, fontVariantNumeric:'tabular-nums', lineHeight:1 }}>{s.val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer label */}
      <div style={{ fontSize:12, color:'var(--label3)', textAlign:'center', flexShrink:0 }}>
        Fogstar Drift 48V · 125Ah
      </div>
    </div>
  );
}

/* ───────────────────────────── Shore mode helpers ───────────────────────────── */
const SHORE_MODES = new Set(['Bulk','Absorption','Float','Storage','Equalize','Passthrough','Charger Only']);

/* ───────────────────────────── Main tab ───────────────────────────── */
export function InverterTab({ inverter, battery }: Props) {
  const isOn       = inverter.isOn;
  const shoreConn  = SHORE_MODES.has(inverter.mode);
  const isCharging = shoreConn && battery.current < 0;
  const batToMulti = !shoreConn;

  /* Power calcs */
  const batKw      = inverter.dcVoltage * Math.abs(inverter.dcCurrent) / 1000;
  const chargeKw   = isCharging ? Math.abs(battery.current) * battery.voltage / 1000 : 0;
  const shoreKw    = shoreConn ? (inverter.outputKw + chargeKw) : 0;
  const dcLoadAmps = Math.max(0, battery.current - (batToMulti ? inverter.dcCurrent : 0));
  const dcLoadW    = dcLoadAmps * battery.voltage;
  const dcActive   = dcLoadAmps > 0.5;

  /* Colours */
  const loadC  = inverter.loadPct > 80 ? 'var(--sys-red)' : inverter.loadPct > 60 ? 'var(--sys-orange)' : 'var(--label)';
  const tempC  = inverter.temp  > 55   ? 'var(--sys-red)' : inverter.temp > 40    ? 'var(--sys-orange)' : 'var(--sys-green)';
  const hubCol = shoreConn ? 'var(--sys-orange)' : isOn ? 'var(--brand)' : 'var(--label3)';

  /* Animation speeds */
  const spd = (kw: number) => kw > 0.05 ? Math.max(4.0, 9.0 - kw * 1.2) : 0;
  const shoreSpd = shoreConn ? spd(shoreKw)             : 0;
  const acSpd    = isOn      ? spd(inverter.outputKw)   : 0;
  const dcSpd    = dcActive  ? spd(dcLoadW / 1000)      : 0;
  const batSpd   = (isOn || shoreConn || dcActive) ? spd(batKw || 0.5) : 0;

  /* Time remaining string */
  const remH   = Math.floor(battery.remaining / 1000 / 3600);
  const remM   = Math.floor((battery.remaining / 1000 % 3600) / 60);
  const remStr = battery.remaining > 0 ? `${remH}h ${remM}m` : '—';

  /* Left connector direction: shore charges battery (shore→bat) or battery feeds loads (stays dim) */
  const leftActive  = shoreConn;
  const leftReverse = false;                /* shore always flows right → battery */

  /* Right top: battery ↔ multiplus (reverse=true when inverting: bat→multi) */
  const rightTopActive  = isOn || shoreConn;
  const rightTopReverse = batToMulti;       /* inverting = battery→multiplus (right) */

  return (
    <div style={{
      display:'grid',
      gridTemplateColumns:'2fr 0.9fr 2.2fr 0.9fr 2fr',
      gridTemplateRows:'1fr 1fr',
      gap:8,
      height:'100%',
      minWidth:0,
    }}>

      {/* ── Shore Power — spans both rows ── */}
      <div style={{ gridColumn:1, gridRow:'1 / span 2', minWidth:0 }}>
        <Node
          accent="var(--sys-orange)"
          active={shoreConn}
          icon={<ShoreIcon size={20} color={shoreConn ? 'var(--sys-orange)' : 'var(--label3)'} />}
          title="Shore Power"
          subtitle="AC Mains Input"
          primary={shoreConn ? `${shoreKw.toFixed(1)} kW` : 'Off'}
          primaryColor={shoreConn ? 'var(--sys-orange)' : 'var(--label3)'}
          rows={shoreConn
            ? [
                { label:'Voltage', value:`${inverter.acVoltage.toFixed(0)} V`,  color:'var(--sys-orange)' },
                { label:'Freq',    value:`${inverter.acHz.toFixed(1)} Hz` },
                { label:'Mode',    value: inverter.mode, color:'var(--sys-orange)' },
                { label:'Status',  value:'Connected',    color:'var(--sys-green)' },
              ]
            : [
                { label:'Status',  value:'No Mains',     color:'var(--label3)' },
                { label:'Voltage', value:'—',            color:'var(--label3)' },
                { label:'Freq',    value:'—',            color:'var(--label3)' },
              ]
          }
        />
      </div>

      {/* ── Left connector — spans both rows, centred ── */}
      <div style={{ gridColumn:2, gridRow:'1 / span 2', display:'flex', alignItems:'center', minWidth:0 }}>
        <HConn
          active={leftActive}
          color="var(--sys-orange)"
          label={shoreConn ? `${shoreKw.toFixed(1)} kW` : '—'}
          sublabel={shoreConn ? 'Via Multiplus' : 'No input'}
          animSpeed={shoreSpd}
          pathId="shore-bat"
          reverse={leftReverse}
        />
      </div>

      {/* ── Battery Tank — spans both rows ── */}
      <div style={{ gridColumn:3, gridRow:'1 / span 2', minWidth:0 }}>
        <BatteryTank battery={battery} isCharging={isCharging} remStr={remStr} />
      </div>

      {/* ── Right top connector — Battery ↔ Multiplus/AC ── */}
      <div style={{ gridColumn:4, gridRow:1, display:'flex', alignItems:'center', minWidth:0 }}>
        <HConn
          active={rightTopActive}
          color={hubCol}
          label={rightTopActive ? `${inverter.outputKw.toFixed(2)} kW` : '—'}
          sublabel="AC Output"
          animSpeed={acSpd}
          pathId="bat-ac"
          reverse={rightTopReverse}
        />
      </div>

      {/* ── Right bottom connector — Battery → DC Loads ── */}
      <div style={{ gridColumn:4, gridRow:2, display:'flex', alignItems:'center', minWidth:0 }}>
        <HConn
          active={dcActive}
          color="var(--sys-blue)"
          label={dcLoadW > 1 ? `${dcLoadW.toFixed(0)} W` : '—'}
          sublabel="DC Bus 48V"
          animSpeed={dcSpd}
          pathId="bat-dc"
          reverse={false}
        />
      </div>

      {/* ── Multiplus / AC Output card ── */}
      <div style={{ gridColumn:5, gridRow:1, minWidth:0 }}>
        <Node
          accent={hubCol}
          active={isOn || shoreConn}
          icon={<PlugIcon size={18} color={(isOn || shoreConn) ? hubCol : 'var(--label3)'} />}
          title="Inverter / AC"
          subtitle="Multiplus 48/5000"
          primary={inverter.mode}
          primaryColor={hubCol}
          rows={[
            { label:'AC Out',  value: isOn ? `${inverter.acVoltage.toFixed(0)} V · ${inverter.acHz.toFixed(1)} Hz` : '—' },
            { label:'Load',    value: isOn ? `${inverter.loadPct}%` : '—',      color: isOn ? loadC : 'var(--label3)' },
            { label:'Temp',    value: `${inverter.temp.toFixed(0)}°C`,           color: tempC },
            { label:'Output',  value: isOn ? `${inverter.outputKw.toFixed(2)} kW` : '—', color: isOn ? 'var(--brand)' : 'var(--label3)' },
          ]}
        />
      </div>

      {/* ── DC Loads card ── */}
      <div style={{ gridColumn:5, gridRow:2, minWidth:0 }}>
        <Node
          accent={dcActive ? 'var(--sys-blue)' : 'var(--label3)'}
          active={dcActive}
          icon={<LightbulbIcon size={18} color={dcActive ? 'var(--sys-blue)' : 'var(--label3)'} />}
          title="DC Loads"
          subtitle="Lights · Fans · Pi"
          primary={dcLoadW > 1 ? `${dcLoadW.toFixed(0)} W` : '—'}
          primaryColor="var(--sys-blue)"
          rows={[
            { label:'Current', value: dcActive ? `${dcLoadAmps.toFixed(1)} A` : '—',       color:'var(--label)' },
            { label:'Voltage', value: `${battery.voltage.toFixed(1)} V`,                    color:'var(--sys-blue)' },
            { label:'Power',   value: dcLoadW > 1 ? `${(dcLoadW/1000).toFixed(2)} kW` : '—', color:'var(--sys-teal)' },
          ]}
        />
      </div>

    </div>
  );
}
