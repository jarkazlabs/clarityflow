import { useState } from 'react'
import DecisionView from './DecisionView.jsx'

const OWNER_COLORS = { blue:{bg:'#D9E0FD',text:'#4F6EF7'}, teal:{bg:'#9FE1CB',text:'#0F6E56'}, coral:{bg:'#F5C4B3',text:'#993C1D'}, gray:{bg:'#E8E6E0',text:'#5F5E5A'}, purple:{bg:'#CECBF6',text:'#534AB7'}, green:{bg:'#EAF3DE',text:'#3B6D11'}, red:{bg:'#FCEBEB',text:'#A32D2D'} }
const STATUS_MAP = { missing:{label:'Fehlt',bg:'#FCEBEB',color:'#A32D2D'}, present:{label:'Vorhanden',bg:'#EAF3DE',color:'#3B6D11'}, unclear:{label:'Unklar',bg:'#FAEEDA',color:'#854F0B'}, pending:{label:'Ausstehend',bg:'#F1EFE8',color:'#5F5E5A'} }
const FILE_COLORS = { red:{bg:'#FCEBEB',color:'#A32D2D'}, blue:{bg:'#E6F1FB',color:'#185FA5'}, green:{bg:'#EAF3DE',color:'#3B6D11'}, purple:{bg:'#EEEDFE',color:'#534AB7'}, amber:{bg:'#FAEEDA',color:'#854F0B'} }

