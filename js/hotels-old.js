// hotels.js — AeroFly hotels page (depends on global.js)

// ── DATA ──────────────────────────────────────────────────────────────────────
const hotels = [
  {id:'h1',name:'Marina Bay Sands',stars:5,loc:'Marina Bay · 0.8 km centre',score:9.2,scoreLbl:'Superb',reviews:2847,price:320,tags:['Infinity Pool','Casino','5-Star','Spa'],featured:true,
   imgs:['https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=900&q=80','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80','https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80','https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80'],
   mapX:62,mapY:55,dotColor:'#4285F4'},
  {id:'h2',name:'Raffles Singapore',stars:5,loc:'City Hall · 1.2 km centre',score:9.5,scoreLbl:'Exceptional',reviews:3410,price:480,tags:['Historic','Butler Service','Colonial','Garden'],featured:false,
   imgs:['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80','https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80'],
   mapX:38,mapY:32,dotColor:'#9B72CB'},
  {id:'h3',name:'The Capitol Kempinski',stars:5,loc:"St Andrews Rd · 0.5 km centre",score:8.8,scoreLbl:'Excellent',reviews:1204,price:215,tags:['Heritage','City Center','Modern','Rooftop'],featured:false,
   imgs:['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80','https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80'],
   mapX:44,mapY:28,dotColor:'#10B981'},
  {id:'h4',name:'Capella Singapore',stars:5,loc:'Sentosa Island · 4.1 km centre',score:9.0,scoreLbl:'Wonderful',reviews:876,price:390,tags:['Beach','Resort','Adults+','Private'],featured:false,
   imgs:['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80','https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80','https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=900&q=80'],
   mapX:55,mapY:75,dotColor:'#4285F4'},
];

// ── STATE ─────────────────────────────────────────────────────────────────────
let maxPriceFilter = 600, starFilter = 'all', activeHotel = null;
let dmIdx = 0, dmTotal = 0;
let bmStep = 1, paxCount = 1, insOn = true, activeBookBtn = null, activeRoomName = '', activeRoomPrice = 0;
let cineDestType = 'beach', cineFlipped = false, cineT1, cineT2, cineT3;

const BM_TITLES  = ['Guest Details','Special Requests','Protection','Review & Confirm'];
const BM_LABELS  = ['Guests','Requests','Protect','Review'];

