interface HBarProps {
  pct: number;
  color: string;
  height?: number;
}

export function HBar({ pct, color, height = 4 }: HBarProps) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div style={{
      width: '100%', height,
      background: 'rgba(255,255,255,0.10)',
      borderRadius: height,
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        width: `${clamped}%`,
        background: color,
        borderRadius: height,
        transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  );
}
