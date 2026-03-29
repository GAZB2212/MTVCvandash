import { useState } from 'react';
import { useKeyboard } from '../context/KeyboardContext';

const QWERTY = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m'],
];

const NUMS = [
  ['1','2','3','4','5','6','7','8','9','0'],
  ['!','@','#','$','%','&','*','(',')','-'],
  ['_','+','=','/',':',';','"',"'",'.',','],
];

const KEY_H   = 46;
const GAP     = 5;
const ACCENT  = 'var(--brand)';

function Key({
  label, onPress, wide, accent, danger, dark,
}: {
  label: string; onPress: () => void;
  wide?: boolean; accent?: boolean; danger?: boolean; dark?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  return (
    <button
      onPointerDown={e => { e.preventDefault(); setPressed(true); onPress(); }}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        height: KEY_H,
        flex: wide ? 2 : 1,
        minWidth: wide ? 80 : 30,
        borderRadius: 8,
        border: accent
          ? `1.5px solid rgba(109,200,43,0.5)`
          : danger
          ? `1.5px solid rgba(255,69,58,0.4)`
          : '1px solid rgba(255,255,255,0.09)',
        background: pressed
          ? 'rgba(255,255,255,0.20)'
          : accent
          ? 'rgba(109,200,43,0.18)'
          : danger
          ? 'rgba(255,69,58,0.15)'
          : dark
          ? 'rgba(255,255,255,0.04)'
          : 'rgba(255,255,255,0.09)',
        color: accent ? ACCENT : danger ? 'var(--sys-red)' : 'var(--label)',
        fontSize: label.length > 2 ? 11 : 15,
        fontWeight: accent || danger ? 700 : 500,
        letterSpacing: label.length > 2 ? '0.04em' : 0,
        cursor: 'pointer',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        touchAction: 'none',
        transition: 'background 0.08s',
        fontFamily: 'inherit',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {label}
    </button>
  );
}

export function TouchKeyboard() {
  const { isOpen, value, closeKeyboard, pushKey, backspace } = useKeyboard();
  const [shifted, setShifted]   = useState(false);
  const [numMode, setNumMode]   = useState(false);

  if (!isOpen) return null;

  const rows = numMode ? NUMS : QWERTY;

  const tap = (ch: string) => {
    const out = shifted && !numMode ? ch.toUpperCase() : ch;
    pushKey(out);
    if (shifted) setShifted(false);
  };

  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 200,
      background: 'rgba(10,12,20,0.97)',
      backdropFilter: 'blur(30px) saturate(1.5)',
      WebkitBackdropFilter: 'blur(30px) saturate(1.5)',
      borderTop: '1px solid rgba(255,255,255,0.10)',
      padding: '8px 8px 10px',
      display: 'flex', flexDirection: 'column', gap: GAP,
      boxShadow: '0 -8px 40px rgba(0,0,0,0.6)',
      animation: 'kb-slide-up 0.18s ease both',
    }}>
      {/* Preview bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5px 12px',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)',
        minHeight: 34, marginBottom: 2, flexShrink: 0,
      }}>
        <span style={{
          flex: 1, fontSize: 14, fontWeight: 500, color: 'var(--label)',
          fontVariantNumeric: 'tabular-nums', letterSpacing: '0.01em',
          overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis',
        }}>
          {value || <span style={{ color: 'var(--label3)' }}>Start typing…</span>}
          <span style={{ animation: 'cursor-blink 1s step-end infinite', color: ACCENT }}>|</span>
        </span>
        <button
          onPointerDown={e => { e.preventDefault(); backspace(); }}
          style={{
            padding: '2px 10px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.09)',
            background: 'rgba(255,255,255,0.07)', color: 'var(--label2)',
            fontSize: 16, cursor: 'pointer', lineHeight: 1, fontFamily: 'inherit',
          }}
        >⌫</button>
      </div>

      {/* Letter / number rows */}
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: GAP, justifyContent: 'center' }}>
          {ri === 2 && !numMode && (
            <Key label={shifted ? '⇧' : '⇧'} onPress={() => setShifted(s => !s)} dark accent={shifted} />
          )}
          {row.map(ch => (
            <Key key={ch} label={shifted && !numMode ? ch.toUpperCase() : ch} onPress={() => tap(ch)} />
          ))}
          {ri === 2 && !numMode && (
            <Key label="⌫" onPress={backspace} dark danger />
          )}
        </div>
      ))}

      {/* Bottom row */}
      <div style={{ display: 'flex', gap: GAP }}>
        <Key label={numMode ? 'ABC' : '123'} onPress={() => { setNumMode(m => !m); setShifted(false); }} dark wide />
        <Key label="SPACE" onPress={() => tap(' ')} wide />
        <Key label=". com" onPress={() => { pushKey('.com'); }} dark />
        <Key label="DONE ✓" onPress={closeKeyboard} accent wide />
      </div>
    </div>
  );
}
