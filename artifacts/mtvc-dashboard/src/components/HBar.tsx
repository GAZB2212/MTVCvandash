interface HBarProps {
  pct: number;
  color: string;
  height?: number;
}

const glowMap: Record<string, string> = {
  '#6DC82B': 'hbar-glow-amber',
  '#4A8A18': 'hbar-glow-amber',
  '#38BDF8': 'hbar-glow-blue',
  '#0369A1': 'hbar-glow-blue',
  '#22C55E': 'hbar-glow-green',
  '#15803D': 'hbar-glow-green',
  '#EF4444': 'hbar-glow-red',
  '#B91C1C': 'hbar-glow-red',
};

export function HBar({ pct, color, height = 6 }: HBarProps) {
  const clampedPct = Math.max(0, Math.min(100, pct));
  const glowClass = glowMap[color] || '';

  return (
    <div
      style={{
        width: '100%',
        height: height,
        background: 'var(--surface2)',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
      }}
    >
      <div
        className={glowClass}
        style={{
          height: '100%',
          width: `${clampedPct}%`,
          background: color,
          borderRadius: 3,
          transition: 'width 0.5s ease',
        }}
      />
    </div>
  );
}