function Av({ initials, colorKey, size=22 }) {
  const c = OWNER_COLORS[colorKey] || OWNER_COLORS.gray
  return <div style={{ width:size, height:size, borderRadius:'50%', background:c.bg, color:c.text, fontSize:size*0.38, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{initials}</div>
}

export default function RequestDetail({ request, onUpdate }) {
  const [decisionView, setDecisionView] = useState(null)

  if (!request) return <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', color:'#bbb' }}>Keine Anfrage ausgewählt.</div>

  if (decisionView !== null) {
    return <DecisionView request={request} initialIndex={decisionView} onBack={() => setDecisionView(null)} onUpdate={onUpdate} />
  }

  function updateInputStatus(inputId, status) {
    const updated = request.inputs.map(i => i.id === inputId ? {...i, status} : i)
    const present = updated.filter(i => i.status === 'present').length
    const decDecided = request.decisions.filter(d => d.status === 'decided').length
    const newReadiness = Math.min(90, Math.round((present / updated.length) * 60) + (decDecided / Math.max(1, request.decisions.length)) * 40)
    onUpdate({ ...request, inputs: updated, readiness: Math.round(newReadiness) })
  }

  const r = 34, circ = 2*Math.PI*r
  const offset = circ - (request.readiness/100)*circ
  const readColor = request.readiness >= 80 ? '#639922' : '#EF9F27'

  return (
    <div style={{ flex:1, display:'flex', overflow:'hidden', minWidth:0 }}>
      {/* Main scroll area */}
      <div style={{ flex:1, overflowY:'auto', padding:'28px 32px 40px', minWidth:0 }}>

        {/* Title + meta row */}
        <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:6 }}>
          <h1 style={{ fontSize:26, fontWeight:600, letterSpacing:'-0.5px', color:'#1a1a1a', margin:0, flex:1 }}>{request.title}</h1>
          <span style={{ fontSize:11.5, color:'#888', background:'#F1EFE8', padding:'4px 10px', borderRadius:20, border:'0.5px solid #e8e6e0', whiteSpace:'nowrap', marginTop:5 }}>{request.reqId}</span>
          <button style={{ width:28, height:28, borderRadius:7, border:'0.5px solid #e8e6e0', background:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, marginTop:3 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 7V11H6L11 6L7 2L2 7Z" stroke="#aaa" strokeWidth="1.2" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <p style={{ fontSize:13, color:'#888', margin:'0 0 22px', lineHeight:1.5 }}>Erstellung der Verpackung für die neue Rückleuchte – inklusive Druckdaten, Freigaben und Produkthandling.</p>

        {/* Meta cards */}
        <div style={{ display:'flex', gap:0, border:'0.5px solid #f0ede8', borderRadius:12, overflow:'hidden', marginBottom:20 }}>
          {[
            { label:'Erstellt von', content: <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:4 }}><Av initials={request.ownerInitials} colorKey={request.ownerColor} size={20}/><span style={{ fontSize:13, fontWeight:500 }}>{request.owner}</span></div> },
            { label:'Erstellt am', content: <div style={{ fontSize:13, fontWeight:500, marginTop:5 }}>{request.createdAt}</div> },
            { label:'Kategorie', content: <div style={{ fontSize:13, fontWeight:500, marginTop:5 }}>{request.category}</div> },
            { label:'Gesamtdeadline', content: <div><div style={{ fontSize:13, fontWeight:500, color:'#BA7517', marginTop:5 }}>{request.deadline || '–'}</div><div style={{ fontSize:11, color:'#bbb', marginTop:2 }}>Keine Einzeldeadlines.</div></div> },
          ].map((c,i) => (
            <div key={i} style={{ flex:1, padding:'11px 16px', borderRight: i<3?'0.5px solid #f0ede8':'none' }}>
              <div style={{ fontSize:11, color:'#bbb', marginBottom:1 }}>{c.label}</div>
              {c.content}
            </div>
          ))}
        </div>

        {/* Readiness banner */}
        <div style={{ display:'flex', alignItems:'center', gap:22, border:'0.5px solid #f0ede8', borderRadius:12, padding:'18px 22px', marginBottom:20, background:'#fff' }}>
          <div style={{ position:'relative', width:80, height:80, flexShrink:0 }}>
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r={r} fill="none" stroke="#F1EFE8" strokeWidth="7"/>
              <circle cx="40" cy="40" r={r} fill="none" stroke={readColor} strokeWidth="7"
                strokeDasharray={circ} strokeDashoffset={offset}
                strokeLinecap="round" transform="rotate(-90 40 40)"/>
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:15, fontWeight:600 }}>{request.readiness}%</div>
          </div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:'#bbb', marginBottom:3 }}>Readiness</div>
            <div style={{ fontSize:16, fontWeight:600, color: request.readiness >= 80 ? '#3B6D11' : '#BA7517', marginBottom:5 }}>
              {request.readiness === 100 ? 'Bereit zur Umsetzung' : request.readiness >= 70 ? 'Fast bereit' : 'Nicht bereit'}
            </div>
            <div style={{ fontSize:13, color:'#888', lineHeight:1.55 }}>{request.readinessMessage}</div>
          </div>
          <div style={{ background:'#F7F7F5', border:'0.5px solid #f0ede8', borderRadius:10, padding:'14px 16px', width:190, flexShrink:0 }}>
            <div style={{ fontSize:11, color:'#bbb', marginBottom:4 }}>Nächster Schritt</div>
            <div style={{ fontSize:13, fontWeight:500, color:'#1a1a1a', lineHeight:1.45, marginBottom:12 }}>{request.nextStep}</div>
            <button onClick={() => setDecisionView(0)} style={{ width:30, height:30, borderRadius:'50%', background:'#4F6EF7', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', marginLeft:'auto', color:'#fff' }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M3 6.5h7M7 3.5l3 3-3 3" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* Inputs + Decisions side by side */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>

          {/* Pflicht-Inputs */}
          <div style={{ border:'0.5px solid #f0ede8', borderRadius:12, overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 16px', borderBottom:'0.5px solid #f0ede8' }}>
              <span style={{ fontSize:13, fontWeight:600 }}>Pflicht-Inputs</span>
              <span style={{ fontSize:11, background:'#F1EFE8', color:'#888', borderRadius:20, padding:'2px 8px', border:'0.5px solid #e8e6e0' }}>{request.inputs.length}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 90px 1fr 16px', gap:8, padding:'6px 16px', background:'#fafaf8', borderBottom:'0.5px solid #f0ede8' }}>
              {['Input','Status','Verantwortlich',''].map((h,i) => <div key={i} style={{ fontSize:10.5, fontWeight:500, color:'#bbb' }}>{h}</div>)}
            </div>
            {request.inputs.map((inp, i) => (
              <div key={inp.id} style={{ display:'grid', gridTemplateColumns:'1fr 90px 1fr 16px', alignItems:'center', gap:8, padding:'10px 16px', borderBottom: i<request.inputs.length-1?'0.5px solid #f5f3ef':'none', cursor:'pointer' }}
                onMouseEnter={e=>e.currentTarget.style.background='#fafaf8'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <div style={{ fontSize:13, color:'#1a1a1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inp.name}</div>
                <select value={inp.status} onChange={e => updateInputStatus(inp.id, e.target.value)}
                  style={{ fontSize:11, padding:'3px 7px', borderRadius:20, border:'none', cursor:'pointer', fontWeight:500,
                    background: STATUS_MAP[inp.status]?.bg || '#eee',
                    color: STATUS_MAP[inp.status]?.color || '#666',
                    outline:'none', WebkitAppearance:'none', maxWidth:88 }}>
                  <option value="missing">✕ Fehlt</option>
                  <option value="pending">◷ Ausstehend</option>
                  <option value="unclear">△ Unklar</option>
                  <option value="present">✓ Vorhanden</option>
                </select>
                <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:12, color:'#666', overflow:'hidden' }}>
                  <Av initials={inp.ownerInitials} colorKey={inp.ownerColor} size={20}/>
                  <div style={{ overflow:'hidden' }}>
                    <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inp.owner}</div>
                    {inp.dept && <div style={{ fontSize:10, color:'#bbb', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{inp.dept}</div>}
                  </div>
                </div>
                <span style={{ fontSize:13, color:'#ddd' }}>›</span>
              </div>
            ))}
            <button style={{ display:'flex', alignItems:'center', gap:5, padding:'9px 16px', fontSize:12.5, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer', borderTop:'0.5px solid #f0ede8', width:'100%' }}
              onMouseEnter={e=>e.currentTarget.style.background='#fafaf8'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >+ Input hinzufügen</button>
          </div>

          {/* Entscheidungspunkte */}
          <div style={{ border:'0.5px solid #f0ede8', borderRadius:12, overflow:'hidden' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, padding:'13px 16px', borderBottom:'0.5px solid #f0ede8' }}>
              <span style={{ fontSize:13, fontWeight:600 }}>Entscheidungspunkte</span>
              <span style={{ fontSize:11, background:'#F1EFE8', color:'#888', borderRadius:20, padding:'2px 8px', border:'0.5px solid #e8e6e0' }}>{request.decisions.length}</span>
            </div>
            {request.decisions.map((dec, i) => (
              <div key={dec.id} onClick={() => setDecisionView(i)}
                style={{ display:'flex', alignItems:'flex-start', gap:12, padding:'14px 16px', borderBottom: i<request.decisions.length-1?'0.5px solid #f5f3ef':'none', cursor:'pointer' }}
                onMouseEnter={e=>e.currentTarget.style.background='#fafaf8'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <div style={{ width:28, height:28, borderRadius:'50%', background: dec.status==='open'?'#F7F7F5':'#EAF3DE', border:'0.5px solid #e8e6e0', color: dec.status==='open'?'#888':'#3B6D11', fontSize:13, fontWeight:600, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:1 }}>
                  {dec.status==='open'?'?':'✓'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, color:'#1a1a1a', lineHeight:1.45, marginBottom:8 }}>{dec.question}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11.5, color:'#888' }}>
                      <Av initials={dec.ownerInitials} colorKey={dec.ownerColor} size={18}/>
                      <span>{dec.owner}</span>
                      {dec.dept && <span style={{ color:'#bbb', fontSize:10.5 }}>{dec.dept}</span>}
                    </div>
                    <span style={{ fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:20, background: dec.status==='open'?'#FCEBEB':'#EAF3DE', color: dec.status==='open'?'#A32D2D':'#3B6D11', marginLeft:'auto' }}>
                      {dec.status==='open'?'Offen':'Entschieden'}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize:14, color:'#ddd', marginTop:4 }}>›</span>
              </div>
            ))}
            <button style={{ display:'flex', alignItems:'center', gap:5, padding:'9px 16px', fontSize:12.5, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer', borderTop:'0.5px solid #f0ede8', width:'100%' }}
              onMouseEnter={e=>e.currentTarget.style.background='#fafaf8'}
              onMouseLeave={e=>e.currentTarget.style.background='transparent'}
            >+ Entscheidungspunkt hinzufügen</button>
          </div>
        </div>

        {/* Entscheidungslog */}
        <div style={{ border:'0.5px solid #f0ede8', borderRadius:12, overflow:'hidden' }}>
          <div style={{ padding:'13px 16px', borderBottom:'0.5px solid #f0ede8' }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Entscheidungslog</span>
          </div>
          {(request.log||[]).map((entry, i) => (
            <div key={entry.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 16px', borderBottom: i<(request.log.length-1)?'0.5px solid #f5f3ef':'none' }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background: i===0?'#4F6EF7':'#3B6D11', flexShrink:0 }} />
              <div style={{ fontSize:12, color:'#555', flex:1 }}>
                <span style={{ fontWeight:500, color:'#1a1a1a' }}>{entry.what}</span>
              </div>
              <div style={{ fontSize:11, color:'#aaa', flexShrink:0 }}>{entry.who} · {entry.whoInitials && <span style={{ color:'#888' }}>{entry.date}</span>}</div>
              <button style={{ fontSize:11.5, color:'#4F6EF7', background:'none', border:'0.5px solid #d8e0fc', borderRadius:6, padding:'3px 10px', cursor:'pointer', flexShrink:0 }}>Details</button>
            </div>
          ))}
          <button style={{ display:'flex', alignItems:'center', gap:5, padding:'10px 16px', fontSize:12.5, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer', width:'100%', justifyContent:'flex-end' }}>
            Zum vollständigen Log →
          </button>
        </div>

        <div style={{ height:32 }} />
      </div>

      {/* Right sidebar — always visible */}
      <div style={{ width:240, minWidth:240, borderLeft:'0.5px solid #f0ede8', overflowY:'auto', background:'#fff', flexShrink:0 }}>

        {/* Aktivität */}
        <div style={{ padding:'16px 16px 12px', borderBottom:'0.5px solid #f0ede8' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Aktivität</span>
            <button style={{ fontSize:11.5, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer', padding:0 }}>Alle anzeigen</button>
          </div>
          {(request.activity||[]).map(a => (
            <div key={a.id} style={{ display:'flex', gap:9, marginBottom:14 }}>
              <div style={{ position:'relative', flexShrink:0 }}>
                <Av initials={a.initials} colorKey={a.color} size={28}/>
                <div style={{ position:'absolute', bottom:0, right:0, width:8, height:8, borderRadius:'50%', background:'#4F6EF7', border:'1.5px solid #fff' }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12, color:'#444', lineHeight:1.5 }}>{a.text}</div>
                <div style={{ fontSize:11, color:'#bbb', marginTop:2 }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Anhänge */}
        <div style={{ padding:'16px 16px 12px', borderBottom:'0.5px solid #f0ede8' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
            <span style={{ fontSize:13, fontWeight:600 }}>Anhänge</span>
            <button style={{ fontSize:11.5, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer', padding:0 }}>Alle anzeigen</button>
          </div>
          {(request.files||[]).map(f => {
            const fc = FILE_COLORS[f.color] || FILE_COLORS.blue
            return (
              <div key={f.id} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10, padding:'6px 8px', borderRadius:8, cursor:'pointer' }}
                onMouseEnter={e=>e.currentTarget.style.background='#fafaf8'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <div style={{ width:34, height:34, borderRadius:8, background:fc.bg, color:fc.color, fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{f.type}</div>
                <div style={{ overflow:'hidden' }}>
                  <div style={{ fontSize:12, fontWeight:500, color:'#1a1a1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{f.name}</div>
                  <div style={{ fontSize:11, color:'#bbb' }}>{f.meta}</div>
                </div>
              </div>
            )
          })}
          {/* AI file */}
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6, padding:'6px 8px', borderRadius:8, cursor:'pointer' }}
            onMouseEnter={e=>e.currentTarget.style.background='#fafaf8'}
            onMouseLeave={e=>e.currentTarget.style.background='transparent'}
          >
            <div style={{ width:34, height:34, borderRadius:8, background:'#FAEEDA', color:'#854F0B', fontSize:9, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>AI</div>
            <div style={{ overflow:'hidden' }}>
              <div style={{ fontSize:12, fontWeight:500, color:'#1a1a1a', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>Verpackung_AlteVersion.ai</div>
              <div style={{ fontSize:11, color:'#bbb' }}>AI · 3.4 MB</div>
            </div>
          </div>
        </div>

        {/* Notizen */}
        <div style={{ padding:'16px 16px 12px' }}>
          <div style={{ fontSize:13, fontWeight:600, marginBottom:10 }}>Notizen</div>
          <div style={{ background:'#F7F7F5', borderRadius:8, padding:'10px 12px', fontSize:12, color:'#aaa', lineHeight:1.6, marginBottom:10 }}>Hier können wichtige Notizen und Informationen zum Request festgehalten werden.</div>
          <button style={{ display:'flex', alignItems:'center', gap:5, fontSize:12.5, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer', padding:0 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1v10M1 6h10" stroke="#4F6EF7" strokeWidth="1.5" strokeLinecap="round"/></svg>
            Notiz hinzufügen
          </button>
        </div>
      </div>
    </div>
  )
}
