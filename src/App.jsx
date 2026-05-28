import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import RequestDetail from './components/RequestDetail.jsx'
import NewRequestModal from './components/NewRequestModal.jsx'
import { INITIAL_REQUESTS } from './data/requests.js'

export default function App() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [selectedId] = useState(INITIAL_REQUESTS[0].id)
  const [showNew, setShowNew] = useState(false)

  const selected = requests.find(r => r.id === selectedId)

  function handleUpdate(updated) {
    setRequests(prev => prev.map(r => r.id === updated.id ? updated : r))
  }

  function handleNew(req) {
    setRequests(prev => [...prev, req])
    setShowNew(false)
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:"'Inter', system-ui, sans-serif", background:'#fff', fontSize:14, color:'#1a1a1a' }}>
      <Sidebar />

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        {/* Topbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', height:52, borderBottom:'0.5px solid #f0ede8', flexShrink:0 }}>
          <button style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer', color:'#888', fontSize:13 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 3L5 7l4 4" stroke="#888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Zurück zur Übersicht
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button style={{ width:32, height:32, borderRadius:8, border:'0.5px solid #f0ede8', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="6.5" cy="6.5" r="4" stroke="#888" strokeWidth="1.3"/><path d="M10 10l3 3" stroke="#888" strokeWidth="1.3" strokeLinecap="round"/></svg>
            </button>
            <div style={{ position:'relative' }}>
              <button style={{ width:32, height:32, borderRadius:8, border:'0.5px solid #f0ede8', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer' }}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><path d="M7.5 1.5a4 4 0 014 4v2.5l1 2H3l1-2V5.5a4 4 0 014-4zM6 11.5a1.5 1.5 0 003 0" stroke="#888" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <div style={{ position:'absolute', top:5, right:5, width:7, height:7, borderRadius:'50%', background:'#4F6EF7', border:'1.5px solid #fff' }} />
            </div>
            <button onClick={() => setShowNew(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', background:'#4F6EF7', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer' }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.8" strokeLinecap="round"/></svg>
              Neu
            </button>
          </div>
        </div>

        {/* Content — no RequestList, just detail + right sidebar */}
        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
          <RequestDetail request={selected} onUpdate={handleUpdate} />
        </div>
      </div>

      {showNew && <NewRequestModal onSave={handleNew} onClose={() => setShowNew(false)} />}
    </div>
  )
}
