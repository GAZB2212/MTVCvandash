import { ReactNode } from 'react';

interface ArcGaugeProps {
  value: number;
  max: number;
  size: number;
  color: string;
  children?: ReactNode;
  strokeWidth?: number;
  trackColor?: string;
}

export function ArcGauge({ value, max, size, color, children, strokeWidth = 10, trackColor }: ArcGaugeProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const sweepAngle = 270;
  const arcLength = (sweepAngle / 360) * circumference;
  const pct = Math.max(0, Math.min(1, value / max));
  const fillLength = pct * arcLength;

  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135;

  const polarToCart = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) };
  };

  const describeArc = (startDeg: number, endDeg: number) => {
    const s = polarToCart(startDeg);
    const e = polarToCart(endDeg);
    const la = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${la} 1 ${e.x} ${e.y}`;
  };

  const trackPath = describeArc(startAngle, startAngle + sweepAngle);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      <svg width={size} height={size} style={{ display: 'block' }}>
        <defs>
          <filter id={`glow-${color.replace('#','')}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        {/* Track */}
        <path d={trackPath} fill="none"
          stroke={trackColor || 'rgba(255,255,255,0.06)'} strokeWidth={strokeWidth} strokeLinecap="round" />
        {/* Fill */}
        <path d={trackPath} fill="none"
          stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={`${fillLength} ${arcLength}`}
          filter={`url(#glow-${color.replace('#','')})`}
        />
      </svg>
      {children && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
        }}>
          {children}
        </div>
      )}
    </div>
  );
}
