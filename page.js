'use client';
import {useEffect,useState} from 'react';
export default function Home(){
 const [file,setFile]=useState(null),[preview,setPreview]=useState(''),[notes,setNotes]=useState([]),[busy,setBusy]=useState(false),[q,setQ]=useState(''),[open,setOpen]=useState(null);
 useEffect(()=>{try{setNotes(JSON.parse(localStorage.getItem('studyNotes')||'[]'))}catch{}},[]);
 function save(n){const a=[n,...notes];setNotes(a);localStorage.setItem('studyNotes',JSON.stringify(a))}
 function pick(e){const f=e.target.files?.[0];if(!f)return;setFile(f);const r=new FileReader();r.onload=()=>setPreview(r.result);r.readAsDataURL(f)}
 async function analyze(){if(!file)return;setBusy(true);try{const r=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({image:preview})});const d=await r.json();if(!r.ok)throw Error(d.error||'AI error');d.date=new Intl.DateTimeFormat('en-IN',{day:'2-digit',month:'short',year:'numeric'}).format(new Date());d.image=preview;save(d);setFile(null);setPreview('');alert('✅ Notes saved!')}catch(e){alert('❌ '+e.message)}finally{setBusy(false)}}
 const filtered=notes.filter(n=>(n.title+' '+n.subject+' '+n.summary+' '+(n.keyPoints||[]).join(' ')).toLowerCase().includes(q.toLowerCase()));
 return <main><header><h1>📚 Study Notes AI</h1><p>Photo → AI Notes → Date-wise History</p></header>
 <section className="card"><input placeholder="🔍 Search notes..." value={q} onChange={e=>setQ(e.target.value)}/></section>
 <section className="card"><h2>Aaj kya padha?</h2><div className="buttons">
 <label className="btn primary">📷 Camera<input hidden type="file" accept="image/*" capture="environment" onChange={pick}/></label>
 <label className="btn">🖼️ Gallery<input hidden type="file" accept="image/*" onChange={pick}/></label></div>
 {preview&&<><img className="preview" src={preview}/><button className="btn primary full" disabled={busy} onClick={analyze}>{busy?'🤖 Notes bana raha hoon…':'✨ AI se Notes banao'}</button></>}</section>
 <h2>📅 Study History</h2>{filtered.length===0?<section className="card muted">Abhi koi notes nahi. Photo upload karke start karo.</section>:filtered.map((n,i)=><section className="card note" key={i} onClick={()=>setOpen(n)}><h3>{n.title}</h3><span>{n.date} • {n.subject}</span><p>{n.summary}</p></section>)}
 {open&&<div className="modal" onClick={()=>setOpen(null)}><div className="modalbox" onClick={e=>e.stopPropagation()}><button className="close" onClick={()=>setOpen(null)}>✕</button><h2>{open.title}</h2><p className="muted">📅 {open.date} • {open.subject}</p>{open.image&&<img className="preview" src={open.image}/>}<h3>Quick Summary</h3><p>{open.summary}</p>{[['Key Points',open.keyPoints],['Formulas / Definitions',open.formulas],['Quick Revision',open.revision]].map(([t,a])=>a?.length?<div key={t}><h3>{t}</h3><ul>{a.map((x,j)=><li key={j}>{x}</li>)}</ul></div>:null)}</div></div>}
 </main>
}