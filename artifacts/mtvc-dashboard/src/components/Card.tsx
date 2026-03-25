import { ReactNode, CSSProperties } from 'react';

export function Card({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="card" style={style}>
      {children}
    </div>
  );
}

export function SectionHeader({ children }: { children: ReactNode }) {
  return <div className="section-header">{children}</div>;
}
