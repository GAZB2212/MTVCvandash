import { AlertData, BatteryData, InverterData, PressureData, TempData, FanData } from '../../hooks/useLiveData';

interface Props {
  inverter: InverterData; battery: BatteryData; pressure: PressureData;
  temps: TempData; fans: FanData[];
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

function tempColor(t: number) {
  return t <= 0 ? 'var(--label3)' : t < 35 ? 'var(--sys-green)' : t < 50 ? 'var(--sys-orange)' : 'var(--sys-red)';
}

export function StatusTab({ inverter, battery, pressure, temps, fans, alerts, uptime }: Props) {
  const socC       = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const energyKwh  = ((inverter.outputKw * uptime) / 3600).toFixed(2);
  const activeFans = fans.filter(f => f.on).length;

  const alertIcon  = { ok: '●', warn: '▲', error: '✕' };
  const alertColor = { ok: 'var(--sys-green)', warn: 'var(--sys-orange)', error: 'var(--sys-red)' };

  return (
    <div style={{ display: 'flex', gap: 8, height: '100%', minHeight: 0 }}>

      {/* LEFT column */}
      <div style={{ width: 230, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>

        {/* Uptime + Energy */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {[
            { label: 'Uptime',       value: formatUptime(uptime), color: 'var(--brand)' },
            { label: 'Energy Today', value: `${energyKwh} kWh`,  color: 'var(--sys-blue)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ flex: 1, padding: '10px 12px' }}>
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--label3)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 18, fontWeight: 200, color, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Temperatures */}
        <div className="card" style={{ flexShrink: 0 }}>
          <div style={{ padding: '7px 12px 0', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>Temperatures</div>
          <DRow label="Cabinet"  value={temps.cabinet  > 0 ? `${temps.cabinet.toFixed(1)}°C`  : '—'} color={tempColor(temps.cabinet)} />
          <DRow label="Battery"  value={temps.battery  > 0 ? `${temps.battery.toFixed(1)}°C`  : '—'} color={tempColor(temps.battery)} />
          <DRow label="Inverter" value={temps.inverter > 0 ? `${temps.inverter.toFixed(1)}°C` : '—'} color={tempColor(temps.inverter)} last />
        </div>

        {/* Fans */}
        <div className="card" style={{ flexShrink: 0 }}>
          <div style={{ padding: '7px 12px 0', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>
            Fans — {activeFans}/{fans.length} on
          </div>
          {fans.map((f, i) => (
            <DRow
              key={f.id}
              label={f.name}
              value={f.on ? `${f.speed}%` : 'Off'}
              color={f.on ? 'var(--brand)' : 'var(--label3)'}
              last={i === fans.length - 1}
            />
          ))}
        </div>

        {/* Connections */}
        <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <div style={{ padding: '7px 12px 0', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--label3)' }}>Connections</div>
          <DRow label="VE.Bus"      value={inverter.connected ? 'Online'    : 'Offline'}      color={inverter.connected  ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <DRow label="SmartShunt"  value={battery.connected  ? 'Connected' : 'Disconnected'} color={battery.connected   ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <DRow label="Air Sensor"  value={pressure.connected ? 'Online'    : 'Offline'}      color={pressure.connected  ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <DRow label="Battery SOC" value={`${battery.soc}%`}                                 color={socC} last />
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
