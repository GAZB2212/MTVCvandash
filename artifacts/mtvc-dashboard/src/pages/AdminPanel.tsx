import { useState, useEffect } from 'react';
import { VanConfigAPI } from '../hooks/useVanConfig';
import { Toggle } from '../components/Toggle';
import { TouchKeyboard } from '../components/TouchKeyboard';
import { KeyboardProvider, useKeyboard } from '../context/KeyboardContext';

const KB_HEIGHT = 248; // approximate keyboard panel height in px

interface Props {
  api: VanConfigAPI;
  onClose: () => void;
}

/* ── Touch-friendly text input — opens the on-screen keyboard ── */
function TouchInput({
  id, value, onChange, onDone, width, align,
}: {
  id: string; value: string;
  onChange: (v: string) => void; onDone?: () => void;
  width?: number | string; align?: 'left' | 'right';
}) {
  const { openKeyboard, activeId, isOpen } = useKeyboard();
  const isActive = isOpen && activeId === id;

  return (
    <div
      onClick={() => openKeyboard(id, value, onChange, onDone)}
      style={{
        display: 'flex', alignItems: 'center', gap: 4,
        background: isActive ? 'rgba(109,200,43,0.08)' : 'var(--surface2)',
        border: `1px solid ${isActive ? 'var(--brand)' : 'var(--sep)'}`,
        borderRadius: 7, padding: '5px 10px',
        fontSize: 13, fontWeight: 500,
        color: value ? 'var(--label)' : 'var(--label3)',
        cursor: 'text', userSelect: 'none', WebkitUserSelect: 'none',
        width, minWidth: 0,
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        transition: 'border-color 0.2s, background 0.2s',
      }}
    >
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {value || <span style={{ color: 'var(--label3)' }}>Tap to edit</span>}
      </span>
      {isActive
        ? <span style={{ animation: 'cursor-blink 1s step-end infinite', color: 'var(--brand)', flexShrink: 0 }}>|</span>
        : <span style={{ fontSize: 10, color: 'var(--label3)', flexShrink: 0, marginLeft: 4 }}>✎</span>
      }
    </div>
  );
}

function SectionHead({ children }: { children: string }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 600, color: 'var(--label3)',
      letterSpacing: '0.06em', textTransform: 'uppercase',
      padding: '14px 16px 6px',
    }}>
      {children}
    </div>
  );
}

function EditRow({
  id, label, name, enabled, onName, onToggle, accent,
}: {
  id: string; label: string; name: string; enabled: boolean;
  onName: (v: string) => void; onToggle: () => void; accent?: string;
}) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 16px', borderBottom: '0.5px solid var(--sep)',
      opacity: enabled ? 1 : 0.5,
    }}>
      <div style={{
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
        background: enabled ? (accent || 'var(--brand)') : 'var(--surface3)',
      }} />
      <span style={{ fontSize: 11, color: 'var(--label3)', fontWeight: 500, minWidth: 54, flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <TouchInput id={id} value={name} onChange={onName} />
      </div>
      <Toggle on={enabled} onToggle={onToggle} color="var(--brand)" size="sm" />
    </div>
  );
}

function toLocalInputs(ms: number) {
  const d = new Date(ms);
  const pad = (n: number) => String(n).padStart(2, '0');
  return {
    date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
    time: `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`,
  };
}

