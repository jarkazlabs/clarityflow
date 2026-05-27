import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import RequestDetail from './components/RequestDetail.jsx'
import RightSidebar from './components/RightSidebar.jsx'
import { REQUESTS } from './data/requests.js'

export default function App() {
  const [requests, setRequests] = useState(REQUESTS)
  const [selectedId] = useState(REQUESTS[0].id)

  const request = requests.find(r => r.id === selectedId)

  function handleUpdate(updated) {
    setRequests(prev => prev.map(r => r.id === updated.id ? updated : r))
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: '#fff',
      fontSize: 13,
      color: '#1a1a1a',
    }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', height: 52,
          borderBottom: '1px solid #f0ede8',
          background: '#fff', flexShrink: 0,
        }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', color: '#888', fontSize: 13 }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8L10 4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Zurück zur Übersicht
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="8" cy="8" r="5.5" stroke="#888" strokeWidth="1.4"/><path d="M12.5 12.5L15.5 15.5" stroke="#888" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </button>
            <div style={{ position: 'relative' }}>
              <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2.5C6.5 2.5 4.5 4.5 4.5 7v3.5L3 12h12l-1.5-1.5V7C13.5 4.5 11.5 2.5 9 2.5z" stroke="#888" strokeWidth="1.4"/><path d="M7.5 14.5a1.5 1.5 0 003 0" stroke="#888" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
              <div style={{ position: 'absolute', top: 0, right: 0, width: 14, height: 14, borderRadius: '50%', background: '#4F6EF7', color: '#fff', fontSize: 8, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</div>
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#4F6EF7', color: '#fff', border: 'none', borderRadius: 8, padding: '7px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M3.5 5.5L7 9l3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M1.5 10.5v1.5a.5.5 0 00.5.5h10a.5.5 0 00.5-.5v-1.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Teilen
            </button>
          </div>
        </div>
        {/* Content */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>
          <RequestDetail request={request} onUpdate={handleUpdate} />
          <RightSidebar request={request} />
        </div>
      </div>
    </div>
  )
}
