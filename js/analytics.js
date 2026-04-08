/* ================================================
   js/analytics.js — Comparison, Predictor, Improvement, Weak Areas, Radar
   ================================================ */

/* ================================================
   COMPANY COMPARISON
   ================================================ */
function buildComparison() {
  const interviews = DB.interviews();

  /* Aggregate scores per company */
  const companyScores = {};
  interviews.forEach(i => {
    if (i.type === 'company') {
      if (!companyScores[i.typeId]) companyScores[i.typeId] = [];
      companyScores[i.typeId].push(i.overallScore);
    }
  });

  /* Table rows */
  const tbody = document.getElementById('compare-tbody');
  tbody.innerHTML = COMPANIES.map(c => {
    const scores  = companyScores[c.id] || [];
    const myScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : null;
    const gap    = myScore !== null ? myScore - c.required : null;
    const status = myScore === null
      ? 'Not Attempted'
      : myScore >= c.required ? 'Eligible' : 'Below Required';

    return `<tr>
      <td><div style="display:flex;align-items:center;gap:8px;">${c.icon} ${c.name}</div></td>
      <td><strong style="color:var(--accent);">${myScore !== null ? myScore + '%' : '—'}</strong></td>
      <td>${c.required}%</td>
      <td>${gap !== null
        ? `<span style="color:${gap >= 0 ? 'var(--accent5)' : 'var(--accent4)'};">${gap >= 0 ? '+' : ''}${gap}%</span>`
        : '—'}</td>
      <td><span class="badge ${status === 'Eligible' ? 'badge-green' : status === 'Below Required' ? 'badge-red' : 'badge-purple'}">${status}</span></td>
      <td><button class="btn btn-outline btn-sm" onclick="startCompanyInterview('${c.id}')">Practice</button></td>
    </tr>`;
  }).join('');

  /* Bar chart */
  const svgW = COMPANIES.length * 75 + 40;
  const svgH = 170;
  const barW = 28, gap2 = 18;

  const bars = COMPANIES.map((c, i) => {
    const scores  = companyScores[c.id] || [];
    const myScore = scores.length
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;
    const x       = 30 + i * (barW * 2 + gap2);
    const myH     = (myScore  / 100) * (svgH - 50);
    const reqH    = (c.required / 100) * (svgH - 50);
    return `
      <rect x="${x}" y="${svgH - 30 - myH}" width="${barW}" height="${myH}" fill="#6c63ff" rx="3" opacity="0.85"/>
      <rect x="${x + barW + 3}" y="${svgH - 30 - reqH}" width="${barW}" height="${reqH}" fill="#4fd1c5" rx="3" opacity="0.5"/>
      <text x="${x + barW}" y="${svgH - 12}" text-anchor="middle" fill="#5c6380" font-size="9">${c.name.slice(0, 7)}</text>
      ${myScore > 0 ? `<text x="${x + barW / 2}" y="${svgH - 33 - myH}" text-anchor="middle" fill="#9da3c8" font-size="9">${myScore}%</text>` : ''}
    `;
  }).join('');

  document.getElementById('comparison-chart').innerHTML = `
    <svg width="100%" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
      ${bars}
      <line x1="30" y1="${svgH - 30}" x2="${svgW - 10}" y2="${svgH - 30}" stroke="#252840" stroke-width="1"/>
      <!-- Legend -->
      <rect x="30" y="8" width="12" height="8" fill="#6c63ff" rx="2"/>
      <text x="46" y="16" fill="#9da3c8" font-size="9">Your Score</text>
      <rect x="120" y="8" width="12" height="8" fill="#4fd1c5" rx="2"/>
      <text x="136" y="16" fill="#9da3c8" font-size="9">Required</text>
    </svg>`;
}

/* ================================================
   SELECTION PREDICTOR
   ================================================ */
