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

function StatTile({ label, value, color, sub }: { label: string; value: string; color: string; sub?: string }) {
  return (
    <div style={{
      flex: 1, padding: '12px 14px',
      background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
      border: '1px solid rgba(255,255,255,0.08)', borderTopColor: 'rgba(255,255,255,0.14)',
      borderRadius: 14,
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.07), 0 4px 20px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--label3)', marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ fontSize: 22, fontWeight: 300, color, fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
        {value}
      </div>
      {sub && <div style={{ fontSize: 10, color: 'var(--label3)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function DataRow({ label, value, color, last }: { label: string; value: string; color?: string; last?: boolean }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '9px 14px', minHeight: 36,
      borderBottom: last ? 'none' : '0.5px solid var(--sep)',
    }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--label3)' }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 600, color: color || 'var(--label)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  );
}

function tempColor(t: number) {
  return t <= 0 ? 'var(--label3)' : t < 35 ? 'var(--sys-green)' : t < 50 ? 'var(--sys-orange)' : 'var(--sys-red)';
}

const ALERT_ICON  = { ok: '●', warn: '▲', error: '✕' };
const ALERT_COLOR = { ok: 'var(--sys-green)', warn: 'var(--sys-orange)', error: 'var(--sys-red)' };

export function StatusTab({ inverter, battery, pressure, temps, fans, alerts, uptime }: Props) {
  const socC      = battery.soc > 60 ? 'var(--sys-green)' : battery.soc > 30 ? 'var(--sys-orange)' : 'var(--sys-red)';
  const energyKwh = ((inverter.outputKw * uptime) / 3600).toFixed(2);
  const activeFans = fans.filter(f => f.on).length;

  return (
    <div style={{ display: 'flex', gap: 8, height: '100%', minHeight: 0 }}>

      {/* LEFT column */}
      <div style={{ width: 240, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>

        {/* Uptime + Energy tiles */}
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <StatTile label="Uptime"       value={formatUptime(uptime)} color="var(--brand)" />
          <StatTile label="Energy Today" value={`${energyKwh} kWh`}   color="var(--sys-blue)" />
        </div>

        {/* Temperatures */}
        <div className="card" style={{
          flexShrink: 0,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        }}>
          <div style={{ padding: '8px 14px 0', fontSize: 9, fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--label3)' }}>
            Temperatures
          </div>
          <DataRow label="Cabinet"  value={temps.cabinet  > 0 ? `${temps.cabinet.toFixed(1)} °C`  : '—'} color={tempColor(temps.cabinet)} />
          <DataRow label="Battery"  value={temps.battery  > 0 ? `${temps.battery.toFixed(1)} °C`  : '—'} color={tempColor(temps.battery)} />
          <DataRow label="Inverter" value={temps.inverter > 0 ? `${temps.inverter.toFixed(1)} °C` : '—'} color={tempColor(temps.inverter)} last />
        </div>

        {/* Fans */}
        <div className="card" style={{
          flexShrink: 0,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        }}>
          <div style={{ padding: '8px 14px 0', fontSize: 9, fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--label3)' }}>
            Fans — {activeFans}/{fans.length} active
          </div>
          {fans.map((f, i) => (
            <DataRow
              key={f.id}
              label={f.name}
              value={f.on ? `${f.speed} %` : 'Off'}
              color={f.on ? 'var(--brand)' : 'var(--label3)'}
              last={i === fans.length - 1}
            />
          ))}
        </div>

        {/* Connections */}
        <div className="card" style={{
          flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        }}>
          <div style={{ padding: '8px 14px 0', fontSize: 9, fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--label3)' }}>
            Connections
          </div>
          <DataRow label="VE.Bus"     value={inverter.connected  ? 'Online'    : 'Offline'}      color={inverter.connected  ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <DataRow label="SmartShunt" value={battery.connected   ? 'Connected' : 'Disconnected'} color={battery.connected   ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <DataRow label="Air Sensor" value={pressure.connected  ? 'Online'    : 'Offline'}      color={pressure.connected  ? 'var(--sys-green)' : 'var(--sys-red)'} />
          <DataRow label="Battery"    value={`${battery.soc} %`} color={socC} last />
        </div>
      </div>

      {/* RIGHT: Event log */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div className="card" style={{
          flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0,
          background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
        }}>
          <div style={{ padding: '10px 14px 6px', fontSize: 9, fontWeight: 700, letterSpacing: '0.11em', textTransform: 'uppercase', color: 'var(--label3)', flexShrink: 0, borderBottom: '0.5px solid var(--sep)' }}>
            Event Log
          </div>
          <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {alerts.length === 0 ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <span style={{ fontSize: 13, color: 'var(--label3)' }}>No events</span>
              </div>
            ) : alerts.map((a, i) => (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '0 14px', minHeight: 38,
                borderBottom: i < alerts.length - 1 ? '0.5px solid var(--sep)' : 'none',
              }}>
                <span style={{ fontSize: 11, color: ALERT_COLOR[a.type], width: 12, textAlign: 'center', flexShrink: 0 }}>
                  {ALERT_ICON[a.type]}
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
