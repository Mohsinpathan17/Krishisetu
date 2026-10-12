import React, { useEffect, useState } from 'react';

const districts = ['Bhandara','Raigad','Ratnagiri'];
// District weather labels remain unverified; uploaded station metadata conflicts with filenames.
const initial = { location: 'Bhandara', crop: 'Rice', temperature: '', humidity: '', rainfall: '' };
async function readJson(url, options) {
  const response = await fetch(url, options);
  let data;
  try { data = await response.json(); } catch { throw new Error('The server returned an invalid response.'); }
  if (!response.ok) throw new Error(data.error || data.message || 'The service is unavailable.');
  return data;
}
function formatPayload(input) {
  return { location:input.location, crop:input.crop, temperature:Number(input.temperature), humidity:Number(input.humidity), rainfall:Number(input.rainfall) };
}
export default function App() {
  const [form, setForm] = useState(initial);
  const [services, setServices] = useState({ web:'checking',database:'checking',ml:'checking' });
  const [result,setResult] = useState(null);
  const [message,setMessage] = useState('');
  const [loading,setLoading] = useState(false);
  const [records,setRecords] = useState([]);
  const [recordsError,setRecordsError] = useState('');
  useEffect(() => {
    let mounted = true;
    const check = async (url, key) => {
      try { await readJson(url); if (mounted) setServices(v=>({...v,[key]:'online'})); }
      catch { if (mounted) setServices(v=>({...v,[key]:'offline'})); }
    };
    check('/api/health','web');
    check('/api/ready','database');
    check('/api/ml-health','ml');
    return () => { mounted = false; };
  }, []);
  const field = (key, value) => setForm(v => ({...v,[key]:value}));
  async function predict(e) {
    e.preventDefault();
    setMessage(''); setResult(null);
    const values=[form.temperature,form.humidity,form.rainfall].map(Number);
    if ([form.temperature,form.humidity,form.rainfall].some(v=>String(v).trim()==='') || values.some(v=>!Number.isFinite(v))) { setMessage('Enter valid values for all environmental fields.'); return; }
    if(values[1]<0 || values[1]>100 || values[2]<0 || values[0]<-30 || values[0]>65) { setMessage('Check the temperature, humidity (0–100%), and rainfall (non-negative).'); return; }
    setLoading(true);
    try {
      const data=await readJson('/api/predict',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(formatPayload(form)) });
      setResult(data);
    } catch (err) { setMessage(err.message); } finally { setLoading(false); }
  }
  async function fetchRecords() {
    setRecordsError('');
    try {
      const data=await readJson('/api/pest-data');
      if(!Array.isArray(data)) throw new Error('Unexpected response format.');
      setRecords(data.slice(0,8));
    } catch(err) { setRecords([]); setRecordsError(err.message); }
  }
  return <div className="site">
    <header className="nav wrap"><a href="#home" className="brand"><span className="brandmark">✳</span> KrishiSetu<span className="branddot">.</span></a><nav><a href="#platform">Platform</a><a href="#predict">Pest prediction</a><a href="#data">Research data</a><a href="#about">About</a></nav><a className="navcta" href="https://github.com/Mohsinpathan17/Krishisetu" target="_blank" rel="noreferrer">View source ↗</a></header>
    <main id="home">
      <section className="hero"><div className="wrap hero-grid"><div><div className="eyebrow"><span className="pulse"/> RESEARCH-DRIVEN AGRICULTURAL INTELLIGENCE</div><h1>Healthier crops.<br/><em>Better decisions.</em></h1><p className="lead">Explore Kharif crop conditions and research-based pest-risk predictions. Bringing agricultural data and machine learning into one easy-to-use platform.</p><div className="hero-actions"><a className="btn primary" href="#predict">Explore predictions <span>↗</span></a><a className="btn outline" href="#data">Explore records →</a></div><div className="hero-foot"><span>MAHARASHTRA FOCUS</span><span>KHARIF CROP RESEARCH</span><span>DATA + MACHINE LEARNING</span></div></div><div className="hero-art" role="img" aria-label="Illustrated agricultural field and monitoring panel"><div className="sun"/><div className="hills far"/><div className="hills near"/><div className="field f1"/><div className="field f2"/><div className="field f3"/><div className="floating"><small>FIELD INTELLIGENCE</small><strong>Grow with insight.</strong><span>Weather · Soil · Pest risk</span></div></div></div></section>
      <section className="servicebar wrap" id="platform"><div><span className="section-kicker">SYSTEM STATUS</span><h2>Connected to your research stack.</h2></div><div className="statusrow">{[['web','Website API'],['database','Agricultural database'],['ml','Prediction engine']].map(([k,v])=><div className="status" key={k}><span className={'statusdot '+services[k]}/><div><strong>{v}</strong><small>{services[k]==='checking'?'Checking…':services[k]==='online'?'Available':'Unavailable'}</small></div></div>)}</div></section>
      <section className="feature-section wrap"><div className="intro"><span className="section-kicker">WHAT KRISHISETU DOES</span><h2>Field research, made accessible.</h2><p>Understand crop conditions using a simple interface designed around data, not guesswork.</p></div><div className="feature-grid"><article className="feature"><div className="feature-icon">◈</div><h3>Pest risk assessment</h3><p>Submit environmental observations to the connected research prediction service.</p></article><article className="feature"><div className="feature-icon">◎</div><h3>District-level insights</h3><p>Browse agricultural records by location when the research database is available.</p></article><article className="feature"><div className="feature-icon">⌁</div><h3>Transparent system status</h3><p>Know whether data and inference services are online before relying on any results.</p></article></div></section>
      <section id="predict" className="workspace"><div className="wrap work-grid"><div><span className="section-kicker light">INTERACTIVE RESEARCH WORKSPACE</span><h2>Check a field's<br/>pest risk.</h2><p>Enter crop and climate observations. The connected Python ML service must be validated against the original trained model and its input schema before results can be used.</p><div className="notice">Research prototype. Predictions are estimates and should not replace local agricultural advice.</div></div><form className="predict-form" onSubmit={predict}><div className="formhead"><strong>Pest risk predictor</strong><span>LIVE API</span></div><div className="two"><label>District<select value={form.location} onChange={e=>field('location',e.target.value)}>{districts.map(x=><option key={x}>{x}</option>)}</select></label><label>Crop<select value={form.crop} onChange={e=>field('crop',e.target.value)}>{['Rice','Cotton','Soybean','Maize','Pulses'].map(x=><option key={x}>{x}</option>)}</select></label></div><div className="two"><label>Temperature (°C)<input type="number" step="any" placeholder="e.g. 28" value={form.temperature} onChange={e=>field('temperature',e.target.value)}/></label><label>Humidity (%)<input type="number" step="any" min="0" max="100" placeholder="e.g. 72" value={form.humidity} onChange={e=>field('humidity',e.target.value)}/></label></div><label>Rainfall (mm)<input type="number" step="any" min="0" placeholder="e.g. 15" value={form.rainfall} onChange={e=>field('rainfall',e.target.value)}/></label><button className="btn primary wide" disabled={loading}>{loading?'Requesting prediction…':'Generate risk assessment →'}</button>{message&&<div className="alert" role="alert">{message}</div>}{result&&<div className="result" aria-live="polite"><strong>Model response</strong><pre>{JSON.stringify(result,null,2)}</pre><small>Output is displayed as returned by the prediction service; interpretation depends on the trained model.</small></div>}</form></div></section>
      <section id="data" className="wrap data-section"><div className="data-top"><div><span className="section-kicker">AGRICULTURAL RECORDS</span><h2>Explore the research dataset.</h2><p>Load source records from the connected database. Location and pest identifiers are encoded and their mappings are not yet verified; weather station names also require reconciliation.</p></div><button className="btn dark" onClick={fetchRecords}>Load research records ↗</button></div>{recordsError&&<div className="alert" role="alert">{recordsError}</div>}{records.length>0?<div className="record-list">{records.map((r,i)=><pre key={i}>{JSON.stringify(r,null,2)}</pre>)}</div>:<div className="empty"><span>▤</span><strong>No records loaded</strong><p>Load original encoded pest research records. District code mappings have not yet been verified.</p></div>}</section>
      <section id="about" className="about"><div className="wrap about-grid"><div><span className="section-kicker">BUILT ON RESEARCH</span><h2>From a research paper<br/>to a useful platform.</h2></div><div><p>KrishiSetu originated in a machine-learning study of pest outbreak prediction for Kharif crops. The project explores environmental features and comparisons among Random Forest, XGBoost, SVM, and LSTM methods.</p><p>The work was presented at ICRTSET-2026. This website is an engineering interface for the research system, not a guarantee of prediction accuracy.</p><a href="https://github.com/Mohsinpathan17/Krishisetu" target="_blank" rel="noreferrer">Explore the research repository ↗</a></div></div></section>
    </main><footer><div className="wrap footer"><strong>✳ KrishiSetu.</strong><span>Research-driven crop intelligence · Maharashtra, India</span><a href="https://github.com/Mohsinpathan17">Built by Mohsin Pathan ↗</a></div></footer>
  </div>;
}
