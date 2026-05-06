(() => {
  const slides = Array.from(document.querySelectorAll('.slide'))
  const durations = [10, 10, 10] // seconds per slide (total 30s)
  const total = durations.reduce((s, n) => s + n, 0)
  const startBtn = document.getElementById('startBtn')
  const progressBar = document.querySelector('.progress .bar')

  let timer = null
  let startTs = null

  function setActive(index) {
    slides.forEach((s, i) => s.classList.toggle('active', i === index))
  }

  function play() {
    if (timer) return
    startBtn.disabled = true
    startBtn.textContent = 'Playing…'
    startTs = Date.now()

    // schedule slide changes
    let elapsed = 0
    let accumulated = 0
    setActive(0)

    timer = setInterval(() => {
      elapsed = (Date.now() - startTs) / 1000
      // update progress
      const pct = Math.min(100, (elapsed / total) * 100)
      progressBar.style.width = pct + '%'

      // determine slide index
      let idx = 0
      let running = 0
      for (let i = 0; i < durations.length; i++) {
        running += durations[i]
        if (elapsed <= running) { idx = i; break }
      }
      setActive(idx)

      if (elapsed >= total) {
        stop()
      }
    }, 200)
  }

  function stop() {
    if (!timer) return
    clearInterval(timer)
    timer = null
    startBtn.disabled = false
    startBtn.textContent = 'Play Demo (30s)'
    progressBar.style.width = '100%'
    setTimeout(() => { progressBar.style.width = '0%' }, 400)
  }

  startBtn.addEventListener('click', () => play())

  // auto-play once when page loads (for convenience when recording)
  window.addEventListener('load', () => setTimeout(() => startBtn.click(), 800))
})()
