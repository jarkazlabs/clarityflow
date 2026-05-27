const STATUS_COLORS = { amber:'#EF9F27', red:'#E24B4A', blue:'#4F6EF7', green:'#639922' }
const STATUS_BG = { amber:'#FAEEDA', red:'#FCEBEB', blue:'#EEF1FE', green:'#EAF3DE' }
const STATUS_TEXT = { amber:'#854F0B', red:'#A32D2D', blue:'#185FA5', green:'#3B6D11' }

export default function RequestList({ requests, selectedId, onSelect, onNew }) {
  return (
    <div style={{ width:260, minWidth:260, borderRight:'0.5px solid #f0ede8', background:'#fafaf8', display:'flex', flexDirection:'column', overflow:'hidden' }}>
      <div style={{ padding:'16px 14px 10px', borderBottom:'0.5px solid #f0ede8', background:'#fff' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <span style={{ fontSize:13, fontWeight:500, color:'#1a1a1a' }}>Anfragen</span>
          <button onClick={onNew} style={{ display:'flex', alignItems:'center', gap:4, padding:'5px 10px', background:'#4F6EF7', color:'#fff', border:'none', borderRadius:7, fontSize:12, fontWeight:500, cursor:'pointer' }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M5.5 1v9M1 5.5h9" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></svg>
            Neu
          </button>
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {['Alle','Offen','Bereit'].map((f,i) => (
            <button key={f} style={{ fontSize:11, padding:'3px 10px', borderRadius:20, border:'0.5px solid #e8e6e0', cursor:'pointer', background: i===0?'#4F6EF7':'#fff', color: i===0?'#fff':'#888' }}>{f}</button>
          ))}
        </div>
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:8 }}>
        {requests.map(req => (
          <button key={req.id} onClick={() => onSelect(req.id)} style={{ width:'100%', padding:'11px 12px', borderRadius:9, marginBottom:4, cursor:'pointer', border: selectedId===req.id ? '0.5px solid #4F6EF7' : '0.5px solid transparent', background:'#fff', textAlign:'left', outline:'none', transition:'all .12s', boxShadow: selectedId===req.id ? '0 0 0 3px rgba(79,110,247,0.08)' : 'none' }}>
            <div style={{ fontSize:13, fontWeight:500, color:'#1a1a1a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginBottom:6 }}>{req.title}</div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', flexShrink:0, background: STATUS_COLORS[req.statusColor]||'#ccc' }} />
              <span style={{ fontSize:11, color:'#aaa', flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{req.department}</span>
              <span style={{ fontSize:10, fontWeight:500, padding:'2px 7px', borderRadius:20, background: STATUS_BG[req.statusColor], color: STATUS_TEXT[req.statusColor], whiteSpace:'nowrap' }}>
                {req.readiness}%
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