// ── FILTER ────────────────────────────────────────────────────────────────────
let filterOpen = false;
function toggleFilter() {
  filterOpen = !filterOpen;
  document.getElementById('filter-panel').classList.toggle('open', filterOpen);
  document.getElementById('filter-toggle-btn').classList.toggle('active', filterOpen);
}
function setPriceFilter(v) {
  maxPriceFilter = parseInt(v);
  document.getElementById('price-lbl').textContent = '$' + v;
  renderHotels();
}
function toggleStar(el, v) {
  document.querySelectorAll('.star-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active'); starFilter = v; renderHotels();
}
function resetFilters() {
  maxPriceFilter = 600; starFilter = 'all';
  document.querySelector('input[type=range]').value = 600;
  document.getElementById('price-lbl').textContent = '$600';
  document.querySelectorAll('.star-pill').forEach((p,i) => p.classList.toggle('active', i===0));
  renderHotels();
}
function setSort(el, type) {
  document.querySelectorAll('.sort-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  if (type === 'price') hotels.sort((a,b) => a.price - b.price);
  else if (type === 'score') hotels.sort((a,b) => b.score - a.score);
  else hotels.sort((a,b) => b.featured - a.featured);
  renderHotels();
}

// ── RENDER CARDS ──────────────────────────────────────────────────────────────
function renderHotels() {
  const filtered = hotels.filter(h => h.price <= maxPriceFilter && (starFilter === 'all' || h.stars === parseInt(starFilter)));
  const el = document.getElementById('hotels-list');
  document.getElementById('res-count').textContent = filtered.length + ' hotel' + (filtered.length !== 1 ? 's' : '');
  if (!el) return;
  el.innerHTML = filtered.map(h => `
  <div class="hotel-card${h.featured?' featured':''}" onclick="openDetail('${h.id}')">
    <div class="hc-img">
      <img src="${h.imgs[0]}" alt="${h.name}" onerror="this.style.background='#E2E8F0'">
      ${h.featured ? '<div class="hc-badge featured-badge">✦ Featured</div>' : '<div class="hc-badge">Singapore</div>'}
      <button class="hc-fav" onclick="event.stopPropagation();toggleCardFav(this)"><i class="fa-regular fa-heart"></i></button>
    </div>
    <div class="hc-body">
      <div>
        <div class="hc-top">
          <div>
            <div class="hc-name">${h.name}</div>
            <div class="hc-loc"><i class="fa-solid fa-location-dot"></i> ${h.loc}</div>
          </div>
          <div class="hc-score-wrap">
            <div class="hc-score${h.score >= 9 ? ' hi' : ''}">${h.score}</div>
            <div class="hc-score-lbl">${h.scoreLbl}</div>
          </div>
        </div>
        <div class="hc-tags">${h.tags.map(t => `<span class="hc-tag">${t}</span>`).join('')}</div>
      </div>
      <div class="hc-bottom">
        <div>
          <div class="hc-price">$${h.price} <span class="hc-price-night">/ night</span></div>
          <div class="hc-price-total">$${(h.price*11).toLocaleString()} for 11 nights</div>
        </div>
        <div class="hc-btns">
          <button class="hc-save-btn" onclick="event.stopPropagation();toggleCardFav(this)"><i class="fa-regular fa-heart"></i> Save</button>
          <button class="hc-book-btn" onclick="event.stopPropagation();openDetail('${h.id}')">View Deal</button>
        </div>
      </div>
    </div>
  </div>`).join('') || '<div style="text-align:center;padding:3rem;color:var(--tg,#64748B)">No hotels match your filters.</div>';
}

function toggleCardFav(btn) {
  const saved = btn.innerHTML.includes('regular');
  btn.innerHTML = saved
    ? '<i class="fa-solid fa-heart" style="color:#D96570"></i> Saved'
    : '<i class="fa-regular fa-heart"></i> Save';
}

// ── DETAIL MODAL ──────────────────────────────────────────────────────────────
const TAB_CFG = [
  {id:'rooms',    icon:'fa-bed',           label:'Rooms',       floors:3, roof:'<svg viewBox="0 0 42 15"><rect x="13" y="0" width="16" height="15" fill="#1E293B"/><circle cx="21" cy="2.5" r="2.2" fill="#FCD34D" opacity="0.9"/></svg>'},
  {id:'facilities',icon:'fa-dumbbell',     label:'Facilities',  floors:4, roof:'<svg viewBox="0 0 42 15"><polygon points="21,0 4,15 38,15" fill="#1E293B"/></svg>'},
  {id:'rules',    icon:'fa-clipboard-list',label:'House Rules', floors:2, roof:'<svg viewBox="0 0 42 15"><rect x="7" y="3" width="28" height="12" fill="#1E293B" rx="1"/><rect x="9" y="0" width="24" height="7" fill="#334155" rx="1"/></svg>'},
  {id:'reviews',  icon:'fa-star',          label:'Reviews',     floors:5, roof:'<svg viewBox="0 0 42 15"><rect x="0" y="4" width="42" height="11" fill="#1E293B"/><rect x="7" y="0" width="28" height="9" fill="#334155"/></svg>'},
];
let activeTabIdx = 0;

function buildDmSkyTabs() {
  const wrap = document.getElementById('dm-sky-tabs');
  if (!wrap) return;
  wrap.innerHTML = '';
  TAB_CFG.forEach((tab, i) => {
    if (i > 0) { const c = document.createElement('div'); c.className = 'sky-tab-conn'; wrap.appendChild(c); }
    const bldg = document.createElement('div');
    bldg.className = 'sky-tab-bldg' + (i === activeTabIdx ? ' active-tab' : '');
    bldg.onclick = () => switchDmTab(i);
    const roof = document.createElement('div'); roof.className = 'sky-tab-roof'; roof.innerHTML = tab.roof;
    bldg.appendChild(roof);
    for (let f = tab.floors - 1; f >= 0; f--) {
      const fl = document.createElement('div');
      fl.className = 'sky-tab-floor' + (i < activeTabIdx ? ' lit' : i === activeTabIdx ? ' elev' : '');
      bldg.appendChild(fl);
    }
    const lbl = document.createElement('div'); lbl.className = 'sky-tab-lbl';
    lbl.innerHTML = `<i class="fa-solid ${tab.icon}"></i>${tab.label}`;
    bldg.appendChild(lbl);
    wrap.appendChild(bldg);
  });
}

function switchDmTab(idx) {
  activeTabIdx = idx;
  buildDmSkyTabs();
  document.querySelectorAll('.dm-tc').forEach((c,i) => c.classList.toggle('active', i === idx));
}

function openDetail(hid) {
  activeHotel = hotels.find(h => h.id === hid);
  if (!activeHotel) return;
  document.getElementById('dm-name').textContent    = activeHotel.name;
  document.getElementById('dm-score').textContent   = activeHotel.score;
  document.getElementById('dm-slbl').textContent    = activeHotel.scoreLbl;
  document.getElementById('dm-scnt').textContent    = activeHotel.reviews.toLocaleString() + ' reviews';
  document.getElementById('dm-rev-score').textContent = activeHotel.score;
  document.getElementById('dbs-amount').textContent = '$' + activeHotel.price;
  dmIdx = 0; dmTotal = activeHotel.imgs.length;
  document.getElementById('dm-track').innerHTML = activeHotel.imgs
    .map(s => `<div class="dm-slide"><img src="${s}" alt="${activeHotel.name}" onerror="this.style.background='#1E293B'"></div>`).join('');
  activeTabIdx = 0;
  buildDmSkyTabs();
  document.querySelectorAll('.dm-tc').forEach((c,i) => c.classList.toggle('active', i === 0));
  renderDmDots(); updateDmGal();
  document.getElementById('detail-overlay').classList.add('active');
}
function closeDetail() { document.getElementById('detail-overlay').classList.remove('active'); }
function dmSlide(d) { dmIdx = Math.max(0, Math.min(dmTotal - 1, dmIdx + d)); updateDmGal(); renderDmDots(); }
function updateDmGal() {
  document.getElementById('dm-track').style.transform = `translateX(${-dmIdx * 100}%)`;
  document.getElementById('dm-count').textContent = (dmIdx + 1) + ' / ' + dmTotal;
}
function renderDmDots() {
  document.getElementById('dm-dots').innerHTML = Array.from({length: dmTotal}, (_,i) =>
    `<div class="dm-dot${i === dmIdx ? ' active' : ''}" onclick="dmIdx=${i};updateDmGal();renderDmDots()"></div>`).join('');
}
function toggleDmFav() {
  const i = document.getElementById('dbs-fav-icon');
  const saved = i.className.includes('regular');
  i.className = saved ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  i.style.color = saved ? 'var(--gr,#D96570)' : '';
}
document.getElementById('detail-overlay').addEventListener('click', function(e) { if (e.target === this) closeDetail(); });

// ── BOOKING MODAL ─────────────────────────────────────────────────────────────
function openBookModal(btn, price, room) {
  activeBookBtn = btn; activeRoomPrice = price; activeRoomName = room || 'Deluxe Room';
  bmStep = 1; paxCount = 1; insOn = true;
  document.getElementById('pax-container').innerHTML = buildPaxBlock(1, true);
  buildSkyProgress('bm-sky', 4, bmStep, BM_LABELS);
  renderBmStep();
  document.getElementById('book-overlay').classList.add('active');
}
function closeBookModal() { document.getElementById('book-overlay').classList.remove('active'); }

function renderBmStep() {
  document.querySelectorAll('.bm-step').forEach((p,i) => p.classList.toggle('active', i + 1 === bmStep));
  document.getElementById('bm-step-title').textContent   = BM_TITLES[bmStep - 1];
  document.getElementById('bm-step-counter').textContent = 'Step ' + bmStep + ' of 4';
  document.getElementById('bm-back').style.display       = bmStep > 1 ? 'block' : 'none';
  document.getElementById('bm-next').textContent         = bmStep === 4 ? '✔ Confirm & Pay' : 'Continue →';
  if (bmStep === 4) updateReview();
}

function bmNext() {
  if (bmStep === 4) { closeBookModal(); triggerCinematic(); return; }
  animateElevator('bm-sky', bmStep - 1, () => { bmStep++; buildSkyProgress('bm-sky', 4, bmStep, BM_LABELS); renderBmStep(); });
}
function bmPrev() {
  if (bmStep > 1) { bmStep--; buildSkyProgress('bm-sky', 4, bmStep, BM_LABELS); renderBmStep(); }
}

function buildPaxBlock(n, primary) {
  return `<div class="pax-block" id="pb${n}">
    <div class="pax-header">
      <div class="pax-lbl"><i class="fa-solid fa-user"></i> Guest ${n}${primary ? ' <span class="tag">Primary</span>' : ''}</div>
      ${primary ? `<button class="autofill-btn" onclick="autofillBlock(${n}, () => bmNext())"><i class="fa-solid fa-bolt"></i> Autofill</button>` : ''}
    </div>
    <div class="form-row">
      <div class="form-group"><label>First Name</label><input type="text" id="p${n}-fn" placeholder="First name"></div>
      <div class="form-group"><label>Last Name</label><input type="text" id="p${n}-ln" placeholder="Last name"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Date of Birth</label><input type="text" id="p${n}-dob" placeholder="DD/MM/YYYY"></div>
      <div class="form-group"><label>Nationality</label><input type="text" id="p${n}-nat" placeholder="Nationality"></div>
    </div>
    <div class="form-row single">
      <div class="form-group"><label>Passport Number</label><input type="text" id="p${n}-pp" placeholder="Passport number"></div>
    </div>
  </div>`;
}

function addPax() {
  paxCount++;
  const c = document.getElementById('pax-container');
  const d = document.createElement('div'); d.innerHTML = buildPaxBlock(paxCount, false);
  c.appendChild(d.firstElementChild);
}
function toggleIns() { insOn = !insOn; document.getElementById('ins-card').classList.toggle('active', insOn); }
function selDel(el) { document.querySelectorAll('.del-opt').forEach(o => o.classList.remove('active')); el.classList.add('active'); }

function updateReview() {
  const fn = document.getElementById('p1-fn')?.value || '—';
  const ln = document.getElementById('p1-ln')?.value || '—';
  const insAdd = insOn ? 28 : 0;
  const total  = activeRoomPrice * 11 + insAdd;
  document.getElementById('sum-hotel').textContent  = activeHotel?.name || '—';
  document.getElementById('sum-room').textContent   = activeRoomName;
  document.getElementById('sum-guest').textContent  = (fn + ' ' + ln).trim() || '—';
  document.getElementById('sum-ins').textContent    = insOn ? 'Included (+$28)' : 'Not added';
  document.getElementById('sum-total').textContent  = '$' + total.toLocaleString();
}
document.getElementById('book-overlay').addEventListener('click', function(e) { if (e.target === this) closeBookModal(); });

// ── CINEMATIC (destination flip) ──────────────────────────────────────────────
function buildRain() {
  const layer = document.getElementById('rain-layer');
  if (!layer) return;
  layer.innerHTML = '';
  for (let i = 0; i < 40; i++) {
    const d = document.createElement('div'); d.className = 'rain-drop';
    const h = 10 + Math.random() * 20;
    d.style.cssText = `left:${Math.random()*100}%;height:${h}px;top:-20px;animation-duration:${0.4+Math.random()*0.6}s;animation-delay:${Math.random()*2}s`;
    layer.appendChild(d);
  }
}
function buildCity() {
  const c = document.getElementById('city-home-bldgs');
  if (!c) return;
  c.innerHTML = '';
  [{w:18,h:45},{w:25,h:62},{w:20,h:38},{w:30,h:70},{w:22,h:50},{w:16,h:35},{w:28,h:58}].forEach(b => {
    const el = document.createElement('div'); el.className = 'city-bldg-h';
    el.style.cssText = `width:${b.w}px;height:${b.h}px`; c.appendChild(el);
  });
}

const DEST_SCENES = {
  beach: `<div class="scene-beach">
    <div class="beach-sun"></div>
    <div class="beach-wave"></div>
    <div class="beach-wave" style="bottom:30%;opacity:.55;animation-delay:.5s"></div>
    <div class="palm" style="left:10%;font-size:2.6rem">🌴</div>
    <div class="palm" style="right:12%;font-size:2rem;animation-delay:1s">🌴</div>
    <div style="position:absolute;bottom:0;width:100%;height:32%;background:linear-gradient(180deg,#F4D03F,#E8B89A,#D4A574)"></div>
    <div style="position:absolute;bottom:10px;left:0;right:0;text-align:center;font-family:'Outfit',sans-serif;font-size:.95rem;font-weight:700;color:rgba(15,23,42,.72)">Singapore<span style="display:block;font-size:.6rem;font-weight:400;margin-top:2px">Sunny · 31°C</span></div>
  </div>`,
  snow: `<div class="scene-snow">
    <div class="aurora"></div>
    <div id="snow-flakes-inner"></div>
    <div class="mtn" style="left:-10px;width:0;height:0;border-left:80px solid transparent;border-right:80px solid transparent;border-bottom:100px solid #C8DCE8"></div>
    <div class="mtn" style="left:120px;width:0;height:0;border-left:70px solid transparent;border-right:70px solid transparent;border-bottom:85px solid #B8D0DC"></div>
    <div class="mtn" style="right:-10px;width:0;height:0;border-left:90px solid transparent;border-right:90px solid transparent;border-bottom:110px solid #D4E8F0"></div>
    <div style="position:absolute;bottom:10px;left:0;right:0;text-align:center;font-family:'Outfit',sans-serif;font-size:.95rem;font-weight:700;color:#0F172A">Swiss Alps<span style="display:block;font-size:.6rem;font-weight:400;margin-top:2px">Snowy · -4°C</span></div>
  </div>`,
  neon: `<div class="scene-neon">
    <div id="neon-stars-inner"></div>
    <div id="neon-bldgs-inner"></div>
    <div class="neon-city-label" style="color:#FF6EC7">Tokyo<span style="display:block;font-size:.6rem;font-weight:400;margin-top:2px;color:rgba(255,110,199,.7)">Neon Night · 22°C</span></div>
  </div>`
};

function buildSnowflakes(parentId) {
  const c = document.getElementById(parentId); if (!c) return;
  for (let i = 0; i < 20; i++) {
    const s = document.createElement('div'); s.className = 'snow-flake';
    s.style.cssText = `left:${Math.random()*100}%;font-size:${8+Math.random()*10}px;animation-duration:${2+Math.random()*4}s;animation-delay:${Math.random()*3}s`;
    s.textContent = '❄'; c.appendChild(s);
  }
}
function buildNeon(bParent, sParent) {
  const bs = document.getElementById(bParent), ss = document.getElementById(sParent);
  const colors = ['#FF6EC7','#00FFFF','#ADFF2F','#FF4500','#7B68EE'];
  const bdata  = [{x:10,w:35,h:110},{x:55,w:25,h:85},{x:90,w:40,h:130},{x:145,w:28,h:95},{x:185,w:45,h:115},{x:245,w:30,h:100}];
  if (bs) bs.innerHTML = bdata.map((b,i) => {
    const c = colors[i % colors.length];
    const rgb = parseInt(c.slice(1,3),16)+','+parseInt(c.slice(3,5),16)+','+parseInt(c.slice(5,7),16);
    return `<div class="neon-bldg" style="left:${b.x}px;width:${b.w}px;height:${b.h}px;background:rgba(${rgb},.06)"><div class="neon-outline" style="border:1.5px solid ${c};box-shadow:0 0 6px ${c},inset 0 0 6px rgba(${rgb},.15);animation-delay:${i*.3}s"></div></div>`;
  }).join('');
  if (ss) for (let i = 0; i < 30; i++) {
    const s = document.createElement('div'); s.className = 'neon-star';
    const sz = 1 + Math.random() * 2;
    s.style.cssText = `width:${sz}px;height:${sz}px;background:white;top:${Math.random()*50}%;left:${Math.random()*100}%;animation-delay:${Math.random()*2}s;animation-duration:${1+Math.random()*2}s`;
    ss.appendChild(s);
  }
}

function setDestScene(el, type) {
  document.querySelectorAll('.dest-pick-btn').forEach(b => b.classList.remove('active'));
  el.classList.add('active'); cineDestType = type;
  if (cineFlipped) renderDestScene(type);
}

function renderDestScene(type) {
  const back = document.getElementById('flip-back-scene');
  if (!back) return;
  back.innerHTML = DEST_SCENES[type];
  if (type === 'snow') setTimeout(() => buildSnowflakes('snow-flakes-inner'), 50);
  if (type === 'neon') setTimeout(() => buildNeon('neon-bldgs-inner','neon-stars-inner'), 50);
}

function triggerCinematic() {
  buildRain(); buildCity();
  const fi = document.getElementById('flip-inner');
  if (fi) fi.classList.remove('flipped');
  cineFlipped = false;
  renderDestScene(cineDestType);
  document.getElementById('cine-title').textContent    = 'Processing your booking...';
  document.getElementById('cine-sub').textContent      = 'Your destination awaits';
  document.getElementById('cine-success').classList.remove('show');
  document.getElementById('page-dimmer').classList.add('active');
  document.getElementById('cine-wrap').classList.add('active');

  cineT1 = setTimeout(() => {
    document.getElementById('cine-title').textContent = 'Payment confirmed ✓';
    document.getElementById('cine-sub').textContent   = 'Flipping to your destination...';
    cineT2 = setTimeout(() => {
      if (cineDestType === 'snow') buildSnowflakes('snow-flakes-inner');
      if (cineDestType === 'neon') buildNeon('neon-bldgs-inner','neon-stars-inner');
      if (fi) { fi.classList.add('flipped'); cineFlipped = true; }
      document.getElementById('cine-title').textContent = 'See you there!';
      document.getElementById('cine-sub').textContent   = cineDestType === 'beach' ? 'Sunny days ahead 🌊' : cineDestType === 'snow' ? 'Snow paradise awaits ❄' : 'The city never sleeps 🌃';
      cineT3 = setTimeout(() => {
        document.getElementById('cine-success').classList.add('show');
        setTimeout(resolveCine, 2200);
      }, 800);
    }, 1800);
  }, 1200);
  document.getElementById('cine-skip').onclick = resolveCine;
}

function resolveCine() {
  clearTimeout(cineT1); clearTimeout(cineT2); clearTimeout(cineT3);
  document.getElementById('page-dimmer').classList.remove('active');
  document.getElementById('cine-wrap').classList.remove('active');
  if (activeBookBtn) {
    activeBookBtn.textContent = '✓ Booked';
    activeBookBtn.style.cssText = 'background:linear-gradient(135deg,#10B981,#059669);color:#fff;border:none';
    activeBookBtn.disabled = true;
  }
}

// ── MAP ───────────────────────────────────────────────────────────────────────
function initMap() {
  const area = document.getElementById('map-area'); if (!area) return;
  const canvas = document.getElementById('map-canvas');
  canvas.width = area.offsetWidth || 305; canvas.height = area.offsetHeight || 215;
  const ctx = canvas.getContext('2d'), w = canvas.width, h = canvas.height;
  ctx.fillStyle = '#DBEAFE'; ctx.fillRect(0,0,w,h);
  ctx.fillStyle = '#C8E6C9';
  [[w*.1,h*.2,w*.4,h*.35],[w*.5,h*.1,w*.35,h*.45],[w*.3,h*.55,w*.2,h*.2]].forEach(([x,y,bw,bh]) => {
    ctx.beginPath(); ctx.ellipse(x,y,bw,bh,0,0,Math.PI*2); ctx.fill();
  });
  ctx.fillStyle = '#B3D4E8';
  ctx.beginPath(); ctx.ellipse(w*.58,h*.62,w*.22,h*.18,.2,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1;
  for (let x=0;x<w;x+=w/8) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke(); }
  for (let y=0;y<h;y+=h/6) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke(); }
  hotels.forEach(hotel => {
    const dx = w * hotel.mapX / 100, dy = h * hotel.mapY / 100;
    ctx.beginPath(); ctx.setLineDash([3,5]);
    ctx.moveTo(w*.5, h*.5); ctx.lineTo(dx, dy);
    ctx.strokeStyle = 'rgba(66,133,244,.2)'; ctx.lineWidth = 1.2; ctx.stroke(); ctx.setLineDash([]);
    const dot = document.createElement('div'); dot.className = 'dest-dot';
    dot.style.left = hotel.mapX + '%'; dot.style.top = hotel.mapY + '%';
    const size = hotel.score >= 9.2 ? 20 : hotel.score >= 8.8 ? 16 : 14;
    dot.innerHTML = `<div class="dd-pulse" style="width:${size}px;height:${size}px"></div><div class="dd-circle" style="width:${size}px;height:${size}px;background:${hotel.dotColor}"></div><div class="dd-price">$${hotel.price}</div>`;
    dot.onclick = () => openDetail(hotel.id);
    area.appendChild(dot);
  });
}

// ── INIT ──────────────────────────────────────────────────────────────────────
renderHotels();
window.addEventListener('load', () => setTimeout(initMap, 80));
