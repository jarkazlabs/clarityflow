import { useState } from 'react'

export default function DecisionView({ request, initialIndex, onBack, onUpdate }) {
  const [activeIdx, setActiveIdx] = useState(initialIndex)
  const [what, setWhat] = useState('')
  const [why, setWhy] = useState('')

  const dec = request.decisions[activeIdx]

  function switchTo(idx) {
    setActiveIdx(idx)
    setWhat('')
    setWhy('')
  }

  const whyHint = why.length === 0 ? { text: 'Eine gute Begründung hilft deinem Team, die Entscheidung später zu verstehen.', color: '#bbb' }
    : why.length < 20 ? { text: 'Bitte etwas ausführlicher – damit die Entscheidung später nachvollziehbar bleibt.', color: '#854F0B' }
    : { text: 'Gut. Diese Begründung hilft dem Team später.', color: '#3B6D11' }

  const canSave = what.trim().length > 0 && why.trim().length >= 20

  function save() {
    if (!canSave) return
    const today = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    const newEntry = { id: Date.now(), what: what.trim(), why: why.trim(), who: 'Sascha Büchel', whoInitials: 'SB', date: today }
    const newReadiness = Math.min(100, request.readiness + 20)
    onUpdate({ ...request, readiness: newReadiness, log: [newEntry, ...request.log] })
    setWhat('')
    setWhy('')
  }

  return (
    <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>

      {/* Left list */}
      <div style={{ width: 200, minWidth: 200, borderRight: '1px solid #f0ede8', padding: '16px 12px', overflowY: 'auto', background: '#fff' }}>
        <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 12, marginBottom: 16, padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="#888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Zurück zu Entscheidungspunkten
        </button>
        <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginBottom: 10 }}>Entscheidungspunkte</div>
        {request.decisions.map((d, i) => (
          <button key={d.id} onClick={() => switchTo(i)} style={{
            width: '100%', textAlign: 'left', padding: '9px 10px', borderRadius: 8,
            border: activeIdx === i ? '1px solid rgba(79,110,247,0.25)' : '1px solid transparent',
            background: activeIdx === i ? '#EEF1FE' : 'transparent',
            cursor: 'pointer', marginBottom: 4,
          }}>
            <div style={{ fontSize: 11.5, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 4 }}>{d.question}</div>
            <span style={{ fontSize: 10.5, fontWeight: 500, background: d.status === 'open' ? '#FCEBEB' : '#EAF3DE', color: d.status === 'open' ? '#A32D2D' : '#3B6D11', padding: '1px 7px', borderRadius: 20 }}>
              {d.status === 'open' ? 'Offen' : 'Entschieden'}
            </span>
          </button>
        ))}
      </div>

      {/* Main form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', minWidth: 0 }}>
        <div style={{ fontSize: 11.5, color: '#bbb', marginBottom: 8 }}>Erstellt von Sascha Büchel · 20. Mai 2025</div>
        <div style={{ display: 'inline-block', fontSize: 10.5, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', background: '#EEF1FE', color: '#4F6EF7', padding: '3px 10px', borderRadius: 20, marginBottom: 12 }}>
          Offen
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#1a1a1a', letterSpacing: '-0.3px', lineHeight: 1.35, marginBottom: 18 }}>
          {dec.question}
        </h2>

        <div style={{ fontSize: 11, color: '#bbb', marginBottom: 8 }}>Entscheider</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#CECBF6', color: '#534AB7', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {dec.ownerInitials}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{dec.owner}</div>
            <div style={{ fontSize: 11, color: '#bbb' }}>{dec.ownerDept || 'Produktmanagement'}</div>
          </div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Was soll entschieden werden?</div>
        <div style={{ background: '#F7F7F5', borderRadius: 8, padding: '10px 12px', fontSize: 12.5, color: '#666', lineHeight: 1.6, marginBottom: 20 }}>
          {dec.context || 'Soll die Rückleuchte zusätzlich als Einzelprodukt verkauft werden oder bleibt sie ausschließlich als Set-Variante erhältlich?'}
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Was wurde entschieden?</div>
          <textarea
            value={what}
            onChange={e => setWhat(e.target.value)}
            placeholder="Beschreibe die Entscheidung in vollständigen Sätzen…"
            style={{ width: '100%', minHeight: 72, padding: '9px 11px', fontSize: 12.5, fontFamily: 'inherit', border: '1px solid #e8e6e0', borderRadius: 8, resize: 'vertical', outline: 'none', color: '#1a1a1a', background: '#fff' }}
            onFocus={e => e.target.style.borderColor = '#4F6EF7'}
            onBlur={e => e.target.style.borderColor = '#e8e6e0'}
          />
          <div style={{ fontSize: 10.5, color: '#bbb', marginTop: 4 }}>Bitte formuliere die Entscheidung so, dass sie später eindeutig nachvollziehbar ist.</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Warum wurde diese Entscheidung getroffen?</div>
          <textarea
            value={why}
            onChange={e => setWhy(e.target.value)}
            placeholder="Erkläre die Begründung für diese Entscheidung…"
            style={{ width: '100%', minHeight: 72, padding: '9px 11px', fontSize: 12.5, fontFamily: 'inherit', border: '1px solid #e8e6e0', borderRadius: 8, resize: 'vertical', outline: 'none', color: '#1a1a1a', background: '#fff' }}
            onFocus={e => e.target.style.borderColor = '#4F6EF7'}
            onBlur={e => e.target.style.borderColor = '#e8e6e0'}
          />
          <div style={{ fontSize: 10.5, color: whyHint.color, marginTop: 4, transition: 'color .2s' }}>{whyHint.text}</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={save}
            style={{ padding: '9px 20px', background: canSave ? '#4F6EF7' : '#c5cefc', color: '#fff', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: canSave ? 'pointer' : 'not-allowed', transition: 'background .15s' }}
          >
            Entscheidung speichern
          </button>
          <span style={{ fontSize: 11, color: '#bbb' }}>Die Entscheidung wird im Log dokumentiert.</span>
        </div>
      </div>

      {/* Right info */}
      <div style={{ width: 200, minWidth: 200, borderLeft: '1px solid #f0ede8', padding: '20px 16px', overflowY: 'auto', background: '#fff' }}>
        <div style={{ background: '#F0EFFE', borderRadius: 10, padding: '14px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginBottom: 6 }}>Warum vollständig entscheiden?</div>
          <div style={{ fontSize: 11.5, color: '#666', lineHeight: 1.6 }}>Vollständige Entscheidungen schaffen Klarheit, vermeiden Rückfragen und helfen dem gesamten Team, später bessere Entscheidungen zu treffen.</div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginBottom: 12 }}>Entscheidungslog</div>
        {request.log.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ display: 'block', margin: '0 auto 8px' }}><rect x="6" y="4" width="20" height="24" rx="3" stroke="#ddd" strokeWidth="1.5"/><path d="M11 10h10M11 14h10M11 18h6" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginBottom: 3 }}>Noch keine Entscheidung getroffen.</div>
            <div style={{ fontSize: 11, color: '#bbb', lineHeight: 1.5 }}>Sobald eine Entscheidung festgehalten wurde, erscheint sie hier im Log.</div>
          </div>
        ) : request.log.map(entry => (
          <div key={entry.id} style={{ borderTop: '1px solid #f0ede8', paddingTop: 12, marginTop: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', marginBottom: 4 }}>{entry.what}</div>
            <div style={{ fontSize: 11, color: '#888', lineHeight: 1.5, marginBottom: 6 }}>{entry.why}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, color: '#bbb' }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#F5C4B3', color: '#993C1D', fontSize: 8, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>SB</div>
              {entry.who} · {entry.date}
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
