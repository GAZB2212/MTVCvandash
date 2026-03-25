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

function formatUptime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function StatusTab({ inverter, battery, pressure, alerts, uptime }: Props) {
  const { isDark } = useTheme();
  const amber = isDark ? '#6DC82B' : '#4A8A18';
  const green = isDark ? '#22C55E' : '#15803D';
  const red = isDark ? '#EF4444' : '#B91C1C';
  const blue = isDark ? '#38BDF8' : '#0369A1';

  const healthTiles = [
    { label: 'VE.Bus', value: inverter.connected ? 'Online' : 'Offline', color: inverter.connected ? green : red },
    { label: 'BMS Bluetooth', value: battery.connected ? 'Connected' : 'Disconnected', color: battery.connected ? green : red },
    { label: 'Pressure Sensor', value: pressure.connected ? 'Online' : 'Offline', color: pressure.connected ? green : red },
    { label: 'Inverter Temp', value: `${inverter.temp}°C`, color: inverter.temp < 45 ? green : inverter.temp < 60 ? amber : red },
    { label: 'Cell Delta', value: `${battery.delta} mV`, color: battery.delta < 10 ? green : amber },
    { label: 'Battery SOC', value: `${battery.soc}%`, color: battery.soc > 60 ? green : battery.soc > 30 ? amber : red },
  ];

  const alertTypeConfig = {
    ok: { color: green, icon: '●' },
    warn: { color: amber, icon: '▲' },
    error: { color: red, icon: '✕' },
  };

  const energyKwh = ((inverter.outputKw * uptime) / 3600).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {/* Health Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
        {healthTiles.map(tile => (
          <div
            key={tile.label}
            style={{
              background: 'var(--surface)',
              border: `1px solid ${tile.color}40`,
              borderLeft: `2px solid ${tile.color}`,
              borderRadius: 4,
              padding: '6px 8px',
            }}
          >
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-dim)', marginBottom: 4, fontWeight: 700 }}>
              {tile.label}
            </div>
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 13, color: tile.color }}>
              {tile.value}
            </div>
          </div>
        ))}
      </div>

      {/* Uptime + Energy */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <Card accent={amber}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 6, fontWeight: 700 }}>
            UPTIME
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 22, color: amber }}>
            {formatUptime(uptime)}
          </div>
        </Card>
        <Card accent={blue}>
          <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-dim)', marginBottom: 6, fontWeight: 700 }}>
            ENERGY TODAY
          </div>
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 22, color: blue }}>
            {energyKwh} kWh
          </div>
        </Card>
      </div>

      {/* Event Log */}
      <Card accent={amber} title="EVENT LOG">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {alerts.map(alert => {
            const cfg = alertTypeConfig[alert.type];
            return (
              <div
                key={alert.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '5px 8px',
                  background: 'var(--surface2)',
                  borderRadius: 3,
                  borderLeft: `2px solid ${cfg.color}`,
                }}
              >
                <span style={{ color: cfg.color, fontSize: 12, width: 14, textAlign: 'center' }}>{cfg.icon}</span>
                <span style={{ flex: 1, fontSize: 11, color: 'var(--text)' }}>{alert.msg}</span>
                <span style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 10, color: 'var(--text-dim)' }}>{alert.time}</span>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
