// global.js — AeroFly shared logic (nav, date picker, travelers, skyscraper)

// NAV
const menuToggle=document.getElementById('menuToggle'),navDropdown=document.getElementById('navDropdown');
menuToggle.addEventListener('click',e=>{e.stopPropagation();navDropdown.classList.toggle('active')});
document.addEventListener('click',()=>{navDropdown.classList.remove('active');closeDatePicker();closeTravelersPicker()});

// DATE PICKER
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const today=new Date();today.setHours(0,0,0,0);
let dpYear=today.getFullYear(),dpMonth=today.getMonth();
let dpStart=null,dpEnd=null,dpSelecting=0; // 0=start, 1=end

function toggleDatePicker(e){
  e.stopPropagation();
  const p=document.getElementById('date-popup');
  const tp=document.getElementById('travelers-popup');
  tp.classList.remove('active');
  if(p.classList.contains('active')){p.classList.remove('active');return;}
  renderCalendar();
  p.classList.add('active');
}
function closeDatePicker(){document.getElementById('date-popup').classList.remove('active')}

function dpNav(dir){dpMonth+=dir;if(dpMonth>11){dpMonth=0;dpYear++;}if(dpMonth<0){dpMonth=11;dpYear--;}renderCalendar()}

function renderCalendar(){
  document.getElementById('dp-month-label').textContent=MONTHS[dpMonth]+' '+dpYear;
  const firstDay=new Date(dpYear,dpMonth,1).getDay();
  const offset=(firstDay===0?6:firstDay-1); // Mon=0
  const daysInMonth=new Date(dpYear,dpMonth+1,0).getDate();
  let html='';
  for(let i=0;i<offset;i++) html+=`<button class="dp-day empty" disabled></button>`;
  for(let d=1;d<=daysInMonth;d++){
    const date=new Date(dpYear,dpMonth,d);
    let cls='dp-day';
    if(date<today) cls+=' past';
    else if(dpStart&&dpEnd&&date>dpStart&&date<dpEnd) cls+=' in-range';
    if(dpStart&&date.getTime()===dpStart.getTime()) cls+=' range-start';
    if(dpEnd&&date.getTime()===dpEnd.getTime()) cls+=' range-end';
    if(date.getTime()===today.getTime()) cls+=' today';
    html+=`<button class="${cls}" onclick="dpPickDay(${dpYear},${dpMonth},${d})">${d}</button>`;
  }
  document.getElementById('dp-grid').innerHTML=html;
  updateDpFooter();
}

function dpPickDay(y,m,d){
  const date=new Date(y,m,d);
  if(date<today) return;
  if(dpSelecting===0||dpEnd){
    dpStart=date;dpEnd=null;dpSelecting=1;
  } else {
    if(date<dpStart){dpEnd=dpStart;dpStart=date;}
    else dpEnd=date;
    dpSelecting=0;
  }
  renderCalendar();
}

function updateDpFooter(){
  const hint=document.getElementById('dp-hint');
  const sel=document.getElementById('dp-selection-text');
  if(!dpStart){hint.textContent='Select departure date';sel.textContent='No dates selected';}
  else if(!dpEnd){hint.textContent='Now select return date';sel.textContent=fmtDate(dpStart)+' → ?';}
  else{hint.textContent='';sel.textContent=fmtDate(dpStart)+' – '+fmtDate(dpEnd);}
}
function fmtDate(d){return d.getDate()+' '+MONTHS[d.getMonth()].slice(0,3);}

function confirmDates(){
  if(dpStart){
    const txt=dpEnd?fmtDate(dpStart)+' – '+fmtDate(dpEnd):fmtDate(dpStart);
    document.getElementById('dates-display').textContent=txt;
  }
  closeDatePicker();
}

// TRAVELERS PICKER
let travelers={adult:1,kid:0,baby:0};
let tClass='Economy';

function toggleTravelersPicker(e){
  e.stopPropagation();
  const p=document.getElementById('travelers-popup');
  closeDatePicker();
  if(p.classList.contains('active')){p.classList.remove('active');return;}
  p.classList.add('active');
  updateCounterBtns();
}
function closeTravelersPicker(){document.getElementById('travelers-popup').classList.remove('active')}

function adjustTraveler(type,delta){
  travelers[type]=Math.max(0,travelers[type]+delta);
  if(type==='adult') travelers.adult=Math.max(1,travelers.adult);
  document.getElementById(type+'-count').textContent=travelers[type];
  updateCounterBtns();
}

function updateCounterBtns(){
  document.getElementById('adult-minus').disabled=travelers.adult<=1;
  document.getElementById('kid-minus').disabled=travelers.kid<=0;
  document.getElementById('baby-minus').disabled=travelers.baby<=0;
}

function setTClass(el,cls){
  document.querySelectorAll('.tclass-pill').forEach(p=>p.classList.remove('active'));
  el.classList.add('active');tClass=cls;
}

function confirmTravelers(){
  const parts=[];
  if(travelers.adult) parts.push(travelers.adult+' Adult'+(travelers.adult>1?'s':''));
  if(travelers.kid) parts.push(travelers.kid+' Child'+(travelers.kid>1?'ren':''));
  if(travelers.baby) parts.push(travelers.baby+' Infant'+(travelers.baby>1?'s':''));
  document.getElementById('travelers-display').textContent=parts.join(', ')+' · '+tClass;
  const total=travelers.adult+(travelers.kid||0)+(travelers.baby||0);
  document.getElementById('results-traveler-summary').textContent=parts.join(', ');
  closeTravelersPicker();
}

