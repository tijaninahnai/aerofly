// ---- DATE PICKER ----
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const today=new Date();today.setHours(0,0,0,0);
let dpY=today.getFullYear(),dpM=today.getMonth(),dpStart=null,dpEnd=null,dpSel=0;
function toggleDatePopup(e){e.stopPropagation();const p=document.getElementById('date-popup'),g=document.getElementById('guests-popup');g.classList.remove('active');if(p.classList.contains('active')){p.classList.remove('active');return;}renderCal();p.classList.add('active')}
function dpNav(d){dpM+=d;if(dpM>11){dpM=0;dpY++;}if(dpM<0){dpM=11;dpY--;}renderCal()}
function renderCal(){
  document.getElementById('dp-month-lbl').textContent=MONTHS[dpM]+' '+dpY;
  const fd=new Date(dpY,dpM,1).getDay(),off=(fd===0?6:fd-1),dim=new Date(dpY,dpM+1,0).getDate();
  let h='';
  for(let i=0;i<off;i++) h+='<button class="dp-d empty" disabled></button>';
  for(let d=1;d<=dim;d++){
    const dt=new Date(dpY,dpM,d);let c='dp-d';
    if(dt<today)c+=' past';
    else if(dpStart&&dpEnd&&dt>dpStart&&dt<dpEnd)c+=' inrange';
    if(dpStart&&dt.getTime()===dpStart.getTime())c+=' rs';
    if(dpEnd&&dt.getTime()===dpEnd.getTime())c+=' re';
    if(dt.getTime()===today.getTime())c+=' today';
    h+=`<button class="${c}" onclick="dpPick(${dpY},${dpM},${d})">${d}</button>`;
  }
  document.getElementById('dp-grid').innerHTML=h;updDpFoot();
}
function dpPick(y,m,d){const dt=new Date(y,m,d);if(dt<today)return;if(dpSel===0||dpEnd){dpStart=dt;dpEnd=null;dpSel=1;}else{if(dt<dpStart){dpEnd=dpStart;dpStart=dt;}else dpEnd=dt;dpSel=0;}renderCal()}
function fmt(d){return d.getDate()+' '+MONTHS[d.getMonth()].slice(0,3)}
function updDpFoot(){const h=document.getElementById('dp-hint'),s=document.getElementById('dp-sel-txt');if(!dpStart){h.textContent='Select check-in date';s.textContent='No dates selected';}else if(!dpEnd){h.textContent='Now select check-out date';s.textContent=fmt(dpStart)+' → ?';}else{h.textContent='';s.textContent=fmt(dpStart)+' – '+fmt(dpEnd);}}
function confirmDates(){if(dpStart){const t=dpEnd?fmt(dpStart)+' – '+fmt(dpEnd):fmt(dpStart);document.getElementById('sb-dates-val').textContent=t;}document.getElementById('date-popup').classList.remove('active')}

// ---- GUESTS ----
let guests={adult:2,child:0,room:1};
function toggleGuestsPopup(e){e.stopPropagation();const p=document.getElementById('guests-popup'),d=document.getElementById('date-popup');d.classList.remove('active');p.classList.toggle('active');updGuestBtns()}
function adjG(t,d){guests[t]=Math.max(t==='adult'?1:0,guests[t]+d);if(t==='room')guests.room=Math.max(1,guests.room);document.getElementById(t[0]+'-val').textContent=guests[t];updGuestBtns()}
function updGuestBtns(){document.getElementById('a-minus').disabled=guests.adult<=1;document.getElementById('c-minus').disabled=guests.child<=0;document.getElementById('r-minus').disabled=guests.room<=1}
function setRT(el){document.querySelectorAll('.rt-pill').forEach(p=>p.classList.remove('active'));el.classList.add('active')}
function confirmGuests(){const p=[];if(guests.adult)p.push(guests.adult+' adult'+(guests.adult>1?'s':''));if(guests.child)p.push(guests.child+' child'+(guests.child>1?'ren':''));document.getElementById('sb-guests-val').textContent=p.join(', ')+' · '+guests.room+' room'+(guests.room>1?'s':'');document.getElementById('guests-popup').classList.remove('active')}
document.addEventListener('click',()=>{document.querySelectorAll('.sb-popup').forEach(p=>p.classList.remove('active'))});

