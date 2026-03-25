interface ConnDotProps { connected: boolean; size?: number; }

export function ConnDot({ connected, size = 7 }: ConnDotProps) {
  const c = connected ? 'var(--sys-green)' : 'var(--sys-red)';
  return (
    <div className="live-dot" style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: c, color: c,
    }} />
  );
}
