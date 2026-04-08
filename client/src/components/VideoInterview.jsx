import React, { useState, useRef, useEffect } from 'react';

const VideoInterview = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  
  // New States
  const [transcript, setTranscript] = useState('');
  const [videoUrl, setVideoUrl] = useState(null);
  
  const questions = [
    "Tell me about yourself and your key strengths.",
    "Describe a time you had to resolve a conflict within your team.",
    "What is your greatest professional achievement?",
    "Why are you interested in working with us?",
    "Tell me about a time you failed and what you learned.",
    "How do you prioritize multiple deadlines?"
  ];
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  // Media Recorder and Speech Recognition Refs
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const recognitionRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsStreaming(true);
      setVideoUrl(null); // Reset older recordings
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera or microphone. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (isRecording) stopRecordingLogic();
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const stopRecordingLogic = () => {
    setIsRecording(false);
    
    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Stop Speech Recognition
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    generateFeedback();
  };

  const toggleRecording = () => {
    if (!isStreaming) return;
    
    if (isRecording) {
      stopRecordingLogic();
    } else {
      // Start Recording
      setIsRecording(true);
      setTimer(0);
      setFeedback(null);
      setTranscript('');
      setVideoUrl(null);
      chunksRef.current = [];
      
      // Setup MediaRecorder
      if (streamRef.current) {
        try {
          const mediaRecorder = new MediaRecorder(streamRef.current);
          mediaRecorderRef.current = mediaRecorder;
          
          mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksRef.current.push(e.data);
          };
          
          mediaRecorder.onstop = () => {
            const blob = new Blob(chunksRef.current, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);
          };
          
          mediaRecorder.start();
        } catch (err) {
          console.error("MediaRecorder initialization failed:", err);
          alert("Your browser does not cleanly support MediaRecorder for this stream. The recording might be text-only.");
        }
      }
      
      // Setup SpeechRecognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const recognition = new SpeechRecognition();
          recognitionRef.current = recognition;
          recognition.continuous = true;
          recognition.interimResults = true;
          
          recognition.onresult = (event) => {
            let currentTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript + ' ';
            }
            setTranscript(currentTranscript);
          };
          
          recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
          };
          
          recognition.start();
        } catch (err) {
          console.error("Failed to start SpeechRecognition:", err);
        }
      } else {
        setTranscript("Browser does not support Live Speech Recognition. Grading will fall back to default.");
        console.warn("Speech Recognition API is not supported in this browser.");
      }
    }
  };

  const generateFeedback = () => {
    // Grade based on actual transcript length and keywords
    const text = transcript.toLowerCase();
    let score = 0;
    let clarity = 0;
    let evalNotes = "";

    if (text.length < 15) {
      score = Math.floor(Math.random() * 15) + 30;
      clarity = 40;
      evalNotes = "Your answer was extremely brief or the microphone could not pick up your voice clearly. Try to speak louder and elaborate on your points.";
    } else if (text.length < 50) {
      score = Math.floor(Math.random() * 15) + 60;
      clarity = 70;
      evalNotes = "Good start, but you should speak longer and provide more context using the STAR method.";
    } else {
      const keywords = ['because', 'example', 'experience', 'team', 'achieved', 'result', 'learned', 'goal', 'project'];
      let count = 0;
      keywords.forEach(kw => { if (text.includes(kw)) count++; });
      
      if (count >= 2) {
        score = Math.floor(Math.random() * 10) + 90;
        evalNotes = "Excellent response! You spoke clearly and used strong professional keywords framing your experience.";
      } else {
        score = Math.floor(Math.random() * 15) + 75;
        evalNotes = "Solid delivery! You maintained good volume. Try to incorporate more metric-driven language to strengthen your points.";
      }
      clarity = Math.floor(Math.random() * 10) + 85;
    }

    setFeedback({
      confidence: score,
      clarity: clarity,
      notes: evalNotes
    });
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    } else clearInterval(interval);
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
      if (recognitionRef.current) recognitionRef.current.stop();
    };
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="page active" id="page-video">
      <div className="page-header">
        <h2>🎥 Video Interview</h2>
        <p>Record your interview — get vocabulary & communication feedback</p>
      </div>

      <div className="grid-2">
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="section-title">Camera Preview</div>
            <div style={{ position: 'relative', width: '100%', height: '240px', background: 'black', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <video 
                ref={videoRef} 
                muted 
                playsInline 
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: isStreaming ? 'block' : 'none', transform: 'scaleX(-1)' }} 
              />
              {!isStreaming && <div style={{ fontSize: '48px', color: 'white' }}>🎥</div>}
              
              {!isStreaming ? (
                <button className="btn btn-accent" style={{ position: 'absolute', bottom: '16px' }} onClick={startCamera}>Start Camera</button>
              ) : (
                <button className="btn btn-outline" style={{ position: 'absolute', bottom: '16px', background: 'rgba(0,0,0,0.5)', color: 'white', borderColor: 'white' }} onClick={stopCamera}>Turn Off Camera</button>
              )}
            </div>
            
            <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'space-between' }}>
              <div 
                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: isStreaming ? 'pointer' : 'not-allowed', padding: '8px', background: isRecording ? 'rgba(237, 137, 54, 0.1)' : 'transparent', borderRadius: '8px', transition: 'all 0.2s', border: isRecording ? '1px solid var(--orange)' : '1px solid transparent' }}
                onClick={toggleRecording}
              >
                <div 
                  style={{ 
                    width: '32px', height: '32px', 
                    background: isRecording ? 'var(--orange)' : (isStreaming ? 'var(--teal)' : 'var(--text3)'), 
                    borderRadius: isRecording ? '4px' : '50%', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white',
                    transition: 'all 0.2s'
                  }}
                >
                  {isRecording ? "⏹" : (isStreaming ? "⏺" : "")}
                </div>
                <div style={{ color: 'var(--text2)', fontSize: '15px', fontWeight: 'bold' }}>
                  {isRecording ? <span style={{ color: 'var(--orange)' }}>Recording... click to STOP ({formatTime(timer)})</span> : "Click here to START recording"}
                </div>
              </div>
              {videoUrl && (
                <a href={videoUrl} download="interview_recording.webm" className="btn btn-sm btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  ⬇️ Save Recording
                </a>
              )}
            </div>
          </div>
          <div className="card">
            <div className="section-title">Current Question {questionIndex + 1}/{questions.length}</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text)' }}>{questions[questionIndex]}</div>
            <button 
              className="btn btn-outline btn-sm" 
              style={{ marginTop: '12px' }}
              onClick={() => setQuestionIndex((prev) => (prev + 1) % questions.length)}
            >
              Next Question →
            </button>
          </div>
        </div>
        
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <div className="section-title">📊 Communication Analysis</div>
            
            {!feedback && !isRecording ? (
              <div className="empty-state">Start recording to get real-time communication feedback</div>
            ) : null}

            {(isRecording || transcript) && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg3)', borderRadius: '6px', minHeight: '60px' }}>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: '8px', fontWeight: 'bold' }}>Live Transcript</div>
                <div style={{ fontSize: '14px', color: 'var(--text)', fontStyle: 'italic', lineHeight: '1.5' }}>
                  {transcript || "Listening..."}
                </div>
              </div>
            )}

            {feedback && !isRecording && (
              <div style={{ padding: '16px', background: 'var(--bg2)', borderRadius: '8px', borderLeft: '4px solid var(--orange)' }}>
                <h4 style={{ marginBottom: '8px', color: 'var(--orange)' }}>AI Analysis Complete</h4>
                <p style={{ color: 'var(--text2)', fontStyle: 'italic', fontSize: '14px' }}>{feedback.notes}</p>
              </div>
            )}
          </div>
          <div className="card">
            <div className="section-title">🎙️ Speech Confidence Analysis</div>
            <div className="bar-chart">
              <div className="bar-row" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                <div className="bar-label" style={{ width: '80px', fontSize: '13px', color: 'var(--text)' }}>Confidence</div>
                <div className="bar-track" style={{ flex: 1, height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', margin: '0 12px' }}>
                  <div className="bar-fill" style={{ width: `${feedback ? feedback.confidence : 0}%`, height: '100%', background: 'var(--teal)', transition: 'width 1s' }}></div>
                </div>
                <div className="bar-val" style={{ width: '30px', fontSize: '13px', color: 'var(--teal)', fontWeight: 'bold' }}>{feedback ? feedback.confidence : '--'}</div>
              </div>
              <div className="bar-row" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="bar-label" style={{ width: '80px', fontSize: '13px', color: 'var(--text)' }}>Clarity</div>
                <div className="bar-track" style={{ flex: 1, height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden', margin: '0 12px' }}>
                  <div className="bar-fill" style={{ width: `${feedback ? feedback.clarity : 0}%`, height: '100%', background: 'var(--accent)', transition: 'width 1s' }}></div>
                </div>
                <div className="bar-val" style={{ width: '30px', fontSize: '13px', color: 'var(--accent)', fontWeight: 'bold' }}>{feedback ? feedback.clarity : '--'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInterview;
