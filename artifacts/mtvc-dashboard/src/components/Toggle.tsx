interface ToggleProps {
  on: boolean;
  onToggle: () => void;
  color?: string;
  size?: 'sm' | 'md';
}

export function Toggle({ on, onToggle, color = 'var(--brand)', size = 'md' }: ToggleProps) {
  const w = size === 'sm' ? 36 : 44;
  const h = size === 'sm' ? 20 : 24;
  const thumb = size === 'sm' ? 16 : 20;
  const pad = 2;

  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      style={{
        width: w, height: h, borderRadius: h,
        background: on
          ? `linear-gradient(135deg, ${color}, ${color}cc)`
          : 'rgba(255,255,255,0.10)',
        border: `1px solid ${on ? `${color}80` : 'rgba(255,255,255,0.12)'}`,
        position: 'relative', cursor: 'pointer', flexShrink: 0,
        boxShadow: on ? `0 0 12px ${color}50` : 'none',
      }}
    >
      <div style={{
        width: thumb, height: thumb,
        background: 'white',
        borderRadius: '50%',
        position: 'absolute',
        top: pad,
        left: on ? w - thumb - pad : pad,
        boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
        transition: 'left 0.22s cubic-bezier(0.4,0,0.2,1)',
      }} />
    </button>
  );
}
