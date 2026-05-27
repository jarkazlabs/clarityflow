// App – Hauptlayout mit State-Management

import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import RequestList from './components/RequestList.jsx'
import RequestDetail from './components/RequestDetail.jsx'
import { REQUESTS } from './data/requests.js'

export default function App() {
  const [requests, setRequests] = useState(REQUESTS)
  const [selectedId, setSelectedId] = useState(REQUESTS[0].id)
  const [activeNav, setActiveNav] = useState('requests')

  const selectedRequest = requests.find(r => r.id === selectedId)

  function handleUpdate(updated) {
    setRequests(prev => prev.map(r => r.id === updated.id ? updated : r))
  }

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: '#F7F7F5',
    }}>
      <Sidebar activeNav={activeNav} onNav={setActiveNav} />

      <RequestList
        requests={requests}
        selectedId={selectedId}
        onSelect={setSelectedId}
      />

      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        {selectedRequest ? (
          <RequestDetail
            request={selectedRequest}
            onUpdate={handleUpdate}
          />
        ) : (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            height: '100%', color: '#bbb', fontSize: 14,
          }}>
            Keine Request ausgewählt.
          </div>
        )}
      </div>
    </div>
  )
}
