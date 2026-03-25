interface ToggleProps {
  on: boolean;
  onToggle: () => void;
  color?: string;
  size?: 'sm' | 'md';
}

export function Toggle({ on, onToggle, color = 'var(--sys-green)', size = 'md' }: ToggleProps) {
  const W = size === 'sm' ? 38 : 50;
  const H = size === 'sm' ? 22 : 30;
  const T = H - 4;

  return (
    <button onClick={e => { e.stopPropagation(); onToggle(); }} style={{
      width: W, height: H, borderRadius: H / 2,
      background: on ? color : 'var(--surface3)',
      border: 'none', cursor: 'pointer', flexShrink: 0, position: 'relative',
      transition: 'background 0.25s var(--ease)',
      boxShadow: 'inset 0 0 0 0.5px rgba(255,255,255,0.10)',
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? W - T - 2 : 2,
        width: T, height: T, borderRadius: '50%',
        background: 'white',
        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
        transition: 'left 0.25s var(--ease)',
      }} />
    </button>
  );
}
