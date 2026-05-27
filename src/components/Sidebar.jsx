export default function Sidebar() {
  return (
    <nav style={{
      width: 200, minWidth: 200,
      background: '#fff',
      borderRight: '1px solid #f0ede8',
      display: 'flex', flexDirection: 'column',
      padding: '16px 0',
      height: '100%',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 16px 20px', display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: 22, height: 22, background: '#4F6EF7', borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <rect x="1" y="1" width="4.5" height="4.5" rx="1.2" fill="white"/>
            <rect x="7.5" y="1" width="4.5" height="4.5" rx="1.2" fill="white" opacity=".6"/>
            <rect x="1" y="7.5" width="4.5" height="4.5" rx="1.2" fill="white" opacity=".6"/>
            <rect x="7.5" y="7.5" width="4.5" height="4.5" rx="1.2" fill="white" opacity=".3"/>
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.3px', color: '#1a1a1a' }}>ClarityFlow</span>
      </div>

      {/* Nav */}
      <div style={{ padding: '0 8px', flex: 1 }}>
        {[
          { label: 'Anfragen', active: true, icon: <IconList /> },
          { label: 'Entscheidungen', active: false, icon: <IconGit /> },
          { label: 'Kalender', active: false, icon: <IconCal /> },
          { label: 'Berichte', active: false, icon: <IconChart /> },
        ].map(item => (
          <button key={item.label} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
            fontSize: 13, background: item.active ? '#EEF1FE' : 'transparent',
            color: item.active ? '#4F6EF7' : '#555', textAlign: 'left', marginBottom: 1,
          }}>
            {item.icon}
            {item.label}
          </button>
        ))}

        <div style={{ fontSize: 10, fontWeight: 600, color: '#bbb', letterSpacing: '0.07em', textTransform: 'uppercase', padding: '12px 10px 4px' }}>
          Favoriten
        </div>
        <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, background: '#EEF1FE', color: '#4F6EF7', textAlign: 'left', marginBottom: 1 }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2.5" stroke="#4F6EF7" strokeWidth="1.3"/><path d="M4 7h6M7 4v6" stroke="#4F6EF7" strokeWidth="1.3" strokeLinecap="round"/></svg>
          Verpackung Rückleuchte
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4F6EF7', marginLeft: 'auto', flexShrink: 0 }} />
        </button>
        <button style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 7, border: 'none', cursor: 'pointer', fontSize: 13, background: 'transparent', color: '#555', textAlign: 'left' }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="12" height="12" rx="2.5" stroke="#aaa" strokeWidth="1.3"/><path d="M4 7h6M7 4v6" stroke="#aaa" strokeWidth="1.3" strokeLinecap="round"/></svg>
          POS-Display System
        </button>
      </div>

      {/* User */}
      <div style={{ marginTop: 'auto', padding: '12px 16px 0', borderTop: '1px solid #f0ede8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', padding: '6px 0' }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#F5C4B3', color: '#993C1D', fontSize: 11, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>SB</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: '#1a1a1a' }}>Sascha Büchel</div>
            <div style={{ fontSize: 11, color: '#aaa' }}>Marketing</div>
          </div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M4 6l3 3 3-3" stroke="#bbb" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 2px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#aaa', marginTop: 4 }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M8 6.5H1.5M4.5 4L2 6.5l2.5 2.5" stroke="#bbb" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Menü minimieren
        </button>
      </div>
    </nav>
  )
}

function IconList() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1" y="2.5" width="13" height="2" rx="1" fill="currentColor" opacity=".7"/><rect x="1" y="6.5" width="13" height="2" rx="1" fill="currentColor" opacity=".7"/><rect x="1" y="10.5" width="9" height="2" rx="1" fill="currentColor" opacity=".7"/></svg>
}
function IconGit() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="4" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="11" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.3"/><circle cx="4" cy="11" r="1.5" stroke="currentColor" strokeWidth="1.3"/><path d="M4 5.5v4M5.5 4h4M11 5.5v2a2 2 0 01-2 2H6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function IconCal() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="2.5" width="12" height="11" rx="2" stroke="currentColor" strokeWidth="1.3"/><path d="M1.5 6h12M5 1.5v2M10 1.5v2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>
}
function IconChart() {
  return <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><rect x="1.5" y="8" width="3" height="5" rx="1" fill="currentColor" opacity=".7"/><rect x="6" y="5" width="3" height="8" rx="1" fill="currentColor" opacity=".7"/><rect x="10.5" y="2" width="3" height="11" rx="1" fill="currentColor" opacity=".7"/></svg>
}
