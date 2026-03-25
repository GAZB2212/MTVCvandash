interface HBarProps {
  pct: number;
  color: string;
  height?: number;
  showGlow?: boolean;
}

export function HBar({ pct, color, height = 5, showGlow = true }: HBarProps) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div style={{
      width: '100%', height, borderRadius: height,
      background: 'rgba(255,255,255,0.06)',
      overflow: 'hidden',
      border: '1px solid rgba(255,255,255,0.04)',
    }}>
      <div style={{
        height: '100%',
        width: `${clamped}%`,
        background: `linear-gradient(90deg, ${color}cc, ${color})`,
        borderRadius: height,
        boxShadow: showGlow ? `0 0 10px ${color}66` : 'none',
        transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </div>
  );
}