// ---- HOTELS DATA ----
const hotels=[
  {id:'h1',name:'Marina Bay Sands',stars:5,loc:'Marina Bay · 0.8 km from centre',score:9.2,scoreLbl:'Superb',reviews:2847,price:320,tags:['Infinity Pool','Casino','5-Star','Spa'],featured:true,imgs:['https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=900&q=80','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80','https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80','https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80'],mapX:62,mapY:55,dotColor:'#3B6B9A'},
  {id:'h2',name:'Raffles Singapore',stars:5,loc:'City Hall · 1.2 km from centre',score:9.5,scoreLbl:'Exceptional',reviews:3410,price:480,tags:['Historic','Butler Service','Colonial','Garden'],featured:false,imgs:['https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80','https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80','https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80','https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80'],mapX:38,mapY:35,dotColor:'#C9A84C'},
  {id:'h3',name:'The Capitol Kempinski',stars:5,loc:'St Andrews Road · 0.5 km centre',score:8.8,scoreLbl:'Excellent',reviews:1204,price:215,tags:['Heritage','City Center','Modern','Rooftop'],featured:false,imgs:['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80','https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80','https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=900&q=80'],mapX:45,mapY:28,dotColor:'#22a05a'},
  {id:'h4',name:'Capella Singapore',stars:5,loc:'Sentosa Island · 4.1 km from centre',score:9.0,scoreLbl:'Wonderful',reviews:876,price:390,tags:['Beach','Resort','Adults+','Private'],featured:false,imgs:['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=900&q=80','https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=900&q=80','https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=900&q=80'],mapX:55,mapY:78,dotColor:'#3B6B9A'},
];

let maxPriceFilter=600,starFilter='all';

function renderHotels(){
  const filtered=hotels.filter(h=>h.price<=maxPriceFilter&&(starFilter==='all'||h.stars===parseInt(starFilter)));
  document.getElementById('res-count').textContent=filtered.length+' hotel'+(filtered.length!==1?'s':'');
  document.getElementById('hotels-list').innerHTML=filtered.map(h=>`
  <div class="hotel-card${h.featured?' featured-card':''}" onclick="openDetail('${h.id}')">
    <div class="hc-img">
      <img src="${h.imgs[0]}" alt="${h.name}" onerror="this.style.background='#E8E0D0'">
      ${h.featured?'<div class="hc-badge gold">✦ Featured</div>':'<div class="hc-badge">Singapore</div>'}
      <button class="hc-fav" onclick="event.stopPropagation();this.classList.toggle('saved');this.querySelector('i').className=this.classList.contains('saved')?'fa-solid fa-heart':'fa-regular fa-heart'"><i class="fa-regular fa-heart"></i></button>
    </div>
    <div class="hc-body">
      <div>
        <div class="hc-top">
          <div><div class="hc-name">${h.name}</div><div class="hc-loc"><i class="fa-solid fa-location-dot"></i> ${h.loc}</div></div>
          <div class="hc-score-wrap"><div class="hc-score${h.score>=9?' hi':''}">${h.score}</div><div class="hc-score-lbl">${h.scoreLbl}</div></div>
        </div>
        <div class="hc-tags">${h.tags.map(t=>`<span class="hc-tag">${t}</span>`).join('')}</div>
      </div>
      <div class="hc-bottom">
        <div class="hc-price-block">
          <div class="hc-price">$${h.price} <span class="hc-price-night">/ night</span></div>
          <div class="hc-price-total">$${(h.price*11).toLocaleString()} for 11 nights</div>
        </div>
        <div class="hc-btns">
          <button class="hc-save-btn" onclick="event.stopPropagation();this.innerHTML=this.innerHTML.includes('heart')?'<i class=\'fa-solid fa-heart\' style=\'color:var(--red)\'></i> Saved':'<i class=\'fa-regular fa-heart\'></i> Save'"><i class="fa-regular fa-heart"></i> Save</button>
          <button class="hc-book-btn" onclick="event.stopPropagation();openDetail('${h.id}')">View Deal</button>
        </div>
      </div>
    </div>
  </div>`).join('')||'<div style="text-align:center;padding:3rem;color:var(--mist);">No hotels match your filters.</div>';
}

function setSort(el,type){document.querySelectorAll('.sort-pill').forEach(p=>p.classList.remove('active'));el.classList.add('active');if(type==='price')hotels.sort((a,b)=>a.price-b.price);else if(type==='score')hotels.sort((a,b)=>b.score-a.score);else if(type==='distance')hotels.sort((a,b)=>parseFloat(a.loc)-parseFloat(b.loc));else hotels.sort((a,b)=>b.featured-a.featured);renderHotels()}
function setPriceFilter(v){maxPriceFilter=parseInt(v);document.getElementById('price-lbl').textContent='$'+v;renderHotels()}
function toggleStar(el,v){document.querySelectorAll('.star-pill').forEach(p=>p.classList.remove('active'));el.classList.add('active');starFilter=v;renderHotels()}
function resetFilters(){maxPriceFilter=600;starFilter='all';document.querySelector('input[type=range]').value=600;document.getElementById('price-lbl').textContent='$600';document.querySelectorAll('.star-pill').forEach((p,i)=>p.classList.toggle('active',i===0));renderHotels()}

