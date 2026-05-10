// ============================================================
// components.js — 102e FOS De Albatros
// Injects shared topbar, nav, footer & login modal
//
// Gebruik in elke pagina:
//   <script>window.ACTIVE_PAGE='index';</script>
//   <script src="js/components.js"></script>
//
// Voor pagina's in een submap (bv. Takken/bevers.html):
//   <script>window.ACTIVE_PAGE='takken'; window.COMPONENTS_DEPTH=1;</script>
//   <script src="../js/components.js"></script>
// ============================================================

(function () {

  const depth  = window.COMPONENTS_DEPTH || 0;
  const prefix = depth > 0 ? '../'.repeat(depth) : '';

  // ── Topbar ───────────────────────────────────────────────
  function buildTopbar(activePage) {
    const links = [
      { id: 'index',    href: prefix + 'index.html',    icon: 'ti-home',        label: 'Home' },
      { id: 'info',     href: prefix + 'info.html',     icon: 'ti-info-circle', label: 'Info' },
      { id: 'kalender', href: prefix + 'kalender.html', icon: 'ti-calendar',    label: 'Kalender' },
      { id: 'fotos',    href: prefix + 'fotos.html',    icon: 'ti-photo',       label: "Foto's" },
      { id: 'contact',  href: prefix + 'contact.html',  icon: 'ti-mail',        label: 'Contact' },
    ];
    const linksHTML = links.map(l =>
      `<a href="${l.href}" class="topbar-link${activePage === l.id ? ' active' : ''}"><i class="ti ${l.icon}"></i>${l.label}</a>`
    ).join('');

    return `
<div class="topbar">
  <div class="topbar-left">${linksHTML}</div>
  <div class="topbar-right">
    <a href="http://www.facebook.com/FOSalbatros" class="social-btn" target="_blank"><i class="ti ti-brand-facebook"></i>Facebook</a>
    <a href="https://www.instagram.com/de_albatros/" class="social-btn" target="_blank"><i class="ti ti-brand-instagram"></i>Instagram</a>
    <button class="login-btn" id="loginBtn" onclick="openLogin()"><i class="ti ti-user"></i> Login</button>
    <div class="user-chip" id="userChip" style="display:none"></div>
  </div>
</div>`;
  }

  // ── Nav ──────────────────────────────────────────────────
  function buildNav(activePage) {
    const links = [
      { id: 'index',          href: prefix + 'index.html',          label: 'Home' },
      { id: 'takken',         href: prefix + 'takken.html',         label: 'Takken' },
      { id: 'fotos',          href: prefix + 'fotos.html',          label: "Foto's" },
      { id: 'kalender',       href: prefix + 'kalender.html',       label: 'Kalender' },
      { id: 'albatrossertje', href: prefix + 'albatrossertje.html', label: "'t Albatrossertje" },
      { id: 'contact',        href: prefix + 'contact.html',        label: 'Contact' },
    ];
    const linksHTML = links.map(l =>
      `<a href="${l.href}" class="nav-link${activePage === l.id ? ' active' : ''}">${l.label}</a>`
    ).join('');

    return `
<nav>
  <a href="${prefix}index.html" class="nav-logo">
    <img src="${prefix}img/logo.png" onerror="this.style.display='none'" alt="Logo 102e FOS De Albatros">
    <div class="nav-logo-text">De Albatros<small>102e FOS · Knokke-Heist</small></div>
  </a>
  <div class="search-bar"><i class="ti ti-search"></i><input type="text" placeholder="Zoeken…" id="globalSearch" onkeydown="if(event.key==='Enter')handleSearch(this.value)"></div>
  <div class="nav-links">
    ${linksHTML}
    <a href="http://www.keeo.fos.be" class="nav-link nav-cta" target="_blank">Lid worden</a>
  </div>
</nav>`;
  }

  // ── Footer ───────────────────────────────────────────────
  function buildFooter() {
    return `
<footer>
  <div class="footer-inner">
    <div>
      <img src="${prefix}img/logo.png" onerror="this.style.display='none'" alt="Logo" style="width:52px;height:52px;border-radius:50%;margin-bottom:.6rem;border:2px solid rgba(245,197,24,.4)">
      <div><strong style="color:var(--yellow)">102e FOS De Albatros</strong></div>
      <div style="margin-top:.2rem;opacity:.6">Knokke-Heist · <a href="http://www.fos.be" style="color:rgba(255,255,255,.4)" target="_blank">FOS Open Scouting</a></div>
      <div class="footer-social">
        <a href="http://www.facebook.com/FOSalbatros" target="_blank"><i class="ti ti-brand-facebook"></i> Facebook</a>
        <a href="https://www.instagram.com/de_albatros/" target="_blank"><i class="ti ti-brand-instagram"></i> Instagram</a>
      </div>
    </div>
    <div class="footer-col"><h4>Navigatie</h4>
      <div class="footer-links-col">
        <a href="${prefix}index.html">Home</a>
        <a href="${prefix}takken.html">Onze takken</a>
        <a href="${prefix}fotos.html">Foto's</a>
        <a href="${prefix}kalender.html">Kalender</a>
        <a href="${prefix}albatrossertje.html">'t Albatrossertje</a>
        <a href="${prefix}contact.html">Contact</a>
      </div>
    </div>
    <div class="footer-col"><h4>Takken</h4>
      <div class="footer-links-col">
        <a href="${prefix}Takken/bevers.html">Bevers</a>
        <a href="${prefix}Takken/welpen.html">Welpen</a>
        <a href="${prefix}Takken/jvg.html">JVG's</a>
        <a href="${prefix}Takken/vg.html">VG's</a>
        <a href="${prefix}Takken/seniors.html">Seniors</a>
        <a href="${prefix}Takken/stam.html">Stam</a>
      </div>
    </div>
    <div class="footer-col"><h4>Info</h4>
      <div class="footer-links-col">
        <a href="${prefix}info.html">Algemene info</a>
        <a href="${prefix}fosshop.html">FOS-shop</a>
        <a href="https://www.dealbatros.be/onze-leiding/" target="_blank">Onze leiding</a>
        <a href="https://www.dealbatros.be/kampen/" target="_blank">Kampen</a>
      </div>
    </div>
    <div class="footer-col"><h4>Contact</h4>
      <div class="footer-links-col">
        <a href="mailto:eenheidsleiding@dealbatros.be">eenheidsleiding@dealbatros.be</a>
        <a href="${prefix}contact.html">Contactpagina</a>
        <a href="http://www.keeo.fos.be" target="_blank">Keeo ouderportaal</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">© 2026 102e FOS De Albatros · Knokke-Heist</div>
</footer>`;
  }

  // ── Login Modal ──────────────────────────────────────────
  function buildLoginModal() {
    return `
<div id="loginModal" class="modal" onclick="if(event.target===this)closeLogin()">
  <div class="modal-content login-modal-box">
    <button class="close-btn" onclick="closeLogin()"><i class="ti ti-x"></i></button>
    <div class="login-logo">
      <img src="${prefix}img/logo.png" onerror="this.style.background='var(--blue-pale)'" alt="">
    </div>
    <h2>Inloggen</h2>
    <p class="login-sub">Leiding van 102e FOS De Albatros</p>
    <div class="login-field">
      <label>E-mailadres</label>
      <input type="email" id="loginEmail" placeholder="jouw@email.be" autocomplete="email">
    </div>
    <div class="login-field">
      <label>Wachtwoord</label>
      <input type="password" id="loginPassword" placeholder="••••••••" autocomplete="current-password">
    </div>
    <div id="loginError" class="login-error"></div>
    <button id="loginSubmitBtn" class="btn-login-submit" onclick="doLogin()">
      <i class="ti ti-login"></i> Inloggen
    </button>
    <p class="login-footer-note">Problemen met inloggen? Contacteer de eenheidsleiding.</p>
  </div>
</div>`;
  }

  // ── Inject everything ────────────────────────────────────
  function inject() {
    const activePage  = window.ACTIVE_PAGE  || 'index';
    const activeTopbar = window.ACTIVE_TOPBAR || activePage;

    const body = document.body;

    // Insert topbar + nav + modal BEFORE page content
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildTopbar(activeTopbar) + buildNav(activePage) + buildLoginModal();
    while (wrapper.firstChild) {
      body.insertBefore(wrapper.firstChild, body.firstChild);
    }

    // Append footer AFTER page content
    const footerDiv = document.createElement('div');
    footerDiv.innerHTML = buildFooter();
    body.appendChild(footerDiv.firstElementChild);

    // Load auth.js dynamically
    const authScript = document.createElement('script');
    authScript.src = prefix + 'js/auth.js';
    document.head.appendChild(authScript);
  }

  // Simple search handler — navigates to a search results page or filters
  window.handleSearch = function(query) {
    if (!query.trim()) return;
    // Placeholder: navigeer naar index met zoekterm
    window.location.href = prefix + 'index.html?q=' + encodeURIComponent(query.trim());
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

})();
