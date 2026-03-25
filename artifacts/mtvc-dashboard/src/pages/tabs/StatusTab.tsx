import { AlertData, BatteryData, InverterData, PressureData } from '../../hooks/useLiveData';

interface Props {
  inverter: InverterData; battery: BatteryData; pressure: PressureData;
  alerts: AlertData[]; uptime: number;
}

function formatUptime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

function DRow({ label, value, color, last }: { label: string; value: string; color?: string; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 12px', flex: 1,
      borderBottom: last ? 'none' : '0.5px solid var(--sep)',
    }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--label2)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 500, color: color || 'var(--label)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

export function StatusTab({ inverter, battery, pressure, alerts, uptime }: Props) {
  const socC   = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const tempC  = inverter.temp < 45 ? 'var(--sys-green)' : inverter.temp < 60 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const deltaC = battery.delta > 10 ? 'var(--sys-red)' : battery.delta > 5 ? 'var(--sys-orange)' : 'var(--sys-green)';
  const energyKwh = ((inverter.outputKw * uptime) / 3600).toFixed(2);

  const alertIcon  = { ok: '●', warn: '▲', error: '✕' };
  const alertColor = { ok: 'var(--sys-green)', warn: 'var(--sys-orange)', error: 'var(--sys-red)' };

  return (
    <div style={{ display: 'flex', gap: 8, height: '100%', minHeight: 0 }}>

      {/* LEFT: Overview stats */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0 }}>
        {/* Uptime + Energy chips */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {[
            { label: 'Uptime',       value: formatUptime(uptime), color: 'var(--brand)' },
            { label: 'Energy Today', value: `${energyKwh} kWh`,  color: 'var(--sys-blue)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ flex: 1, padding: '10px 14px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>{label}</div>
              <div style={{ fontSize: 22, fontWeight: 200, color, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* System health — grows to fill */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '7px 12px 0', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>System Health</div>
          <DRow label="VE.Bus"          value={inverter.connected ? 'Online'      : 'Offline'}      color={inverter.connected  ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <DRow label="BMS"             value={battery.connected  ? 'Connected'   : 'Disconnected'} color={battery.connected   ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <DRow label="Air Sensor"      value={pressure.connected ? 'Online'      : 'Offline'}      color={pressure.connected  ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <DRow label="Battery SOC"     value={`${battery.soc}%`}                                   color={socC} />
          <DRow label="Cell Delta"      value={`${battery.delta} mV`}                               color={deltaC} />
          <DRow label="Inverter Temp"   value={`${inverter.temp}°C`}                                color={tempC} last />
        </div>
      </div>

      {/* RIGHT: Event log */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '7px 12px 0', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)', flexShrink: 0 }}>Event Log</div>
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {alerts.map((a, i) => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '0 12px', minHeight: 36,
                borderBottom: i < alerts.length - 1 ? '0.5px solid var(--sep)' : 'none',
                flex: 1,
              }}>
                <span style={{ fontSize: 10, color: alertColor[a.type], width: 10, textAlign: 'center', flexShrink: 0 }}>
                  {alertIcon[a.type]}
                </span>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 400, color: 'var(--label2)' }}>{a.msg}</span>
                <span style={{ fontSize: 11, color: 'var(--label3)', fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
