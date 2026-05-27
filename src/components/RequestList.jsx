// RequestList – linke Spalte mit allen Requests

const DOT_COLORS = {
  amber: '#EF9F27',
  red:   '#E24B4A',
  blue:  '#4F6EF7',
  green: '#639922',
}

export default function RequestList({ requests, selectedId, onSelect }) {
  return (
    <div style={{
      width: 260,
      minWidth: 260,
      borderRight: '0.5px solid #e8e6e0',
      background: '#F7F7F5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '18px 16px 12px',
        borderBottom: '0.5px solid #e8e6e0',
        background: '#fff',
      }}>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Requests</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {['Alle', 'Offen', 'Bereit'].map(f => (
            <button key={f} style={{
              fontSize: 11,
              padding: '3px 10px',
              borderRadius: 20,
              border: '0.5px solid #e0ddd6',
              cursor: 'pointer',
              background: f === 'Alle' ? '#4F6EF7' : '#fff',
              color: f === 'Alle' ? '#fff' : '#888',
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 8 }}>
        {requests.map(req => (
          <button
            key={req.id}
            onClick={() => onSelect(req.id)}
            style={{
              width: '100%',
              padding: 12,
              borderRadius: 8,
              marginBottom: 4,
              cursor: 'pointer',
              border: selectedId === req.id ? '0.5px solid #4F6EF7' : '0.5px solid transparent',
              background: '#fff',
              textAlign: 'left',
              boxShadow: selectedId === req.id ? '0 0 0 3px rgba(79,110,247,0.08)' : 'none',
              transition: 'all 0.12s',
            }}
          >
            <div style={{
              fontSize: 12, fontWeight: 500,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              marginBottom: 5,
            }}>
              {req.title}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
                background: DOT_COLORS[req.statusColor] || '#ccc',
              }} />
              <div style={{ fontSize: 10, color: '#aaa' }}>{req.department}</div>
              <div style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 500, color: '#aaa' }}>
                {req.readiness}%
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
