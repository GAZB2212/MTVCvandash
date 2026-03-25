import { ReactNode } from 'react';

interface ArcGaugeProps {
  value: number;
  max: number;
  size: number;
  color: string;
  children?: ReactNode;
  strokeWidth?: number;
}

export function ArcGauge({ value, max, size, color, children, strokeWidth = 10 }: ArcGaugeProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const sweepAngle = 270;
  const arcLength = (sweepAngle / 360) * circumference;
  const pct = Math.max(0, Math.min(1, value / max));
  const fillLength = pct * arcLength;

  const cx = size / 2;
  const cy = size / 2;
  const startAngle = 135;

  const polarToCartesian = (angle: number) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  };

  const describeArc = (startDeg: number, endDeg: number) => {
    const s = polarToCartesian(startDeg);
    const e = polarToCartesian(endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${radius} ${radius} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  };

  const trackPath = describeArc(startAngle, startAngle + sweepAngle);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      <svg width={size} height={size} style={{ display: 'block' }}>
        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="var(--surface2)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={trackPath}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${fillLength} ${arcLength}`}
          style={{ filter: `drop-shadow(0 0 4px ${color})` }}
        />
      </svg>
      {children && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}
