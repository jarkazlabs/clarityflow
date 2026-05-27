import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import RequestList from './components/RequestList.jsx'
import RequestDetail from './components/RequestDetail.jsx'
import NewRequestModal from './components/NewRequestModal.jsx'
import { INITIAL_REQUESTS } from './data/requests.js'

export default function App() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS)
  const [selectedId, setSelectedId] = useState(INITIAL_REQUESTS[0].id)
  const [showNew, setShowNew] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [activePanel, setActivePanel] = useState(null)

  const selected = requests.find(r => r.id === selectedId)

  function handleUpdate(updated) {
    setRequests(prev => prev.map(r => r.id === updated.id ? updated : r))
  }

  function handleNew(req) {
    setRequests(prev => [...prev, req])
    setSelectedId(req.id)
    setShowNew(false)
  }

  function handleTogglePanel(key) {
    if (activePanel === key && panelOpen) { setPanelOpen(false); setActivePanel(null) }
    else { setPanelOpen(true); setActivePanel(key) }
  }

  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', fontFamily:"'Inter', system-ui, sans-serif", background:'#fff', fontSize:14, color:'#1a1a1a' }}>
      <Sidebar />

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        {/* Topbar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', height:52, borderBottom:'0.5px solid #f0ede8', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:'#888', fontSize:13 }}>
              ← Übersicht
            </button>
            <span style={{ color:'#e8e6e0' }}>·</span>
            <span style={{ fontSize:13, color:'#888', fontWeight:500 }}>{selected?.title || ''}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <button style={{ width:32, height:32, borderRadius:8, border:'0.5px solid #f0ede8', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16, color:'#888' }}>🔍</button>
            <div style={{ position:'relative' }}>
              <button style={{ width:32, height:32, borderRadius:8, border:'0.5px solid #f0ede8', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:16 }}>🔔</button>
              <div style={{ position:'absolute', top:4, right:4, width:8, height:8, borderRadius:'50%', background:'#4F6EF7', border:'1.5px solid #fff' }} />
            </div>
            <button style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 16px', background:'#4F6EF7', color:'#fff', border:'none', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer' }}>
              ↗ Teilen
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
          <RequestList
            requests={requests}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onNew={() => setShowNew(true)}
          />
          <RequestDetail
            request={selected}
            onUpdate={handleUpdate}
            panelOpen={panelOpen}
            onTogglePanel={handleTogglePanel}
            activePanel={activePanel}
          />
        </div>
      </div>

      {showNew && <NewRequestModal onSave={handleNew} onClose={() => setShowNew(false)} />}
    </div>
  )
}
