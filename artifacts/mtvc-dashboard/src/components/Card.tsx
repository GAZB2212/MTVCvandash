import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  accent?: string;
  style?: CSSProperties;
  className?: string;
  title?: string;
}

export function Card({ children, accent, style, className, title }: CardProps) {
  return (
    <div
      className={className}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-color)',
        borderTop: accent ? `2px solid ${accent}` : '1px solid var(--border-color)',
        borderRadius: 4,
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        padding: '10px',
        ...style,
      }}
    >
      {title && (
        <div
          style={{
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-dim)',
            fontFamily: 'Rajdhani, sans-serif',
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
