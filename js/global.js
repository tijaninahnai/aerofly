/* ============================================================
   AEROFLY — GLOBAL.JS
   Shared behaviour, meant to be included on every page
   (after ../css/global.css, before the page's own <script>).

   What lives here:
   1. Hamburger section-switcher (flights / hotels / experiences)
      — used on sub-pages so people can't misclick out of their
      current flow. The homepage keeps the full .hdr-nav instead.
   2. A generic "close this popover when you click outside it"
      helper, so every page doesn't reinvent it.
   3. Cross-sell suggestion box renderer.
   ============================================================ */

const AeroUI = (() => {

  const SECTION_META = {
    flights:     { label: 'Flights',     icon: 'fa-plane',  accent: 'var(--flights)' },
    hotels:      { label: 'Hotels',      icon: 'fa-hotel',  accent: 'var(--hotels)' },
    experiences: { label: 'Experiences', icon: 'fa-ticket', accent: 'var(--experiences)' }
  };
  const SECTION_TINT = { flights:'fl', hotels:'ht', experiences:'xp' };

  // ---------- hamburger section menu ----------
  function toggleNavMenu(e){
    if(e) e.stopPropagation();
    const menu = document.getElementById('navMenuPopover');
    const btn  = document.getElementById('navHamburgerBtn');
    if(!menu) return;
    menu.classList.toggle('active');
    if(btn) btn.classList.toggle('active', menu.classList.contains('active'));
  }
  function closeNavMenu(){
    const menu = document.getElementById('navMenuPopover');
    const btn  = document.getElementById('navHamburgerBtn');
    if(menu) menu.classList.remove('active');
    if(btn) btn.classList.remove('active');
  }

  // ---------- section switch: icon-morph on the hamburger itself ----------
  // Old section's icon flies out right & fades, the new section's icon
  // flies in from the left & fades, the button tints to match — then,
  // once that's played out, the actual navigation happens.
  // Usage in markup: onclick="return switchSection(event,'hotels','hotels.html')"
  function switchSection(e, key, url){
    if(e) e.preventDefault();
    closeNavMenu();
    const btn = document.getElementById('navHamburgerBtn');
    const current = document.querySelector('.nav-hb-icon.active');
    const next = btn ? btn.querySelector(`.nav-hb-icon[data-section="${key}"]`) : null;

    if(!btn || !next || current === next){
      // already on this section, or the icon-morph markup isn't on this
      // page — just navigate straight there, no animation to play
      window.location.href = url;
      return false;
    }

    if(current){
      current.classList.remove('active');
      current.classList.add('exit-right');
    }
    next.classList.add('enter-left');
    void next.offsetWidth; // force reflow so the enter-left start position is committed
    next.classList.remove('enter-left');
    next.classList.add('active');

    btn.classList.remove('fl','ht','xp');
    btn.classList.add(SECTION_TINT[key] || 'fl');

    setTimeout(()=>{ window.location.href = url; }, 380);
    return false;
  }

  // ---------- generic "outside click closes it" registry ----------
  // Pages register their own popovers (search fields, filters, etc.)
  // so global.js can close everything on an outside click/Escape,
  // instead of every page wiring its own document click listener.
  const registeredPopovers = new Set(['navMenuPopover']);
  function registerPopover(id){ registeredPopovers.add(id); }

  function closeAllPopovers(exceptId){
    registeredPopovers.forEach(id => {
      if(id === exceptId) return;
      const el = document.getElementById(id);
      if(el) el.classList.remove('active');
    });
    if(exceptId !== 'navMenuPopover') closeNavMenu();
  }

  document.addEventListener('click', (e) => {
    // hamburger menu
    const menu = document.getElementById('navMenuPopover');
    const btn  = document.getElementById('navHamburgerBtn');
    if(menu && menu.classList.contains('active')){
      if(!menu.contains(e.target) && e.target !== btn && !(btn && btn.contains(e.target))){
        closeNavMenu();
      }
    }
    // any other registered popover not opened via stopPropagation stays untouched —
    // pages that manage their own popups (e.g. hotels.html search bar) keep doing so.
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closeNavMenu();
  });

  // ---------- cross-sell suggestion box ----------
  // Usage: AeroUI.renderCrossSell('crosssell', 'hotels', 'Singapore')
  // Renders pills linking to the OTHER two sections, pre-seeded with
  // the current destination, so it stays a light suggestion — never
  // an accidental exit from the page someone is already booking on.
  function renderCrossSell(containerId, currentSection, destination){
    const el = document.getElementById(containerId);
    if(!el) return;
    const others = Object.keys(SECTION_META).filter(k => k !== currentSection);
    const dest = destination || 'your destination';
    el.innerHTML = `
      <div class="crosssell-box">
        <div class="crosssell-title">Complete your trip to ${dest}</div>
        <div class="crosssell-row">
          ${others.map(k => {
            const m = SECTION_META[k];
            return `<a class="crosssell-pill" href="${k}.html" style="--pill-accent:${m.accent}">
                      <i class="fa-solid ${m.icon}"></i> Add ${m.label.toLowerCase()}
                    </a>`;
          }).join('')}
        </div>
      </div>`;
  }

  return { toggleNavMenu, closeNavMenu, switchSection, registerPopover, closeAllPopovers, renderCrossSell };
})();

// convenience wrappers so inline onclick="..." works directly
function toggleNavMenu(e){ AeroUI.toggleNavMenu(e); }
function switchSection(e, key, url){ return AeroUI.switchSection(e, key, url); }
