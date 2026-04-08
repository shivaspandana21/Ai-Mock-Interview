/* ================================================
   js/resume.js — Resume Upload, Scoring, Q Generation
   ================================================ */

let resumeGeneratedQs = null;

function handleResumeUpload(input) {
  if (!input.files[0]) return;
  const file = input.files[0];
  document.getElementById('resume-filename').textContent = file.name;
  document.getElementById('resume-info').style.display = 'block';
  showToast(`Resume "${file.name}" loaded. Click Analyze.`, 'success');
}

function analyzeResume() {
  showToast('Analyzing resume with AI...', 'info');

  setTimeout(() => {
    const score = Math.floor(Math.random() * 15) + 72;

    // Score ring
    const deg = (score / 100) * 360;
    document.getElementById('resume-score-circle').style.background =
      `conic-gradient(#6c63ff 0deg, #4fd1c5 ${deg}deg, #252840 ${deg}deg)`;
    document.getElementById('resume-score-val').textContent = score;
    document.getElementById('resume-score-card').style.display = 'block';

    // Breakdown bars
    const breakdown = [
      { label: 'Skills Match',  val: Math.floor(Math.random()*20)+72, color: 'var(--grad1)' },
      { label: 'Experience',    val: Math.floor(Math.random()*20)+68, color: 'var(--grad3)' },
      { label: 'Education',     val: Math.floor(Math.random()*20)+75, color: 'var(--grad2)' },
      { label: 'Formatting',    val: Math.floor(Math.random()*20)+70, color: 'linear-gradient(135deg,#68d391,#48bb78)' },
      { label: 'Keywords (ATS)',val: Math.floor(Math.random()*25)+65, color: 'linear-gradient(135deg,#b794f4,#6c63ff)' },
    ];

    document.getElementById('resume-breakdown').innerHTML = breakdown.map(b => `
      <div class="bar-row">
        <div class="bar-label">${b.label}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${b.val}%;background:${b.color};"></div>
        </div>
        <div class="bar-val">${b.val}</div>
      </div>
    `).join('');

    // Suggestions
    const suggestions = [
      { icon:'📊', text:'Add quantifiable achievements (e.g., "Increased revenue by 30%")',    color:'rgba(108,99,255,0.15)' },
      { icon:'🏅', text:'Include relevant certifications and online courses',                     color:'rgba(79,209,197,0.15)'  },
      { icon:'🔑', text:'Use industry-specific keywords to pass ATS screening',                   color:'rgba(246,173,85,0.15)'  },
      { icon:'✍️', text:'Add a compelling professional summary at the top',                       color:'rgba(104,211,145,0.15)' },
    ];
    document.getElementById('resume-suggestions').innerHTML = `
      <div style="margin-top:12px;">
        <div style="font-size:13px;font-weight:600;margin-bottom:8px;color:var(--accent3);">💡 Suggestions</div>
        ${suggestions.map(s => `
          <div class="suggestion-item">
            <div class="suggestion-icon" style="background:${s.color};">${s.icon}</div>
            <div style="font-size:13px;">${s.text}</div>
          </div>
        `).join('')}
      </div>`;

    // Generate resume-based questions
    const specific = [
      { id:9001, stream:'se', text:'Walk me through the most impactful project on your resume.',              diff:'Medium', type:'Behavioral' },
      { id:9002, stream:'se', text:'How did you handle the biggest technical challenge in your last role?',   diff:'Medium', type:'Behavioral' },
      { id:9003, stream:'se', text:'Explain a technical decision you made and describe its outcome.',         diff:'Hard',   type:'Technical'  },
      { id:9004, stream:'se', text:'Describe a situation where you had to learn something quickly. How did you do it?', diff:'Medium', type:'Behavioral' },
      { id:9005, stream:'se', text:'Looking at your experience, what is the project you are most proud of?', diff:'Easy',   type:'Behavioral' },
    ];
    resumeGeneratedQs = [...specific, ...ALL_QUESTIONS.slice(0, 8)];

    document.getElementById('resume-questions-list').innerHTML = resumeGeneratedQs.slice(0, 12).map((q, i) => `
      <div class="question-card">
        <div class="q-header">
          <div class="q-number">${i + 1}</div>
          <div class="q-text">${q.text}</div>
        </div>
        <div class="q-meta">
          <span class="badge badge-purple">Resume-Based</span>
          ${diffBadge(q.diff)}
          <span class="badge badge-teal">${q.type}</span>
        </div>
      </div>
    `).join('');

    document.getElementById('resume-qn-actions').style.display = 'block';
    showToast(`Resume analyzed! Score: ${score}/100`, 'success');
  }, 2000);
}

function startResumeInterview() {
  const qs = resumeGeneratedQs || ALL_QUESTIONS.slice(0, 10);
  launchInterview({
    title: 'Resume-Based Interview',
    subtitle: 'Personalized Questions',
    icon: '📄',
    type: 'resume',
    typeId: 'resume',
    questions: qs.slice(0, 12),
  });
}