function predictSelection() {
  const companyId  = document.getElementById('pred-company').value;
  const exp        = parseFloat(document.getElementById('pred-exp').value)            || 0;
  const resumeScore= parseFloat(document.getElementById('pred-resume-score').value)   || 0;
  const intScore   = parseFloat(document.getElementById('pred-interview-score').value)|| 0;

  if (!companyId) { showToast('Please select a company first', 'error'); return; }

  const company   = COMPANIES.find(c => c.id === companyId);
  const expFactor = Math.min(exp / 5, 1) * 20;
  const raw       = resumeScore * 0.35 + intScore * 0.45 + expFactor * 0.2;
  const adjusted  = Math.max(5, Math.min(95, Math.round(raw * (raw / company.required))));

  const color = adjusted >= 70 ? '#68d391' : adjusted >= 50 ? '#f6ad55' : '#fc8181';
  const label = adjusted >= 70 ? 'High Chances! 🎉'
              : adjusted >= 50 ? 'Moderate Chances ⚡'
              : 'Low Chances — Practice More 📚';

  const tips = adjusted >= 70
    ? ['Strong resume score detected', 'Good mock interview performance', 'Relevant experience level']
    : adjusted >= 50
    ? ['Improve your technical scores by 10+ points', 'Take more company-specific mock interviews', 'Add relevant certifications to resume']
    : ['Significantly improve interview score to 75+', 'Boost resume score to 80+', 'Practice daily for at least 2 weeks'];

  const deg = (adjusted / 100) * 360;

  document.getElementById('prediction-result').innerHTML = `
    <div class="section-title">Prediction Result</div>
    <div style="text-align:center;padding:20px;">
      <!-- Donut ring -->
      <div style="
        width:140px;height:140px;border-radius:50%;
        background:conic-gradient(${color} ${deg}deg, #252840 ${deg}deg);
        margin:0 auto 16px;
        display:flex;align-items:center;justify-content:center;">
        <div style="
          width:105px;height:105px;border-radius:50%;
          background:var(--card);
          display:flex;flex-direction:column;
          align-items:center;justify-content:center;">
          <div style="font-family:Syne,sans-serif;font-size:32px;font-weight:800;color:${color};">${adjusted}%</div>
          <div style="font-size:10px;color:var(--text2);">Selection Chance</div>
        </div>
      </div>
      <div style="font-size:16px;font-weight:700;margin-bottom:20px;color:${color};">${label}</div>
      <div style="text-align:left;">
        ${tips.map(t => `
          <div style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--bg2);border-radius:6px;margin-bottom:6px;font-size:13px;">
            <span>${adjusted >= 70 ? '✅' : '📌'}</span> ${t}
          </div>`).join('')}
      </div>
      <div style="margin-top:16px;padding:12px;background:rgba(108,99,255,0.08);border-radius:var(--r3);font-size:12px;color:var(--text2);">
        Based on: Resume ${resumeScore}% · Interview ${intScore}% · ${exp}yr experience · ${company.name} requires ${company.required}%
      </div>
    </div>`;
}

/* ================================================
   IMPROVEMENT GRAPH
   ================================================ */
function buildImprovementGraph() {
  const interviews = DB.interviews();
  const svg        = document.getElementById('imp-svg');
  if (!svg) return;

  if (interviews.length < 2) {
    svg.innerHTML = `<text x="20" y="100" fill="#5c6380" font-size="13">Take at least 2 interviews to see your improvement graph.</text>`;
    buildSkillsProgress([]);
    populateMilestones();
    return;
  }

  const scores = interviews.map(i => i.overallScore || 0);
  const W = 680, H = 190, pad = 35;

  const pts = scores.map((s, i) => ({
    x: pad + (i / (scores.length - 1)) * (W - pad * 2),
    y: H - pad - (s / 100) * (H - pad * 2),
    s,
  }));

  const pathD = 'M ' + pts.map(p => `${p.x},${p.y}`).join(' L ');
  const areaD = pathD + ` L ${pts[pts.length-1].x},${H-pad} L ${pts[0].x},${H-pad} Z`;

  const gridLines = [0, 25, 50, 75, 100].map(v => {
    const y = H - pad - (v / 100) * (H - pad * 2);
    return `
      <line x1="${pad}" y1="${y}" x2="${W-pad}" y2="${y}" stroke="#1c2035" stroke-width="0.8"/>
      <text x="${pad - 5}" y="${y + 4}" text-anchor="end" fill="#5c6380" font-size="9">${v}%</text>`;
  }).join('');

  svg.innerHTML = `
    <defs>
      <linearGradient id="impLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   style="stop-color:#6c63ff"/>
        <stop offset="100%" style="stop-color:#4fd1c5"/>
      </linearGradient>
      <linearGradient id="impAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%"   style="stop-color:#6c63ff;stop-opacity:0.3"/>
        <stop offset="100%" style="stop-color:#6c63ff;stop-opacity:0"/>
      </linearGradient>
    </defs>
    ${gridLines}
    <path d="${areaD}" fill="url(#impAreaGrad)"/>
    <path d="${pathD}" stroke="url(#impLineGrad)" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map((p, i) => `
      <circle cx="${p.x}" cy="${p.y}" r="5" fill="#6c63ff" stroke="var(--bg)" stroke-width="2"/>
      <text x="${p.x}" y="${p.y - 10}" text-anchor="middle" fill="#9da3c8" font-size="10">${p.s}%</text>
      <text x="${p.x}" y="${H - pad + 14}" text-anchor="middle" fill="#5c6380" font-size="9">#${i+1}</text>
    `).join('')}
    <line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="#252840" stroke-width="1"/>`;

  buildSkillsProgress(scores);
  populateMilestones();
}

function buildSkillsProgress(scores) {
  const el = document.getElementById('skills-progress');
  if (!el) return;

  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;

  const skills = [
    { label: 'Technical',       val: Math.min(100, Math.round(avg * 0.90)), color: 'var(--grad1)' },
    { label: 'Behavioral',      val: Math.min(100, Math.round(avg * 1.05)), color: 'var(--grad3)' },
    { label: 'Communication',   val: Math.min(100, Math.round(avg * 1.10)), color: 'var(--grad2)' },
    { label: 'Problem Solving', val: Math.min(100, Math.round(avg * 0.95)), color: 'linear-gradient(135deg,#b794f4,#6c63ff)' },
  ];

  el.innerHTML = skills.map(sk => `
    <div class="bar-row">
      <div class="bar-label">${sk.label}</div>
      <div class="bar-track">
        <div class="bar-fill" style="width:${sk.val}%;background:${sk.color};"></div>
      </div>
      <div class="bar-val">${sk.val > 0 ? sk.val + '%' : '--'}</div>
    </div>`
  ).join('');
}

