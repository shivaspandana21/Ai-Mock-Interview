/* ================================================
   js/ui.js — UI Helpers: Toast, Modal, Navigation
   ================================================ */

/* ---- TOAST ---- */
function showToast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

/* ---- MODAL ---- */
function openModal(id) {
  document.getElementById(id)?.classList.add('open');
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('open');
}
function openAutoQnModal() { openModal('auto-qn-modal'); }

/* ---- NAVIGATION ---- */
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(n => {
    n.classList.toggle('active', n.getAttribute('onclick')?.includes(`'${page}'`));
  });

  // Page-specific init
  if (page === 'reports')    buildReport();
  if (page === 'improvement') buildImprovementGraph();
  if (page === 'recordings')  buildRecordings();
  if (page === 'weakareas')   { buildWeakAreas(); buildRadar(); }
  if (page === 'comparison')  buildComparison();
}

/* ---- BADGES ---- */
function diffBadge(diff) {
  const cls = diff === 'Easy' ? 'badge-green' : diff === 'Medium' ? 'badge-orange' : 'badge-red';
  return `<span class="badge ${cls}">${diff}</span>`;
}

/* ---- TYPING ANIMATION ---- */
function showTyping(container) {
  container.innerHTML = `<div class="ai-typing">
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
    <div class="typing-dot"></div>
  </div>`;
}
