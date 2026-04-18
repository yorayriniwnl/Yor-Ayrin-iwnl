(() => {
  const recordBtn = document.getElementById('recordBtn');
  const playBtn = document.getElementById('playBtn');
  const downloadLink = document.getElementById('downloadLink');
  const liveTranscribeBtn = document.getElementById('liveTranscribeBtn');
  const stateEl = document.getElementById('state');
  const timerEl = document.getElementById('timer');
  const transcriptEl = document.getElementById('transcript');
  const fillerReport = document.getElementById('fillerReport');
  const countinEl = document.getElementById('countin');

  let mediaRecorder = null;
  let audioChunks = [];
  let audioBlob = null;
  let audioUrl = null;
  let audioEl = null;
  let timerInterval = null;
  let startTime = null;
  let recognition = null;
  let transcribing = false;

  const fillerWords = ['uh','um','like','you know','so','actually','basically','right'];

  function formatTime(ms){
    if(!ms) return '00:00';
    const s = Math.floor(ms/1000);
    const mm = Math.floor(s/60).toString().padStart(2,'0');
    const ss = (s%60).toString().padStart(2,'0');
    return `${mm}:${ss}`;
  }

  function startTimer(){
    startTime = Date.now();
    timerInterval = setInterval(()=>{
      timerEl.textContent = formatTime(Date.now()-startTime);
    },250);
  }
  function stopTimer(){
    clearInterval(timerInterval);
    timerEl.textContent = '00:00';
  }

  function startCountIn(sec=3){
    return new Promise(resolve=>{
      let n = sec;
      countinEl.textContent = n;
      const iv = setInterval(()=>{
        n--;
        if(n>0){ countinEl.textContent = n; return }
        clearInterval(iv);
        countinEl.textContent = '';
        resolve();
      },1000);
    });
  }

  async function startRecording(){
    try{
      const stream = await navigator.mediaDevices.getUserMedia({audio:true});
      mediaRecorder = new MediaRecorder(stream);
      audioChunks = [];
      mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
      mediaRecorder.onstop = ()=>{
        audioBlob = new Blob(audioChunks,{type: audioChunks[0]?.type || 'audio/webm'});
        audioUrl = URL.createObjectURL(audioBlob);
        audioEl = new Audio(audioUrl);
        playBtn.disabled = false;
        downloadLink.classList.remove('disabled');
        downloadLink.href = audioUrl;
        stateEl.textContent = 'Idle';
      };

      mediaRecorder.start();
      stateEl.textContent = 'Recording';
      startTimer();
      recordBtn.textContent = 'Stop';
    }catch(err){
      stateEl.textContent = 'Error: microphone access denied';
    }
  }

  function stopRecording(){
    if(mediaRecorder && mediaRecorder.state !== 'inactive'){
      mediaRecorder.stop();
      stopTimer();
      recordBtn.textContent = 'Start Recording';
    }
  }

  recordBtn.addEventListener('click', async ()=>{
    if(!mediaRecorder || mediaRecorder.state === 'inactive'){
      // count-in then start
      await startCountIn(3);
      startRecording();
    } else {
      stopRecording();
    }
  });

  playBtn.addEventListener('click', ()=>{
    if(audioEl){ audioEl.play(); }
  });

  // Live transcription (experimental): uses Web Speech API when available.
  liveTranscribeBtn.addEventListener('click', ()=>{
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if(!SpeechRec){
      alert('Live transcription not supported in this browser.');
      return;
    }
    if(!transcribing){
      recognition = new SpeechRec();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = true;
      transcriptEl.textContent = '';
      fillerReport.textContent = '';
      recognition.onresult = (ev)=>{
        let interim=''; let final='';
        for(let i=0;i<ev.results.length;i++){
          const r = ev.results[i];
          if(r.isFinal) final += r[0].transcript + '\n'; else interim += r[0].transcript;
        }
        transcriptEl.textContent = final + interim;
        if(final){ analyzeFiller(final); }
      };
      recognition.onerror = e=> { stateEl.textContent = 'Recognition error'; };
      recognition.onend = ()=>{
        transcribing = false;
        liveTranscribeBtn.textContent = 'Live Transcribe (experimental)';
        stateEl.textContent = 'Idle';
      };
      recognition.start();
      transcribing = true;
      liveTranscribeBtn.textContent = 'Stop Live Transcribe';
      stateEl.textContent = 'Transcribing';
    } else {
      recognition.stop();
    }
  });

  function analyzeFiller(text){
    const lower = text.toLowerCase();
    const report = [];
    let total = 0;
    fillerWords.forEach(w=>{
      const re = new RegExp('\\b'+w.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')+'\\b','g');
      const m = lower.match(re);
      const count = m ? m.length : 0;
      if(count>0){ report.push(`${w}: ${count}`); total += count; }
    });
    fillerReport.textContent = total ? `Filler words detected — ${report.join(', ')}` : 'No common filler words detected.';
  }

  // On load: small feature to load sample script into transcript space
  document.addEventListener('DOMContentLoaded', ()=>{
    transcriptEl.textContent = 'Tip: press Start Recording, pause between lines, then Play to review.';
  });

})();
