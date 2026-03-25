import { StatRow } from '../../components/StatRow';
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

export function StatusTab({ inverter, battery, pressure, alerts, uptime }: Props) {
  const socC  = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const tempC = inverter.temp < 45 ? 'var(--sys-green)' : inverter.temp < 60 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const deltaC = battery.delta > 10 ? 'var(--sys-red)' : battery.delta > 5 ? 'var(--sys-orange)' : 'var(--sys-green)';
  const energyKwh = ((inverter.outputKw * uptime) / 3600).toFixed(2);

  const alertIcon = { ok: '●', warn: '▲', error: '✕' };
  const alertColor = { ok: 'var(--sys-green)', warn: 'var(--sys-orange)', error: 'var(--sys-red)' };

  return (
    <div className="slide-in" style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      {/* Uptime + Energy */}
      <div style={{ display: 'flex', gap: 10 }}>
        {[
          { label: 'Uptime',       value: formatUptime(uptime),     color: 'var(--brand)' },
          { label: 'Energy Today', value: `${energyKwh} kWh`,       color: 'var(--sys-blue)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ flex: 1, padding: '14px 16px' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
            <div style={{ fontSize: 26, fontWeight: 200, color, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* System health */}
      <div>
        <div className="section-header">System Health</div>
        <div className="card">
          <StatRow label="VE.Bus"          value={inverter.connected ? 'Online'      : 'Offline'}      valueColor={inverter.connected  ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <StatRow label="BMS Bluetooth"   value={battery.connected  ? 'Connected'   : 'Disconnected'} valueColor={battery.connected   ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <StatRow label="Pressure Sensor" value={pressure.connected ? 'Online'      : 'Offline'}      valueColor={pressure.connected  ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <StatRow label="Battery SOC"     value={`${battery.soc}%`}                                   valueColor={socC} />
          <StatRow label="Cell Delta"      value={`${battery.delta} mV`}                               valueColor={deltaC} />
          <StatRow label="Inverter Temp"   value={`${inverter.temp}°C`}                                valueColor={tempC} last />
        </div>
      </div>

      {/* Event log */}
      <div>
        <div className="section-header">Event Log</div>
        <div className="card">
          {alerts.map((a, i) => (
            <div key={a.id} className="list-row" style={{ borderBottom: i < alerts.length - 1 ? undefined : 'none', gap: 10 }}>
              <span style={{ fontSize: 11, color: alertColor[a.type], width: 12, textAlign: 'center', flexShrink: 0 }}>
                {alertIcon[a.type]}
              </span>
              <span className="list-row-label" style={{ flex: 1, color: 'var(--label2)', fontSize: 12 }}>{a.msg}</span>
              <span style={{ fontSize: 11, color: 'var(--label3)', fontVariantNumeric: 'tabular-nums' }}>{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
