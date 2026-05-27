import { useState } from 'react'
import DecisionView from './DecisionView.jsx'

const OWNER_COLORS = { blue:{bg:'#D9E0FD',text:'#4F6EF7'}, teal:{bg:'#9FE1CB',text:'#0F6E56'}, coral:{bg:'#F5C4B3',text:'#993C1D'}, gray:{bg:'#E8E6E0',text:'#5F5E5A'}, purple:{bg:'#CECBF6',text:'#534AB7'}, green:{bg:'#EAF3DE',text:'#3B6D11'}, red:{bg:'#FCEBEB',text:'#A32D2D'} }
const STATUS_MAP = { missing:{label:'Fehlt',bg:'#FCEBEB',color:'#A32D2D',icon:'✕'}, present:{label:'Vorhanden',bg:'#EAF3DE',color:'#3B6D11',icon:'✓'}, unclear:{label:'Unklar',bg:'#FAEEDA',color:'#854F0B',icon:'△'}, pending:{label:'Ausstehend',bg:'#F1EFE8',color:'#5F5E5A',icon:'◷'} }
const FILE_COLORS = { red:{bg:'#FCEBEB',color:'#A32D2D'}, blue:{bg:'#E6F1FB',color:'#185FA5'}, green:{bg:'#EAF3DE',color:'#3B6D11'}, purple:{bg:'#EEEDFE',color:'#534AB7'}, amber:{bg:'#FAEEDA',color:'#854F0B'} }

function Av({ initials, colorKey, size=22 }) {
  const c = OWNER_COLORS[colorKey] || OWNER_COLORS.gray
  return <div style={{ width:size, height:size, borderRadius:'50%', background:c.bg, color:c.text, fontSize:size*0.38, fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{initials}</div>
}

function Badge({ status }) {
  const s = STATUS_MAP[status] || { label:status, bg:'#eee', color:'#666', icon:'' }
  return <span style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:11.5, fontWeight:500, padding:'3px 9px', borderRadius:20, background:s.bg, color:s.color, whiteSpace:'nowrap' }}>{s.icon} {s.label}</span>
}

