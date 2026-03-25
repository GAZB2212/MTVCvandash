interface ConnDotProps {
  connected: boolean;
  size?: number;
}

export function ConnDot({ connected, size = 7 }: ConnDotProps) {
  return (
    <div
      className="pulse-dot"
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: connected ? 'var(--green)' : 'var(--red)',
        boxShadow: connected ? '0 0 6px var(--green)' : '0 0 6px var(--red)',
        color: connected ? 'var(--green)' : 'var(--red)',
      }}
    />
  );
}
