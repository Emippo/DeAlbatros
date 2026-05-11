// ============================================================
// auth.js — 102e FOS De Albatros
// Supabase auth + role-based permissions
// ============================================================

const SUPABASE_URL = 'https://vycijnudgeqqgxpkxrih.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5Y2lqbnVkZ2VxcWd4cGt4cmloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyMzczNjYsImV4cCI6MjA5MzgxMzM2Nn0.d4TQEKisc20O-LgSpxz_7QZGZREhZe0fxlVmEKVum34';

// Role definitions
// Rollen zijn opgeslagen in user_metadata.role in Supabase
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
    try {
      await this._loadSupabase();
    } catch (e) {
      console.error('Auth init mislukt:', e);
      return;
    }

    this.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // Check existing session
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      if (session?.user) {
        this._setUser(session.user);
      }
    } catch (e) {
      console.error('Sessie ophalen mislukt:', e);
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
    return new Promise((resolve, reject) => {
      if (window.supabase?.createClient) { resolve(); return; }
      document.querySelectorAll('script[data-supabase]').forEach(s => s.remove());
      const s = document.createElement('script');
      s.setAttribute('data-supabase', '1');
      s.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';
      s.onload = () => {
        if (window.supabase?.createClient) {
          resolve();
        } else {
          reject(new Error('Supabase createClient niet gevonden na laden.'));
        }
      };
      s.onerror = () => reject(new Error('Supabase script kon niet geladen worden.'));
      document.head.appendChild(s);
    });
  },

  _setUser(user) {
    this.user = user;
    // GEEN fallback naar eenheidsleiding — als de rol ontbreekt, geen rechten
    const role = user.user_metadata?.role;
    if (!role || !ROLE_PERMISSIONS[role]) {
      console.warn(`Onbekende of ontbrekende rol: "${role}". Geen rechten toegekend.`);
      this.role = null;
      this.permissions = null;
    } else {
      this.role = role;
      this.permissions = ROLE_PERMISSIONS[role];
    }
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
// Veilige wrappers die wachten tot de DOM klaar is

function openLogin() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.style.display = 'flex';
  // Kleine vertraging zodat de browser de display-wijziging verwerkt voor de focus
  setTimeout(() => document.getElementById('loginEmail')?.focus(), 50);
}

function closeLogin() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;
  modal.style.display = 'none';
  const err = document.getElementById('loginError');
  if (err) err.textContent = '';
  const pw = document.getElementById('loginPassword');
  if (pw) pw.value = '';
}

async function doLogin() {
  const emailEl = document.getElementById('loginEmail');
  const passwordEl = document.getElementById('loginPassword');
  const btn = document.getElementById('loginSubmitBtn');
  const err = document.getElementById('loginError');

  if (!emailEl || !passwordEl || !btn || !err) return;

  const email = emailEl.value.trim();
  const password = passwordEl.value;

  if (!email || !password) {
    err.textContent = 'Vul e-mail en wachtwoord in.';
    return;
  }

  // Valideer e-mailformaat
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    err.textContent = 'Vul een geldig e-mailadres in.';
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Bezig…';
  err.textContent = '';

  try {
    await AlbatrosAuth.login(email, password);
    closeLogin();
  } catch (e) {
    // Vertaal veelvoorkomende Supabase-foutmeldingen naar Nederlands
    const msg = e.message || '';
    if (msg.includes('Invalid login credentials')) {
      err.textContent = 'Ongeldig e-mailadres of wachtwoord.';
    } else if (msg.includes('Email not confirmed')) {
      err.textContent = 'Je e-mailadres is nog niet bevestigd. Controleer je inbox.';
    } else if (msg.includes('Too many requests')) {
      err.textContent = 'Te veel pogingen. Wacht even en probeer opnieuw.';
    } else {
      err.textContent = msg || 'Inloggen mislukt. Probeer opnieuw.';
    }
  } finally {
    btn.disabled = false;
    btn.textContent = 'Inloggen';
  }
}

// Toetsenbord: Enter om in te loggen, Escape om te sluiten
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('loginModal');
  if (!modal || modal.style.display !== 'flex') return;
  if (e.key === 'Enter') doLogin();
  if (e.key === 'Escape') closeLogin();
});

// Init zodra de DOM klaar is
// components.js laadt auth.js dynamisch, dus DOMContentLoaded is al voorbij.
// We controleren de readyState en initialiseren meteen of wachten.
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AlbatrosAuth.init());
} else {
  AlbatrosAuth.init();
}
