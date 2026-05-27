import { useState } from 'react'

const OWNER_COLORS = { blue:{bg:'#D9E0FD',text:'#4F6EF7'}, teal:{bg:'#9FE1CB',text:'#0F6E56'}, coral:{bg:'#F5C4B3',text:'#993C1D'}, gray:{bg:'#E8E6E0',text:'#5F5E5A'}, purple:{bg:'#CECBF6',text:'#534AB7'} }
function Av({ initials, colorKey, size=28 }) {
  const c = OWNER_COLORS[colorKey]||OWNER_COLORS.gray
  return <div style={{ width:size, height:size, borderRadius:'50%', background:c.bg, color:c.text, fontSize:size*0.38, fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{initials}</div>
}

export default function DecisionView({ request, initialIndex, onBack, onUpdate }) {
  const [idx, setIdx] = useState(initialIndex)
  const [what, setWhat] = useState('')
  const [why, setWhy] = useState('')
  const dec = request.decisions[idx]

  function switchTo(i) { setIdx(i); setWhat(''); setWhy('') }

  const whyHint = why.length===0 ? { text:'Eine gute Begründung hilft deinem Team später.', color:'#bbb' }
    : why.length<20 ? { text:'Bitte etwas ausführlicher – damit die Entscheidung nachvollziehbar bleibt.', color:'#854F0B' }
    : { text:'Gut. Diese Begründung hilft dem Team.', color:'#3B6D11' }
  const canSave = what.trim().length>0 && why.trim().length>=20

  function save() {
    if (!canSave) return
    const today = new Date().toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'})
    const newEntry = { id:Date.now(), what:what.trim(), why:why.trim(), who:'Sascha Büchel', whoInitials:'SB', date:today }
    const updatedDecisions = request.decisions.map((d,i) => i===idx ? {...d, status:'decided'} : d)
    const decidedCount = updatedDecisions.filter(d=>d.status==='decided').length
    const presentInputs = request.inputs.filter(i=>i.status==='present').length
    const newReadiness = Math.round((presentInputs/Math.max(1,request.inputs.length))*60 + (decidedCount/Math.max(1,request.decisions.length))*40)
    onUpdate({ ...request, decisions:updatedDecisions, log:[newEntry,...request.log], readiness:newReadiness,
      activity:[{ id:Date.now(), text:`Sascha Büchel hat "${what.slice(0,40)}..." als Entscheidung dokumentiert.`, time:'Gerade eben', initials:'SB', color:'coral' }, ...(request.activity||[])]
    })
    setWhat(''); setWhy('')
  }

  return (
    <div style={{ flex:1, display:'flex', overflow:'hidden', minWidth:0 }}>
      {/* Left list */}
      <div style={{ width:210, minWidth:210, borderRight:'0.5px solid #f0ede8', padding:'16px 12px', overflowY:'auto', background:'#fff' }}>
        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:5, background:'none', border:'none', cursor:'pointer', color:'#888', fontSize:12.5, marginBottom:18, padding:0 }}>
          ← Zurück
        </button>
        <div style={{ fontSize:12.5, fontWeight:500, color:'#1a1a1a', marginBottom:10 }}>Entscheidungspunkte</div>
        {request.decisions.map((d,i) => (
          <button key={d.id} onClick={() => switchTo(i)} style={{ width:'100%', textAlign:'left', padding:'10px 11px', borderRadius:9, border: idx===i?'0.5px solid rgba(79,110,247,.25)':'0.5px solid transparent', background: idx===i?'#EEF1FE':'transparent', cursor:'pointer', marginBottom:5 }}>
            <div style={{ fontSize:12.5, color:'#1a1a1a', lineHeight:1.4, marginBottom:5 }}>{d.question}</div>
            <span style={{ fontSize:11, fontWeight:500, padding:'2px 8px', borderRadius:20, background: d.status==='open'?'#FCEBEB':'#EAF3DE', color: d.status==='open'?'#A32D2D':'#3B6D11' }}>
              {d.status==='open'?'Offen':'Entschieden'}
            </span>
          </button>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex:1, overflowY:'auto', padding:'26px 30px', minWidth:0 }}>
        <div style={{ fontSize:12, color:'#bbb', marginBottom:8 }}>Erstellt von {request.owner} · {request.createdAt}</div>
        <span style={{ display:'inline-block', fontSize:11, fontWeight:500, letterSpacing:'0.05em', textTransform:'uppercase', background: dec.status==='open'?'#EEF1FE':'#EAF3DE', color: dec.status==='open'?'#4F6EF7':'#3B6D11', padding:'3px 11px', borderRadius:20, marginBottom:14 }}>
          {dec.status==='open'?'Offen':'Entschieden'}
        </span>
        <h2 style={{ fontSize:21, fontWeight:500, color:'#1a1a1a', letterSpacing:'-0.3px', lineHeight:1.35, marginBottom:18 }}>{dec.question}</h2>

        <div style={{ fontSize:12, color:'#bbb', marginBottom:8 }}>Entscheider</div>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24 }}>
          <Av initials={dec.ownerInitials} colorKey={dec.ownerColor} size={34}/>
          <div>
            <div style={{ fontSize:14, fontWeight:500, color:'#1a1a1a' }}>{dec.owner}</div>
            <div style={{ fontSize:12, color:'#bbb' }}>{dec.dept||''}</div>
          </div>
        </div>

        <div style={{ fontSize:13, fontWeight:500, color:'#1a1a1a', marginBottom:6 }}>Was soll entschieden werden?</div>
        <div style={{ background:'#F7F7F5', borderRadius:9, padding:'11px 13px', fontSize:13.5, color:'#666', lineHeight:1.6, marginBottom:22 }}>{dec.context||dec.question}</div>

        {dec.status === 'open' ? (
          <>
            <div style={{ marginBottom:16 }}>
              <div style={{ fontSize:13, fontWeight:500, color:'#1a1a1a', marginBottom:6 }}>Was wurde entschieden?</div>
              <textarea value={what} onChange={e=>setWhat(e.target.value)} placeholder="Beschreibe die Entscheidung in vollständigen Sätzen…"
                style={{ width:'100%', minHeight:80, padding:'10px 12px', fontSize:13.5, fontFamily:'inherit', border:'0.5px solid #e8e6e0', borderRadius:9, resize:'vertical', outline:'none', color:'#1a1a1a', background:'#fff' }}/>
              <div style={{ fontSize:11, color:'#bbb', marginTop:4 }}>Formuliere die Entscheidung so, dass sie später eindeutig nachvollziehbar ist.</div>
            </div>
            <div style={{ marginBottom:22 }}>
              <div style={{ fontSize:13, fontWeight:500, color:'#1a1a1a', marginBottom:6 }}>Warum wurde diese Entscheidung getroffen?</div>
              <textarea value={why} onChange={e=>setWhy(e.target.value)} placeholder="Erkläre die Begründung…"
                style={{ width:'100%', minHeight:80, padding:'10px 12px', fontSize:13.5, fontFamily:'inherit', border:'0.5px solid #e8e6e0', borderRadius:9, resize:'vertical', outline:'none', color:'#1a1a1a', background:'#fff' }}/>
              <div style={{ fontSize:11, color:whyHint.color, marginTop:4, transition:'color .2s' }}>{whyHint.text}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <button onClick={save} style={{ padding:'9px 22px', background: canSave?'#4F6EF7':'#c5cefc', color:'#fff', border:'none', borderRadius:9, fontSize:13.5, fontWeight:500, cursor: canSave?'pointer':'not-allowed', transition:'background .15s' }}>
                Entscheidung speichern
              </button>
              <span style={{ fontSize:12, color:'#bbb' }}>Wird im Log dokumentiert.</span>
            </div>
          </>
        ) : (
          <div style={{ background:'#EAF3DE', border:'0.5px solid #C0DD97', borderRadius:9, padding:'12px 16px', display:'flex', alignItems:'center', gap:10 }}>
            <span style={{ fontSize:20 }}>✓</span>
            <div style={{ fontSize:13.5, color:'#3B6D11', fontWeight:500 }}>Diese Entscheidung wurde bereits getroffen und dokumentiert.</div>
          </div>
        )}
      </div>

      {/* Log panel */}
      <div style={{ width:210, minWidth:210, borderLeft:'0.5px solid #f0ede8', padding:'18px 16px', overflowY:'auto', background:'#fff' }}>
        <div style={{ background:'#EEEDFE', border:'0.5px solid #CECBF6', borderRadius:9, padding:'13px', marginBottom:20 }}>
          <div style={{ fontSize:13, fontWeight:500, color:'#3C3489', marginBottom:5 }}>Warum vollständig entscheiden?</div>
          <div style={{ fontSize:12, color:'#534AB7', lineHeight:1.6 }}>Vollständige Entscheidungen schaffen Klarheit, vermeiden Rückfragen und helfen dem Team.</div>
        </div>
        <div style={{ fontSize:13, fontWeight:500, color:'#1a1a1a', marginBottom:14 }}>Entscheidungslog</div>
        {request.log.length===0 ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:28, marginBottom:6 }}>📋</div>
            <div style={{ fontSize:12.5, fontWeight:500, color:'#1a1a1a' }}>Noch keine Entscheidungen.</div>
            <div style={{ fontSize:11.5, color:'#bbb', marginTop:3, lineHeight:1.5 }}>Gespeicherte Entscheidungen erscheinen hier.</div>
          </div>
        ) : request.log.map(e => (
          <div key={e.id} style={{ borderTop:'0.5px solid #f0ede8', paddingTop:12, marginTop:12 }}>
            <div style={{ fontSize:13, fontWeight:500, color:'#1a1a1a', marginBottom:4 }}>{e.what}</div>
            <div style={{ fontSize:12, color:'#888', marginBottom:7, lineHeight:1.5 }}>{e.why}</div>
            <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#bbb' }}>
              <div style={{ width:16, height:16, borderRadius:'50%', background:'#F5C4B3', color:'#993C1D', fontSize:8, fontWeight:500, display:'flex', alignItems:'center', justifyContent:'center' }}>{e.whoInitials}</div>
              {e.who} · {e.date}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
