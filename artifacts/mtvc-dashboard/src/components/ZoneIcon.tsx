export type IconType = 'light' | 'water' | 'power' | 'fan' | 'step' | 'tools' | 'switch' | 'emergency';

export const ICON_TYPES: IconType[] = [
  'light', 'water', 'power', 'fan', 'step', 'tools', 'switch', 'emergency',
];

export const ICON_LABELS: Record<IconType, string> = {
  light:     'Light',
  water:     'Water',
  power:     'Power',
  fan:       'Fan',
  step:      'Step',
  tools:     'Tools',
  switch:    'Switch',
  emergency: 'Emergency',
};

export function ZoneIcon({ type, color, size = 52 }: { type: string; color: string; size?: number }) {
  const sw = size >= 36 ? '1.7' : '1.9';
  const base = {
    fill: 'none' as const,
    stroke: color,
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (type) {

    case 'water':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"
            fill={color} fillOpacity={0.22} {...base}
          />
        </svg>
      );

    case 'power':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <polygon
            points="13,2 13,10 20,10 11,22 11,14 4,14"
            fill={color} fillOpacity={0.22} {...base}
          />
        </svg>
      );

    case 'fan':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M12 10C12 7 9.5 4.5 7 5S4.5 8 7 10z"
            fill={color} fillOpacity={0.30}
            stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 12C17 12 19.5 9.5 19 7S16 4.5 14 7z"
            fill={color} fillOpacity={0.30}
            stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 14C12 17 14.5 19.5 17 19S19.5 16 17 14z"
            fill={color} fillOpacity={0.30}
            stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M10 12C7 12 4.5 14.5 5 17S8 19.5 10 17z"
            fill={color} fillOpacity={0.30}
            stroke={color} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="2.2" fill={color} />
        </svg>
      );

    case 'step':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M2 20h4v-4h4v-4h4v-4h4v-4h4" {...base} />
        </svg>
      );

    case 'tools':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"
            {...base}
          />
        </svg>
      );

    case 'switch':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path d="M18.36 6.64a9 9 0 11-12.73 0" {...base} />
          <line x1="12" y1="2" x2="12" y2="12" {...base} />
        </svg>
      );

    case 'emergency':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            fill={color} fillOpacity={0.22} {...base}
          />
          <line x1="12" y1="9" x2="12" y2="13" {...base} />
          <circle cx="12" cy="17" r="0.9" fill={color} stroke="none" />
        </svg>
      );

    default: /* light */
      return (
        <svg width={size} height={size} viewBox="0 0 24 24">
          <path
            d="M9 21h6M12 3a6 6 0 014.243 10.243C15.368 14.12 15 15.03 15 16v1H9v-1c0-.97-.368-1.88-1.243-2.757A6 6 0 0112 3z"
            fill={color} fillOpacity={0.22} {...base}
          />
          <line x1="9" y1="17" x2="15" y2="17" {...base} />
        </svg>
      );
  }
}
