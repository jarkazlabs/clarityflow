// RequestDetail – vollständige Ansicht einer Request

import { useState } from 'react'
import DecisionModal from './DecisionModal.jsx'

const STATUS_LABELS = {
  missing: 'fehlt',
  present: 'vorhanden',
  unclear: 'unklar',
  pending: 'ausstehend',
  open: 'offen',
  decided: 'entschieden',
}

const OWNER_COLORS = {
  blue:  { bg: '#D9E0FD', color: '#4F6EF7' },
  teal:  { bg: '#9FE1CB', color: '#0F6E56' },
  coral: { bg: '#F5C4B3', color: '#993C1D' },
  gray:  { bg: '#E8E6E0', color: '#5F5E5A' },
}

function Avatar({ initials, colorKey, size = 20 }) {
  const c = OWNER_COLORS[colorKey] || OWNER_COLORS.gray
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: c.bg, color: c.color,
      fontSize: size * 0.45, fontWeight: 500,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

function Section({ title, icon, count, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{
      background: '#fff',
      border: '0.5px solid #e8e6e0',
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px',
          borderBottom: open ? '0.5px solid #e8e6e0' : 'none',
          background: 'none', border: 'none',
          borderBottom: open ? '0.5px solid #e8e6e0' : 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 15, color: '#bbb' }}>{icon}</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{title}</span>
          <span style={{
            fontSize: 11, color: '#aaa',
            background: '#F1EFE8', borderRadius: 20,
            padding: '1px 8px',
          }}>{count}</span>
        </div>
        <span style={{
          fontSize: 12, color: '#ccc',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
          display: 'inline-block',
        }}>▾</span>
      </button>
      {open && <div>{children}</div>}
    </div>
  )
}

