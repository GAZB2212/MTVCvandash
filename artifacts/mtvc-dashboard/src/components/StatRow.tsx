interface StatRowProps {
  label: string;
  value: string | number;
  valueColor?: string;
  accent?: boolean;
}

export function StatRow({ label, value, valueColor, accent }: StatRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5px 8px',
        background: 'var(--surface2)',
        borderRadius: 3,
        borderLeft: accent ? `2px solid ${valueColor || 'var(--amber)'}` : 'none',
        marginBottom: 2,
      }}
    >
      <span
        style={{
          fontSize: 10,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--text-dim)',
          fontFamily: 'Rajdhani, sans-serif',
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      <span
        className="font-mono-data"
        style={{
          fontSize: 13,
          color: valueColor || 'var(--text)',
          fontFamily: 'Share Tech Mono, monospace',
        }}
      >
        {value}
      </span>
    </div>
  );
}