// ---- DETAIL MODAL ----
let dmIdx=0,dmTotal=0,currentHotel=null;
function openDetail(hid){
  currentHotel=hotels.find(h=>h.id===hid);if(!currentHotel)return;
  document.getElementById('dm-name').textContent=currentHotel.name;
  document.getElementById('dm-score').textContent=currentHotel.score;
  document.getElementById('dm-score-lbl').textContent=currentHotel.scoreLbl;
  document.getElementById('dm-score-cnt').textContent=currentHotel.reviews.toLocaleString()+' reviews';
  document.getElementById('dm-rev-score').textContent=currentHotel.score;
  document.getElementById('dbs-amount').textContent='$'+currentHotel.price;
  dmIdx=0;dmTotal=currentHotel.imgs.length;
  document.getElementById('dm-track').innerHTML=currentHotel.imgs.map(s=>`<div class="dm-slide"><img src="${s}" alt="${currentHotel.name}" onerror="this.style.background='#1E1A14'"></div>`).join('');
  renderDmDots();updateDmGallery();
  // reset tabs
  document.querySelectorAll('.dm-tab').forEach((t,i)=>t.classList.toggle('active',i===0));
  document.querySelectorAll('.dm-tc').forEach((c,i)=>c.classList.toggle('active',i===0));
  document.getElementById('detail-overlay').classList.add('active');
}
function closeDetail(){document.getElementById('detail-overlay').classList.remove('active')}
function dmSlide(d){dmIdx=Math.max(0,Math.min(dmTotal-1,dmIdx+d));updateDmGallery();renderDmDots()}
function updateDmGallery(){document.getElementById('dm-track').style.transform=`translateX(${-dmIdx*100}%)`;document.getElementById('dm-count').textContent=(dmIdx+1)+' / '+dmTotal}
function renderDmDots(){document.getElementById('dm-dots').innerHTML=Array.from({length:dmTotal},(_,i)=>`<div class="dm-dot${i===dmIdx?' active':''}" onclick="dmIdx=${i};updateDmGallery();renderDmDots()"></div>`).join('')}
function switchTab(el,id){document.querySelectorAll('.dm-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');document.querySelectorAll('.dm-tc').forEach(c=>c.classList.remove('active'));document.getElementById('dtc-'+id).classList.add('active')}
function toggleDmFav(){const i=document.getElementById('dbs-fav-icon'),b=document.getElementById('dbs-fav');const saved=i.className.includes('regular');i.className=saved?'fa-solid fa-heart':'fa-regular fa-heart';i.style.color=saved?'var(--red)':'';b.innerHTML=(saved?'<i id="dbs-fav-icon" class="fa-solid fa-heart" style="color:var(--red)"></i> Saved':'<i id="dbs-fav-icon" class="fa-regular fa-heart"></i> Save')}
document.getElementById('detail-overlay').addEventListener('click',function(e){if(e.target===this)closeDetail()});

// ---- MAP ----
const mapDests=[
  {name:'Marina Bay Sands',price:'$320',x:62,y:55,color:'#3B6B9A',size:20},
  {name:'Raffles',price:'$480',x:38,y:35,color:'#C9A84C',size:18},
  {name:'The Capitol',price:'$215',x:45,y:28,color:'#22a05a',size:14},
  {name:'Capella',price:'$390',x:55,y:78,color:'#3B6B9A',size:16},
];
function initMap(){
  const area=document.getElementById('map-area');if(!area)return;
  const canvas=document.getElementById('map-canvas');
  canvas.width=area.offsetWidth;canvas.height=area.offsetHeight;
  const ctx=canvas.getContext('2d'),w=canvas.width,h=canvas.height;
  // bg
  ctx.fillStyle='#D6D0C4';ctx.fillRect(0,0,w,h);
  // water bodies
  ctx.fillStyle='#B8CDDC';
  ctx.beginPath();ctx.ellipse(w*.55,h*.6,w*.25,h*.2,0.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(w*.2,h*.7,w*.15,h*.15,-0.3,0,Math.PI*2);ctx.fill();
  // land patches
  ctx.fillStyle='#C8C0B0';
  [[w*.1,h*.2,w*.4,h*.35],[w*.5,h*.1,w*.35,h*.45],[w*.3,h*.6,w*.2,h*.2]].forEach(([x,y,bw,bh])=>{ctx.beginPath();ctx.ellipse(x,y,bw,bh,0,0,Math.PI*2);ctx.fill()});
  // grid
  ctx.strokeStyle='rgba(255,255,255,0.4)';ctx.lineWidth=1;
  for(let x=0;x<w;x+=w/8){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke()}
  for(let y=0;y<h;y+=h/6){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}
  // roads
  ctx.strokeStyle='rgba(255,255,255,0.25)';ctx.lineWidth=2;ctx.setLineDash([]);
  [[w*.1,h*.3,w*.9,h*.5],[w*.3,h*.1,w*.4,h*.9],[w*.5,h*.2,w*.6,h*.8]].forEach(([x1,y1,x2,y2])=>{ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke()});
  // add dots via HTML overlay
  mapDests.forEach(d=>{
    const dot=document.createElement('div');dot.className='map-dest-dot';
    dot.style.left=(d.x)+'%';dot.style.top=(d.y)+'%';
    dot.innerHTML=`<div class="dot-pulse" style="width:${d.size}px;height:${d.size}px;"></div><div class="dot-circle" style="width:${d.size}px;height:${d.size}px;background:${d.color};"></div><div class="dot-price">${d.price}</div>`;
    area.appendChild(dot);
  });
}

renderHotels();
window.addEventListener('load',()=>{initMap();});
setTimeout(initMap,100);
