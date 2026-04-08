/* ================================================
   js/app.js — App Entry Point & Initialization
   ================================================ */

/**
 * Called after successful login/signup.
 * Sets up the UI and loads all page data.
 */
function loadApp(user) {
  /* Hide auth, show app */
  document.getElementById('auth-screen').style.display = 'none';
  document.getElementById('app').style.display         = 'block';

  /* Populate user info */
  document.getElementById('user-name-display').textContent = user.name;
  document.getElementById('user-avatar').textContent        = user.name[0].toUpperCase();
  document.getElementById('dash-name').textContent          = user.name.split(' ')[0];

  /* Build static page content */
  buildStreamCards();
  buildCompanyCards();
  buildQBank();
  buildComparison();
  buildWeakAreas();
  buildRadar();
  buildImprovementGraph();
  updateDashboard();

  /* Navigate to dashboard */
  navigate('dashboard');
}

/* ================================================
   BOOT — runs on page load
   ================================================ */
window.addEventListener('load', () => {
  checkAutoLogin();
});
