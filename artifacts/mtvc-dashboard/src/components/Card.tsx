import { ReactNode, CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  accent?: string;
  style?: CSSProperties;
  className?: string;
  title?: string;
  padding?: number | string;
}

export function Card({ children, accent, style, className, title, padding = '14px' }: CardProps) {
  return (
    <div
      className={`glass-card ${className || ''}`}
      style={{
        padding,
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {accent && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${accent}, ${accent}80)`,
          borderRadius: '14px 14px 0 0',
        }} />
      )}
      {title && (
        <div className="label-caps" style={{ marginBottom: 10, marginTop: accent ? 4 : 0 }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
