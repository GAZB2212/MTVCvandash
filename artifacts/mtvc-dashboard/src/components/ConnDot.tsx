interface ConnDotProps {
  connected: boolean;
  size?: number;
}

export function ConnDot({ connected, size = 8 }: ConnDotProps) {
  return (
    <div
      className={`pulse-dot ${connected ? 'conn-glow-green' : 'conn-glow-red'}`}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: connected ? 'var(--green)' : 'var(--red)',
        flexShrink: 0,
        display: 'inline-block',
      }}
    />
  );
}
