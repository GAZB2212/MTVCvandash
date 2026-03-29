import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: Props) {
  const [exiting, setExiting] = useState(false);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots(d => d.length >= 6 ? '.' : d + '.');
    }, 260);
    const t1 = setTimeout(() => setExiting(true), 2200);
    const t2 = setTimeout(() => onComplete(),    2750);
    return () => { clearInterval(dotInterval); clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <div
      style={{
        position: 'absolute', inset: 0, zIndex: 9999,
        background: 'linear-gradient(160deg, #030710 0%, #060c1a 55%, #040810 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        animation: exiting
          ? 'splash-exit 0.6s cubic-bezier(0.4,0,1,1) both'
          : 'splash-bg-in 0.4s ease both',
      }}
    >
      {/* Scan-line overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
        backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 4px)',
      }} />

      {/* Ambient glow blob — brand green, top-left */}
      <div style={{
        position: 'absolute', top: '8%', left: '12%',
        width: 420, height: 280,
        background: 'radial-gradient(ellipse, rgba(109,200,43,0.14) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'splash-blob-drift 7s ease-in-out infinite',
        filter: 'blur(2px)',
      }} />

      {/* Ambient glow blob — blue, bottom-right */}
      <div style={{
        position: 'absolute', bottom: '10%', right: '10%',
        width: 380, height: 260,
        background: 'radial-gradient(ellipse, rgba(10,132,255,0.12) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'splash-blob-drift 9s ease-in-out infinite reverse',
        filter: 'blur(2px)',
      }} />

      {/* Ambient glow blob — teal, top-right */}
      <div style={{
        position: 'absolute', top: '20%', right: '8%',
        width: 260, height: 200,
        background: 'radial-gradient(ellipse, rgba(90,200,250,0.08) 0%, transparent 70%)',
        borderRadius: '50%',
        animation: 'splash-blob-drift 11s ease-in-out infinite 2s',
        filter: 'blur(2px)',
      }} />

      {/* Content stack */}
      <div style={{
        position: 'relative', zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 0,
      }}>

        {/* Logo + ring wrapper */}
        <div style={{ position: 'relative', width: 220, height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Outer ambient glow behind logo */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(109,200,43,0.18) 0%, transparent 75%)',
            borderRadius: '50%',
            animation: 'splash-logo-glow-pulse 2.2s ease-in-out infinite 1.2s',
          }} />

          {/* SVG decorative ring — draws itself */}
          <svg
            width="220" height="220"
            viewBox="0 0 220 220"
            style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
          >
            <defs>
              <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%"   stopColor="#6DC82B" stopOpacity="1" />
                <stop offset="40%"  stopColor="#5AC8FA" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#6DC82B" stopOpacity="0.2" />
              </linearGradient>
              <filter id="ring-glow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {/* Outer faint ring */}
            <circle
              cx="110" cy="110" r="100"
              fill="none"
              stroke="rgba(109,200,43,0.10)"
              strokeWidth="1"
            />

            {/* Main animated ring */}
            <circle
              cx="110" cy="110" r="96"
              fill="none"
              stroke="url(#ring-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              filter="url(#ring-glow)"
              strokeDasharray="603"
              style={{
                transformOrigin: '110px 110px',
                animation: 'splash-ring-draw 1.1s cubic-bezier(0.4,0,0.2,1) 0.3s both, splash-ring-rotate 8s linear 1.4s infinite',
              }}
            />

            {/* Inner dashed accent ring */}
            <circle
              cx="110" cy="110" r="86"
              fill="none"
              stroke="rgba(90,200,250,0.22)"
              strokeWidth="1"
              strokeDasharray="4 8"
              style={{
                transformOrigin: '110px 110px',
                animation: 'splash-ring-rotate 14s linear 1.4s infinite reverse',
              }}
            />

            {/* Corner tick marks */}
            {[0, 90, 180, 270].map(deg => {
              const rad = (deg - 90) * Math.PI / 180;
              const r1 = 100, r2 = 107;
              const x1 = 110 + r1 * Math.cos(rad);
              const y1 = 110 + r1 * Math.sin(rad);
              const x2 = 110 + r2 * Math.cos(rad);
              const y2 = 110 + r2 * Math.sin(rad);
              return (
                <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#6DC82B" strokeWidth="2.5" strokeLinecap="round"
                  style={{ opacity: 0, animation: `splash-sub-in 0.4s ease ${0.9 + deg/720}s both` }}
                />
              );
            })}
          </svg>

          {/* MTVC Logo */}
          <img
            src="/mtvc-logo.png"
            alt="MTVC"
            style={{
              width: 120, height: 120,
              objectFit: 'contain',
              position: 'relative', zIndex: 1,
              animation: 'splash-logo-in 0.9s cubic-bezier(0.34,1.56,0.64,1) 0.5s both, splash-logo-glow-pulse 2.2s ease-in-out infinite 1.5s',
            }}
          />
        </div>

        {/* Brand name */}
        <div style={{
          marginTop: 24,
          fontSize: 38,
          fontWeight: 700,
          letterSpacing: '0.22em',
          color: '#ffffff',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          animation: 'splash-text-in 0.7s cubic-bezier(0.4,0,0.2,1) 1.0s both',
          textShadow: '0 0 40px rgba(109,200,43,0.5), 0 2px 12px rgba(0,0,0,0.8)',
        }}>
          MTVC
        </div>

        {/* Subtitle */}
        <div style={{
          marginTop: 6,
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: '0.30em',
          color: 'rgba(200,220,255,0.60)',
          textAlign: 'center',
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
          animation: 'splash-sub-in 0.7s cubic-bezier(0.4,0,0.2,1) 1.35s both',
        }}>
          Van Control System
        </div>

        {/* Thin divider line */}
        <div style={{
          marginTop: 28,
          width: 180,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(109,200,43,0.5), rgba(90,200,250,0.4), transparent)',
          animation: 'splash-sub-in 0.5s ease 1.55s both',
        }} />

        {/* System booting text */}
        <div style={{
          marginTop: 20,
          fontSize: 13,
          fontWeight: 400,
          letterSpacing: '0.14em',
          color: 'rgba(109,200,43,0.75)',
          fontFamily: 'Inter, monospace',
          minWidth: 220,
          animation: 'splash-sub-in 0.4s ease 1.65s both',
        }}>
          System booting{dots}
        </div>

        {/* GAJO Technologies tag */}
        <div style={{
          marginTop: 32,
          display: 'flex', alignItems: 'center', gap: 8,
          animation: 'splash-sub-in 0.5s ease 1.85s both',
          opacity: 0.45,
        }}>
          <img src="/gajo-tech-logo.png" alt="GAJO Technologies"
            style={{ height: 16, width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
            onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span style={{
            fontSize: 11, letterSpacing: '0.18em', color: 'rgba(200,220,255,0.7)',
            fontFamily: 'Inter, sans-serif', textTransform: 'uppercase',
          }}>
            GAJO Technologies
          </span>
        </div>
      </div>
    </div>
  );
}
