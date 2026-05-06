'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

export default function CarGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [paused, setPaused] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const pausedRef = useRef(false)

  const startGame = useCallback(() => {
    setStarted(true)
    setScore(0)
    setGameOver(false)
    setPaused(false)
  }, [])

  const resumeGame = useCallback(() => {
    if (!started || gameOver) return
    pausedRef.current = false
    setPaused(false)
  }, [gameOver, started])

  const togglePause = useCallback(() => {
    if (!started || gameOver) return
    pausedRef.current = !pausedRef.current
    setPaused(pausedRef.current)
  }, [gameOver, started])

  const fullscreenAndResume = useCallback(async () => {
    if (!started || gameOver) return

    const container = containerRef.current
    if (container && document.fullscreenElement !== container && container.requestFullscreen) {
      try {
        await container.requestFullscreen()
      } catch {
        // If fullscreen fails, still let the user keep playing.
      }
    }

    resumeGame()
  }, [gameOver, resumeGame, started])

  useEffect(() => {
    if (!started || !canvasRef.current) return

    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return
    const ctx: CanvasRenderingContext2D = context
    canvas.width = 420
    canvas.height = 560

    let animId: number
    let localScore = 0
    let localLives = 3
    let speed = 4
    let frameCount = 0
    let over = false

    // Road configuration
    const ROAD_LEFT = 60
    const ROAD_RIGHT = 360
    const ROAD_W = ROAD_RIGHT - ROAD_LEFT
    const LANE_W = ROAD_W / 3

    // Player car
    const player = { x: ROAD_LEFT + LANE_W, y: 440, w: 40, h: 70, lane: 1 }
    const targetX = { val: player.x }

    // Road lines for animation
    const lines: { y: number }[] = [0, 120, 240, 360, 480].map(y => ({ y }))

    // Obstacles
    type Obstacle = { x: number; y: number; w: number; h: number; lane: number; color: string; invincible: boolean }
    const obstacles: Obstacle[] = []
    const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']

    // Powerups
    type Powerup = { x: number; y: number; type: 'heart' | 'star'; lane: number }
    const powerups: Powerup[] = []

    let invincible = false
    let invincibleTimer = 0
    let shakeTimer = 0

    function laneX(lane: number) { 
      return ROAD_LEFT + lane * LANE_W + LANE_W / 2 - 20 
    }

    // Input handling
    let lastKeyTime = 0

    function onKey(e: KeyboardEvent) {
      const now = Date.now()
      if (now - lastKeyTime < 180) return
      lastKeyTime = now

      if (e.key === 'Escape') {
        e.preventDefault()
        togglePause()
        return
      }

      if (pausedRef.current) return

      if (e.key === 'ArrowLeft' && player.lane > 0) {
        player.lane--
        targetX.val = laneX(player.lane)
      }
      if (e.key === 'ArrowRight' && player.lane < 2) {
        player.lane++
        targetX.val = laneX(player.lane)
      }
    }
    window.addEventListener('keydown', onKey)

    // Touch controls for mobile
    let touchStartX = 0
    function onTouchStart(e: TouchEvent) { 
      touchStartX = e.touches[0].clientX 
    }
    function onTouchEnd(e: TouchEvent) {
      const dx = e.changedTouches[0].clientX - touchStartX
      const now = Date.now()
      if (now - lastKeyTime < 180) return
      lastKeyTime = now
      if (dx < -30 && player.lane > 0) { 
        player.lane--
        targetX.val = laneX(player.lane) 
      }
      if (dx > 30 && player.lane < 2) { 
        player.lane++
        targetX.val = laneX(player.lane) 
      }
    }
    canvas.addEventListener('touchstart', onTouchStart)
    canvas.addEventListener('touchend', onTouchEnd)

    function spawnObstacle() {
      const lane = Math.floor(Math.random() * 3)
      obstacles.push({
        x: laneX(lane), 
        y: -80, 
        w: 40, 
        h: 70,
        lane, 
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        invincible: false,
      })
    }

    function spawnPowerup() {
      const lane = Math.floor(Math.random() * 3)
      powerups.push({ 
        x: laneX(lane), 
        y: -40, 
        type: Math.random() < 0.5 ? 'heart' : 'star', 
        lane 
      })
    }

    function drawRoad() {
      // Sky gradient background
      const sky = ctx.createLinearGradient(0, 0, 0, canvas.height)
      sky.addColorStop(0, '#0a1628')
      sky.addColorStop(1, '#071130')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Grass on sides
      ctx.fillStyle = '#0d2b1a'
      ctx.fillRect(0, 0, ROAD_LEFT, canvas.height)
      ctx.fillRect(ROAD_RIGHT, 0, canvas.width - ROAD_RIGHT, canvas.height)

      // Road surface with gradient
      const roadGrad = ctx.createLinearGradient(ROAD_LEFT, 0, ROAD_RIGHT, 0)
      roadGrad.addColorStop(0, '#1a1a2e')
      roadGrad.addColorStop(0.5, '#16213e')
      roadGrad.addColorStop(1, '#1a1a2e')
      ctx.fillStyle = roadGrad
      ctx.fillRect(ROAD_LEFT, 0, ROAD_W, canvas.height)

      // Road edge lines
      ctx.strokeStyle = '#f97316'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(ROAD_LEFT, 0)
      ctx.lineTo(ROAD_LEFT, canvas.height)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(ROAD_RIGHT, 0)
      ctx.lineTo(ROAD_RIGHT, canvas.height)
      ctx.stroke()

      // Lane dividing lines
      for (let i = 1; i < 3; i++) {
        lines.forEach(line => {
          ctx.strokeStyle = 'rgba(255,255,255,0.25)'
          ctx.lineWidth = 2
          ctx.setLineDash([30, 20])
          ctx.beginPath()
          ctx.moveTo(ROAD_LEFT + i * LANE_W, line.y)
          ctx.lineTo(ROAD_LEFT + i * LANE_W, line.y + 50)
          ctx.stroke()
          ctx.setLineDash([])
        })
      }
    }

    function drawCar(x: number, y: number, color: string, isPlayer = false) {
      ctx.save()
      
      // Car body with gradient
      const grad = ctx.createLinearGradient(x, y, x + 40, y + 70)
      grad.addColorStop(0, color)
      grad.addColorStop(1, shadeColor(color, -40))
      ctx.fillStyle = grad
      roundRect(ctx, x, y + 10, 40, 55, 6)
      ctx.fill()

      // Hood
      ctx.fillStyle = shadeColor(color, -20)
      roundRect(ctx, x + 5, y, 30, 15, 4)
      ctx.fill()

      // Windows
      ctx.fillStyle = isPlayer ? 'rgba(147,197,253,0.8)' : 'rgba(100,150,200,0.5)'
      roundRect(ctx, x + 6, y + 15, 28, 20, 3)
      ctx.fill()

      // Wheels
      ctx.fillStyle = '#111'
      const wheelPositions = [
        { wx: x - 4, wy: y + 20 }, 
        { wx: x + 36, wy: y + 20 }, 
        { wx: x - 4, wy: y + 48 }, 
        { wx: x + 36, wy: y + 48 }
      ]
      wheelPositions.forEach(w => {
        ctx.beginPath()
        ctx.arc(w.wx + 4, w.wy + 5, 7, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#333'
        ctx.beginPath()
        ctx.arc(w.wx + 4, w.wy + 5, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#111'
      })

      // Player headlights with glow
      if (isPlayer) {
        ctx.shadowBlur = 16
        ctx.shadowColor = '#fde68a'
        ctx.fillStyle = '#fde68a'
        ctx.beginPath()
        ctx.arc(x + 8, y + 2, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x + 32, y + 2, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }
      
      ctx.restore()
    }

    function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
      ctx.beginPath()
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.arcTo(x + w, y, x + w, y + r, r)
      ctx.lineTo(x + w, y + h - r)
      ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
      ctx.lineTo(x + r, y + h)
      ctx.arcTo(x, y + h, x, y + h - r, r)
      ctx.lineTo(x, y + r)
      ctx.arcTo(x, y, x + r, y, r)
      ctx.closePath()
    }

    function shadeColor(color: string, percent: number) {
      const num = parseInt(color.replace('#', ''), 16)
      const r = Math.min(255, Math.max(0, (num >> 16) + percent))
      const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent))
      const b = Math.min(255, Math.max(0, (num & 0xff) + percent))
      return `rgb(${r},${g},${b})`
    }

    function drawHUD() {
      // Score display
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      roundRect(ctx, 10, 10, 120, 36, 6)
      ctx.fill()
      ctx.fillStyle = '#fde68a'
      ctx.font = 'bold 14px monospace'
      ctx.fillText(`SCORE: ${localScore}`, 20, 33)

      // Lives display
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      roundRect(ctx, canvas.width - 100, 10, 90, 36, 6)
      ctx.fill()
      ctx.fillStyle = '#f472b6'
      ctx.font = 'bold 16px monospace'
      ctx.fillText('❤️'.repeat(localLives), canvas.width - 90, 33)

      // Speed indicator
      ctx.fillStyle = 'rgba(0,0,0,0.5)'
      roundRect(ctx, 10, 54, 100, 24, 6)
      ctx.fill()
      ctx.fillStyle = '#6ee7b7'
      ctx.font = '11px monospace'
      ctx.fillText(`SPEED: ${Math.floor(speed * 10)}`, 18, 70)

      // Invincibility indicator
      if (invincible) {
        ctx.fillStyle = '#fbbf24'
        ctx.font = 'bold 12px monospace'
        ctx.fillText('⭐ STAR POWER!', canvas.width / 2 - 55, 25)
      }
    }

    function checkCollision(a: {x:number,y:number,w:number,h:number}, b: {x:number,y:number,w:number,h:number}) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y
    }

    function loop() {
      if (over) return
      frameCount++

      if (pausedRef.current) {
        animId = requestAnimationFrame(loop)
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Screen shake effect on collision
      let sx = 0, sy = 0
      if (shakeTimer > 0) {
        sx = (Math.random() - 0.5) * 8
        sy = (Math.random() - 0.5) * 8
        shakeTimer--
        ctx.save()
        ctx.translate(sx, sy)
      }

      drawRoad()

      // Animate road lines
      lines.forEach(l => {
        l.y += speed * 1.5
        if (l.y > canvas.height) l.y -= canvas.height + 60
      })

      // Smooth car lane switching
      player.x += (targetX.val - player.x) * 0.18

      // Spawn obstacles and powerups
      if (frameCount % Math.max(40, 80 - Math.floor(localScore / 5)) === 0) spawnObstacle()
      if (frameCount % 180 === 0) spawnPowerup()

      // Increase speed based on score
      speed = 4 + localScore * 0.04

      // Update and draw obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].y += speed
        drawCar(obstacles[i].x, obstacles[i].y, obstacles[i].color)

        // Collision detection
        if (!invincible && checkCollision(
          { x: player.x + 4, y: player.y + 4, w: 32, h: 62 },
          { x: obstacles[i].x + 4, y: obstacles[i].y + 4, w: 32, h: 62 }
        )) {
          obstacles.splice(i, 1)
          localLives--
          shakeTimer = 20
          if (localLives <= 0) {
            over = true
            setGameOver(true)
            setHighScore(prev => Math.max(prev, localScore))
            return
          }
          continue
        }
        
        // Remove obstacles that passed
        if (obstacles[i]?.y > canvas.height) {
          obstacles.splice(i, 1)
          localScore++
          setScore(localScore)
        }
      }

      // Update and draw powerups
      for (let i = powerups.length - 1; i >= 0; i--) {
        powerups[i].y += speed * 0.8
        const p = powerups[i]

        // Draw powerup
        ctx.save()
        ctx.font = '28px serif'
        ctx.textAlign = 'center'
        ctx.fillText(p.type === 'heart' ? '❤️' : '⭐', p.x + 20, p.y + 30)
        ctx.restore()

        // Powerup collision
        if (checkCollision(
          { x: player.x + 4, y: player.y + 4, w: 32, h: 62 },
          { x: p.x, y: p.y, w: 40, h: 40 }
        )) {
          powerups.splice(i, 1)
          if (p.type === 'heart') {
            localLives = Math.min(3, localLives + 1)
          } else {
            invincible = true
            invincibleTimer = 180
          }
          continue
        }
        
        if (p.y > canvas.height) powerups.splice(i, 1)
      }

      // Update invincibility timer
      if (invincible) {
        invincibleTimer--
        if (invincibleTimer <= 0) invincible = false
      }

      // Draw player car
      ctx.save()
      if (invincible) {
        ctx.shadowBlur = 20
        ctx.shadowColor = '#fbbf24'
      }
      if (invincible && frameCount % 6 < 3) ctx.globalAlpha = 0.6
      drawCar(player.x, player.y, invincible ? '#fbbf24' : '#6366f1', true)
      ctx.restore()

      drawHUD()
      
      if (shakeTimer > 0) ctx.restore()

      animId = requestAnimationFrame(loop)
    }

    loop()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('touchstart', onTouchStart)
      canvas.removeEventListener('touchend', onTouchEnd)
      pausedRef.current = false
    }
  }, [started, togglePause])

  useEffect(() => {
    if (!started || gameOver) return

    const onFullscreenChange = () => {
      const container = containerRef.current
      setIsFullscreen(Boolean(container && document.fullscreenElement === container))
      if (!document.fullscreenElement && pausedRef.current) {
        // Keep the game paused until the player explicitly resumes.
        setPaused(true)
      }
    }

    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [gameOver, started])

  return (
    <section 
      id="car-game" 
      style={{ 
        background: 'linear-gradient(135deg, #060d1f, #0a1628)', 
        padding: 'clamp(2rem, 4vw, 3rem) 1rem', 
        borderRadius: 'var(--ds-radius-lg)',
        border: '1px solid var(--ds-border)',
        boxSizing: 'border-box',
        maxWidth: '100%',
        overflow: 'clip',
      }}
    >
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h3 
          style={{ 
            color: '#fde68a', 
            fontFamily: 'var(--ds-font-mono)', 
            fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', 
            fontWeight: 800, 
            letterSpacing: '0.05em',
            marginBottom: '0.5rem',
          }}
        >
          🕹️ YOR ROAD RUNNER
        </h3>
        <p 
          style={{ 
            color: 'rgba(253,230,138,0.6)', 
            fontSize: '0.85rem', 
            fontFamily: 'var(--ds-font-mono)',
            marginBottom: '0.25rem',
          }}
        >
          Arrow keys / swipe to switch lanes • Avoid cars • Collect ❤️ & ⭐
        </p>
        {highScore > 0 && (
          <p 
            style={{ 
              color: '#f472b6', 
              fontSize: '0.8rem', 
              fontFamily: 'var(--ds-font-mono)',
            }}
          >
            🏆 HIGH SCORE: {highScore}
          </p>
        )}
      </div>
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          margin: '0 auto',
          width: '100%',
          maxWidth: isFullscreen ? '100dvw' : '420px',
          boxSizing: 'border-box',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: isFullscreen ? '100dvh' : 'auto',
          padding: isFullscreen ? 'max(10px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left))' : 0,
          background: isFullscreen ? 'radial-gradient(circle at center, #101a36 0%, #060d1f 70%)' : 'transparent',
          overflow: 'hidden',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            border: '2px solid rgba(99,102,241,0.4)',
            borderRadius: 'var(--ds-radius-md)',
            boxSizing: 'border-box',
            maxWidth: '100%',
            boxShadow: '0 0 40px rgba(99,102,241,0.2)',
            display: started ? 'block' : 'none',
            width: isFullscreen ? 'min(calc((100dvh - 20px) * 0.75), calc(100dvw - 20px))' : '100%',
            height: isFullscreen ? 'min(calc(100dvh - 20px), calc((100dvw - 20px) / 0.75))' : 'auto',
            objectFit: 'contain',
          }}
        />

        {!started && (
          <div 
            style={{
              width: '100%',
              maxWidth: '420px',
              aspectRatio: '3 / 4',
              minHeight: 0,
              background: 'linear-gradient(135deg, #0a1628, #060d1f)',
              border: '2px solid rgba(99,102,241,0.4)',
              borderRadius: 'var(--ds-radius-md)',
              boxSizing: 'border-box',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '1rem',
              padding: '2rem',
            }}
          >
            <div style={{ fontSize: '5rem' }}>🚗</div>
            <div 
              style={{ 
                color: '#fde68a', 
                fontFamily: 'var(--ds-font-mono)', 
                fontSize: '1.4rem', 
                fontWeight: 800,
                textAlign: 'center',
              }}
            >
              YOR ROAD RUNNER
            </div>
            <div 
              style={{ 
                color: 'rgba(165,180,252,0.7)', 
                fontFamily: 'var(--ds-font-mono)', 
                fontSize: '0.8rem', 
                textAlign: 'center',
              }}
            >
              Dodge traffic on the neon highway.<br/>Collect powerups. Survive longer.
            </div>
            <button
              onClick={startGame}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', 
                border: 'none', 
                borderRadius: 'var(--ds-radius-sm)',
                padding: '0.75rem 2.5rem', 
                fontSize: '1rem',
                fontFamily: 'var(--ds-font-mono)', 
                fontWeight: 700,
                cursor: 'pointer', 
                letterSpacing: '0.05em',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                marginTop: '0.5rem',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.4)'
              }}
            >
              ▶ START GAME
            </button>
          </div>
        )}

        {gameOver && (
          <div 
            style={{
              position: 'absolute', 
              inset: 0,
              background: 'rgba(6,13,31,0.92)',
              backdropFilter: 'blur(8px)',
              borderRadius: 'var(--ds-radius-md)',
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              gap: '1rem',
              padding: '2rem',
            }}
          >
            <div style={{ fontSize: '3.5rem' }}>💥</div>
            <div 
              style={{ 
                color: '#ef4444', 
                fontFamily: 'var(--ds-font-mono)', 
                fontSize: '1.6rem', 
                fontWeight: 800,
              }}
            >
              GAME OVER
            </div>
            <div 
              style={{ 
                color: '#fde68a', 
                fontFamily: 'var(--ds-font-mono)', 
                fontSize: '1rem',
              }}
            >
              Score: {score}
            </div>
            <div 
              style={{ 
                color: '#f472b6', 
                fontFamily: 'var(--ds-font-mono)', 
                fontSize: '0.9rem',
              }}
            >
              High Score: {highScore}
            </div>
            <button
              onClick={startGame}
              style={{
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                color: 'white', 
                border: 'none', 
                borderRadius: 'var(--ds-radius-sm)',
                padding: '0.75rem 2.5rem', 
                fontSize: '1rem',
                fontFamily: 'var(--ds-font-mono)', 
                fontWeight: 700,
                cursor: 'pointer', 
                letterSpacing: '0.05em',
                boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                marginTop: '0.5rem',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.6)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.4)'
              }}
            >
              🔄 RETRY
            </button>
          </div>
        )}

        {started && !gameOver && paused && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(6,13,31,0.88)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--ds-radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '1rem',
              padding: '1rem',
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button
                onClick={fullscreenAndResume}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                  color: '#0a1628',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.55rem 1rem',
                  fontSize: '0.78rem',
                  fontFamily: 'var(--ds-font-mono)',
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  boxShadow: '0 0 18px rgba(249,115,22,0.35)',
                }}
              >
                ⤢ FULL SCREEN PLAY
              </button>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.9rem' }}>
              <div style={{ fontSize: '3.5rem' }}>⏸️</div>
              <div
                style={{
                  color: '#fde68a',
                  fontFamily: 'var(--ds-font-mono)',
                  fontSize: '1.5rem',
                  fontWeight: 800,
                  letterSpacing: '0.06em',
                }}
              >
                GAME PAUSED
              </div>
              <div
                style={{
                  color: 'rgba(165,180,252,0.75)',
                  fontFamily: 'var(--ds-font-mono)',
                  fontSize: '0.82rem',
                  textAlign: 'center',
                  lineHeight: 1.7,
                }}
              >
                Press ESC to resume or use the fullscreen play button above.
              </div>
              <button
                onClick={resumeGame}
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--ds-radius-sm)',
                  padding: '0.75rem 2.5rem',
                  fontSize: '1rem',
                  fontFamily: 'var(--ds-font-mono)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  boxShadow: '0 0 20px rgba(99,102,241,0.4)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(99,102,241,0.6)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 0 20px rgba(99,102,241,0.4)'
                }}
              >
                ▶ RESUME
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
