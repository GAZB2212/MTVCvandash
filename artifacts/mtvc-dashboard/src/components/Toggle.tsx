interface ToggleProps {
  on: boolean;
  onToggle: () => void;
  color?: string;
  size?: 'sm' | 'md';
}

export function Toggle({ on, onToggle, color = '#E8A020', size = 'md' }: ToggleProps) {
  const width = size === 'sm' ? 34 : 42;
  const height = size === 'sm' ? 18 : 22;
  const thumbSize = size === 'sm' ? 14 : 18;
  const thumbOffset = size === 'sm' ? 2 : 2;

  return (
    <button
      onClick={onToggle}
      style={{
        width,
        height,
        borderRadius: height,
        background: on ? color : 'var(--surface2)',
        border: `1px solid ${on ? color : 'var(--border-color)'}`,
        position: 'relative',
        cursor: 'pointer',
        display: 'inline-block',
        transition: 'background 0.3s ease, border-color 0.3s ease',
        boxShadow: on ? `0 0 8px ${color}40` : 'none',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: thumbSize,
          height: thumbSize,
          background: on ? 'white' : 'var(--text-dim)',
          borderRadius: '50%',
          position: 'absolute',
          top: thumbOffset,
          left: on ? width - thumbSize - thumbOffset : thumbOffset,
          transition: 'left 0.25s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
        }}
      />
    </button>
  );
}
