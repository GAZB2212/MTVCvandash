import { useState, useEffect, useRef, useCallback } from 'react';
import { useLiveData } from '../hooks/useLiveData';
import { useVanConfig } from '../hooks/useVanConfig';
import { ConnDot } from '../components/ConnDot';
import { AdminPanel } from './AdminPanel';
import { InverterTab } from './tabs/InverterTab';
import { BatteryTab } from './tabs/BatteryTab';
import { HomeTab } from './tabs/HomeTab';
import { StatusTab } from './tabs/StatusTab';

/* ── Tab definitions with SVG icons ── */
const TABS = [
  {
    id: 'home', label: 'Home',
    icon: (c: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    id: 'inverter', label: 'Power',
    icon: (c: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13,2 13,9 20,9 11,22 11,15 4,15"/>
      </svg>
    ),
  },
  {
    id: 'battery', label: 'Battery',
    icon: (c: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="17" height="10" rx="2"/>
        <path d="M22 11v2"/>
        <line x1="6" y1="12" x2="12" y2="12"/>
      </svg>
    ),
  },
  {
    id: 'status', label: 'Status',
    icon: (c: string) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    ),
  },
];

const HOLD_MS = 2000;

function Clock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(iv);
  }, []);
  const time = now.toLocaleTimeString('en-GB', { hour12: false });
  const date = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
      <span style={{
        fontSize: 22, fontWeight: 300, color: 'var(--label)',
        fontVariantNumeric: 'tabular-nums', lineHeight: 1, letterSpacing: '-0.02em',
      }}>
        {time}
      </span>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--label3)', lineHeight: 1, letterSpacing: '0.03em' }}>
        {date}
      </span>
      <span style={{
        fontSize: 10, fontWeight: 400, lineHeight: 1, letterSpacing: '0.06em',
        color: 'rgba(255,255,255,0.22)',
        marginTop: 1,
      }}>
        Powered by Gajotech
      </span>
    </div>
  );
}

