import { InverterData } from '../../hooks/useLiveData';

interface Props {
  inverter: InverterData;
  onToggle: () => void;
}

function InfoCard({ label, top, bottom, color }: {
  label: string; top: string; bottom: string; color: string;
}) {
  return (
    <div className="card" style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>
        {label}
      </div>
      <div style={{ fontSize: 26, fontWeight: 200, color, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {top}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--label3)' }}>
        {bottom}
      </div>
    </div>
  );
}

function PowerIcon({ size, color }: { size: number; color: string }) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;
  const r = s * 0.34;
  const gapDeg = 60;
  const startRad = ((gapDeg / 2 - 90) * Math.PI) / 180;
  const endRad = ((360 - gapDeg / 2 - 90) * Math.PI) / 180;
  const x1 = cx + r * Math.cos(startRad);
  const y1 = cy + r * Math.sin(startRad);
  const x2 = cx + r * Math.cos(endRad);
  const y2 = cy + r * Math.sin(endRad);
  const lineLen = s * 0.24;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none">
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 1 1 ${x2} ${y2}`}
        stroke={color} strokeWidth={s * 0.08} strokeLinecap="round"
      />
      <line
        x1={cx} y1={cy - lineLen * 0.3}
        x2={cx} y2={cy - r - s * 0.01}
        stroke={color} strokeWidth={s * 0.08} strokeLinecap="round"
      />
    </svg>
  );
}

export function InverterTab({ inverter, onToggle }: Props) {
  const isOn = inverter.isOn;
  const btnColor = isOn ? 'var(--brand)' : 'var(--label3)';
  const btnGlow = isOn
    ? '0 0 48px rgba(109,200,43,0.35), 0 0 96px rgba(109,200,43,0.15)'
    : 'none';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>

      {/* Info cards row */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <InfoCard
          label="AC Output"
          top={isOn ? `${inverter.acVoltage.toFixed(0)} V` : '— V'}
          bottom={isOn ? `${inverter.acHz.toFixed(1)} Hz · ${inverter.outputKw.toFixed(2)} kW` : 'Inverter off'}
          color={isOn ? 'var(--brand)' : 'var(--label3)'}
        />
        <InfoCard
          label="DC Battery"
          top={`${inverter.dcVoltage.toFixed(1)} V`}
          bottom={`${inverter.dcCurrent.toFixed(1)} A draw`}
          color="var(--sys-blue)"
        />
        <InfoCard
          label="Load"
          top={isOn ? `${inverter.loadPct}%` : '—%'}
          bottom={isOn ? 'of rated capacity' : 'Inverter off'}
          color={inverter.loadPct > 80 ? 'var(--sys-red)' : inverter.loadPct > 60 ? 'var(--sys-orange)' : 'var(--label)'}
        />
      </div>

      {/* Power button — fills remaining space */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <button
          onClick={onToggle}
          style={{
            width: 160, height: 160, borderRadius: '50%',
            border: `3px solid ${btnColor}`,
            background: isOn ? 'rgba(109,200,43,0.10)' : 'var(--surface1)',
            cursor: 'pointer',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 10,
            boxShadow: btnGlow,
            transition: 'box-shadow 0.4s ease, background 0.3s ease, border-color 0.3s ease',
          }}
        >
          <PowerIcon size={56} color={btnColor} />
          <span style={{
            fontSize: 15, fontWeight: 700, letterSpacing: '0.08em',
            color: btnColor, transition: 'color 0.3s ease',
          }}>
            {isOn ? 'ON' : 'OFF'}
          </span>
        </button>

        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--label2)' }}>
            {inverter.mode}
          </div>
          <div style={{ fontSize: 11, color: 'var(--label3)', marginTop: 3 }}>
            {isOn ? 'Tap to switch off' : 'Tap to switch on'}
          </div>
        </div>
      </div>
    </div>
  );
}
