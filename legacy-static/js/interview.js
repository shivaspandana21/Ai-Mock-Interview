/* ================================================
   js/interview.js — Interview Engine + Voice Input + Q Bank
   ================================================ */

let interviewState   = null;
let interviewTimer   = null;
let voiceRecognition = null;
let isVoiceActive    = false;

/* ---- STREAM / COMPANY LAUNCHERS ---- */
function buildStreamCards() {
  const grid   = document.getElementById('stream-cards-grid');
  const select = document.getElementById('qbank-stream-filter');

  grid.innerHTML = STREAMS.map(s => `
    <div class="stream-card" onclick="startStreamInterview('${s.id}')">
      <div class="stream-icon">${s.icon}</div>
      <div class="stream-name">${s.name}</div>
      <div class="stream-count">10+ Questions · Stream Mock</div>
      <div style="font-size:12px;color:var(--text2);margin-bottom:10px;">${s.desc}</div>
      <span class="badge badge-purple">Start Interview →</span>
    </div>
  `).join('');

  STREAMS.forEach(s => {
    const opt = document.createElement('option');
    opt.value = s.id; opt.textContent = s.name;
    select.appendChild(opt);
  });
}

function buildCompanyCards() {
  const grid   = document.getElementById('company-cards-grid');
  const predSel = document.getElementById('pred-company');

  grid.innerHTML = COMPANIES.map(c => `
    <div class="company-card" onclick="startCompanyInterview('${c.id}')">
      <div style="display:flex;align-items:center;gap:12px;">
        <div class="company-logo-wrap" style="background:${c.color}22;">${c.icon}</div>
        <div>
          <div class="company-name">${c.name}</div>
          <div class="company-industry">${c.industry}</div>
        </div>
      </div>
      <div style="font-size:12px;color:var(--text2);">Required: <strong style="color:var(--accent);">${c.required}%</strong></div>
      <div class="bar-chart">
        <div class="bar-row">
          <div class="bar-label" style="width:80px;">Difficulty</div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${c.required}%;background:${c.color};"></div>
          </div>
          <div class="bar-val">${c.required >= 85 ? '🔥' : c.required >= 75 ? '⚡' : '✅'}</div>
        </div>
      </div>
      <button class="btn btn-outline btn-sm" style="width:100%;margin-top:4px;">Start ${c.name} Interview →</button>
    </div>
  `).join('');

  COMPANIES.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c.id; opt.textContent = c.name;
    predSel.appendChild(opt);
  });
}

function startStreamInterview(streamId) {
  const stream = STREAMS.find(s => s.id === streamId);
  launchInterview({
    title: `${stream.name} Interview`,
    subtitle: 'Stream Mock Interview',
    icon: stream.icon,
    type: 'stream',
    typeId: streamId,
    questions: getQuestionsForStream(streamId),
  });
}

function startCompanyInterview(companyId) {
  const company = COMPANIES.find(c => c.id === companyId);
  launchInterview({
    title: `${company.name} Interview`,
    subtitle: 'Company Mock Interview',
    icon: company.icon,
    type: 'company',
    typeId: companyId,
    questions: getQuestionsForCompany(companyId),
  });
}

/* ---- QUESTION SELECTION ---- */
function getQuestionsForStream(streamId) {
  let qs = ALL_QUESTIONS.filter(q => q.stream === streamId);
  if (qs.length < 10) {
    const extra = ALL_QUESTIONS.filter(q => q.stream !== streamId).slice(0, 10 - qs.length);
    qs = [...qs, ...extra];
  }
  return qs.slice(0, 12);
}

function getQuestionsForCompany(companyId) {
  let qs = ALL_QUESTIONS.filter(q => q.company === companyId);
  if (qs.length < 10) {
    const extra = ALL_QUESTIONS.filter(q => q.company !== companyId).slice(0, 10 - qs.length);
    qs = [...qs, ...extra];
  }
  return qs.slice(0, 12);
}

/* ---- LAUNCH INTERVIEW ---- */
function launchInterview(config) {
  interviewState = {
    config,
    currentIndex: 0,
    answers: [],
    scores: [],
    startTime: Date.now(),
    elapsed: 0,
  };

  document.getElementById('active-interview').classList.add('open');
  document.getElementById('int-title').textContent    = config.title;
  document.getElementById('int-subtitle').textContent = config.subtitle;

  buildQuestionDots();
  showCurrentQuestion();
  startInterviewTimer();
}

