import { useState } from 'react'

const COLORS = { bg: { blue:'#D9E0FD', teal:'#9FE1CB', coral:'#F5C4B3', gray:'#E8E6E0', purple:'#CECBF6' }, text: { blue:'#4F6EF7', teal:'#0F6E56', coral:'#993C1D', gray:'#5F5E5A', purple:'#534AB7' } }

export default function NewRequestModal({ onSave, onClose }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ title:'', category:'', deadline:'', owner:'', department:'' })
  const [inputs, setInputs] = useState([{ id:1, name:'', status:'missing', owner:'', ownerInitials:'', dept:'' }])
  const [decisions, setDecisions] = useState([{ id:1, question:'', owner:'', ownerInitials:'', dept:'' }])

  function set(k, v) { setForm(f => ({...f, [k]:v})) }

  function addInput() { setInputs(i => [...i, { id: Date.now(), name:'', status:'missing', owner:'', ownerInitials:'', dept:'' }]) }
  function updateInput(id, k, v) { setInputs(i => i.map(x => x.id===id ? {...x,[k]:v} : x)) }
  function removeInput(id) { setInputs(i => i.filter(x => x.id!==id)) }

  function addDecision() { setDecisions(d => [...d, { id: Date.now(), question:'', owner:'', ownerInitials:'', dept:'' }]) }
  function updateDecision(id, k, v) { setDecisions(d => d.map(x => x.id===id ? {...x,[k]:v} : x)) }
  function removeDecision(id) { setDecisions(d => d.filter(x => x.id!==id)) }

  function handleSave() {
    const initials = form.owner.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2)
    const newReq = {
      id: Date.now(),
      title: form.title,
      category: form.category || 'Allgemein',
      reqId: 'REQ-2025-' + String(Math.floor(Math.random()*900)+100),
      owner: form.owner,
      ownerInitials: initials,
      ownerColor: 'blue',
      department: form.department,
      deadline: form.deadline,
      createdAt: new Date().toLocaleDateString('de-DE',{day:'numeric',month:'long',year:'numeric'}),
      status: 'Klarheit ausstehend',
      statusColor: 'amber',
      readiness: 0,
      readinessMessage: 'Neue Anfrage – noch keine Inputs oder Entscheidungen vorhanden.',
      nextStep: inputs[0]?.name ? `Input "${inputs[0].name}" einholen` : 'Erste Inputs definieren',
      inputs: inputs.filter(i=>i.name).map(i => ({
        ...i,
        ownerInitials: i.owner.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || '?',
        ownerColor: 'blue',
        detail: '',
      })),
      decisions: decisions.filter(d=>d.question).map(d => ({
        ...d,
        ownerInitials: d.owner.split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2) || '?',
        ownerColor: 'blue',
        status: 'open',
        context: d.question,
      })),
      log: [],
      activity: [{ id:1, text: `${form.owner} hat diese Anfrage angelegt.`, time: 'Gerade eben', initials, color: 'blue' }],
      files: [],
    }
    onSave(newReq)
  }

  const canNext1 = form.title.trim() && form.owner.trim()
  const s = (n) => ({ fontSize: 12, color:'#888', marginBottom: 5, display:'block' })

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100 }}>
      <div style={{ background:'#fff', borderRadius:16, width:560, maxHeight:'85vh', display:'flex', flexDirection:'column', border:'0.5px solid #e8e6e0' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'18px 24px', borderBottom:'0.5px solid #f0ede8' }}>
          <div>
            <div style={{ fontSize:16, fontWeight:500, color:'#1a1a1a' }}>Neue Anfrage anlegen</div>
            <div style={{ fontSize:12, color:'#aaa', marginTop:2 }}>Schritt {step} von 3</div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            {[1,2,3].map(n => (
              <div key={n} style={{ width:28, height:4, borderRadius:99, background: n <= step ? '#4F6EF7' : '#f0ede8', transition:'background .2s' }} />
            ))}
          </div>
          <button onClick={onClose} style={{ width:30, height:30, borderRadius:8, border:'0.5px solid #e8e6e0', background:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:18 }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:'22px 24px' }}>

          {step === 1 && (
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:'#1a1a1a', marginBottom:18 }}>Grundinformationen</div>
              <div style={{ marginBottom:14 }}>
                <label style={s()}>Titel der Anfrage *</label>
                <input value={form.title} onChange={e=>set('title',e.target.value)} placeholder="z. B. Produkteinführung Rückleuchte R7" style={{ width:'100%', padding:'9px 12px', fontSize:14, border:'0.5px solid #e8e6e0', borderRadius:8, outline:'none', color:'#1a1a1a' }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:14 }}>
                <div>
                  <label style={s()}>Kategorie</label>
                  <select value={form.category} onChange={e=>set('category',e.target.value)} style={{ width:'100%', padding:'9px 12px', fontSize:13, border:'0.5px solid #e8e6e0', borderRadius:8, outline:'none', color:'#1a1a1a', background:'#fff' }}>
                    <option value="">Wählen…</option>
                    {['Produkteinführung','Marketing','Digital','Vertrieb','HR','Operations','Sonstiges'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s()}>Deadline</label>
                  <input value={form.deadline} onChange={e=>set('deadline',e.target.value)} placeholder="z. B. 31. Aug. 2025" style={{ width:'100%', padding:'9px 12px', fontSize:13, border:'0.5px solid #e8e6e0', borderRadius:8, outline:'none', color:'#1a1a1a' }} />
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div>
                  <label style={s()}>Verantwortliche Person *</label>
                  <input value={form.owner} onChange={e=>set('owner',e.target.value)} placeholder="Name" style={{ width:'100%', padding:'9px 12px', fontSize:13, border:'0.5px solid #e8e6e0', borderRadius:8, outline:'none', color:'#1a1a1a' }} />
                </div>
                <div>
                  <label style={s()}>Abteilung</label>
                  <input value={form.department} onChange={e=>set('department',e.target.value)} placeholder="z. B. Marketing" style={{ width:'100%', padding:'9px 12px', fontSize:13, border:'0.5px solid #e8e6e0', borderRadius:8, outline:'none', color:'#1a1a1a' }} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:'#1a1a1a', marginBottom:4 }}>Pflicht-Inputs</div>
              <div style={{ fontSize:12, color:'#aaa', marginBottom:18 }}>Was muss vorliegen, damit diese Anfrage starten kann?</div>
              {inputs.map((inp, i) => (
                <div key={inp.id} style={{ display:'grid', gridTemplateColumns:'1fr 120px 120px 32px', gap:8, marginBottom:10, alignItems:'start' }}>
                  <div>
                    {i === 0 && <label style={s()}>Input-Bezeichnung</label>}
                    <input value={inp.name} onChange={e=>updateInput(inp.id,'name',e.target.value)} placeholder="z. B. Produktbilder" style={{ width:'100%', padding:'8px 10px', fontSize:13, border:'0.5px solid #e8e6e0', borderRadius:8, outline:'none' }} />
                  </div>
                  <div>
                    {i === 0 && <label style={s()}>Status</label>}
                    <select value={inp.status} onChange={e=>updateInput(inp.id,'status',e.target.value)} style={{ width:'100%', padding:'8px 10px', fontSize:13, border:'0.5px solid #e8e6e0', borderRadius:8, outline:'none', background:'#fff' }}>
                      <option value="missing">Fehlt</option>
                      <option value="pending">Ausstehend</option>
                      <option value="unclear">Unklar</option>
                      <option value="present">Vorhanden</option>
                    </select>
                  </div>
                  <div>
                    {i === 0 && <label style={s()}>Verantwortlich</label>}
                    <input value={inp.owner} onChange={e=>updateInput(inp.id,'owner',e.target.value)} placeholder="Name" style={{ width:'100%', padding:'8px 10px', fontSize:13, border:'0.5px solid #e8e6e0', borderRadius:8, outline:'none' }} />
                  </div>
                  <div style={{ marginTop: i===0 ? 20 : 0 }}>
                    <button onClick={()=>removeInput(inp.id)} style={{ width:32, height:34, border:'0.5px solid #e8e6e0', borderRadius:8, background:'none', cursor:'pointer', color:'#ccc', fontSize:16 }}>✕</button>
                  </div>
                </div>
              ))}
              <button onClick={addInput} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer', marginTop:4 }}>
                + Input hinzufügen
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ fontSize:14, fontWeight:500, color:'#1a1a1a', marginBottom:4 }}>Entscheidungspunkte</div>
              <div style={{ fontSize:12, color:'#aaa', marginBottom:18 }}>Welche Entscheidungen müssen getroffen werden?</div>
              {decisions.map((dec, i) => (
                <div key={dec.id} style={{ display:'grid', gridTemplateColumns:'1fr 140px 32px', gap:8, marginBottom:10, alignItems:'start' }}>
                  <div>
                    {i === 0 && <label style={s()}>Offene Frage</label>}
                    <input value={dec.question} onChange={e=>updateDecision(dec.id,'question',e.target.value)} placeholder="z. B. Wird als Einzel- oder Set-Produkt verkauft?" style={{ width:'100%', padding:'8px 10px', fontSize:13, border:'0.5px solid #e8e6e0', borderRadius:8, outline:'none' }} />
                  </div>
                  <div>
                    {i === 0 && <label style={s()}>Entscheider</label>}
                    <input value={dec.owner} onChange={e=>updateDecision(dec.id,'owner',e.target.value)} placeholder="Name" style={{ width:'100%', padding:'8px 10px', fontSize:13, border:'0.5px solid #e8e6e0', borderRadius:8, outline:'none' }} />
                  </div>
                  <div style={{ marginTop: i===0 ? 20 : 0 }}>
                    <button onClick={()=>removeDecision(dec.id)} style={{ width:32, height:34, border:'0.5px solid #e8e6e0', borderRadius:8, background:'none', cursor:'pointer', color:'#ccc', fontSize:16 }}>✕</button>
                  </div>
                </div>
              ))}
              <button onClick={addDecision} style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, color:'#4F6EF7', background:'none', border:'none', cursor:'pointer', marginTop:4 }}>
                + Entscheidungspunkt hinzufügen
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ display:'flex', justifyContent:'space-between', padding:'16px 24px', borderTop:'0.5px solid #f0ede8' }}>
          <button onClick={() => step > 1 ? setStep(s=>s-1) : onClose()} style={{ padding:'8px 16px', border:'0.5px solid #e8e6e0', borderRadius:8, background:'none', cursor:'pointer', fontSize:13, color:'#888' }}>
            {step === 1 ? 'Abbrechen' : '← Zurück'}
          </button>
          {step < 3
            ? <button onClick={() => setStep(s=>s+1)} disabled={step===1 && !canNext1} style={{ padding:'8px 20px', background: (step===1 && !canNext1) ? '#c5cefc' : '#4F6EF7', color:'#fff', border:'none', borderRadius:8, cursor: (step===1 && !canNext1)?'not-allowed':'pointer', fontSize:13, fontWeight:500 }}>Weiter →</button>
            : <button onClick={handleSave} style={{ padding:'8px 20px', background:'#4F6EF7', color:'#fff', border:'none', borderRadius:8, cursor:'pointer', fontSize:13, fontWeight:500 }}>Anfrage anlegen</button>
          }
        </div>
      </div>
    </div>
  )
}
