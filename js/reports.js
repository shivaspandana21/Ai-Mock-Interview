/* ================================================
   js/reports.js — Smart Feedback Report + Recordings
   ================================================ */

function buildReport() {
  const interviews = DB.interviews();
  if (!interviews.length) return;

  const scores = interviews.map(i => i.overallScore);
  const avg    = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const best   = Math.max(...scores);
  const types  = [...new Set(interviews.map(i => i.type))].join(', ');

  /* Summary */
  document.getElementById('report-summary').innerHTML = `
    <div class="grid-3" style="margin-bottom:20px;">
      <div class="card2" style="text-align:center;">
        <div style="font-family:Syne,sans-serif;font-size:32px;font-weight:800;color:var(--accent);">${avg}%</div>
        <div style="font-size:13px;color:var(--text2);">Average Score</div>
      </div>
      <div class="card2" style="text-align:center;">
        <div style="font-family:Syne,sans-serif;font-size:32px;font-weight:800;color:var(--accent2);">${interviews.length}</div>
        <div style="font-size:13px;color:var(--text2);">Total Interviews</div>
      </div>
      <div class="card2" style="text-align:center;">
        <div style="font-family:Syne,sans-serif;font-size:32px;font-weight:800;color:var(--accent3);">${best}%</div>
        <div style="font-size:13px;color:var(--text2);">Best Score</div>
      </div>
    </div>
    <div style="font-size:14px;line-height:1.8;color:var(--text2);background:var(--bg2);padding:16px;border-radius:var(--r3);">
      Based on your <strong style="color:var(--text);">${interviews.length}</strong> interview(s), your overall performance is
      <strong style="color:var(--text);">${avg >= 80 ? 'Excellent' : avg >= 65 ? 'Good' : 'Needs Improvement'}</strong>.
      Your strongest area appears to be <strong style="color:var(--accent2);">Communication</strong>.
      Focus on improving <strong style="color:var(--accent3);">Technical Depth</strong> and <strong style="color:var(--accent3);">System Design</strong>.
      Categories completed: ${types}.
    </div>`;

  /* Suggestions */
  const suggestions = [
    { icon:'📚', text:'Practice system design questions daily for at least 30 minutes.', color:'rgba(108,99,255,0.15)' },
    { icon:'🎙️', text:'Record yourself answering behavioral questions to improve vocal clarity.', color:'rgba(79,209,197,0.15)' },
    { icon:'⏱️', text:'Time your answers — aim for 2–3 minutes per response in a real interview.', color:'rgba(246,173,85,0.15)' },
    { icon:'📖', text:'Master the STAR method for all behavioral and situational questions.', color:'rgba(104,211,145,0.15)' },
    { icon:'🤝', text:'Do peer mock interviews weekly to build real-world confidence.', color:'rgba(252,129,129,0.15)' },
  ];
  document.getElementById('report-suggestions').innerHTML = suggestions.map(s => `
    <div class="suggestion-item">
      <div class="suggestion-icon" style="background:${s.color};">${s.icon}</div>
      <div style="font-size:13px;line-height:1.5;">${s.text}</div>
    </div>`
  ).join('');

  /* Weak areas */
  const weak = ['System Design', 'Time Complexity Analysis', 'Database Optimization'];
  document.getElementById('report-weakareas').innerHTML = weak.map(w => `
    <div style="display:flex;align-items:center;gap:8px;padding:8px;background:rgba(252,129,129,0.08);border-radius:6px;margin-bottom:6px;">
      <span>⚠️</span>
      <span style="font-size:13px;flex:1;">${w}</span>
      <span class="badge badge-red">Weak</span>
    </div>`
  ).join('');

  /* Strengths */
  const strong = ['Communication Skills', 'Behavioral Answers', 'Problem Solving Approach'];
  document.getElementById('report-strengths').innerHTML = strong.map(s => `
    <div style="display:flex;align-items:center;gap:8px;padding:8px;background:rgba(104,211,145,0.08);border-radius:6px;margin-bottom:6px;">
      <span>✅</span>
      <span style="font-size:13px;flex:1;">${s}</span>
      <span class="badge badge-green">Strong</span>
    </div>`
  ).join('');
}

/* ---- RECORDINGS PAGE ---- */
function buildRecordings() {
  const recordings = DB.recordings();
  const el = document.getElementById('recordings-list');

  if (!recordings.length) {
    el.innerHTML = `
      <div class="card empty-state-card">
        <div style="font-size:48px;margin-bottom:12px;">🎞️</div>
        <div>No recordings yet. Take a video interview to create recordings.</div>
      </div>`;
    return;
  }

  el.innerHTML = `<div class="grid-2">` + recordings.slice().reverse().map(rec => `
    <div class="card">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="font-size:32px;">🎥</div>
        <div>
          <div style="font-weight:600;font-size:14px;">${(rec.question || 'Interview Recording').slice(0, 55)}…</div>
          <div style="font-size:12px;color:var(--text2);">
            ${new Date(rec.date).toLocaleString()} ·
            ${Math.floor((rec.duration || 0) / 60)}:${((rec.duration || 0) % 60).toString().padStart(2, '0')}
          </div>
        </div>
      </div>
      <video src="${rec.url}" controls style="width:100%;border-radius:var(--r3);background:#000;max-height:220px;"></video>
    </div>
  `).join('') + `</div>`;
}