function AdminContent({ api, onClose }: Props) {
  const { config, setVanName, setLightConfig, setFanConfig, setDateTimeOffset, resetConfig } = api;
  const [vanDraft, setVanDraft] = useState(config.vanName);
  const [confirmReset, setConfirmReset] = useState(false);
  const { isOpen: kbOpen } = useKeyboard();

  const currentDisplayMs = Date.now() + (config.dateTimeOffset ?? 0);
  const [dtDate, setDtDate] = useState(() => toLocalInputs(currentDisplayMs).date);
  const [dtTime, setDtTime] = useState(() => toLocalInputs(currentDisplayMs).time);

  useEffect(() => {
    const target = new Date(`${dtDate}T${dtTime}`).getTime();
    if (!isNaN(target)) setDateTimeOffset(target - Date.now());
  }, [dtDate, dtTime]);

  const resetDateTime = () => {
    setDateTimeOffset(0);
    const { date, time } = toLocalInputs(Date.now());
    setDtDate(date);
    setDtTime(time);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.90)',
      backdropFilter: 'blur(40px) saturate(1.4)',
      WebkitBackdropFilter: 'blur(40px) saturate(1.4)',
      display: 'flex', flexDirection: 'column',
      animation: 'slide-in 0.2s ease both',
    }}>
      {/* Header */}
      <div style={{
        height: 52, display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12,
        borderBottom: '0.5px solid var(--sep)', flexShrink: 0,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--label)' }}>Van Configuration</div>
          <div style={{ fontSize: 11, color: 'var(--label3)', marginTop: 1 }}>Changes save automatically</div>
        </div>
        <button onClick={onClose} style={{
          padding: '6px 18px', borderRadius: 99, border: 'none', cursor: 'pointer',
          background: 'var(--brand)', color: '#000', fontSize: 13, fontWeight: 700,
          fontFamily: 'inherit',
        }}>Done</button>
      </div>

      {/* Scrollable content — shrinks when keyboard is open */}
      <div style={{
        flex: 1, overflowY: 'auto',
        paddingBottom: kbOpen ? KB_HEIGHT + 8 : 8,
        transition: 'padding-bottom 0.18s ease',
      }}>
        {/* Van Name */}
        <SectionHead>Van Identity</SectionHead>
        <div style={{ background: 'var(--surface1)', borderRadius: 12, margin: '0 12px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--label)', flex: 1 }}>Name</span>
            <TouchInput
              id="van-name"
              value={vanDraft}
              onChange={v => { setVanDraft(v); setVanName(v || config.vanName); }}
              width={180}
              align="right"
            />
          </div>
        </div>

        {/* Date & Time */}
        <SectionHead>Date &amp; Time</SectionHead>
        <div style={{ background: 'var(--surface1)', borderRadius: 12, margin: '0 12px 4px', overflow: 'hidden' }}>
          {[
            { label: 'Date', type: 'date', value: dtDate, onChange: (v: string) => setDtDate(v) },
            { label: 'Time', type: 'time', value: dtTime, onChange: (v: string) => setDtTime(v), extra: { step: '1' } },
          ].map(({ label, type, value, onChange, extra }, i, arr) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px',
              borderBottom: i < arr.length - 1 ? '0.5px solid var(--sep)' : 'none',
            }}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--label)', flex: 1 }}>{label}</span>
              <input
                type={type} value={value} onChange={e => onChange(e.target.value)} {...(extra || {})}
                style={{
                  background: 'var(--surface2)', border: '1px solid var(--sep)',
                  borderRadius: 7, padding: '5px 10px', fontSize: 13, fontWeight: 500,
                  color: 'var(--label)', outline: 'none', fontFamily: 'inherit',
                  colorScheme: 'dark',
                }}
              />
            </div>
          ))}
          <div style={{ padding: '8px 16px 10px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: 'var(--label3)', flex: 1 }}>Adjusts the clock offset on the cab display.</span>
            <button onClick={resetDateTime} style={{
              padding: '4px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: 'var(--surface2)', fontSize: 11, fontWeight: 600,
              color: 'var(--label3)', fontFamily: 'inherit',
            }}>Use System Time</button>
          </div>
        </div>

        {/* Lighting zones */}
        <SectionHead>Lighting Zones</SectionHead>
        <div style={{ background: 'var(--surface1)', borderRadius: 12, margin: '0 12px 4px', overflow: 'hidden' }}>
          {config.lights.map((light, i) => (
            <EditRow
              key={light.id}
              id={`light-${light.id}`}
              label={`Zone ${i + 1}`}
              name={light.name}
              enabled={light.enabled}
              accent={light.name === 'Emergency' ? 'var(--sys-red)' : 'var(--brand)'}
              onName={name => setLightConfig(light.id, { name })}
              onToggle={() => setLightConfig(light.id, { enabled: !light.enabled })}
            />
          ))}
          <div style={{ padding: '6px 16px 10px' }}>
            <span style={{ fontSize: 11, color: 'var(--label3)' }}>
              Disabled zones are hidden from the dashboard and cab display.
            </span>
          </div>
        </div>

        {/* Fan channels */}
        <SectionHead>Fan Channels</SectionHead>
        <div style={{ background: 'var(--surface1)', borderRadius: 12, margin: '0 12px 4px', overflow: 'hidden' }}>
          {config.fans.map((fan, i) => (
            <EditRow
              key={fan.id}
              id={`fan-${fan.id}`}
              label={`Fan ${i + 1}`}
              name={fan.name}
              enabled={fan.enabled}
              onName={name => setFanConfig(fan.id, { name })}
              onToggle={() => setFanConfig(fan.id, { enabled: !fan.enabled })}
            />
          ))}
          <div style={{ padding: '6px 16px 10px' }}>
            <span style={{ fontSize: 11, color: 'var(--label3)' }}>
              Disabled fans are hidden from the dashboard.
            </span>
          </div>
        </div>

        {/* Reset */}
        <SectionHead>Reset</SectionHead>
        <div style={{ background: 'var(--surface1)', borderRadius: 12, margin: '0 12px 16px', overflow: 'hidden' }}>
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} style={{
              width: '100%', padding: '12px 16px', background: 'transparent', border: 'none',
              cursor: 'pointer', fontSize: 13, fontWeight: 500, color: 'var(--sys-red)',
              textAlign: 'left', fontFamily: 'inherit',
            }}>
              Reset to factory defaults…
            </button>
          ) : (
            <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 13, color: 'var(--label2)', flex: 1 }}>Reset all names and re-enable all outputs?</span>
              <button onClick={() => setConfirmReset(false)} style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'var(--surface2)', fontSize: 12, fontWeight: 600,
                color: 'var(--label2)', fontFamily: 'inherit',
              }}>Cancel</button>
              <button onClick={() => { resetConfig(); setVanDraft('Van 01'); setConfirmReset(false); }} style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'var(--sys-red)', fontSize: 12, fontWeight: 700,
                color: '#fff', fontFamily: 'inherit',
              }}>Reset</button>
            </div>
          )}
        </div>
      </div>

      {/* On-screen keyboard */}
      <TouchKeyboard />
    </div>
  );
}

export function AdminPanel({ api, onClose }: Props) {
  return (
    <KeyboardProvider>
      <AdminContent api={api} onClose={onClose} />
    </KeyboardProvider>
  );
}
