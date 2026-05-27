// DecisionModal – Entscheidung dokumentieren

import { useState } from 'react'

export default function DecisionModal({ onSave, onClose }) {
  const [what, setWhat] = useState('')
  const [why, setWhy] = useState('')

  const hint = why.length === 0 ? ''
    : why.length < 20
      ? 'Bitte etwas ausführlicher – damit die Entscheidung später nachvollziehbar bleibt.'
      : 'Gut. Diese Begründung hilft dem Team später.'
  const hintColor = why.length > 0 && why.length < 20 ? '#854F0B' : '#3B6D11'

  function handleSave() {
    if (!what.trim() || !why.trim()) return
    onSave({ what: what.trim(), why: why.trim() })
  }

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.25)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50,
      borderRadius: 12,
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        border: '0.5px solid #e8e6e0',
        padding: '24px 28px',
        width: 440,
        maxWidth: '90%',
      }}>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Entscheidung dokumentieren</div>
        <div style={{ fontSize: 12, color: '#888', marginBottom: 18 }}>
          Was wurde entschieden? Halte es klar, damit es später nachvollziehbar bleibt.
        </div>

        <label style={{ fontSize: 11, color: '#aaa', display: 'block', marginBottom: 4 }}>
          Was wurde entschieden?
        </label>
        <textarea
          value={what}
          onChange={e => setWhat(e.target.value)}
          placeholder="z. B. Die R7 wird zunächst nur als Einzelprodukt angeboten …"
          style={{
            width: '100%', minHeight: 72,
            padding: '8px 10px',
            fontSize: 13, fontFamily: 'inherit',
            border: '0.5px solid #e0ddd6',
            borderRadius: 8, resize: 'vertical',
            marginBottom: 12,
            outline: 'none',
          }}
        />

        <label style={{ fontSize: 11, color: '#aaa', display: 'block', marginBottom: 4 }}>
          Warum wurde so entschieden?
        </label>
        <textarea
          value={why}
          onChange={e => setWhy(e.target.value)}
          placeholder="z. B. Set-Konfiguration verschiebt sich auf Q4, da Verpackungsdaten fehlen …"
          style={{
            width: '100%', minHeight: 72,
            padding: '8px 10px',
            fontSize: 13, fontFamily: 'inherit',
            border: '0.5px solid #e0ddd6',
            borderRadius: 8, resize: 'vertical',
            outline: 'none',
          }}
        />
        {hint && (
          <div style={{ fontSize: 11, color: hintColor, marginTop: 6 }}>{hint}</div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <button
            onClick={onClose}
            style={{
              fontSize: 12, padding: '7px 14px',
              background: 'none', border: '0.5px solid #e0ddd6',
              borderRadius: 8, cursor: 'pointer', color: '#666',
            }}
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            style={{
              fontSize: 12, padding: '7px 14px',
              background: '#4F6EF7', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              opacity: what.trim() && why.trim() ? 1 : 0.5,
            }}
          >
            Entscheidung speichern
          </button>
        </div>
      </div>
    </div>
  )
}
