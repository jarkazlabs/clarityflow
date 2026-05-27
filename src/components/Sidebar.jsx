// Sidebar – Navigation + User

export default function Sidebar({ activeNav, onNav }) {
  const navItems = [
    { id: 'requests', label: 'Requests', icon: '☰', badge: '4' },
    { id: 'responsibilities', label: 'Verantwortlichkeiten', icon: '◎' },
    { id: 'log', label: 'Entscheidungslog', icon: '◷' },
  ]

  return (
    <nav className="flex flex-col" style={{
      width: 220,
      minWidth: 220,
      background: '#fff',
      borderRight: '0.5px solid #e8e6e0',
      padding: '20px 0',
      height: '100%',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 18px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 24, height: 24,
          background: '#4F6EF7',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="5" height="5" rx="1.5" fill="white"/>
            <rect x="8" y="1" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
            <rect x="1" y="8" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.6"/>
            <rect x="8" y="8" width="5" height="5" rx="1.5" fill="white" fillOpacity="0.3"/>
          </svg>
        </div>
        <span style={{ fontSize: 15, fontWeight: 500, letterSpacing: '-0.3px' }}>ClarityFlow</span>
      </div>

      {/* Nav */}
      <div style={{ padding: '0 10px', flex: 1 }}>
        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', padding: '0 8px', marginBottom: 4 }}>
          Workspace
        </div>

        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNav(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '7px 8px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              background: activeNav === item.id ? '#EEF1FE' : 'transparent',
              color: activeNav === item.id ? '#4F6EF7' : '#666',
              textAlign: 'left',
              transition: 'background 0.12s',
            }}
          >
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            {item.label}
            {item.badge && (
              <span style={{
                marginLeft: 'auto',
                fontSize: 10,
                padding: '1px 7px',
                borderRadius: 10,
                background: activeNav === item.id ? '#D9E0FD' : '#f0ede8',
                color: activeNav === item.id ? '#4F6EF7' : '#999',
              }}>
                {item.badge}
              </span>
            )}
          </button>
        ))}

        <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#aaa', padding: '0 8px', marginTop: 16, marginBottom: 4 }}>
          System
        </div>
        <button
          onClick={() => onNav('settings')}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 8px',
            borderRadius: 8,
            border: 'none',
            cursor: 'pointer',
            fontSize: 13,
            background: 'transparent',
            color: '#666',
            textAlign: 'left',
          }}
        >
          <span>⚙</span>
          Einstellungen
        </button>
      </div>

      {/* User */}
      <div style={{ padding: '12px 18px 0', borderTop: '0.5px solid #e8e6e0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', cursor: 'pointer' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#D9E0FD', color: '#4F6EF7',
            fontSize: 11, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>MK</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 500 }}>Marc Keller</div>
            <div style={{ fontSize: 10, color: '#aaa' }}>Produktmanagement</div>
          </div>
          <span style={{ fontSize: 14, color: '#ccc' }}>⋮</span>
        </div>
      </div>
    </nav>
  )
}
