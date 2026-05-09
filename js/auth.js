// ============================================================
// auth.js — 102e FOS De Albatros
// Supabase auth + role-based permissions
// ============================================================

const SUPABASE_URL = 'https://vycijnudgeqqgxpkxrih.supabase.co';
const SUPABASE_KEY = 'sb_publishable_J21o5TVTub4LzL_xj6iNEA_lDqWY6ed';

// Role definitions
// Roles zijn opgeslagen in user_metadata.role in Supabase
// Mogelijke waarden: 'eenheidsleiding', 'bevers_leiding', 'welpen_leiding',
//                   'jvg_leiding', 'vg_leiding', 'seniors_leiding', 'stam_leiding'

const ROLE_PERMISSIONS = {
  eenheidsleiding: {
    canEditAlbums: true,
    canManageEvents: true,
    canEditAllTakken: true,
    canEditTakken: ['bevers','welpen','jvg','vg','seniors','stam'],
    label: 'Eenheidsleiding'
  },
  bevers_leiding: {
    canEditAlbums: false,
    canManageEvents: false,
    canEditAllTakken: false,
    canEditTakken: ['bevers'],
    label: 'Beversleiding'
  },
  welpen_leiding: {
    canEditAlbums: false,
    canManageEvents: false,
    canEditAllTakken: false,
    canEditTakken: ['welpen'],
    label: 'Welpenleiding'
  },
  jvg_leiding: {
    canEditAlbums: false,
    canManageEvents: false,
    canEditAllTakken: false,
    canEditTakken: ['jvg'],
    label: 'JVG-leiding'
  },
  vg_leiding: {
    canEditAlbums: false,
    canManageEvents: false,
    canEditAllTakken: false,
    canEditTakken: ['vg'],
    label: 'VG-leiding'
  },
  seniors_leiding: {
    canEditAlbums: false,
    canManageEvents: false,
    canEditAllTakken: false,
    canEditTakken: ['seniors'],
    label: 'Seniorenleiding'
  },
  stam_leiding: {
    canEditAlbums: false,
    canManageEvents: false,
    canEditAllTakken: false,
    canEditTakken: ['stam'],
    label: 'Stamleiding'
  }
};

// Current user state
window.AlbatrosAuth = {
  user: null,
  role: null,
  permissions: null,
  supabase: null,

  async init() {
    // Load Supabase if not loaded
    if (!window.supabase) {
      await this._loadSupabase();
    }
    this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Check existing session
    const { data: { session } } = await this.supabase.auth.getSession();
    if (session?.user) {
      this._setUser(session.user);
    }

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        this._setUser(session.user);
      } else {
        this._clearUser();
      }
      this._updateUI();
    });

    this._updateUI();
  },

  _loadSupabase() {
    return new Promise((resolve) => {
      if (document.querySelector('script[src*="supabase"]')) { resolve(); return; }
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js';
      s.onload = resolve;
      document.head.appendChild(s);
    });
  },

  _setUser(user) {
    this.user = user;
    this.role = user.user_metadata?.role || 'eenheidsleiding'; // fallback for dev
    this.permissions = ROLE_PERMISSIONS[this.role] || ROLE_PERMISSIONS['eenheidsleiding'];
  },

  _clearUser() {
    this.user = null;
    this.role = null;
    this.permissions = null;
  },

  async login(email, password) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  async logout() {
    await this.supabase.auth.signOut();
    this._clearUser();
    this._updateUI();
  },

  isLoggedIn() {
    return !!this.user;
  },

  can(permission) {
    if (!this.permissions) return false;
    return !!this.permissions[permission];
  },

  canEditTak(tak) {
    if (!this.permissions) return false;
    return this.permissions.canEditTakken?.includes(tak) || false;
  },

  // Update all UI elements based on login state
  _updateUI() {
    const loggedIn = this.isLoggedIn();
    document.body.classList.toggle('logged-in', loggedIn);

    // Show/hide admin elements
    document.querySelectorAll('.admin-only').forEach(el => {
      el.style.display = loggedIn ? '' : 'none';
    });

    // Show/hide elements based on specific permissions
    document.querySelectorAll('[data-permission]').forEach(el => {
      const perm = el.dataset.permission;
      el.style.display = (loggedIn && this.can(perm)) ? '' : 'none';
    });

    // Show/hide tak-edit buttons
    document.querySelectorAll('[data-edit-tak]').forEach(el => {
      const tak = el.dataset.editTak;
      el.style.display = (loggedIn && this.canEditTak(tak)) ? '' : 'none';
    });

    // Update login button
    const loginBtn = document.getElementById('loginBtn');
    const userChip = document.getElementById('userChip');
    if (loginBtn && userChip) {
      if (loggedIn) {
        loginBtn.style.display = 'none';
        userChip.style.display = 'flex';
        const roleLabel = this.permissions?.label || 'Leiding';
        userChip.innerHTML = `<i class="ti ti-user-check"></i><span>${roleLabel}</span><button onclick="AlbatrosAuth.logout()" title="Uitloggen"><i class="ti ti-logout"></i></button>`;
      } else {
        loginBtn.style.display = '';
        userChip.style.display = 'none';
      }
    }
  }
};

// ── Login Modal helpers ──────────────────────────────────────
function openLogin() {
  document.getElementById('loginModal').style.display = 'flex';
  document.getElementById('loginEmail').focus();
}

function closeLogin() {
  document.getElementById('loginModal').style.display = 'none';
  document.getElementById('loginError').textContent = '';
}

async function doLogin() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const btn = document.getElementById('loginSubmitBtn');
  const err = document.getElementById('loginError');

  if (!email || !password) { err.textContent = 'Vul e-mail en wachtwoord in.'; return; }

  btn.disabled = true;
  btn.textContent = 'Bezig…';
  err.textContent = '';

  try {
    await AlbatrosAuth.login(email, password);
    closeLogin();
  } catch (e) {
    err.textContent = e.message || 'Inloggen mislukt. Probeer opnieuw.';
  } finally {
    btn.disabled = false;
    btn.textContent = 'Inloggen';
  }
}

// Allow Enter key in login form
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && document.getElementById('loginModal')?.style.display === 'flex') {
    doLogin();
  }
  if (e.key === 'Escape') closeLogin();
});

// Init on load
document.addEventListener('DOMContentLoaded', () => AlbatrosAuth.init());
