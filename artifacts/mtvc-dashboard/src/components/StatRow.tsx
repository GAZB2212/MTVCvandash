interface StatRowProps {
  label: string;
  value: string | number;
  valueColor?: string;
  last?: boolean;
}

export function StatRow({ label, value, valueColor, last }: StatRowProps) {
  return (
    <div className="list-row" style={{ borderBottom: last ? 'none' : undefined }}>
      <span className="list-row-label">{label}</span>
      <span className="list-row-value" style={valueColor ? { color: valueColor, fontWeight: 500 } : {}}>
        {value}
      </span>
    </div>
  );
}