export default function MainPanel() {
  const [tab, setTab] = useState('home');
  const [adminOpen, setAdminOpen] = useState(false);
  const [holdPct, setHoldPct] = useState(0);
  const data = useLiveData();
  const vanConfig = useVanConfig();
  const online = data.inverter.connected && data.battery.connected;

  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(0);

  const cancelHold = useCallback(() => {
    if (holdTimerRef.current) { clearInterval(holdTimerRef.current); holdTimerRef.current = null; }
    setHoldPct(0);
  }, []);

  const startHold = useCallback(() => {
    holdStartRef.current = Date.now();
    setHoldPct(0);
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const pct = Math.min(100, (elapsed / HOLD_MS) * 100);
      setHoldPct(pct);
      if (pct >= 100) { cancelHold(); setAdminOpen(true); }
    }, 30);
  }, [cancelHold]);

  const activeLights = data.lights
    .map(l => {
      const cfg = vanConfig.config.lights.find(c => c.id === l.id);
      return cfg ? { ...l, name: cfg.name, _enabled: cfg.enabled, icon: cfg.icon } : { ...l, _enabled: true };
    })
    .filter(l => l._enabled);

  const setLightsProxy = (next: typeof data.lights) => {
    data.setLights(data.lights.map(orig => {
      const updated = next.find(n => n.id === orig.id);
      return updated ?? orig;
    }));
  };


  return (
    <div style={{
      width: 1250, height: 720,
      background: 'var(--bg)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', position: 'relative',
    }}>
      {/* ── AMBIENT GLOW BLOBS — blue-biased automotive ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {/* Centre glow — deep blue, like dashboard ambient light */}
        <div style={{
          position: 'absolute', top: '45%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 720, height: 420, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(20,60,180,0.10) 0%, transparent 70%)',
        }} />
        {/* Top-right — cool teal */}
        <div style={{
          position: 'absolute', top: -80, right: -60, width: 420, height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,100,220,0.09) 0%, transparent 68%)',
        }} />
        {/* Bottom-left — brand green, muted */}
        <div style={{
          position: 'absolute', bottom: -100, left: -60, width: 380, height: 380,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,200,43,0.07) 0%, transparent 68%)',
        }} />
      </div>

      {/* ── AUTOMOTIVE SCAN-LINE TEXTURE OVERLAY ── */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: [
          'repeating-linear-gradient(0deg, transparent 0px, transparent 29px, rgba(120,160,255,0.022) 30px)',
        ].join(','),
      }} />

      {/* ── HEADER ── */}
      <div style={{
        height: 56, display: 'flex', alignItems: 'center', gap: 12,
        padding: '0 18px',
        background: 'rgba(4,8,16,0.80)',
        backdropFilter: 'blur(48px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(48px) saturate(1.8)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 1px 0 rgba(109,200,43,0.08), 0 4px 24px rgba(0,0,0,0.4)',
        flexShrink: 0, zIndex: 10, position: 'relative',
      }}>

        {/* Left: Van name + status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, zIndex: 1 }}>
          <span style={{
            fontSize: 13, fontWeight: 700, color: 'var(--label)',
            letterSpacing: '0.04em', textTransform: 'uppercase',
          }}>
            {vanConfig.config.vanName}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <ConnDot connected={online} size={5} />
            <span style={{
              fontSize: 13, fontWeight: 600, letterSpacing: '0.06em',
              color: online ? 'var(--sys-green)' : 'var(--sys-red)',
            }}>
              {online ? 'ONLINE' : 'FAULT'}
            </span>
          </div>
        </div>

        {/* Centre: logo — absolute so it stays truly centred regardless of side widths */}
        <div
          onPointerDown={startHold}
          onPointerUp={cancelHold}
          onPointerLeave={cancelHold}
          style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            cursor: 'pointer', touchAction: 'none', userSelect: 'none',
          }}
        >
          <img src="/logo.png" alt="Mobile Tyre Van City" style={{ height: 30, objectFit: 'contain' }} />
          {holdPct > 0 && (
            <div style={{
              width: '100%', height: 2, marginTop: 3, borderRadius: 1,
              background: `linear-gradient(to right, var(--brand) ${holdPct}%, rgba(255,255,255,0.08) ${holdPct}%)`,
            }} />
          )}
        </div>

        {/* Right: Clock */}
        <div style={{ marginLeft: 'auto', zIndex: 1 }}>
          <Clock />
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', zIndex: 5 }}>
        {TABS.map(t => (
          <div key={t.id} style={{
            position: 'absolute', inset: 0,
            padding: '12px 14px 10px',
            overflow: 'hidden',
            display: tab === t.id ? 'flex' : 'none',
            flexDirection: 'column',
          }}>
            {t.id === 'home'     && <HomeTab battery={data.battery} powerKw={data.inverter.outputKw} lights={activeLights} setLights={setLightsProxy} inverterOn={data.inverter.isOn} onToggleInverter={data.toggleInverter} />}
            {t.id === 'inverter' && <InverterTab inverter={data.inverter} battery={data.battery} />}
            {t.id === 'battery'  && <BatteryTab  battery={data.battery} powerKw={data.inverter.outputKw} />}
            {t.id === 'status'   && (
              <StatusTab inverter={data.inverter} battery={data.battery}
                pressure={data.pressure} temps={data.temps} fans={data.fans}
                alerts={data.alerts} uptime={data.uptime} />
            )}
          </div>
        ))}

        {adminOpen && <AdminPanel api={vanConfig} onClose={() => setAdminOpen(false)} />}
      </div>

      {/* ── AUTOMOTIVE TAB BAR ── */}
      <div style={{
        height: 56,
        background: 'rgba(4,8,16,0.88)',
        backdropFilter: 'blur(48px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(48px) saturate(1.8)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 -1px 0 rgba(109,200,43,0.06), 0 -4px 24px rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'stretch', padding: '6px 8px', gap: 4,
        flexShrink: 0, zIndex: 10, position: 'relative',
      }}>
        {TABS.map(t => {
          const active = tab === t.id;
          const iconColor = active ? 'var(--brand)' : 'var(--label3)';
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, border: active ? '1px solid rgba(109,200,43,0.20)' : '1px solid transparent',
              cursor: 'pointer', borderRadius: 12,
              background: active ? 'rgba(109,200,43,0.09)' : 'transparent',
              boxShadow: active ? '0 0 16px rgba(109,200,43,0.08), inset 0 1px 0 rgba(255,255,255,0.06)' : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              transition: 'background 0.22s, border-color 0.22s, box-shadow 0.22s',
              fontFamily: 'inherit', padding: 0,
            }}>
              {t.icon(iconColor)}
              <span style={{
                fontSize: 12, fontWeight: active ? 700 : 500,
                letterSpacing: '0.07em', textTransform: 'uppercase',
                color: iconColor,
                transition: 'color 0.22s',
              }}>{t.label}</span>
              {/* Active indicator dot */}
              {active && (
                <div style={{
                  width: 16, height: 2, borderRadius: 2,
                  background: 'var(--brand)',
                  boxShadow: '0 0 6px var(--brand-glow)',
                  marginTop: -1,
                }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
