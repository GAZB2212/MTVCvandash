import { ReactNode } from 'react';

interface ArcGaugeProps {
  value: number;
  max: number;
  size: number;
  color: string;
  children?: ReactNode;
  strokeWidth?: number;
}

export function ArcGauge({ value, max, size, color, children, strokeWidth = 8 }: ArcGaugeProps) {
  const r = (size - strokeWidth * 2) / 2;
  const circ = 2 * Math.PI * r;
  const sweep = 270;
  const arcLen = (sweep / 360) * circ;
  const fill = Math.max(0, Math.min(1, value / max)) * arcLen;
  const cx = size / 2, cy = size / 2;

  const pt = (deg: number) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const arc = (s: number, e: number) => {
    const a = pt(s), b = pt(e), la = e - s > 180 ? 1 : 0;
    return `M ${a.x} ${a.y} A ${r} ${r} 0 ${la} 1 ${b.x} ${b.y}`;
  };
  const track = arc(135, 405);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ display: 'block' }}>
        <path d={track} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} strokeLinecap="round" />
        <path d={track} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={`${fill} ${arcLen}`} style={{ transition: 'stroke-dasharray 0.6s cubic-bezier(0.4,0,0.2,1)' }} />
      </svg>
      {children && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          {children}
        </div>
      )}
    </div>
  );
}