function buildQuestionDots() {
  const el = document.getElementById('int-q-dots');
  el.innerHTML = interviewState.config.questions.map((_, i) =>
    `<div class="q-dot ${i === 0 ? 'current' : ''}"></div>`
  ).join('');
}

function showCurrentQuestion() {
  const { currentIndex, config } = interviewState;
  const q = config.questions[currentIndex];
  if (!q) { endInterview(); return; }

  document.getElementById('int-q-num').textContent      = currentIndex + 1;
  document.getElementById('int-q-text').textContent     = q.text;
  document.getElementById('int-qprogress').textContent  = `Q ${currentIndex + 1} / ${config.questions.length}`;
  document.getElementById('int-answer').value           = '';
  document.getElementById('int-ai-feedback').style.display = 'none';

  document.getElementById('int-q-badges').innerHTML = `
    ${diffBadge(q.diff)}
    <span class="badge badge-teal">${q.type}</span>
  `;

  document.querySelectorAll('.q-dot').forEach((d, i) => {
    d.className = 'q-dot ' + (i < currentIndex ? 'done' : i === currentIndex ? 'current' : '');
  });
}

function startInterviewTimer() {
  clearInterval(interviewTimer);
  interviewTimer = setInterval(() => {
    interviewState.elapsed++;
    const m = Math.floor(interviewState.elapsed / 60).toString().padStart(2, '0');
    const s = (interviewState.elapsed % 60).toString().padStart(2, '0');
    document.getElementById('int-timer').textContent = `${m}:${s}`;
  }, 1000);
}

/* ---- ANSWER ACTIONS ---- */
function submitAnswer() {
  const answer = document.getElementById('int-answer').value.trim();
  if (!answer) { showToast('Please provide an answer first!', 'error'); return; }

  const q        = interviewState.config.questions[interviewState.currentIndex];
  const accuracy = Math.floor(Math.random() * 25) + 70;
  const depth    = Math.floor(Math.random() * 25) + 65;
  const clarity  = Math.floor(Math.random() * 25) + 68;
  const avg      = Math.round((accuracy + depth + clarity) / 3);

  interviewState.answers.push({ question: q.text, answer, score: avg });
  interviewState.scores.push(avg);

  // Update live score bars
  document.getElementById('score-accuracy').style.width       = accuracy + '%';
  document.getElementById('score-accuracy-val').textContent   = accuracy;
  document.getElementById('score-depth').style.width          = depth + '%';
  document.getElementById('score-depth-val').textContent      = depth;
  document.getElementById('score-clarity').style.width        = clarity + '%';
  document.getElementById('score-clarity-val').textContent    = clarity;

  // AI Feedback with typing animation
  const fbBox  = document.getElementById('int-ai-feedback');
  const fbText = document.getElementById('int-ai-text');
  fbBox.style.display = 'block';
  showTyping(fbText);

  setTimeout(() => {
    const fb = AI_FEEDBACKS[Math.floor(Math.random() * AI_FEEDBACKS.length)];
    fbText.innerHTML = `
      <div style="font-size:13px;line-height:1.6;margin-bottom:8px;">${fb}</div>
      <span style="font-family:Syne,sans-serif;font-weight:800;font-size:16px;color:var(--accent);">${avg}/100</span>
      <span class="badge ${avg>=80?'badge-green':avg>=60?'badge-orange':'badge-red'}" style="margin-left:8px;">
        ${avg>=80?'Excellent':avg>=60?'Good':'Needs Work'}
      </span>`;
  }, 1100);

  // Add to log
  const log   = document.getElementById('int-log');
  const entry = document.createElement('div');
  entry.className = 'card2';
  entry.style.fontSize = '12px';
  entry.innerHTML = `
    <div style="font-weight:600;margin-bottom:4px;color:var(--text2);">Q${interviewState.currentIndex+1}: ${q.text.slice(0,60)}...</div>
    <div style="color:var(--accent);">Score: ${avg}/100</div>`;
  log.prepend(entry);

  // Advance question after 2s
  setTimeout(() => {
    interviewState.currentIndex++;
    showCurrentQuestion();
  }, 2200);
}

function skipQuestion() {
  interviewState.currentIndex++;
  showCurrentQuestion();
}

