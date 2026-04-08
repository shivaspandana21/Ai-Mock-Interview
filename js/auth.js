/* ================================================
   js/auth.js — JWT Auth System (Client-side simulation)
   ================================================ */

/* --- JWT Helpers --- */
function btoa64(str) {
  return btoa(unescape(encodeURIComponent(str)));
}
function atob64(str) {
  try { return decodeURIComponent(escape(atob(str))); }
  catch { return ''; }
}

function createJWT(payload) {
  const header = btoa64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body   = btoa64(JSON.stringify({ ...payload, iat: Date.now() }));
  const sig    = btoa64('interviewiq_secret_' + body.slice(-8));
  return `${header}.${body}.${sig}`;
}

function parseJWT(token) {
  try {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    return JSON.parse(atob64(parts[1]));
  } catch { return null; }
}

/* --- UI Helpers --- */
function switchAuthTab(tab) {
  document.querySelectorAll('.auth-tab').forEach((t, i) => {
    t.classList.toggle('active', (i === 0 && tab === 'login') || (i === 1 && tab === 'signup'));
  });
  document.getElementById('login-form').style.display  = tab === 'login'  ? 'block' : 'none';
  document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
  document.getElementById('auth-error').style.display  = 'none';
}

function showAuthError(msg) {
  const el = document.getElementById('auth-error');
  el.textContent = msg;
  el.style.display = msg ? 'block' : 'none';
}

/* --- Actions --- */
function doSignup() {
  const name  = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pwd   = document.getElementById('reg-pwd').value;

  if (!name || !email || !pwd) return showAuthError('Please fill all fields.');
  if (pwd.length < 8) return showAuthError('Password must be at least 8 characters.');

  const users = DB.users();
  if (users.find(u => u.email === email)) return showAuthError('Email already registered.');

  const user = {
    id: Date.now().toString(),
    name, email,
    pwd: btoa(pwd),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  DB.set('users', users);

  const token = createJWT({ uid: user.id, email: user.email, name: user.name });
  DB.setToken(token);
  DB.setCurrentUser(user);
  loadApp(user);
}

function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pwd   = document.getElementById('login-pwd').value;

  if (!email || !pwd) return showAuthError('Please fill all fields.');

  // Demo account auto-create
  if (email === 'demo@interviewiq.ai' && pwd === 'demo1234') {
    const users = DB.users();
    let demoUser = users.find(u => u.email === email);
    if (!demoUser) {
      demoUser = { id: 'demo', name: 'Demo User', email, pwd: btoa(pwd), createdAt: new Date().toISOString() };
      users.push(demoUser);
      DB.set('users', users);
    }
    const token = createJWT({ uid: demoUser.id, email: demoUser.email, name: demoUser.name });
    DB.setToken(token);
    DB.setCurrentUser(demoUser);
    loadApp(demoUser);
    return;
  }

  const users = DB.users();
  const user = users.find(u => u.email === email);
  if (!user || atob(user.pwd) !== pwd) return showAuthError('Invalid email or password.');

  const token = createJWT({ uid: user.id, email: user.email, name: user.name });
  DB.setToken(token);
  DB.setCurrentUser(user);
  loadApp(user);
}

function doLogout() {
  DB.clearToken();
  DB.clearCurrentUser();
  document.getElementById('app').style.display = 'none';
  document.getElementById('auth-screen').style.display = 'flex';
}

/* --- Auto Login Check (runs on page load) --- */
function checkAutoLogin() {
  const token = DB.getToken();
  const user  = DB.getCurrentUser();
  if (token && user) {
    const payload = parseJWT(token);
    if (payload && payload.uid) {
      loadApp(user);
      return;
    }
  }
  // Pre-fill demo credentials
  document.getElementById('login-email').value = 'demo@interviewiq.ai';
  document.getElementById('login-pwd').value   = 'demo1234';
}
