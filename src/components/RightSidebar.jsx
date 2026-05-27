const ACTIVITY = [
  { initials: 'AK', color: { bg: '#9FE1CB', text: '#0F6E56' }, text: 'Anna K. hat Produktdaten / Texte als vorhanden markiert.', time: 'Vor 2 Stunden' },
  { initials: 'LH', color: { bg: '#D9E0FD', text: '#4F6EF7' }, text: 'Lukas H. hat einen Kommentar hinzugefügt.', time: 'Vor 5 Stunden' },
  { initials: 'SB', color: { bg: '#F5C4B3', text: '#993C1D' }, text: 'Sascha Büchel hat einen Entscheidungspunkt erstellt.', time: 'Gestern, 16:45' },
]

const FILES = [
  { name: 'Rückleuchte_Specs.pdf', meta: 'PDF · 245 KB', bg: '#FCEBEB', color: '#A32D2D', label: 'PDF' },
  { name: 'Produktbild_Rückleuchte.png', meta: 'PNG · 1.2 MB', bg: '#E6F1FB', color: '#185FA5', label: 'PNG' },
  { name: 'Verpackung_AlteVersion.ai', meta: 'AI · 3.4 MB', bg: '#FAEEDA', color: '#854F0B', label: 'AI' },
]

export default function RightSidebar() {
  return (
    <aside style={{
      width: 220, minWidth: 220,
      borderLeft: '1px solid #f0ede8',
      background: '#fff',
      overflowY: 'auto',
      padding: '20px 16px',
      display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      {/* Aktivität */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Aktivität</span>
          <button style={{ fontSize: 11, color: '#4F6EF7', background: 'none', border: 'none', cursor: 'pointer' }}>Alle anzeigen</button>
        </div>
        {ACTIVITY.map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: a.color.bg, color: a.color.text, fontSize: 9, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
              {a.initials}
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: '#444', lineHeight: 1.5 }}>{a.text}</div>
              <div style={{ fontSize: 10.5, color: '#bbb', marginTop: 2 }}>{a.time}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Anhänge */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>Anhänge</span>
          <button style={{ fontSize: 11, color: '#4F6EF7', background: 'none', border: 'none', cursor: 'pointer' }}>Alle anzeigen</button>
        </div>
        {FILES.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10, cursor: 'pointer' }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, background: f.bg, color: f.color, fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {f.label}
            </div>
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 500, color: '#1a1a1a', lineHeight: 1.3 }}>{f.name}</div>
              <div style={{ fontSize: 10.5, color: '#bbb' }}>{f.meta}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Notizen */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a', marginBottom: 10 }}>Notizen</div>
        <div style={{ background: '#F7F7F5', borderRadius: 8, padding: '10px 12px', fontSize: 11.5, color: '#aaa', lineHeight: 1.6, marginBottom: 10 }}>
          Hier können wichtige Notizen und Informationen zum Request festgehalten werden.
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#4F6EF7', background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke="#4F6EF7" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Notiz hinzufügen
        </button>
      </div>
    </aside>
  )
}