export default function RequestDetail({ request, onUpdate }) {
  const [modalOpen, setModalOpen] = useState(false)

  function handleSaveDecision({ what, why }) {
    const today = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })
    const newEntry = {
      id: Date.now(),
      what,
      why,
      who: 'Marc Keller',
      whoInitials: 'MK',
      date: today,
    }
    const newReadiness = Math.min(100, request.readiness + 20)
    onUpdate({
      ...request,
      readiness: newReadiness,
      log: [newEntry, ...request.log],
    })
    setModalOpen(false)
  }

  const presentInputs = request.inputs.filter(i => i.status === 'present').length

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <main style={{
        flex: 1, overflowY: 'auto',
        padding: '28px 32px',
        height: '100%',
      }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: 11, color: '#bbb', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 4 }}>
          ☰ Requests › {request.department}
        </div>

        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{
            fontSize: 22, fontWeight: 500, letterSpacing: '-0.4px',
            lineHeight: 1.3, marginBottom: 12,
          }}>
            {request.title}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#888' }}>
              <span style={{ fontSize: 14, color: '#ccc' }}>◎</span>
              {request.owner}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#888' }}>
              <span style={{ fontSize: 14, color: '#ccc' }}>◷</span>
              Deadline: {request.deadline}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#888' }}>
              <span style={{ fontSize: 14, color: '#ccc' }}>◈</span>
              {request.category}
            </div>
            <span style={{
              fontSize: 11, fontWeight: 500,
              padding: '3px 10px', borderRadius: 20,
              background: request.statusColor === 'green' ? '#EAF3DE' : '#FAEEDA',
              color: request.statusColor === 'green' ? '#3B6D11' : '#854F0B',
            }}>
              {request.status}
            </span>
          </div>
        </div>

        {/* Next Step */}
        <div style={{
          background: '#EEF1FE',
          border: '0.5px solid rgba(79,110,247,0.2)',
          borderRadius: 12, padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 20, gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#4F6EF7', marginBottom: 4 }}>
              Nächster Schritt
            </div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{request.nextStep}</div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            style={{
              fontSize: 12, padding: '7px 14px',
              background: '#4F6EF7', color: '#fff',
              border: 'none', borderRadius: 8, cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Anfragen →
          </button>
        </div>

        {/* Readiness */}
        <div style={{
          background: '#fff', border: '0.5px solid #e8e6e0',
          borderRadius: 12, padding: '20px 24px', marginBottom: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#bbb' }}>
              Readiness
            </div>
            <div style={{ fontSize: 28, fontWeight: 500, letterSpacing: '-0.5px' }}>
              {request.readiness}<span style={{ fontSize: 16, color: '#bbb', fontWeight: 400 }}>%</span>
            </div>
          </div>
          <div style={{ height: 4, borderRadius: 99, background: '#F1EFE8', marginBottom: 12 }}>
            <div style={{
              height: 4, borderRadius: 99,
              background: '#4F6EF7',
              width: `${request.readiness}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
          <div style={{ fontSize: 13, color: '#888', lineHeight: 1.5 }}>
            {request.readinessMessage}
          </div>
        </div>

        {/* Inputs */}
        <Section title="Pflicht-Inputs" icon="☑" count={`${presentInputs} von ${request.inputs.length} vorhanden`}>
          {request.inputs.map((inp, i) => (
            <div key={inp.id} style={{
              display: 'grid',
              gridTemplateColumns: '32px 1fr 90px 110px',
              alignItems: 'center',
              gap: 8,
              padding: '11px 18px',
              borderBottom: i < request.inputs.length - 1 ? '0.5px solid #f3f1ec' : 'none',
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: '#F7F7F5',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, color: '#bbb',
              }}>◈</div>
              <div>
                <div style={{ fontSize: 13 }}>{inp.name}</div>
                <div style={{ fontSize: 11, color: '#bbb' }}>{inp.detail}</div>
              </div>
              <span className={`badge badge-${inp.status}`}>{STATUS_LABELS[inp.status]}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#888' }}>
                <Avatar initials={inp.ownerInitials} colorKey={inp.ownerColor} size={18} />
                {inp.owner.split(' ')[0]}
              </div>
            </div>
          ))}
        </Section>

        {/* Decisions */}
        <Section
          title="Entscheidungspunkte"
          icon="⑂"
          count={`${request.decisions.filter(d => d.status === 'open').length} offen · ${request.decisions.filter(d => d.status === 'decided').length} entschieden`}
        >
          {request.decisions.map((dec, i) => (
            <div
              key={dec.id}
              onClick={() => dec.status === 'open' && setModalOpen(true)}
              style={{
                padding: '14px 18px',
                borderBottom: i < request.decisions.length - 1 ? '0.5px solid #f3f1ec' : 'none',
                cursor: dec.status === 'open' ? 'pointer' : 'default',
              }}
            >
              <div style={{ fontSize: 13, marginBottom: 7, lineHeight: 1.4 }}>
                {dec.question}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className={`badge badge-${dec.status}`}>{STATUS_LABELS[dec.status]}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#888' }}>
                  <Avatar initials={dec.ownerInitials} colorKey={dec.ownerColor} size={16} />
                  {dec.owner}
                </div>
              </div>
            </div>
          ))}
        </Section>

        {/* Log */}
        <Section title="Entscheidungslog" icon="◷" count={`${request.log.length} ${request.log.length === 1 ? 'Eintrag' : 'Einträge'}`}>
          {request.log.length === 0 ? (
            <div style={{ padding: '20px 18px', fontSize: 13, color: '#bbb' }}>
              Noch keine Entscheidungen dokumentiert.
            </div>
          ) : request.log.map((entry, i) => (
            <div key={entry.id} style={{
              padding: '16px 18px',
              borderBottom: i < request.log.length - 1 ? '0.5px solid #f3f1ec' : 'none',
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 5 }}>{entry.what}</div>
              <div style={{ fontSize: 12, color: '#888', marginBottom: 8, lineHeight: 1.5 }}>{entry.why}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#888' }}>
                  <Avatar initials={entry.whoInitials} colorKey="blue" size={16} />
                  {entry.who}
                </div>
                <div style={{ fontSize: 11, color: '#bbb' }}>{entry.date}</div>
              </div>
            </div>
          ))}
        </Section>

        <div style={{ height: 32 }} />
      </main>

      {modalOpen && (
        <DecisionModal
          onSave={handleSaveDecision}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  )
}
