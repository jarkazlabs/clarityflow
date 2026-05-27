import { useState } from 'react'
import DecisionView from './DecisionView.jsx'

const STATUS_MAP = {
  missing:  { label: 'Fehlt',      bg: '#FCEBEB', color: '#A32D2D' },
  present:  { label: 'Vorhanden',  bg: '#EAF3DE', color: '#3B6D11' },
  unclear:  { label: 'Unklar',     bg: '#FAEEDA', color: '#854F0B' },
  pending:  { label: 'Ausstehend', bg: '#F1EFE8', color: '#5F5E5A' },
}

const OWNER_COLORS = {
  blue:  { bg: '#D9E0FD', text: '#4F6EF7' },
  teal:  { bg: '#9FE1CB', text: '#0F6E56' },
  coral: { bg: '#F5C4B3', text: '#993C1D' },
  gray:  { bg: '#E8E6E0', text: '#5F5E5A' },
  purple:{ bg: '#CECBF6', text: '#534AB7' },
}

function Avatar({ initials, colorKey, size = 26 }) {
  const c = OWNER_COLORS[colorKey] || OWNER_COLORS.gray
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: c.bg, color: c.text, fontSize: size * 0.38, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      {initials}
    </div>
  )
}

function Badge({ status }) {
  const s = STATUS_MAP[status] || { label: status, bg: '#eee', color: '#666' }
  return <span style={{ display: 'inline-block', fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 20, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>{s.label}</span>
}

export default function RequestDetail({ request, onUpdate }) {
  const [decisionView, setDecisionView] = useState(null) // null = main, 0/1 = decision index

  if (decisionView !== null) {
    return (
      <DecisionView
        request={request}
        initialIndex={decisionView}
        onBack={() => setDecisionView(null)}
        onUpdate={onUpdate}
      />
    )
  }

  const openDecisions = request.decisions.filter(d => d.status === 'open').length
  const decidedDecisions = request.decisions.filter(d => d.status === 'decided').length

  // Donut math
  const r = 26, circ = 2 * Math.PI * r
  const offset = circ - (request.readiness / 100) * circ

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', minWidth: 0 }}>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.4px', color: '#1a1a1a', margin: 0 }}>
            {request.title}
          </h1>
          <span style={{ fontSize: 12, color: '#aaa', background: '#F1EFE8', padding: '2px 8px', borderRadius: 20, fontWeight: 500 }}>
            REQ-2025-045
          </span>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#bbb', padding: '0 4px', fontSize: 18, lineHeight: 1 }}>···</button>
        </div>

        {/* Meta row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', border: '1px solid #f0ede8', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
          {[
            { label: 'Erstellt von', content: <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 4 }}><Avatar initials="SB" colorKey="coral" size={22} /><span style={{ fontSize: 12.5, fontWeight: 500 }}>Sascha Büchel</span></div> },
            { label: 'Erstellt am', content: <div style={{ fontSize: 12.5, fontWeight: 500, marginTop: 6 }}>20. Mai 2025</div> },
            { label: 'Kategorie', content: <div style={{ fontSize: 12.5, fontWeight: 500, marginTop: 6 }}>Verpackung</div> },
            { label: 'Gesamtdeadline', content: <><div style={{ fontSize: 12.5, fontWeight: 500, color: '#BA7517', marginTop: 6 }}>{request.deadline}</div><div style={{ fontSize: 10.5, color: '#bbb' }}>Keine Einzeldeadlines.</div></> },
          ].map((cell, i) => (
            <div key={i} style={{ padding: '10px 14px', borderRight: i < 3 ? '1px solid #f0ede8' : 'none' }}>
              <div style={{ fontSize: 11, color: '#bbb', marginBottom: 2 }}>{cell.label}</div>
              {cell.content}
            </div>
          ))}
        </div>
      </div>

      {/* Readiness + Next Step */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', border: '1px solid #f0ede8', borderRadius: 12, padding: '16px 20px', marginBottom: 20 }}>
        {/* Donut */}
        <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
          <svg width="64" height="64" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r={r} fill="none" stroke="#F1EFE8" strokeWidth="6"/>
            <circle cx="32" cy="32" r={r} fill="none" stroke="#EF9F27" strokeWidth="6"
              strokeDasharray={circ} strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(-90 32 32)"/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
            {request.readiness}%
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 11, color: '#bbb', marginBottom: 2 }}>Readiness</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#BA7517', marginBottom: 4 }}>Nicht bereit</div>
          <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{request.readinessMessage}</div>
        </div>
        {/* Next step */}
        <div style={{ flexShrink: 0, background: '#F7F7F5', border: '1px solid #f0ede8', borderRadius: 10, padding: '12px 14px', width: 170 }}>
          <div style={{ fontSize: 10.5, color: '#bbb', marginBottom: 4 }}>Nächster Schritt</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.4, marginBottom: 10 }}>{request.nextStep}</div>
          <button
            onClick={() => setDecisionView(0)}
            style={{ width: 26, height: 26, borderRadius: '50%', background: '#4F6EF7', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2l4 4-4 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Two column: Inputs + Decisions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

        {/* Pflicht-Inputs */}
        <div style={{ background: '#fff', border: '1px solid #f0ede8', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0ede8' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Pflicht-Inputs</span>
            <span style={{ fontSize: 11, background: '#F1EFE8', color: '#888', borderRadius: 20, padding: '1px 8px', fontWeight: 500 }}>{request.inputs.length}</span>
          </div>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 20px', gap: 8, padding: '7px 16px', borderBottom: '1px solid #f5f3ef' }}>
            {['Input', 'Status', 'Verantwortlich', ''].map((h, i) => (
              <div key={i} style={{ fontSize: 10.5, color: '#bbb', fontWeight: 500 }}>{h}</div>
            ))}
          </div>
          {request.inputs.map((inp, i) => (
            <div key={inp.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 90px 20px', alignItems: 'center', gap: 8, padding: '9px 16px', borderBottom: i < request.inputs.length - 1 ? '1px solid #f5f3ef' : 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div style={{ fontSize: 12.5, color: '#1a1a1a' }}>{inp.name}</div>
                {inp.detail && <div style={{ fontSize: 10.5, color: '#bbb' }}>{inp.detail}</div>}
              </div>
              <Badge status={inp.status} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Avatar initials={inp.ownerInitials} colorKey={inp.ownerColor} size={20} />
                <span style={{ fontSize: 11, color: '#666' }}>{inp.owner.split(' ')[0]} {inp.owner.split(' ')[1]?.[0]}.</span>
              </div>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M4.5 3l4 3.5-4 3.5" stroke="#ccc" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          ))}
          <div style={{ padding: '10px 16px', borderTop: '1px solid #f5f3ef' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4F6EF7', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="#4F6EF7" strokeWidth="1.4" strokeLinecap="round"/></svg>
              Input hinzufügen
            </button>
          </div>
        </div>

        {/* Entscheidungspunkte */}
        <div style={{ background: '#fff', border: '1px solid #f0ede8', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #f0ede8' }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Entscheidungspunkte</span>
            <span style={{ fontSize: 11, background: '#F1EFE8', color: '#888', borderRadius: 20, padding: '1px 8px', fontWeight: 500 }}>{request.decisions.length}</span>
          </div>
          {request.decisions.filter(d => d.status === 'open').map((dec, i) => (
            <div key={dec.id}
              onClick={() => setDecisionView(request.decisions.indexOf(dec))}
              style={{ padding: '14px 16px', borderBottom: '1px solid #f5f3ef', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafaf8'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F1EFE8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1, fontSize: 11, fontWeight: 600, color: '#aaa' }}>?</div>
                <div style={{ fontSize: 12.5, color: '#1a1a1a', lineHeight: 1.4 }}>{dec.question}</div>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M4.5 3l4 3.5-4 3.5" stroke="#ccc" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <div style={{ fontSize: 11, color: '#bbb', marginBottom: 6 }}>Entscheider</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Avatar initials={dec.ownerInitials} colorKey={dec.ownerColor} size={20} />
                  <span style={{ fontSize: 11, color: '#666' }}>{dec.owner} · {dec.ownerDept || ''}</span>
                </div>
                <span style={{ fontSize: 11, fontWeight: 500, background: '#FCEBEB', color: '#A32D2D', padding: '2px 8px', borderRadius: 20 }}>Offen</span>
              </div>
            </div>
          ))}
          <div style={{ padding: '10px 16px', borderTop: '1px solid #f5f3ef' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4F6EF7', background: 'none', border: 'none', cursor: 'pointer' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M6.5 1v11M1 6.5h11" stroke="#4F6EF7" strokeWidth="1.4" strokeLinecap="round"/></svg>
              Entscheidungspunkt hinzufügen
            </button>
          </div>
        </div>

      </div>
      <div style={{ height: 32 }} />
    </div>
  )
}