function getHint() {
  const q     = interviewState.config.questions[interviewState.currentIndex];
  const hints = [
    'Consider the key principles, then provide a concrete real-world example.',
    'Use the STAR method: Situation → Task → Action → Result.',
    'Think about trade-offs and edge cases to show deeper expertise.',
    'Start with a clear definition, then explain how it works in practice.',
    'Mention specific tools, frameworks, or metrics you have used.',
  ];
  showToast('💡 ' + hints[q.id % hints.length], 'info');
}

function endInterview() {
  clearInterval(interviewTimer);
  document.getElementById('active-interview').classList.remove('open');

  if (interviewState && interviewState.answers.length > 0) {
    const overallScore = Math.round(
      interviewState.scores.reduce((a, b) => a + b, 0) / interviewState.scores.length
    );
    const record = {
      id: Date.now().toString(),
      title:        interviewState.config.title,
      subtitle:     interviewState.config.subtitle,
      icon:         interviewState.config.icon,
      type:         interviewState.config.type,
      typeId:       interviewState.config.typeId,
      answers:      interviewState.answers,
      overallScore,
      duration:     interviewState.elapsed,
      date:         new Date().toISOString(),
    };
    DB.saveInterview(record);
    showToast(`Interview complete! Score: ${overallScore}%`, 'success');
    updateDashboard();
  }

  interviewState = null;
}

/* ---- VOICE INPUT ---- */
function toggleVoiceInput() {
  const supported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
  if (!supported) { showToast('Voice input not supported in this browser', 'error'); return; }

  if (isVoiceActive) {
    voiceRecognition?.stop();
    isVoiceActive = false;
    document.getElementById('voice-btn').textContent      = '🎙️ Voice Input';
    document.getElementById('voice-status').style.display = 'none';
    return;
  }

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  voiceRecognition = new SR();
  voiceRecognition.continuous      = true;
  voiceRecognition.interimResults  = true;
  voiceRecognition.lang            = 'en-US';

  voiceRecognition.onresult = (e) => {
    let transcript = '';
    for (let i = e.resultIndex; i < e.results.length; i++) {
      transcript += e.results[i][0].transcript;
    }
    document.getElementById('int-answer').value = transcript;
  };

  voiceRecognition.onerror = () => {
    isVoiceActive = false;
    document.getElementById('voice-btn').textContent = '🎙️ Voice Input';
    document.getElementById('voice-status').style.display = 'none';
  };

  voiceRecognition.start();
  isVoiceActive = true;
  document.getElementById('voice-btn').textContent      = '⏹ Stop Voice';
  document.getElementById('voice-status').style.display = 'block';
}

/* ---- QUESTION BANK ---- */
function buildQBank() { filterQBank(); }

function filterQBank() {
  const stream = document.getElementById('qbank-stream-filter').value;
  const diff   = document.getElementById('qbank-diff-filter').value;
  const type   = document.getElementById('qbank-type-filter').value;

  let qs = ALL_QUESTIONS;
  if (stream) qs = qs.filter(q => q.stream === stream);
  if (diff)   qs = qs.filter(q => q.diff   === diff);
  if (type)   qs = qs.filter(q => q.type   === type);

  const el = document.getElementById('qbank-list');
  el.innerHTML = qs.map((q, idx) => {
    const streamName = STREAMS.find(s => s.id === q.stream)?.name || q.stream;
    const compName   = COMPANIES.find(c => c.id === q.company)?.name || '';
    return `
      <div class="question-card">
        <div class="q-header">
          <div class="q-number">${idx + 1}</div>
          <div class="q-text">${q.text}</div>
        </div>
        <div class="q-meta">
          <span class="badge badge-purple">${streamName}</span>
          ${diffBadge(q.diff)}
          <span class="badge badge-teal">${q.type}</span>
          ${compName ? `<span class="badge badge-orange">${compName}</span>` : ''}
        </div>
        <textarea class="q-answer-area" placeholder="Practice your answer here..." rows="3"></textarea>
        <div style="margin-top:8px;display:flex;gap:8px;">
          <button class="btn btn-accent btn-sm" onclick="evaluateQBankAnswer(this, ${q.id})">🤖 Evaluate</button>
          <button class="btn btn-outline btn-sm" onclick="showQBankHint(${q.id})">💡 Hint</button>
        </div>
        <div class="ai-feedback-box" style="display:none;margin-top:10px;" data-fb="${q.id}">
          <div class="ai-feedback-label">AI Feedback</div>
          <div class="ai-fb-text"></div>
        </div>
      </div>`;
  }).join('');
}

