interface StatRowProps {
  label: string;
  value: string | number;
  valueColor?: string;
  accent?: boolean;
}

export function StatRow({ label, value, valueColor }: StatRowProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '6px 10px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: 8,
      border: '1px solid rgba(255,255,255,0.05)',
      marginBottom: 3,
    }}>
      <span style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: 'var(--text-lo)',
        fontFamily: 'Rajdhani, sans-serif',
      }}>
        {label}
      </span>
      <span className="mono" style={{
        fontSize: 13,
        color: valueColor || 'var(--text-hi)',
        fontWeight: valueColor ? 600 : 400,
      }}>
        {value}
      </span>
    </div>
  );
}
