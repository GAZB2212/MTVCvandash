import { Card } from '../../components/Card';
import { AlertData, BatteryData, InverterData, PressureData } from '../../hooks/useLiveData';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  inverter: InverterData;
  battery: BatteryData;
  pressure: PressureData;
  alerts: AlertData[];
  uptime: number;
}

function formatUptime(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
}

export function StatusTab({ inverter, battery, pressure, alerts, uptime }: Props) {
  const { isDark } = useTheme();
  const brand = isDark ? '#6DC82B' : '#4A8A18';
  const blue  = isDark ? '#38BDF8' : '#0284C7';
  const green = isDark ? '#34D399' : '#059669';
  const red   = isDark ? '#F87171' : '#DC2626';
  const amber = isDark ? '#FBB040' : '#D97706';

  const tiles = [
    { label: 'VE.Bus',          value: inverter.connected       ? 'Online'      : 'Offline',      color: inverter.connected       ? green : red },
    { label: 'BMS Bluetooth',   value: battery.connected        ? 'Connected'   : 'Disconnected', color: battery.connected        ? green : red },
    { label: 'Pressure Sensor', value: pressure.connected       ? 'Online'      : 'Offline',      color: pressure.connected       ? green : red },
    { label: 'Inverter Temp',   value: `${inverter.temp}°C`,                                      color: inverter.temp < 45 ? green : inverter.temp < 60 ? amber : red },
    { label: 'Cell Delta',      value: `${battery.delta} mV`,                                     color: battery.delta < 10 ? green : amber },
    { label: 'Battery SOC',     value: `${battery.soc}%`,                                         color: battery.soc > 60 ? green : battery.soc > 30 ? amber : red },
  ];

  const alertCfg = {
    ok:    { color: green,  icon: '●' },
    warn:  { color: amber,  icon: '▲' },
    error: { color: red,    icon: '✕' },
  };

  const energyKwh = ((inverter.outputKw * uptime) / 3600).toFixed(2);

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {/* Health grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        {tiles.map(t => (
          <div key={t.label} className="glass-card-mid" style={{ padding: '8px 10px', borderLeft: `2px solid ${t.color}` }}>
            <div className="label-caps" style={{ marginBottom: 4 }}>{t.label}</div>
            <div className="mono" style={{ fontSize: 13, color: t.color }}>{t.value}</div>
          </div>
        ))}
      </div>

      {/* Uptime + Energy */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Card accent={brand}>
          <div className="label-caps" style={{ marginBottom: 6, marginTop: 4 }}>Uptime</div>
          <div className="mono" style={{ fontSize: 26, color: brand }}>{formatUptime(uptime)}</div>
        </Card>
        <Card accent={blue}>
          <div className="label-caps" style={{ marginBottom: 6, marginTop: 4 }}>Energy Today</div>
          <div className="mono" style={{ fontSize: 26, color: blue }}>{energyKwh} <span style={{ fontSize: 14, opacity: 0.7 }}>kWh</span></div>
        </Card>
      </div>

      {/* Event log */}
      <Card title="Event Log">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {alerts.map(a => {
            const cfg = alertCfg[a.type];
            return (
              <div key={a.id} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '6px 10px', background: 'rgba(255,255,255,0.03)',
                borderRadius: 8, border: '1px solid rgba(255,255,255,0.05)',
                borderLeft: `2px solid ${cfg.color}`,
              }}>
                <span style={{ color: cfg.color, fontSize: 11, width: 14, textAlign: 'center' }}>{cfg.icon}</span>
                <span style={{ flex: 1, fontSize: 11, color: 'var(--text-mid)' }}>{a.msg}</span>
                <span className="mono" style={{ fontSize: 10, color: 'var(--text-lo)' }}>{a.time}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
