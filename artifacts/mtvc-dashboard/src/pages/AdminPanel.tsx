import { useState } from 'react';
import { VanConfigAPI } from '../hooks/useVanConfig';
import { Toggle } from '../components/Toggle';

interface Props {
  api: VanConfigAPI;
  onClose: () => void;
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
  label, name, enabled,
  onName, onToggle, accent,
}: {
  label: string; name: string; enabled: boolean;
  onName: (v: string) => void; onToggle: () => void;
  accent?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);

  const commit = () => {
    const trimmed = draft.trim();
    if (trimmed) onName(trimmed);
    else setDraft(name);
    setEditing(false);
  };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '9px 16px', borderBottom: '0.5px solid var(--sep)',
      background: enabled ? 'transparent' : 'rgba(255,255,255,0.01)',
      opacity: enabled ? 1 : 0.5,
    }}>
      {/* Colour dot */}
      <div style={{
        width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
        background: enabled ? (accent || 'var(--brand)') : 'var(--surface3)',
      }} />

      {/* Default label */}
      <span style={{
        fontSize: 11, color: 'var(--label3)', fontWeight: 500,
        minWidth: 54, flexShrink: 0,
      }}>{label}</span>

      {/* Editable name */}
      {editing ? (
        <input
          autoFocus
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(name); setEditing(false); } }}
          style={{
            flex: 1, background: 'var(--surface2)', border: '1px solid var(--brand)',
            borderRadius: 7, padding: '4px 10px', fontSize: 13, fontWeight: 500,
            color: 'var(--label)', outline: 'none', fontFamily: 'inherit',
          }}
        />
      ) : (
        <button onClick={() => { setDraft(name); setEditing(true); }} style={{
          flex: 1, textAlign: 'left', background: 'var(--surface2)',
          border: '1px solid transparent', borderRadius: 7, padding: '5px 10px',
          fontSize: 13, fontWeight: 500, color: 'var(--label)', cursor: 'text',
          fontFamily: 'inherit',
        }}>
          {name}
          <span style={{ fontSize: 10, color: 'var(--label3)', marginLeft: 8 }}>✎</span>
        </button>
      )}

      {/* Enable / disable */}
      <Toggle on={enabled} onToggle={onToggle} color="var(--brand)" size="sm" />
    </div>
  );
}

export function AdminPanel({ api, onClose }: Props) {
  const { config, setVanName, setLightConfig, setFanConfig, resetConfig } = api;
  const [vanDraft, setVanDraft] = useState(config.vanName);
  const [confirmReset, setConfirmReset] = useState(false);

  const commitVanName = () => {
    const t = vanDraft.trim();
    if (t) setVanName(t);
    else setVanDraft(config.vanName);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.88)',
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
        }}>Done</button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Van Name */}
        <SectionHead>Van Identity</SectionHead>
        <div style={{ background: 'var(--surface1)', borderRadius: 12, margin: '0 12px 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--label)', flex: 1 }}>Name</span>
            <input
              value={vanDraft}
              onChange={e => setVanDraft(e.target.value)}
              onBlur={commitVanName}
              onKeyDown={e => e.key === 'Enter' && commitVanName()}
              style={{
                background: 'var(--surface2)', border: '1px solid var(--sep)',
                borderRadius: 7, padding: '5px 10px', fontSize: 13, fontWeight: 500,
                color: 'var(--label)', outline: 'none', fontFamily: 'inherit', width: 180,
                textAlign: 'right',
              }}
            />
          </div>
        </div>

        {/* Lighting zones */}
        <SectionHead>Lighting Zones</SectionHead>
        <div style={{ background: 'var(--surface1)', borderRadius: 12, margin: '0 12px 4px', overflow: 'hidden' }}>
          {config.lights.map((light, i) => (
            <EditRow
              key={light.id}
              label={`Zone ${i + 1}`}
              name={light.name}
              enabled={light.enabled}
              accent={light.name === 'Emergency' ? 'var(--sys-red)' : 'var(--brand)'}
              onName={name => setLightConfig(light.id, { name })}
              onToggle={() => setLightConfig(light.id, { enabled: !light.enabled })}
            />
          ))}
          <div style={{ borderBottom: 'none', padding: '6px 16px 10px' }}>
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
              label={`Fan ${i + 1}`}
              name={fan.name}
              enabled={fan.enabled}
              onName={name => setFanConfig(fan.id, { name })}
              onToggle={() => setFanConfig(fan.id, { enabled: !fan.enabled })}
            />
          ))}
          <div style={{ padding: '6px 16px 10px' }}>
            <span style={{ fontSize: 11, color: 'var(--label3)' }}>
              Disabled fans are hidden from the dashboard and cab display.
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
                background: 'var(--surface2)', fontSize: 12, fontWeight: 600, color: 'var(--label2)',
                fontFamily: 'inherit',
              }}>Cancel</button>
              <button onClick={() => { resetConfig(); setVanDraft('Van 01'); setConfirmReset(false); }} style={{
                padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: 'var(--sys-red)', fontSize: 12, fontWeight: 700, color: '#fff',
                fontFamily: 'inherit',
              }}>Reset</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
