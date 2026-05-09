// ============================================================
// components.js — 102e FOS De Albatros
// Injects shared topbar, nav, footer & login modal
// Usage: <script src="js/components.js"></script>  in <head>
//        Set window.ACTIVE_PAGE before including, e.g.:
//        <script>window.ACTIVE_PAGE='takken'; window.ACTIVE_TOPBAR='kalender';</script>
// ============================================================

(function () {
  // ── Topbar ───────────────────────────────────────────────
  function buildTopbar(activePage) {
    const links = [
      { id: 'index',   href: 'index.html',    icon: 'ti-home',     label: 'Home' },
      { id: 'info',    href: 'info.html',      icon: 'ti-info-circle', label: 'Info' },
      { id: 'kalender',href: 'kalender.html',  icon: 'ti-calendar', label: 'Kalender' },
      { id: 'fotos',   href: 'fotos.html',     icon: 'ti-photo',    label: "Foto's" },
      { id: 'contact', href: 'contact.html',   icon: 'ti-mail',     label: 'Contact' },
    ];
    const linksHTML = links.map(l =>
      `<a href="${l.href}" class="topbar-link${activePage === l.id ? ' active' : ''}">
        <i class="ti ${l.icon}"></i>${l.label}</a>`
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
      { id: 'index',        href: 'index.html',         label: 'Home' },
      { id: 'takken',       href: 'takken.html',        label: 'Takken' },
      { id: 'fotos',        href: 'fotos.html',         label: "Foto's" },
      { id: 'kalender',     href: 'kalender.html',      label: 'Kalender' },
      { id: 'albatrossertje', href: 'albatrossertje.html', label: "'t Albatrossertje" },
      { id: 'contact',      href: 'contact.html',       label: 'Contact' },
    ];
    const linksHTML = links.map(l =>
      `<a href="${l.href}" class="nav-link${activePage === l.id ? ' active' : ''}">${l.label}</a>`
    ).join('');

    return `
<nav>
  <a href="index.html" class="nav-logo">
    <img src="img/logo.png" onerror="this.style.display='none'" alt="Logo 102e FOS De Albatros">
    <div class="nav-logo-text">De Albatros<small>102e FOS · Knokke-Heist</small></div>
  </a>
  <div class="search-bar"><i class="ti ti-search"></i><input type="text" placeholder="Zoeken…" id="globalSearch"></div>
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
      <img src="img/logo.png" onerror="this.style.display='none'" alt="Logo" style="width:52px;height:52px;border-radius:50%;margin-bottom:.6rem;border:2px solid rgba(245,197,24,.4)">
      <div><strong style="color:var(--yellow)">102e FOS De Albatros</strong></div>
      <div style="margin-top:.2rem;opacity:.6">Knokke-Heist · <a href="http://www.fos.be" style="color:rgba(255,255,255,.4)" target="_blank">FOS Open Scouting</a></div>
      <div class="footer-social">
        <a href="http://www.facebook.com/FOSalbatros" target="_blank"><i class="ti ti-brand-facebook"></i> Facebook</a>
        <a href="https://www.instagram.com/de_albatros/" target="_blank"><i class="ti ti-brand-instagram"></i> Instagram</a>
      </div>
    </div>
    <div class="footer-col"><h4>Navigatie</h4>
      <div class="footer-links-col">
        <a href="index.html">Home</a>
        <a href="takken.html">Onze takken</a>
        <a href="fotos.html">Foto's</a>
        <a href="kalender.html">Kalender</a>
        <a href="albatrossertje.html">'t Albatrossertje</a>
        <a href="contact.html">Contact</a>
      </div>
    </div>
    <div class="footer-col"><h4>Takken</h4>
      <div class="footer-links-col">
        <a href="takken/bevers.html">Bevers</a>
        <a href="takken/welpen.html">Welpen</a>
        <a href="takken/jvg.html">JVG's</a>
        <a href="takken/vg.html">VG's</a>
        <a href="takken/seniors.html">Seniors</a>
        <a href="takken/stam.html">Stam</a>
      </div>
    </div>
    <div class="footer-col"><h4>Info</h4>
      <div class="footer-links-col">
        <a href="info.html">Algemene info</a>
        <a href="https://www.dealbatros.be/onze-leiding/" target="_blank">Onze leiding</a>
        <a href="https://www.dealbatros.be/kampen/" target="_blank">Kampen</a>
        <a href="https://www.dealbatros.be/de-winkel/" target="_blank">FOS-shop</a>
      </div>
    </div>
    <div class="footer-col"><h4>Contact</h4>
      <div class="footer-links-col">
        <a href="mailto:eenheidsleiding@dealbatros.be">eenheidsleiding@dealbatros.be</a>
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
      <img src="img/logo.png" onerror="this.style.background='var(--blue)'" alt="">
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
    const activePage = window.ACTIVE_PAGE || 'index';
    const activeTopbar = window.ACTIVE_TOPBAR || activePage;

    // Insert topbar + nav before first child of body
    const wrapper = document.createElement('div');
    wrapper.innerHTML = buildTopbar(activeTopbar) + buildNav(activePage) + buildLoginModal();
    const body = document.body;
    while (wrapper.firstChild) {
      body.insertBefore(wrapper.firstChild, body.firstChild);
    }

    // Append footer before end of body
    const footerDiv = document.createElement('div');
    footerDiv.innerHTML = buildFooter();
    body.appendChild(footerDiv.firstElementChild);

    // Load auth script
    const authScript = document.createElement('script');
    // Determine relative path to js/ folder
    const depth = (window.COMPONENTS_DEPTH || 0);
    const prefix = depth > 0 ? '../'.repeat(depth) : '';
    authScript.src = prefix + 'js/auth.js';
    document.head.appendChild(authScript);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
