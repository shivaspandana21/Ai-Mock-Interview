/* ================================================
   js/dashboard.js — Dashboard Page Logic
   ================================================ */

function updateDashboard() {
  const interviews = DB.interviews();

  document.getElementById('stat-interviews').textContent = interviews.length;

  const allQ = interviews.reduce((s, i) => s + (i.answers?.length || 0), 0);
  document.getElementById('stat-questions').textContent = allQ;

  if (interviews.length > 0) {
    const scores = interviews.map(i => i.overallScore || 0);
    const avg  = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    const best = Math.max(...scores);
    document.getElementById('stat-avg-score').textContent = avg + '%';
    document.getElementById('stat-best').textContent      = best + '%';
  }

  buildRecentInterviews();
  drawPerformanceChart();
  populateMilestones();
}

function buildRecentInterviews() {
  const interviews = DB.interviews().slice(-5).reverse();
  const el = document.getElementById('recent-interviews');

  if (!interviews.length) {
    el.innerHTML = '<div class="empty-state">No interviews yet. Start your first mock interview!</div>';
    return;
  }

  el.innerHTML = interviews.map(i => `
    <div class="card2" style="margin-bottom:8px;display:flex;align-items:center;gap:16px;">
      <div style="font-size:24px;">${i.icon || '🎓'}</div>
      <div style="flex:1;">
        <div style="font-weight:600;font-size:14px;">${i.title}</div>
        <div style="font-size:12px;color:var(--text2);">${i.subtitle} · ${new Date(i.date).toLocaleDateString()}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:Syne,sans-serif;font-weight:800;font-size:18px;color:var(--accent);">${i.overallScore}%</div>
        <div style="font-size:11px;color:var(--text2);">${i.answers?.length || 0} questions</div>
      </div>
      <span class="badge ${i.overallScore >= 80 ? 'badge-green' : i.overallScore >= 60 ? 'badge-orange' : 'badge-red'}">
        ${i.overallScore >= 80 ? 'Excellent' : i.overallScore >= 60 ? 'Good' : 'Needs Work'}
      </span>
    </div>
  `).join('');
}

function drawPerformanceChart() {
  const interviews = DB.interviews().slice(-8);
  if (interviews.length < 2) return;

  const scores = interviews.map(i => i.overallScore || 0);
  const W = 400, H = 140, pad = 20;

  const pts = scores.map((s, i) => {
    const x = pad + (i / (scores.length - 1)) * (W - pad * 2);
    const y = H - pad - (s / 100) * (H - pad * 2);
    return { x, y, s };
  });

  const pathD  = 'M ' + pts.map(p => `${p.x},${p.y}`).join(' L ');
  const areaD  = pathD + ` L ${pts[pts.length-1].x},${H-pad} L ${pts[0].x},${H-pad} Z`;

  document.getElementById('perf-chart-area').innerHTML = `
    <svg width="100%" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs>
        <linearGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style="stop-color:#6c63ff"/>
          <stop offset="100%" style="stop-color:#4fd1c5"/>
        </linearGradient>
        <linearGradient id="aGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#6c63ff;stop-opacity:0.3"/>
          <stop offset="100%" style="stop-color:#6c63ff;stop-opacity:0"/>
        </linearGradient>
      </defs>
      <path d="${areaD}" fill="url(#aGrad)"/>
      <path d="${pathD}" stroke="url(#cGrad)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${pts.map(p => `
        <circle cx="${p.x}" cy="${p.y}" r="4" fill="#6c63ff"/>
        <text x="${p.x}" y="${p.y - 8}" text-anchor="middle" fill="#9da3c8" font-size="10">${p.s}%</text>
      `).join('')}
      <line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="#252840" stroke-width="1"/>
    </svg>`;
}

function populateMilestones() {
  const milestones = [
    { count: 1,  label: 'First Interview',  icon: '🎯' },
    { count: 5,  label: '5 Interviews Done', icon: '🌟' },
    { count: 10, label: 'Practice Pro',      icon: '🏅' },
    { count: 25, label: 'Interview Expert',  icon: '🏆' },
  ];
  const interviews = DB.interviews();
  const el = document.getElementById('milestones');
  if (!el) return;

  el.innerHTML = milestones.map(m => {
    const done = interviews.length >= m.count;
    return `
      <div style="display:flex;align-items:center;gap:12px;padding:10px;background:var(--bg2);border-radius:var(--r3);margin-bottom:8px;opacity:${done ? 1 : 0.45};">
        <span style="font-size:24px;">${m.icon}</span>
        <div>
          <div style="font-size:13px;font-weight:600;">${m.label}</div>
          <div style="font-size:11px;color:var(--text2);">${done ? '✅ Achieved!' : `${m.count - interviews.length} more to go`}</div>
        </div>
      </div>
    `;
  }).join('');
}