export default function RequestDetail({ request, onUpdate, panelOpen, onTogglePanel, activePanel }) {
  const [decisionView, setDecisionView] = useState(null)
  const [editingInput, setEditingInput] = useState(null)

  if (!request) return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#bbb', fontSize:14 }}>Keine Anfrage ausgewählt.</div>

  if (decisionView !== null) {
    return <DecisionView request={request} initialIndex={decisionView} onBack={() => setDecisionView(null)} onUpdate={onUpdate} />
  }

  function updateInputStatus(inputId, status) {
    const present = request.inputs.filter(i => (i.id === inputId ? status : i.status) === 'present').length
    const newReadiness = Math.min(90, Math.round((present / request.inputs.length) * 60) + (request.decisions.filter(d=>d.status==='decided').length / Math.max(1,request.decisions.length)) * 40)
    onUpdate({ ...request, inputs: request.inputs.map(i => i.id===inputId ? {...i, status} : i), readiness: Math.round(newReadiness) })
  }

  const r = 27, circ = 2*Math.PI*r
  const offset = circ - (request.readiness/100)*circ
  const readColor = request.readiness >= 80 ? '#639922' : request.readiness >= 50 ? '#EF9F27' : '#EF9F27'

  return (
    <div style={{ flex:1, display:'flex', overflow:'hidden', minWidth:0 }}>
      <div style={{ flex:1, overflowY:'auto', padding:'24px 28px', minWidth:0 }}>

        {/* Eyebrow */}
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <span style={{ fontSize:11, color:'#aaa', background:'#F1EFE8', padding:'3px 9px', borderRadius:20, border:'0.5px solid #e8e6e0' }}>{request.reqId}</span>
          <span style={{ fontSize:11, color:'#185FA5', background:'#E6F1FB', padding:'3px 9px', borderRadius:20 }}>{request.category}</span>
          <span style={{ fontSize:11, fontWeight:500, padding:'3px 9px', borderRadius:20, background: request.statusColor==='green'?'#EAF3DE':request.statusColor==='blue'?'#EEF1FE':'#FAEEDA', color: request.statusColor==='green'?'#3B6D11':request.statusColor==='blue'?'#185FA5':'#854F0B', marginLeft:'auto' }}>{request.status}</span>
        </div>

        <h1 style={{ fontSize:24, fontWeight:500, letterSpacing:'-0.5px', color:'#1a1a1a', margin:'0 0 16px' }}>{request.title}</h1>

        {/* Meta */}
        <div style={{ display:'flex', gap:0, border:'0.5px solid #f0ede8', borderRadius:12, overflow:'hidden', marginBottom:20 }}>
          {[
            { icon:'👤', label:'Erstellt von', content: <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}><Av initials={request.ownerInitials} colorKey={request.ownerColor} size={20}/><span style={{ fontSize:13, fontWeight:500 }}>{request.owner}</span></div> },
            { icon:'📅', label:'Erstellt am', content: <div style={{ fontSize:13, fontWeight:500, marginTop:5 }}>{request.createdAt}</div> },
            { icon:'📁', label:'Abteilung', content: <div style={{ fontSize:13, fontWeight:500, marginTop:5 }}>{request.department}</div> },
            { icon:'⏱', label:'Deadline', content: <div style={{ fontSize:13, fontWeight:500, color:'#BA7517', marginTop:5 }}>{request.deadline || '–'}</div> },
          ].map((c,i) => (
            <div key={i} style={{ flex:1, padding:'10px 14px', borderRight: i<3?'0.5px solid #f0ede8':'none' }}>
              <div style={{ fontSize:11, color:'#bbb', marginBottom:2 }}>{c.label}</div>
              {c.content}
            </div>
          ))}
        </div>

        {/* Readiness */}
        <div style={{ display:'flex', alignItems:'center', gap:20, border:'0.5px solid #f0ede8', borderRadius:12, padding:'16px 20px', marginBottom:20 }}>
          <div style={{ position:'relative', width:68, height:68, flexShrink:0 }}>
            <svg width="68" height="68" viewBox="0 0 68 68">
              <circle cx="34" cy="34" r={r} fill="none" stroke="#F1EFE8" strokeWidth="6"/>
              <circle cx="34" cy="34" r={r} fill="none" stroke={readColor} strokeWidth="6"
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round" transform="rotate(-90 34 34)"/>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, fontWeight:500 }}>{request.readiness}%</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:'#bbb', marginBottom:3 }}>Readiness</div>
            <div style={{ fontSize:15, fontWeight:500, color: request.readiness===100?'#3B6D11':'#BA7517', marginBottom:4 }}>
              {request.readiness===100 ? 'Bereit zur Umsetzung' : request.readiness>=70 ? 'Fast bereit' : 'Nicht bereit'}
            </div>
            <div style={{ fontSize:13, color:'#888', lineHeight:1.55 }}>{request.readinessMessage}</div>
          </div>
          <div style={{ background:'#F7F7F5', border:'0.5px solid #f0ede8', borderRadius:10, padding:'13px 15px', width:178, flexShrink:0 }}>
            <div style={{ fontSize:11, color:'#bbb', marginBottom:4 }}>Nächster Schritt</div>
            <div style={{ fontSize:13, fontWeight:500, color:'#1a1a1a', lineHeight:1.45, marginBottom:10 }}>{request.nextStep}</div>
            <button onClick={() => setDecisionView(0)} style={{ width:28, height:28, borderRadius:'50%', background:'#4F6EF7', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', marginLeft:'auto', fontSize:13, color:'#fff' }}>→</button>
          </div>
        </div>

        {/* Inputs */}
        <div style={{ border:'0.5px solid #f0ede8', borderRadius:12, overflow:'hidden', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 18px', borderBottom:'0.5px solid #f0ede8' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:'#EEF1FE', color:'#4F6EF7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>☑</div>
              <span style={{ fontSize:14, fontWeight:500 }}>Pflicht-Inputs</span>
              <span style={{ fontSize:11.5, background:'#F1EFE8', color:'#888', borderRadius:20, padding:'2px 9px', border:'0.5px solid #e8e6e0' }}>
                {request.inputs.filter(i=>i.status==='present').length} von {request.inputs.length}
              </span>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'30px 1fr 110px 1fr 20px', gap:10, padding:'7px 18px', background:'#fafaf8', borderBottom:'0.5px solid #f0ede8' }}>
            {['','Input','Status','Verantwortlich',''].map((h,i) => <div key={i} style={{ fontSize:11, fontWeight:500, color:'#bbb' }}>{h}</div>)}
          </div>
          {request.inputs.map((inp, i) => (
            <div key={inp.id} style={{ display:'grid', gridTemplateColumns:'30px 1fr 110px 1fr 20px', alignItems:'center', gap:10, padding:'11px 18px', borderBottom: i<request.inputs.length-1?'0.5px solid #f5f3ef':'none', cursor:'pointer', transition:'background .1s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#fafaf8'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <div style={{ width:28, height:28, borderRadius:7, background:'#F7F7F5', display:'flex', alignItems:'center', justifyContent:'center', border:'0.5px solid #f0ede8', fontSize:14 }}>
                {inp.status==='present'?'📄':inp.status==='missing'?'🖼':'📦'}
              </div>
              <div>
                <div style={{ fontSize:14, color:'#1a1a1a' }}>{inp.name}</div>
                {inp.detail && <div style={{ fontSize:11, color:'#bbb' }}>{inp.detail}</div>}
              </div>
              <select value={inp.status} onChange={e => updateInputStatus(inp.id, e.target.value)}
                style={{ fontSize:11.5, padding:'4px 8px', borderRadius:20, border:'none', cursor:'pointer', fontWeight:500,
                  background: STATUS_MAP[inp.status]?.bg || '#eee',
                  color: STATUS_MAP[inp.status]?.color || '#666',
                  outline:'none', WebkitAppearance:'none' }}>
                <option value="missing">✕ Fehlt</option>
                <option value="pending">◷ Ausstehend</option>
                <option value="unclear">△ Unklar</option>
                <option value="present">✓ Vorhanden</option>
              </select>
              <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:12.5, color:'#666' }}>
                <Av initials={inp.ownerInitials} colorKey={inp.ownerColor} size={20}/>
                {inp.owner} {inp.dept && <span style={{ color:'#bbb', fontSize:11 }}>· {inp.dept}</span>}
              </div>
              <span style={{ fontSize:14, color:'#ddd' }}>›</span>
            </div>
          ))}
          <button style={{ display:'flex', alignItems:'center', gap:5, padding:'10px 18px', fontSize:13, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer', borderTop:'0.5px solid #f0ede8', width:'100%', transition:'background .1s' }}
            onMouseEnter={e=>e.currentTarget.style.background='#fafaf8'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          >+ Input hinzufügen</button>
        </div>

        {/* Decisions */}
        <div style={{ border:'0.5px solid #f0ede8', borderRadius:12, overflow:'hidden', marginBottom:14 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'13px 18px', borderBottom:'0.5px solid #f0ede8' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:30, height:30, borderRadius:8, background:'#FAEEDA', color:'#854F0B', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>⑂</div>
              <span style={{ fontSize:14, fontWeight:500 }}>Entscheidungspunkte</span>
              <span style={{ fontSize:11.5, background:'#F1EFE8', color:'#888', borderRadius:20, padding:'2px 9px', border:'0.5px solid #e8e6e0' }}>
                {request.decisions.filter(d=>d.status==='open').length} offen · {request.decisions.filter(d=>d.status==='decided').length} entschieden
              </span>
            </div>
          </div>
          {request.decisions.map((dec, i) => (
            <div key={dec.id} onClick={() => setDecisionView(i)}
              style={{ display:'flex', alignItems:'flex-start', gap:14, padding:'14px 18px', borderBottom: i<request.decisions.length-1?'0.5px solid #f5f3ef':'none', cursor:'pointer', transition:'background .1s' }}
              onMouseEnter={e=>e.currentTarget.style.background='#fafaf8'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >
              <div style={{ width:28, height:28, borderRadius:'50%', background: dec.status==='open'?'#FAEEDA':'#EAF3DE', color: dec.status==='open'?'#854F0B':'#3B6D11', fontSize:13, fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                {dec.status==='open'?'?':'✓'}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:14, color:'#1a1a1a', lineHeight:1.45, marginBottom:8 }}>{dec.question}</div>
                <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
                  <span style={{ fontSize:11.5, fontWeight:500, padding:'3px 9px', borderRadius:20, background: dec.status==='open'?'#FCEBEB':'#EAF3DE', color: dec.status==='open'?'#A32D2D':'#3B6D11' }}>
                    {dec.status==='open'?'Offen':'Entschieden'}
                  </span>
                  <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, color:'#888' }}>
                    <Av initials={dec.ownerInitials} colorKey={dec.ownerColor} size={18}/>
                    {dec.owner} {dec.dept && <span style={{ color:'#bbb', fontSize:11 }}>· {dec.dept}</span>}
                  </div>
                </div>
              </div>
              <span style={{ fontSize:15, color:'#ddd', marginTop:4 }}>›</span>
            </div>
          ))}
          <button style={{ display:'flex', alignItems:'center', gap:5, padding:'10px 18px', fontSize:13, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer', borderTop:'0.5px solid #f0ede8', width:'100%' }}>
            + Entscheidungspunkt hinzufügen
          </button>
        </div>

        <div style={{ height:32 }} />
      </div>

      {/* Rail */}
      <div style={{ width:40, minWidth:40, borderLeft:'0.5px solid #f0ede8', display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 0', gap:6, background:'#fff' }}>
        {[
          { key:'act', icon:'📊', label:'Aktivität', dot: true },
          { key:'files', icon:'📎', label:'Anhänge' },
          { key:'notes', icon:'📝', label:'Notizen' },
        ].map(btn => (
          <button key={btn.key} onClick={() => onTogglePanel(btn.key)} aria-label={btn.label}
            style={{ width:32, height:32, borderRadius:8, border:'none', background: activePanel===btn.key?'#EEF1FE':'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, position:'relative', transition:'background .1s' }}
          >
            {btn.icon}
            {btn.dot && request.activity?.length > 0 && <div style={{ position:'absolute', top:4, right:4, width:5, height:5, borderRadius:'50%', background:'#4F6EF7' }} />}
          </button>
        ))}
      </div>

      {/* Side panel */}
      {panelOpen && (
        <div style={{ width:220, minWidth:220, borderLeft:'0.5px solid #f0ede8', overflowY:'auto', padding:'18px 16px', background:'#fff' }}>
          {activePanel === 'act' && (
            <div>
              <div style={{ fontSize:13, fontWeight:500, marginBottom:14, display:'flex', justifyContent:'space-between' }}>Aktivität <button style={{ fontSize:11.5, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer' }}>Alle</button></div>
              {(request.activity||[]).map(a => (
                <div key={a.id} style={{ display:'flex', gap:8, marginBottom:12 }}>
                  <Av initials={a.initials} colorKey={a.color} size={24}/>
                  <div>
                    <div style={{ fontSize:12.5, color:'#555', lineHeight:1.5 }}>{a.text}</div>
                    <div style={{ fontSize:11, color:'#bbb', marginTop:2 }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {activePanel === 'files' && (
            <div>
              <div style={{ fontSize:13, fontWeight:500, marginBottom:14, display:'flex', justifyContent:'space-between' }}>Anhänge <button style={{ fontSize:11.5, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer' }}>Alle</button></div>
              {(request.files||[]).map(f => {
                const fc = FILE_COLORS[f.color]||FILE_COLORS.blue
                return (
                  <div key={f.id} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:10, padding:'7px 8px', borderRadius:8, cursor:'pointer' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#fafaf8'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <div style={{ width:34, height:34, borderRadius:8, background:fc.bg, color:fc.color, fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{f.type}</div>
                    <div>
                      <div style={{ fontSize:12.5, fontWeight:500, color:'#1a1a1a' }}>{f.name}</div>
                      <div style={{ fontSize:11, color:'#bbb' }}>{f.meta}</div>
                    </div>
                  </div>
                )
              })}
              {request.files?.length === 0 && <div style={{ fontSize:12.5, color:'#bbb', textAlign:'center', padding:'20px 0' }}>Noch keine Anhänge.</div>}
              <button style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer', marginTop:4 }}>+ Datei hochladen</button>
            </div>
          )}
          {activePanel === 'notes' && (
            <div>
              <div style={{ fontSize:13, fontWeight:500, marginBottom:12 }}>Notizen</div>
              <div style={{ background:'#F7F7F5', borderRadius:8, padding:'10px 12px', fontSize:12.5, color:'#aaa', lineHeight:1.6, marginBottom:10 }}>Hier können wichtige Notizen festgehalten werden.</div>
              <button style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer' }}>+ Notiz hinzufügen</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