// SKYSCRAPER BUILDER (shared)
const ROOF_SVGS=[
  '<svg viewBox="0 0 34 13"><rect x="10" y="0" width="14" height="13" fill="#1C2240"/><circle cx="17" cy="2" r="2" fill="#FCD34D"/></svg>',
  '<svg viewBox="0 0 34 13"><polygon points="17,0 3,13 31,13" fill="#1C2240"/></svg>',
  '<svg viewBox="0 0 34 13"><rect x="0" y="4" width="34" height="9" fill="#1C2240"/><rect x="5" y="0" width="24" height="7" fill="#263450" rx="1"/></svg>',
  '<svg viewBox="0 0 34 13"><rect x="6" y="0" width="22" height="13" fill="#1C2240" rx="2"/><rect x="10" y="0" width="14" height="6" fill="#5B6AF0" rx="1" opacity="0.8"/></svg>',
  '<svg viewBox="0 0 34 13"><rect x="2" y="2" width="30" height="11" fill="#1C2240" rx="1"/><rect x="5" y="0" width="9" height="6" fill="#263450"/><rect x="20" y="0" width="9" height="6" fill="#263450"/></svg>'
];
const FLOOR_COUNTS=[3,2,3,4,3];

function buildSkyProgress(containerId,totalSteps,currentStep,labels){
  const wrap=document.getElementById(containerId);
  if(!wrap)return;
  wrap.innerHTML='';
  for(let s=0;s<totalSteps;s++){
    if(s>0){const c=document.createElement('div');c.className='sky-conn';wrap.appendChild(c)}
    const bldg=document.createElement('div');
    bldg.className='sky-bldg'+(s+1===currentStep?' active-step':'');
    bldg.id=containerId+'-b'+s;
    const roof=document.createElement('div');roof.className='sky-roof';
    roof.innerHTML=ROOF_SVGS[s%ROOF_SVGS.length];bldg.appendChild(roof);
    const floors=FLOOR_COUNTS[s%FLOOR_COUNTS.length];
    for(let f=floors-1;f>=0;f--){
      const fl=document.createElement('div');
      fl.className='sky-floor'+(s+1<currentStep?' lit':s+1===currentStep?' elev':'');
      bldg.appendChild(fl);
    }
    const lbl=document.createElement('div');lbl.className='sky-label';
    lbl.textContent=(labels&&labels[s])||'';bldg.appendChild(lbl);
    wrap.appendChild(bldg);
  }
}

function animateElevator(containerId,stepIdx,cb){
  const bldg=document.getElementById(containerId+'-b'+stepIdx);
  if(!bldg){cb&&cb();return;}
  const floors=[...bldg.querySelectorAll('.sky-floor')].reverse();
  let i=0;
  const iv=setInterval(()=>{
    if(i>0)floors[i-1].classList.remove('elev');
    if(i<floors.length){floors[i].classList.add('elev','lit');i++;}
    else{clearInterval(iv);setTimeout(()=>cb&&cb(),120);}
  },190);
}

// AUTOFILL
const PROFILE_DATA={fname:'Sarah',lname:'Mitchell',dob:'12 / 04 / 1989',nationality:'Belgian',passport:'BE••••••482'};

function buildPassengerBlock(num,primary){
  const tag=primary?'<span class="tag">Primary</span>':'';
  const afBtn=primary?`<button class="autofill-btn" onclick="autofill(${num})"><i class="fa-solid fa-bolt"></i> Autofill</button>`:'';
  return `<div class="passenger-block" id="p${num}-block">
    <div class="passenger-header">
      <div class="passenger-label"><i class="fa-solid fa-user"></i> Passenger ${num} ${tag}</div>
      ${afBtn}
    </div>
    <div class="form-row">
      <div class="form-group"><label>First Name</label><input type="text" id="p${num}-fname" placeholder="First name"></div>
      <div class="form-group"><label>Last Name</label><input type="text" id="p${num}-lname" placeholder="Last name"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label>Date of Birth</label><input type="text" id="p${num}-dob" placeholder="DD / MM / YYYY"></div>
      <div class="form-group"><label>Nationality</label><input type="text" id="p${num}-nationality" placeholder="Nationality"></div>
    </div>
    <div class="form-row single">
      <div class="form-group"><label>Passport Number</label><input type="text" id="p${num}-passport" placeholder="Passport number"></div>
    </div>
  </div>`;
}

function autofill(num){
  const block=document.getElementById(`p${num}-block`);
  block.classList.remove('filling');void block.offsetWidth;block.classList.add('filling');
  const set=(id,val)=>{const el=document.getElementById(id);if(el){el.value=val;el.classList.add('filled');}};
  // type out effect
  const fields=[
    [`p${num}-fname`,PROFILE_DATA.fname],
    [`p${num}-lname`,PROFILE_DATA.lname],
    [`p${num}-dob`,PROFILE_DATA.dob],
    [`p${num}-nationality`,PROFILE_DATA.nationality],
    [`p${num}-passport`,PROFILE_DATA.passport]
  ];
  fields.forEach(([id,val],i)=>setTimeout(()=>set(id,val),i*80));
  // After fill, auto-advance
  setTimeout(()=>{
    currentStep++;renderStep();
  },fields.length*80+400);
}

function addPassenger(){
  passengerCount++;
  const container=document.getElementById('passengers-container');
  const div=document.createElement('div');
  div.innerHTML=buildPassengerBlock(passengerCount,false);
  container.appendChild(div.firstElementChild);
}