function evaluateQBankAnswer(btn, qid) {
  const card   = btn.closest('.question-card');
  const answer = card.querySelector('.q-answer-area').value.trim();
  if (!answer) { showToast('Write an answer first!', 'error'); return; }

  const fbBox  = card.querySelector('.ai-feedback-box');
  const fbText = card.querySelector('.ai-fb-text');
  fbBox.style.display = 'block';
  showTyping(fbText);

  setTimeout(() => {
    const score = Math.floor(Math.random() * 30) + 65;
    const fb    = AI_FEEDBACKS[Math.floor(Math.random() * AI_FEEDBACKS.length)];
    fbText.innerHTML = `
      <div style="font-size:13px;line-height:1.6;margin-bottom:8px;">${fb}</div>
      <span style="font-family:Syne,sans-serif;font-weight:800;font-size:18px;color:var(--accent);">${score}/100</span>
      <span class="badge ${score>=80?'badge-green':score>=60?'badge-orange':'badge-red'}" style="margin-left:8px;">
        ${score>=80?'Excellent':score>=60?'Good':'Needs Work'}
      </span>`;
  }, 1200);
}

function showQBankHint(qid) {
  const hints = [
    'Think of real-world applications from your own experience.',
    'Use the STAR method: Situation, Task, Action, Result.',
    'Mention trade-offs and when you would choose one approach over another.',
    'Include specific metrics or quantifiable outcomes.',
    'Structure: define → how it works → give an example.',
  ];
  showToast('💡 ' + hints[qid % hints.length], 'info');
}

/* ---- AUTO QUESTION GENERATOR ---- */
function autoGenerateQuestions() {
  const topic  = document.getElementById('aqn-topic').value.trim() || 'General';
  const diff   = document.getElementById('aqn-diff').value;
  const count  = parseInt(document.getElementById('aqn-count').value) || 10;
  const type   = document.getElementById('aqn-type').value;

  const templates = {
    Technical: [
      `Explain the core concept of ${topic} and its practical applications.`,
      `What are the key challenges in ${topic} and how do you overcome them?`,
      `Compare different approaches to ${topic} and discuss their trade-offs.`,
      `How would you design a system that incorporates ${topic} at scale?`,
      `What best practices do you follow when working with ${topic}?`,
      `Walk me through a real project where you applied ${topic}.`,
      `How does ${topic} relate to performance optimization?`,
      `What are the most common mistakes developers make with ${topic}?`,
      `Explain how you would test a ${topic}-based implementation.`,
      `How has ${topic} evolved in recent years and where is it heading?`,
    ],
    Behavioral: [
      `Tell me about a time you successfully applied ${topic} under pressure.`,
      `Describe a challenge you faced with ${topic} and how you resolved it.`,
      `How do you stay updated with the latest trends in ${topic}?`,
      `Give an example of when your knowledge of ${topic} made a measurable difference.`,
      `How do you explain ${topic} to non-technical stakeholders?`,
    ],
    HR: [
      `Why are you passionate about ${topic}?`,
      `How does your experience with ${topic} align with this role?`,
      `What is your plan to deepen your expertise in ${topic}?`,
      `Describe your ideal work environment for ${topic}-related work.`,
      `How do you handle constructive criticism about your ${topic} work?`,
    ],
  };

  let base = type === 'Mixed'
    ? [...templates.Technical, ...templates.Behavioral, ...templates.HR]
    : (templates[type] || templates.Technical);

  const selected = base.slice(0, count);
  while (selected.length < count) {
    selected.push(`Advanced ${topic} question ${selected.length + 1}: Explain with a real-world example and discuss edge cases.`);
  }

  const result = document.getElementById('aqn-result');
  result.style.display = 'flex';
  result.innerHTML = selected.map((q, i) => `
    <div class="question-card">
      <div class="q-header">
        <div class="q-number">${i + 1}</div>
        <div class="q-text">${q}</div>
      </div>
      <div class="q-meta">
        <span class="badge badge-purple">${topic}</span>
        ${diffBadge(diff)}
        <span class="badge badge-teal">${type === 'Mixed' ? (i < 10 ? 'Technical' : i < 15 ? 'Behavioral' : 'HR') : type}</span>
      </div>
    </div>
  `).join('');

  showToast(`✅ Generated ${selected.length} questions for "${topic}"`, 'success');
}
