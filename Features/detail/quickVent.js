import { addTapListener } from '../../Utils/addTapListener.js';

function renderQuickVentSetup(contentArea){
  const wrap = document.createElement('div');
  wrap.className = 'mb-4';
  wrap.innerHTML = `
    <div class="text-center mb-3"><span class="font-semibold underline text-2xl md:text-3xl">Zoll Set Up</span></div>
    <div class="qv relative max-w-3xl mx-auto border border-gray-400 rounded pt-1 pb-2 mb-4">
      <div class="qv-legend absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2 text-sm font-semibold underline">Input Pt Info</div>
    <div class="qv-row">
      <div class="qv-field">
        <label class="block text-sm font-medium mb-1 underline text-center">Sex</label>
        <div id="qv-sex" class="flex flex-col gap-1 items-center">
          <button data-val="male" class="text-sm border border-gray-500 rounded px-1 leading-tight">♂</button>
          <button data-val="female" class="text-sm border border-gray-500 rounded px-1 leading-tight">♀</button>
        </div>
      </div>
      <div class="qv-field">
        <label class="block text-sm font-medium mb-1 underline text-center">Weight</label>
        <div class="qv-weight">
          <div class="qv-unit"><input type="text" inputmode="decimal" id="qv-weight-lb" class="qv-input qv-num" placeholder="" aria-label="Weight pounds" /><span class="qv-suffix">lb</span></div>
          <div class="qv-unit"><input type="text" inputmode="decimal" id="qv-weight-kg" class="qv-input qv-num" placeholder="" aria-label="Weight kilograms" /><span class="qv-suffix">kg</span></div>
        </div>
      </div>
      <div class="qv-field">
        <label class="block text-sm font-medium mb-1 underline text-center">Height</label>
        <div class="qv-height">
          <div class="qv-height-pair">
            <div class="qv-unit"><input type="text" inputmode="numeric" id="qv-height-ft" class="qv-input qv-num" placeholder="" aria-label="Height feet" /><span class="qv-suffix">ft</span></div>
            <div class="qv-unit"><input type="text" inputmode="numeric" id="qv-height-in" class="qv-input qv-num" placeholder="" aria-label="Height inches" /><span class="qv-suffix">in</span></div>
          </div>
          <div class="qv-height-total"><input type="text" inputmode="numeric" id="qv-height-inches" class="qv-input qv-num" placeholder="" aria-label="Total inches" /><span class="qv-total-label">in</span></div>
        </div>
      </div>
      <div class="qv-field">
        <label class="block text-sm font-medium mb-1 underline text-center">ARDS?</label>
        <div id="qv-ards" class="flex flex-col gap-1 items-center">
          <button data-val="yes" class="text-sm border border-gray-500 rounded px-1 leading-tight">Yes</button>
          <button data-val="no" class="text-sm border border-gray-500 rounded px-1 leading-tight">No</button>
          <button data-val="unsure" class="text-sm border border-gray-500 rounded px-1 leading-tight">Not Sure</button>
        </div>
      </div>
    </div>
    </div>
    <div class="md:col-span-2 qv-tv-row">
      <div class="qv-tv-title">Suggested Tidal Volume =</div>
      <div id="qv-tv" class="qv-tv-ans" title="Hover to see math"></div>
    </div>
    <div class="mt-4 text-sm">
      <ul class="list-disc ml-5">
        <li>IFT = Obtain vent setting from respiratory therapist</li>
        <li>New ventilator pt = Use Ideal Body Weight (IBW) to find the Tidal Volume</li>
        <li><span class="qv-toggle text-green-700 cursor-pointer" role="button" tabindex="0" aria-expanded="false">Attach circuit to circuit tube hole <span class="qv-indicator" aria-hidden="true">Show</span><span class="qv-info hidden">big tube covered by red cap on right</span></span></li>
        <li><span class="qv-toggle text-green-700 cursor-pointer" role="button" tabindex="0" aria-expanded="false">Attach green tube to top transducer port <span class="qv-indicator" aria-hidden="true">Show</span><span class="qv-info hidden">top left</span></span></li>
        <li><span class="qv-toggle text-green-700 cursor-pointer" role="button" tabindex="0" aria-expanded="false">Attach clear tube to bottom port exhalation valve <span class="qv-indicator" aria-hidden="true">Show</span><span class="qv-info hidden">bottom left</span></span></li>
        <li>Turn on → Let self test run → Patient disconnect should display</li>
        <li>Check high pressure alarm by putting gloved hand against end of vent circuit</li>
        <li>Select mode - Assistant Control (AC) or SIMV</li>
        <li>Select breath type - Volume or Pressure</li>
        <li>Adjust settings &amp; alarms prn</li>
        <li><span class="qv-toggle text-green-700 cursor-pointer" role="button" tabindex="0" aria-expanded="false">Attach filter &amp; Capnography <span class="qv-indicator" aria-hidden="true">Show</span><span class="qv-info hidden">Place filter closer to pt &amp; place Capno on the other side of the filter that is farther from the pt</span></span></li>
        <li>Attach circuit to the pt</li>
        <li>Assess the pt\'s reaction to the vent &amp; document settings on Vent Form</li>
        <li>If any changes are needed, then discuss those changes with the Respiratory Therapist and document the changes on the Vent Form.</li>
      </ul>
    </div>
  `;
  contentArea.appendChild(wrap);
  // Ensure sex buttons have no stray inner text (control chars) so only ::before icons show
  try { wrap.querySelectorAll('#qv-sex button').forEach(b => { b.textContent = ''; }); } catch(e) {} // eslint-disable-line no-empty
  // Transform specific list items: make the leading instruction text non-interactive
  try {
    const patterns = [
      { prefix: 'Attach circuit to ', clickable: 'circuit tube hole' },
      { prefix: 'Attach green tube to ', clickable: 'top transducer port' },
      { prefix: 'Attach clear tube to ', clickable: 'bottom port exhalation valve' },
    ];
    wrap.querySelectorAll('.qv-toggle').forEach(span => {
      const li = span.closest('li');
      if (!li) return;
      const textBeforeToggle = Array.from(span.childNodes)
        .filter(n => n.nodeType === Node.TEXT_NODE)
        .map(n => n.textContent || '')
        .join('')
        .trim();
      for (const p of patterns) {
        if (textBeforeToggle.startsWith(p.prefix) && textBeforeToggle.includes(p.clickable)) {
          const prefixNode = document.createTextNode(p.prefix);
          li.insertBefore(prefixNode, span);
          const firstNode = span.childNodes[0];
          if (firstNode && firstNode.nodeType === Node.TEXT_NODE) {
            firstNode.textContent = `${p.clickable} `;
          }
          break;
        }
      }
    });
  } catch(e) { /* ignore */ } // eslint-disable-line no-empty
  wrap.querySelectorAll('.qv-toggle').forEach(el => {
    addTapListener(el, () => {
      const info = el.querySelector('.qv-info');
      if (!info) return;
      const indicator = el.querySelector('.qv-indicator');
      const isHidden = info.classList.toggle('hidden');
      const expanded = !isHidden;
      if (indicator) indicator.textContent = expanded ? 'Hide' : 'Show';
      el.classList.toggle('open', expanded);
      el.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
  });
  // Prefill from patientData
  const sexContainer = wrap.querySelector('#qv-sex');
  const wtKgEl = wrap.querySelector('#qv-weight-kg');
  const wtLbEl = wrap.querySelector('#qv-weight-lb');
  const wtClrEl = wrap.querySelector('#qv-weight-clear');
  const ftEl = wrap.querySelector('#qv-height-ft');
  const inEl = wrap.querySelector('#qv-height-in');
  const totalEl = wrap.querySelector('#qv-height-inches');
  const ardsContainer = wrap.querySelector('#qv-ards');
  const tvEl = wrap.querySelector('#qv-tv');
  // Input helpers for validation/formatting
  function clamp(num, min, max){ if (isNaN(num)) return NaN; return Math.min(max, Math.max(min, num)); }

function frac(numer, denom){
    return `<span class="frac"><span class="frac-num">${numer}</span><span class="frac-bar"></span><span class="frac-den">${denom}</span></span>`;
  }

function setInputSize(el){ /* disabled autosizing to keep inputs fixed */ }

function sanitizeIntInRange(str, min, max){
    const onlyDigits = String(str || '').replace(/[^0-9]/g, '');
    if (!onlyDigits) return '';
    let n = parseInt(onlyDigits, 10);
    if (isNaN(n)) return '';
    n = clamp(n, min, max);
    return String(n);
  }

function sanitizeWeight(str, unit){
    // allow only digits and optional single decimal with one digit
    let s = String(str || '').toLowerCase().replace(/[^0-9.]/g, '');
    const firstDot = s.indexOf('.');
    if (firstDot !== -1){
      // keep only first dot, remove any others
      s = s.slice(0, firstDot+1) + s.slice(firstDot+1).replace(/\./g, '');
    }
    // limit to one decimal place
    s = s.replace(/^(\d+)(\.(\d)?).*$/, '$1$2$3');
    // remove leading zeros if any (except keep single zero before decimal)
    s = s.replace(/^0+(\d)/, '$1');
    // clamp to realistic max
    const max = unit === 'kg' ? 300 : 660;
    const val = parseFloat(s);
    if (!isNaN(val)) {
      const clamped = clamp(val, 0, max);
      // preserve one decimal if present, else as integer string
      s = (s.includes('.') ? clamped.toFixed(1) : String(Math.trunc(clamped)));
    } else {
      s = '';
    }
    return s;
  }
  if (window.patientData) {
    if (window.patientData.gender) selectOption(sexContainer, window.patientData.gender);
    if (window.patientData.weight != null) wtKgEl.value = window.patientData.weight;
    if (window.patientData.weight != null) wtLbEl.value = (window.patientData.weight * 2.20462).toFixed(1);
    if (window.patientData.heightIn != null) {
      const h = window.patientData.heightIn;
      totalEl.value = h;
      ftEl.value = Math.floor(h/12);
      inEl.value = h % 12;
    }
  }

function updateSidebarFromQV() {
    // Update sidebar fields to keep in sync
    const g = getSelected(sexContainer);
    const wkg = parseFloat(wtKgEl.value || '');
    const wlb = parseFloat(wtLbEl.value || '');
    const w = !isNaN(wkg) ? wkg : (!isNaN(wlb) ? +(wlb/2.20462).toFixed(2) : NaN);
    const ft = parseInt(ftEl.value || '0',10);
    const inc = parseInt(inEl.value || '0',10);
    const total = parseInt(totalEl.value || ((ft*12 + inc)||''), 10);
    // Update patientData directly to avoid full re-render while typing
    if (window.patientData) {
      window.patientData.gender = g || window.patientData.gender;
      window.patientData.weight = !isNaN(w) ? w : window.patientData.weight;
      window.patientData.heightIn = isNaN(total) ? window.patientData.heightIn : total;
      if (typeof window.renderPatientSnapshot === 'function') window.renderPatientSnapshot();
    }
  }

function ibwKg(sex, heightIn) {
    if (!sex || !heightIn) return null;
    const over60 = Math.max(0, heightIn - 60);
    const base = sex === 'male' ? 50 : 45.5;
    return +(base + 2.3 * over60).toFixed(1);
  }

function tvRange(kg, ards) {
    if (!kg) return null;
    // mL/kg ranges
    const normal = [6,8];
    const ardsR = [4,6];
    if (ards === 'yes') return [Math.round(kg*ardsR[0]), Math.round(kg*ardsR[1])];
    if (ards === 'no') return [Math.round(kg*normal[0]), Math.round(kg*normal[1])];
    // unsure → return both as string later
    return {
      normal: [Math.round(kg*normal[0]), Math.round(kg*normal[1])],
      ards: [Math.round(kg*ardsR[0]), Math.round(kg*ardsR[1])]
    };
  }

function getSelected(container){ const btn=container.querySelector('button.selected'); return btn?btn.dataset.val:''; }

function setSelected(container, val){ container.querySelectorAll('button').forEach(b=>{ b.classList.toggle('selected', b.dataset.val===val); }); }

function selectOption(container, val){ if (!val) return; setSelected(container, val); }

function compute() {
    const sex = getSelected(sexContainer);
    const wkg = parseFloat(wtKgEl.value || 'NaN');
    const wlb = parseFloat(wtLbEl.value || 'NaN');
    const w = !isNaN(wkg) ? wkg : (!isNaN(wlb) ? (wlb/2.20462) : NaN);
    const total = parseInt(totalEl.value || (parseInt(ftEl.value||'0',10)*12 + parseInt(inEl.value||'0',10)), 10);
    const ards = getSelected(ardsContainer);
    let usedKg = null;
    let mathHtml = '';
    if (!isNaN(w)) {
      usedKg = +w.toFixed(1);
      mathHtml = `Using actual weight: <strong>${usedKg} kg</strong><br/>`;
    } else if (sex && !isNaN(total)) {
      const ibw = ibwKg(sex,total);
      if (ibw) {
        usedKg = ibw;
        const base = sex === 'male' ? 50 : 45.5;
        mathHtml = `IBW (${sex}) = ${base} + 2.3 × (${total} − 60) = <strong>${ibw} kg</strong><br/>`;
      }
    }
    let display = '';
    const isUnsure = ards === 'unsure';
    if (usedKg != null) {
      const rng = tvRange(usedKg, ards);
      if (rng && Array.isArray(rng)) {
        display = `<span class="qv-tv-ans-val">${rng[0]}-${rng[1]} mL</span>`;
        mathHtml += `TV range = <strong>[${ards==='yes'?'4–6':'6–8'} mL/<s>kg</s>]</strong> × <strong>${usedKg} <s>kg</s></strong> → <strong>${rng[0]}–${rng[1]} mL</strong>`;
      } else if (rng && rng.normal) {
        display = `${rng.normal[0]}–${rng.normal[1]} mL (no ARDS) · ${rng.ards[0]}–${rng.ards[1]} mL (ARDS)`;
        mathHtml += `No ARDS: [6–8 mL/<s>kg</s>] × ${usedKg} <s>kg</s> → <strong>${rng.normal[0]}–${rng.normal[1]} mL</strong><br/>ARDS: [4–6 mL/<s>kg</s>] × ${usedKg} <s>kg</s> → <strong>${rng.ards[0]}–${rng.ards[1]} mL</strong>`;
      } else {
        display = '';
      }
    }
    tvEl.innerHTML = display;
    // Enforce exact placement of the pastel-purple answer text
    try {
      const rng2 = tvRange(usedKg, ards);
      if (rng2 && Array.isArray(rng2)) {
        tvEl.innerHTML = `<span class="qv-tv-ans-val">${rng2[0]}-${rng2[1]} mL</span>`;
      } else if (rng2 && rng2.normal) {
        tvEl.innerHTML = `<div class="qv-tv-ans-line"><span class="qv-tv-ans-val">${rng2.normal[0]}-${rng2.normal[1]} mL</span><span class="qv-tv-ans-label"> (no ARDS)</span></div>`+
                         `<div class="qv-tv-ans-line"><span class="qv-tv-ans-val">${rng2.ards[0]}-${rng2.ards[1]} mL</span><span class="qv-tv-ans-label"> (ARDS)</span></div>`;
      }
    } catch(e) { /* ignore */ } // eslint-disable-line no-empty
    // Ensure explicit formulas are always shown (min/max per case)
    try {
      if (usedKg != null && !/TV min/.test(mathHtml)) {
        const both = tvRange(usedKg, ards);
        let detail = '';
        if (both && Array.isArray(both)) {
          const minPerKg = ards==='yes'?4:6;
          const maxPerKg = ards==='yes'?6:8;
          const tvMin = Math.round(usedKg * minPerKg);
          const tvMax = Math.round(usedKg * maxPerKg);
          detail += `<div><strong>TV min</strong> = <strong>${minPerKg} mL/<s>kg</s></strong> \u00D7 <strong>${usedKg} <s>kg</s></strong> \u001a <strong>${tvMin} mL</strong></div>`;
          detail += `<div><strong>TV max</strong> = <strong>${maxPerKg} mL/<s>kg</s></strong> \u00D7 <strong>${usedKg} <s>kg</s></strong> \u001a <strong>${tvMax} mL</strong></div>`;
          detail += `<div class="mt-1"><em>Range</em> = <strong>${tvMin}-${tvMax} mL</strong></div>`;
        } else if (both && both.normal) {
          const nMinPerKg = 6, nMaxPerKg = 8;
          const aMinPerKg = 4, aMaxPerKg = 6;
          const nMin = Math.round(usedKg * nMinPerKg);
          const nMax = Math.round(usedKg * nMaxPerKg);
          const aMin = Math.round(usedKg * aMinPerKg);
          const aMax = Math.round(usedKg * aMaxPerKg);
          detail += `<div><u>No ARDS</u></div>`;
          detail += `<div><strong>TV min</strong> = <strong>${nMinPerKg} mL/<s>kg</s></strong> \u00D7 <strong>${usedKg} <s>kg</s></strong> \u001a <strong>${nMin} mL</strong></div>`;
          detail += `<div><strong>TV max</strong> = <strong>${nMaxPerKg} mL/<s>kg</s></strong> \u00D7 <strong>${usedKg} <s>kg</s></strong> \u001a <strong>${nMax} mL</strong></div>`;
          detail += `<div class="mt-1"><em>Range</em> = <strong>${nMin}-${nMax} mL</strong></div>`;
          detail += `<br/>`;
          detail += `<div><u>ARDS</u></div>`;
          detail += `<div><strong>TV min</strong> = <strong>${aMinPerKg} mL/<s>kg</s></strong> \u00D7 <strong>${usedKg} <s>kg</s></strong> \u001a <strong>${aMin} mL</strong></div>`;
          detail += `<div><strong>TV max</strong> = <strong>${aMaxPerKg} mL/<s>kg</s></strong> \u00D7 <strong>${usedKg} <s>kg</s></strong> \u001a <strong>${aMax} mL</strong></div>`;
          detail += `<div class="mt-1"><em>Range</em> = <strong>${aMin}-${aMax} mL</strong></div>`;
        }
        if (detail) {
          mathHtml += (mathHtml.endsWith('<br/>') ? '' : '<br/>') + detail;
        }
      }
    } catch(e) { /* ignore */ } // eslint-disable-line no-empty
    // Normalize ranges to "6 mL/kg - 8 mL/kg" format before fraction styling
    try {
      mathHtml = mathHtml
        .replace(/T V range = [\s\S]*?\[([0-9]+)-([0-9]+) mL[\s\S]*?\] [\s\S]*?<strong>([0-9]+)-([0-9]+) mL<\/strong>/g, 'TV range = [6–8 mL/<s>kg</s>] × <strong>${usedKg} <s>kg</s></strong> → <strong>$1–$2 mL</strong>')
        .replace(/No ARDS:[\s\S]*?<strong>([0-9]+)-([0-9]+) mL<\/strong>/g, 'No ARDS: [6–8 mL/<s>kg</s>] × <strong>${usedKg} <s>kg</s></strong> → <strong>$1–$2 mL</strong>')
        .replace(/ARDS:[\s\S]*?<strong>([0-9]+)-([0-9]+) mL<\/strong>/g, 'ARDS: [4–6 mL/<s>kg</s>] × <strong>${usedKg} <s>kg</s></strong> → <strong>$1–$2 mL</strong>');
    } catch(e) { /* ignore */ } // eslint-disable-line no-empty
    // Render any a/b segments as stacked fractions in the math details
    try {
      mathHtml = mathHtml.replace(/(\d+(?:-\d+)?\s*mL)\s*\/\s*(<s>kg<\/s>|kg)/g, (_, numer, denom) => frac(numer, denom));
      // Replace any legacy arrow markers with equals for final values
      mathHtml = mathHtml.replace(/\u001a/g, ' = ');
    } catch(e) { /* ignore */ } // eslint-disable-line no-empty
    // Reformat TV range explanation into formula + min/max with equals, and adjust the displayed answer block
    try {
      const single = mathHtml.match(/TV range = [\s\S]*?\[([0-9]+)-([0-9]+) mL[\s\S]*?\] [\s\S]*?<strong>([0-9]+)-([0-9]+) mL<\/strong>/);
      if (single && usedKg != null) {
        const rmin = single[1], rmax = single[2], vmin = single[3], vmax = single[4];
        const title = 'Formula: TV = [mL/<s>kg</s>] × kg';
        const body = `Min: [${rmin} mL/<s>kg</s>] × ${usedKg} <s>kg</s> = <strong>${vmin} mL</strong><br/>Max: [${rmax} mL/<s>kg</s>] × ${usedKg} <s>kg</s> = <strong>${vmax} mL</strong>`;
        mathHtml = mathHtml.replace(/TV range =[\s\S]*?<strong>[0-9]+-[0-9]+ mL<\/strong>/, `${title}<br/>${body}`);
        display = `<span class="qv-tv-ans-val">${vmin}-${vmax} mL</span>`;
      } else {
        const noMatch = mathHtml.match(/No ARDS:[\s\S]*?<strong>([0-9]+)-([0-9]+) mL<\/strong>/);
        const ardsMatch = mathHtml.match(/ARDS:[\s\S]*?<strong>([0-9]+)-([0-9]+) mL<\/strong>/);
        if (noMatch && ardsMatch && usedKg != null) {
          const nMinVal = Math.round(usedKg * 6), nMaxVal = Math.round(usedKg * 8), aMinVal = Math.round(usedKg * 4), aMaxVal = Math.round(usedKg * 6);
          const title = 'Formula: TV = [mL/<s>kg</s>] × kg';
          const body = `No ARDS Min: [6 mL/<s>kg</s>] × ${usedKg} s>kg</s> = <strong>${nMinVal} mL</strong><br/>No ARDS Max: [8 mL/<s>kg</s>] × ${usedKg} <s>kg</s> = <strong>${nMaxVal} mL</strong><br/>ARDS Min: [4 mL/<s>kg</s>] × ${usedKg} <s>kg</s> = <strong>${aMinVal} mL</strong><br/>ARDS Max: [6 mL/<s>kg</s>] × ${usedKg} <s>kg</s> = <strong>${aMaxVal} mL</strong>`;
          mathHtml += (mathHtml.endsWith('<br/>') ? '' : '<br/>') + `${title}<br/>${body}`;
          display = `<div class="qv-tv-ans-line"><span class="qv-tv-ans-val">${nMinVal}-${nMaxVal} mL</span><span class="qv-tv-ans-label"> (no ARDS)</span></div>`+
                    `<div class="qv-tv-ans-line"><span class="qv-tv-ans-val">${aMinVal}-${aMaxVal} mL</span><span class="qv-tv-ans-label"> (ARDS)</span></div>`;
        }
      }
      if (!isUnsure && display) tvEl.innerHTML = display;
    } catch(e) { /* ignore */ } // eslint-disable-line no-empty
    tvEl.dataset.math = mathHtml;
    // hover tooltip
    tvEl.onmouseenter = (e)=>{
      if (!tvEl.textContent) return;
      const tip = document.createElement('div'); tip.className='qv-tooltip'; tip.id='qv-tip';
      tip.innerHTML = tvEl.dataset.math || '';
      document.body.appendChild(tip);
      const r = tvEl.getBoundingClientRect(); tip.style.left = (r.left+window.scrollX)+'px'; tip.style.top=(r.bottom+window.scrollY+6)+'px';
    };
    tvEl.onmouseleave = ()=>{ document.getElementById('qv-tip')?.remove(); };
    tvEl.onclick = ()=>{
      if (!tvEl.textContent) return;
      const modal = document.createElement('div'); modal.className='qv-modal'; modal.id='qv-modal';
      modal.innerHTML = `<div class="qv-modal-header"><span>Calculation Details</span><span id="qv-close" class="qv-close">✕</span></div><div class="p-3 text-sm">${tvEl.dataset.math||''}</div>`;
      document.body.appendChild(modal);
      const close = modal.querySelector('#qv-close'); close?.addEventListener('click', ()=> modal.remove());
      // basic drag
      const hdr = modal.querySelector('.qv-modal-header');
      let sx=0, sy=0, dragging=false, offX=0, offY=0;
      hdr?.addEventListener('mousedown', (ev)=>{ dragging=true; sx=ev.clientX; sy=ev.clientY; const rect=modal.getBoundingClientRect(); offX=ev.clientX-rect.left; offY=ev.clientY-rect.top; ev.preventDefault(); });
      window.addEventListener('mousemove', (ev)=>{ if(!dragging) return; modal.style.left=(ev.clientX-offX)+'px'; modal.style.top=(ev.clientY-offY)+'px'; modal.style.transform='none'; });
      window.addEventListener('mouseup', ()=> dragging=false);
    };
  }
  // Set initial input sizes
  [wtKgEl, wtLbEl, ftEl, inEl, totalEl].forEach(el => setInputSize(el));
  // Event wiring
  sexContainer.querySelectorAll('button').forEach(btn=> {
    btn.addEventListener('click', ()=>{ setSelected(sexContainer, btn.dataset.val); updateSidebarFromQV(); compute(); });
    btn.addEventListener('mouseenter', ()=>{
      const tip = document.createElement('div'); tip.className='qv-tooltip'; tip.id='qv-sex-tip'; tip.textContent = btn.dataset.val==='male'?'Male':'Female';
      document.body.appendChild(tip);
      const r = btn.getBoundingClientRect(); tip.style.left = (r.left+window.scrollX)+'px'; tip.style.top=(r.bottom+window.scrollY+6)+'px';
    });
    btn.addEventListener('mouseleave', ()=>{ document.getElementById('qv-sex-tip')?.remove(); });
  });
  wtKgEl.addEventListener('input', ()=>{
    wtKgEl.value = sanitizeWeight(wtKgEl.value, 'kg');
    setInputSize(wtKgEl);
    const kg = parseFloat(wtKgEl.value||'NaN');
    wtLbEl.value = !isNaN(kg) ? (kg*2.20462).toFixed(1) : '';
    setInputSize(wtLbEl);
    updateSidebarFromQV(); compute();
  });
  wtLbEl.addEventListener('input', ()=>{
    wtLbEl.value = sanitizeWeight(wtLbEl.value, 'lb');
    setInputSize(wtLbEl);
    const lb = parseFloat(wtLbEl.value||'NaN');
    wtKgEl.value = !isNaN(lb) ? (lb/2.20462).toFixed(1) : '';
    setInputSize(wtKgEl);
    updateSidebarFromQV(); compute();
  });
  wtClrEl?.addEventListener('click', (e)=>{ e.preventDefault(); wtKgEl.value=''; wtLbEl.value=''; setInputSize(wtKgEl); setInputSize(wtLbEl); updateSidebarFromQV(); compute(); });
  ftEl.addEventListener('input', ()=>{ ftEl.value = sanitizeIntInRange(ftEl.value, 0, 9); setInputSize(ftEl); totalEl.value=''; updateSidebarFromQV(); compute(); });
  inEl.addEventListener('input', ()=>{ inEl.value = sanitizeIntInRange(inEl.value, 0, 11); setInputSize(inEl); totalEl.value=''; updateSidebarFromQV(); compute(); });
  totalEl.addEventListener('input', ()=>{ totalEl.value = sanitizeIntInRange(totalEl.value, 0, 99); setInputSize(totalEl); updateSidebarFromQV(); compute(); });
  ardsContainer.querySelectorAll('button').forEach(btn=> btn.addEventListener('click', ()=>{ setSelected(ardsContainer, btn.dataset.val); compute(); }));
  // Height syncing between total and ft/in inside Quick Vent
  totalEl.addEventListener('input', ()=>{
    const total = parseInt(totalEl.value||'NaN',10);
    if (!isNaN(total)) { ftEl.value = Math.floor(total/12); inEl.value = total%12; }
  });
  ftEl.addEventListener('input', ()=>{
    const ft = parseInt(ftEl.value||'0',10); const inc = parseInt(inEl.value||'0',10);
    totalEl.value = (ft*12 + inc) || '';
  });
  inEl.addEventListener('input', ()=>{
    const ft = parseInt(ftEl.value||'0',10); const inc = parseInt(inEl.value||'0',10);
    totalEl.value = (ft*12 + inc) || '';
  });
  compute();
}

function renderQuickVentCalculator(contentArea){
  const wrap = document.createElement('div');
  wrap.className = 'mb-4';
  wrap.innerHTML = `<div class="text-center mb-3"><span class="font-semibold underline">Tidal Volume Calculator</span></div>`;
  contentArea.appendChild(wrap);
  // reuse setup UI minimal
  const fake = { quickVent: 'setup' };
  renderQuickVentSetup(contentArea);
}

export { renderQuickVentSetup, renderQuickVentCalculator };
