import { patientData } from './PatientInfo.js';

// Abbreviations used for compact snapshot
const ABBREV = new Map([
  ['chest pain','CP'], ['shortness of breath','SOB'], ['dyspnea','SOB'],
  ['myocardial infarction','MI'], ['mi','MI'], ['acs','ACS'],
  ['congestive heart failure','CHF'], ['heart failure','CHF'], ['copd','COPD'],
  ['diabetes','DM'], ['diabetes mellitus','DM'], ['chronic kidney disease','CKD'],
  ['hypertension','HTN']
]);

function abbr(text){
  if (!text) return '';
  const t = text.toLowerCase();
  for (const [k,v] of ABBREV) { if (t === k) return v; }
  return text.replace(/\b\w/g, c => c.toUpperCase());
}
function genderSymbol(g){ if (g === 'female') return '♀'; if (g === 'male') return '♂'; return ''; }
function sevHR(hr){ if (hr==null) return ''; if (hr>120||hr<50) return 'text-red-600'; if (hr>100||hr<60) return 'text-yellow-600'; return ''; }
function sevRR(rr){ if (rr==null) return ''; if (rr>24||rr<10) return 'text-red-600'; if (rr>20||rr<12) return 'text-yellow-600'; return ''; }
function sevBGL(bgl){ const n=parseFloat(bgl); if (isNaN(n)) return ''; if (n>200||n<60) return 'text-red-600'; if (n>140||n<70) return 'text-yellow-600'; return ''; }
function sevRhythm(ekg){ const s=(ekg||'').toLowerCase(); if (s.includes('tachy')||s.includes('brady')) return 'text-yellow-600'; return ''; }
function relevantAllergies(inds, allergies){
  const L = a => (a||[]).map(x=>x.toLowerCase());
  const iL = L(inds), aL=L(allergies);
  const out=[];
  const chestPainLike = iL.some(t=>['chest pain','mi','acs','myocardial infarction'].includes(t));
  if (chestPainLike && aL.includes('asa')) out.push('ASA');
  return out;
}

// Render compact snapshot under the search bar
export function renderPatientSnapshot(){
  const bar = document.getElementById('patient-snapshot-bar');
  if (!bar) return;
  const d = patientData;
  const parts = [];
  // Age/Gender/Weight
  if (d.age!=null || d.gender || d.weight!=null){
    const age = d.age!=null ? `${d.age}yo` : '';
    const g = genderSymbol(d.gender);
    const wt = d.weight!=null ? `${d.weight}kg` : '';
    const seg = [age,g,wt].filter(Boolean).join(' ');
    if (seg) parts.push(seg);
  }
  // Indications underlined blue
  if (Array.isArray(d.indications) && d.indications.length){
    const inds = d.indications.map(ind => `<span class="underline decoration-blue-600 text-blue-600" title="${ind}">${abbr(ind)}</span>`);
    parts.push(inds.join(', '));
  }
  // Allergies: NKA if none provided; else only show relevant ones
  if (Array.isArray(d.allergies) && d.allergies.length){
    const rel = relevantAllergies(d.indications, d.allergies);
    if (rel.length) parts.push(`Allergy: ${rel.join(', ')}`);
  } else {
    parts.push('NKA');
  }
  // PMH concise (up to 2)
  if (Array.isArray(d.pmh) && d.pmh.length){
    const pmh = d.pmh.slice(0,2).map(p=>`<span title="${p}">${abbr(p)}</span>`).join(', ');
    if (pmh) parts.push(`PMH: ${pmh}`);
  }
  // Vitals
  const v = d.vitalSigns || {};
  if (v.bp) parts.push(`BP ${v.bp}`);
  if (v.hr!=null) parts.push(`<span class="${sevHR(v.hr)}">HR ${v.hr}</span>`);
  if (v.rr!=null) parts.push(`<span class="${sevRR(v.rr)}">RR ${v.rr}</span>`);
  if (v.bgl) parts.push(`<span class="${sevBGL(v.bgl)}">BGL ${v.bgl}</span>`);
  if (d.ekg) parts.push(`<span class="${sevRhythm(d.ekg)}" title="${d.ekg}">${abbr(d.ekg)}</span>`);

  bar.innerHTML = parts.join(' · ');
}

if (typeof window !== 'undefined') { window.renderPatientSnapshot = renderPatientSnapshot; }

// Optionally expose globally
if (typeof window !== 'undefined') {
    window.renderPatientSnapshot = renderPatientSnapshot;
}