/* ================================================
   WEAK AREAS
   ================================================ */
function buildWeakAreas() {
  const interviews = DB.interviews();
  const avgScore   = interviews.length
    ? Math.round(interviews.reduce((s, i) => s + i.overallScore, 0) / interviews.length)
    : 50;

  const weak = [
    { area: 'System Design',          score: Math.max(30, avgScore - 20), tip: 'Study distributed systems: CAP theorem, load balancing, caching strategies.' },
    { area: 'Dynamic Programming',    score: Math.max(25, avgScore - 28), tip: 'Practice LeetCode DP problems daily. Start with memoization patterns.' },
    { area: 'Database Optimization',  score: Math.max(35, avgScore - 15), tip: 'Learn query optimization, indexing, and execution plan analysis.' },
  ];

  const detailEl = document.getElementById('weak-areas-detail');
  if (detailEl) {
    detailEl.innerHTML = weak.map(w => `
      <div style="margin-bottom:14px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:14px;font-weight:600;">${w.area}</span>
          <span style="font-family:Syne,sans-serif;font-weight:700;color:var(--accent4);">${w.score}%</span>
        </div>
        <div class="progress-bar" style="margin-bottom:6px;">
          <div class="progress-fill" style="width:${w.score}%;background:var(--grad2);"></div>
        </div>
        <div style="font-size:12px;color:var(--text2);">${w.tip}</div>
      </div>`
    ).join('');
  }

  const recEl = document.getElementById('weak-recommended');
  if (recEl) {
    recEl.innerHTML = `<div class="grid-3">${weak.map(w => `
      <div class="card2">
        <div style="font-size:13px;font-weight:600;margin-bottom:8px;">📚 ${w.area}</div>
        <div style="font-size:12px;color:var(--text2);margin-bottom:10px;">${w.tip}</div>
        <button class="btn btn-accent btn-sm" onclick="navigate('questions')">Practice Now →</button>
      </div>`).join('')}
    </div>`;
  }
}

/* ================================================
   RADAR CHART
   ================================================ */
function buildRadar() {
  const svg = document.getElementById('radar-svg');
  if (!svg) return;

  const interviews = DB.interviews();
  const avg = interviews.length
    ? interviews.reduce((s, i) => s + i.overallScore, 0) / interviews.length / 100
    : 0.5;

  const skills = [
    { label: 'Technical',       val: Math.min(0.99, avg * 0.90) },
    { label: 'Behavioral',      val: Math.min(0.99, avg * 1.05) },
    { label: 'HR / Soft',       val: Math.min(0.99, avg * 1.10) },
    { label: 'Problem Solving', val: Math.min(0.99, avg * 0.95) },
    { label: 'Communication',   val: Math.min(0.99, avg * 1.08) },
    { label: 'Domain Know.',    val: Math.min(0.99, avg * 0.88) },
  ];

  const cx = 140, cy = 140, r = 100;
  const n  = skills.length;
  const angle = i => (Math.PI * 2 * i / n) - Math.PI / 2;
  const px    = (i, rr) => cx + Math.cos(angle(i)) * rr;
  const py    = (i, rr) => cy + Math.sin(angle(i)) * rr;

  let html = '';

  /* Grid rings */
  [0.25, 0.5, 0.75, 1.0].forEach(lv => {
    const pts = skills.map((_, i) => `${px(i, r*lv)},${py(i, r*lv)}`).join(' ');
    html += `<polygon points="${pts}" fill="none" stroke="#252840" stroke-width="1"/>`;
  });

  /* Axis lines */
  skills.forEach((_, i) => {
    html += `<line x1="${cx}" y1="${cy}" x2="${px(i,r)}" y2="${py(i,r)}" stroke="#1c2035" stroke-width="1"/>`;
  });

  /* Data polygon */
  const dataPts = skills.map((s, i) => `${px(i, r*s.val)},${py(i, r*s.val)}`).join(' ');
  html += `<polygon points="${dataPts}" fill="rgba(108,99,255,0.2)" stroke="#6c63ff" stroke-width="2"/>`;

  /* Data dots + labels */
  skills.forEach((s, i) => {
    html += `<circle cx="${px(i, r*s.val)}" cy="${py(i, r*s.val)}" r="4" fill="#6c63ff"/>`;
    const lx = px(i, r * 1.18);
    const ly = py(i, r * 1.18);
    html += `<text x="${lx}" y="${ly}" text-anchor="middle" fill="#9da3c8" font-size="10" dominant-baseline="middle">${s.label}</text>`;
    html += `<text x="${px(i, r*s.val)}" y="${py(i, r*s.val) - 8}" text-anchor="middle" fill="#6c63ff" font-size="9" font-weight="bold">${Math.round(s.val * 100)}%</text>`;
  });

  svg.innerHTML = html;
}
