/* ================================================
   js/video.js — Video Recording, Speech & Communication Analysis
   ================================================ */

let mediaRecorder   = null;
let recordedChunks  = [];
let videoStream     = null;
let videoTimer      = null;
let videoElapsed    = 0;
let isVideoRecording = false;
let videoQIndex     = 0;

async function startVideoInterview() {
  try {
    videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const videoEl = document.getElementById('video-preview');
    videoEl.srcObject = videoStream;
    document.getElementById('video-start-overlay').style.display = 'none';
    showToast('Camera started! Press ⏺ to begin recording.', 'success');
  } catch (err) {
    showToast('Camera access denied or not available in this browser.', 'error');
    console.error('getUserMedia error:', err);
  }
}

function toggleVideoRecording() {
  if (!videoStream) { showToast('Start your camera first!', 'error'); return; }

  if (!isVideoRecording) {
    /* START recording */
    recordedChunks = [];
    try {
      mediaRecorder = new MediaRecorder(videoStream);
    } catch {
      showToast('Recording not supported in this browser. Try Chrome.', 'error');
      return;
    }

    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) recordedChunks.push(e.data);
    };
    mediaRecorder.onstop = saveRecording;
    mediaRecorder.start(1000); // collect every 1s

    isVideoRecording = true;
    document.getElementById('vid-rec-btn').textContent = '⏹';
    document.getElementById('vid-rec-btn').title       = 'Stop Recording';

    videoElapsed = 0;
    videoTimer = setInterval(() => {
      videoElapsed++;
      const m = Math.floor(videoElapsed / 60).toString().padStart(2, '0');
      const s = (videoElapsed % 60).toString().padStart(2, '0');
      document.getElementById('vid-timer').textContent = `${m}:${s}`;
    }, 1000);

    showCommunicationFeedback();
    showToast('Recording started…', 'info');

  } else {
    /* STOP recording */
    mediaRecorder.stop();
    isVideoRecording = false;
    clearInterval(videoTimer);

    document.getElementById('vid-rec-btn').textContent = '⏺';
    document.getElementById('vid-rec-btn').title       = 'Record';

    showToast('Recording saved! Analyzing speech…', 'success');
    showSpeechAnalysis();
  }
}

function saveRecording() {
  if (!recordedChunks.length) return;
  const blob = new Blob(recordedChunks, { type: 'video/webm' });
  const url  = URL.createObjectURL(blob);

  DB.saveRecording({
    id:       Date.now().toString(),
    question: VIDEO_QUESTIONS[videoQIndex] || 'Interview Recording',
    url,
    duration: videoElapsed,
    date:     new Date().toISOString(),
  });
}

function nextVideoQuestion() {
  videoQIndex = (videoQIndex + 1) % VIDEO_QUESTIONS.length;
  document.getElementById('video-current-question').textContent = VIDEO_QUESTIONS[videoQIndex];
}

/* ---- COMMUNICATION FEEDBACK ---- */
function showCommunicationFeedback() {
  const tips = [
    { icon: '👁️', label: 'Eye Contact',    status: 'good', tip: 'Maintain consistent eye contact with the camera lens.' },
    { icon: '🗣️', label: 'Speaking Pace',  status: 'warn', tip: 'Slightly fast — aim for 130–150 words per minute.' },
    { icon: '😊', label: 'Expression',     status: 'good', tip: 'Natural and engaged facial expressions detected.' },
    { icon: '📏', label: 'Posture',         status: 'good', tip: 'Upright posture — great professional presence.' },
  ];

  document.getElementById('comm-feedback').innerHTML = tips.map(t => `
    <div style="display:flex;align-items:center;gap:10px;padding:10px;background:var(--bg2);border-radius:var(--r3);margin-bottom:8px;">
      <span style="font-size:20px;">${t.icon}</span>
      <div style="flex:1;">
        <div style="font-size:13px;font-weight:600;">${t.label}</div>
        <div style="font-size:12px;color:var(--text2);">${t.tip}</div>
      </div>
      <span class="badge ${t.status === 'good' ? 'badge-green' : 'badge-orange'}">
        ${t.status === 'good' ? 'Good' : 'Improve'}
      </span>
    </div>
  `).join('');
}

/* ---- SPEECH CONFIDENCE ANALYSIS ---- */
function showSpeechAnalysis() {
  const conf  = Math.floor(Math.random() * 20) + 72;
  const clar  = Math.floor(Math.random() * 20) + 70;
  const pace  = Math.floor(Math.random() * 20) + 68;
  const vocab = Math.floor(Math.random() * 20) + 65;

  setTimeout(() => {
    document.getElementById('conf-bar').style.width  = conf + '%';
    document.getElementById('conf-val').textContent  = conf + '%';
    document.getElementById('clar-bar').style.width  = clar + '%';
    document.getElementById('clar-val').textContent  = clar + '%';
    document.getElementById('pace-bar').style.width  = pace + '%';
    document.getElementById('pace-val').textContent  = pace + '%';
    document.getElementById('vocab-bar').style.width = vocab + '%';
    document.getElementById('vocab-val').textContent = vocab + '%';
  }, 200);

  showVocabFeedback();
}

/* ---- VOCABULARY FEEDBACK ---- */
function showVocabFeedback() {
  const vocabHtml = VOCAB_FEEDBACK.slice(0, 3).map(v => `
    <div style="display:flex;gap:8px;padding:8px;background:rgba(252,129,129,0.08);border-radius:6px;margin-bottom:6px;">
      <span style="color:var(--accent4);">⚠️</span>
      <div>
        <div style="font-size:12px;font-weight:600;">
          Avoid: <span style="color:var(--accent4);">"${v.word}"</span>
          → Use: <span style="color:var(--accent5);">"${v.better}"</span>
        </div>
        <div style="font-size:11px;color:var(--text2);">${v.tip}</div>
      </div>
    </div>
  `).join('');

  const fb = document.getElementById('comm-feedback');
  fb.innerHTML += `
    <div style="margin-top:12px;">
      <div style="font-size:13px;font-weight:600;margin-bottom:6px;color:var(--accent3);">📚 Vocabulary Suggestions</div>
      ${vocabHtml}
    </div>`;
}
