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

  return { toggleNavMenu, closeNavMenu, registerPopover, closeAllPopovers, renderCrossSell };
})();

// convenience wrapper so inline onclick="toggleNavMenu(event)" works directly
function toggleNavMenu(e){ AeroUI.toggleNavMenu(e); }
