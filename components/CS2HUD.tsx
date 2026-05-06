"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

// ─── Real data from csstats.gg — Premier S4 only ──────────────────────────
const PLAYER_DATA = {
  name: "YOR AYRIN - IWNL",
  alias: "YorAyriniwnl",
  country: "IN",
  steamLevel: 125,

  // Premier S4 rank (csstats.gg screenshot, excluding Faceit + old seasons)
  rank: "24,436",
  rankSub: "PREMIER S4 · BEST 24,999",
  rankWins: "129 WINS",

  // K/D → real CS2 Premier 5v5 K/D (csstats.gg)
  kd: { label: "K/D", sub: "PREMIER 5V5 · CS2", value: "1.0", fill: 0.5 },

  // HLTV Rating slot (csstats.gg)
  adr: { label: "HLTV RATING", sub: "PREMIER 5V5 · CS2", value: "1.09", fill: 0.545 },

  // Wingman ranks (Steam profile)
  hs: { label: "WINGMAN (CURRENT)", sub: "SEASON 03 · CS2", value: "SMFC", fill: 0.82 },

  // Footer extras
  wingmanBest: "GLOBAL ELITE",
  wingmanBestSeason: "S2",
  wingmanCurrent: "SMFC",
  wingmanCurrentSeason: "S3",
  eDPI: "1000",
};

// ─── SVG rank badge ────────────────────────────────────────────────────────
function PremierBadge() {
  // Premier S4 shield icon in CS2 gold/purple palette
  return (
    <svg width="36" height="38" viewBox="0 0 36 38" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="CS2 Premier rank badge">
      {/* Shield outline */}
      <path d="M18 2 L33 8 L33 20 Q33 30 18 36 Q3 30 3 20 L3 8 Z" fill="rgba(138,43,226,0.25)" stroke="#c9aa4c" strokeWidth="1.4" />
      {/* Inner shield line */}
      <path d="M18 5 L30 10 L30 20 Q30 28 18 33 Q6 28 6 20 L6 10 Z" fill="none" stroke="rgba(201,170,76,0.4)" strokeWidth="0.5" />
      {/* Star */}
      <polygon points="18,10 19.8,15.5 25.5,15.5 21,19 22.8,24.5 18,21 13.2,24.5 15,19 10.5,15.5 16.2,15.5" fill="#c9aa4c" stroke="#ffd700" strokeWidth="0.5" />
    </svg>
  );
}

// ─── Scanline effect ───────────────────────────────────────────────────────
function Scanlines() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        background:
          "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.025) 2px, rgba(0,255,65,0.025) 4px)",
        pointerEvents: "none",
        borderRadius: "inherit",
      }}
    />
  );
}

// ─── Player Card (top-left) ────────────────────────────────────────────────
function PlayerCard({ inline = false }: { inline?: boolean }) {
  const [tick, setTick] = useState(true);

  // Blinking cursor every 800ms
  useEffect(() => {
    const id = setInterval(() => setTick((t) => !t), 800);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -24, y: -8 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      style={{
        position: inline ? "relative" : "fixed",
        top: inline ? "auto" : "5.5rem",       // below the site header
        left: inline ? "auto" : "1.25rem",
        zIndex: inline ? 2 : 9999,
        width: inline ? "100%" : "auto",
        maxWidth: inline ? "420px" : "none",
        fontFamily: "'Courier New', 'Lucida Console', monospace",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        userSelect: "none",
        pointerEvents: "none",
        margin: inline ? "0 auto" : 0,
      }}
    >
      {/* Main panel */}
      <div
        style={{
          background: "rgba(0,0,0,0.82)",
          border: "1px solid rgba(255,255,255,0.18)",
          borderLeft: "2px solid #00ff41",
          padding: "0.75rem 1rem",
          minWidth: "210px",
          position: "relative",
          overflow: "hidden",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          boxShadow: "0 0 18px rgba(0,255,65,0.12), inset 0 0 40px rgba(0,0,0,0.4)",
        }}
      >
        <Scanlines />

        {/* Corner decorators */}
        <span style={{ position:"absolute", top:0, left:0, width:6, height:6, borderTop:"1px solid #00ff41", borderLeft:"1px solid #00ff41" }} />
        <span style={{ position:"absolute", top:0, right:0, width:6, height:6, borderTop:"1px solid #00ff41", borderRight:"1px solid #00ff41" }} />
        <span style={{ position:"absolute", bottom:0, left:0, width:6, height:6, borderBottom:"1px solid #00ff41", borderLeft:"1px solid #00ff41" }} />
        <span style={{ position:"absolute", bottom:0, right:0, width:6, height:6, borderBottom:"1px solid #00ff41", borderRight:"1px solid #00ff41" }} />

        {/* Header bar */}
        <div style={{
          borderBottom: "1px solid rgba(0,255,65,0.25)",
          paddingBottom: "0.45rem",
          marginBottom: "0.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
        }}>
          {/* Alive indicator */}
          <span style={{
            display:"inline-block", width:6, height:6,
            borderRadius:"50%", background:"#00ff41",
            boxShadow:"0 0 6px #00ff41",
            animation: "cs2pulse 1.8s ease-in-out infinite",
          }} />
          <span style={{ fontSize:"0.58rem", color:"rgba(255,255,255,0.45)", letterSpacing:"0.18em" }}>
            CS2 — PREMIER S4
          </span>
        </div>

        {/* Rank row */}
        <div style={{ display:"flex", alignItems:"center", gap:"0.6rem", marginBottom:"0.55rem" }}>
          <PremierBadge />
          <div>
            <div style={{ fontSize:"0.52rem", color:"rgba(255,255,255,0.35)", marginBottom:"1px", letterSpacing:"0.18em" }}>PREMIER RATING</div>
            <div style={{ fontSize:"0.88rem", color:"#c9aa4c", fontWeight:700, letterSpacing:"0.06em", textShadow:"0 0 10px rgba(201,170,76,0.5)", lineHeight:1 }}>
              {PLAYER_DATA.rank}
            </div>
            <div style={{ fontSize:"0.46rem", color:"rgba(201,170,76,0.45)", letterSpacing:"0.1em", marginTop:"2px" }}>{PLAYER_DATA.rankSub}</div>
            <div style={{ fontSize:"0.46rem", color:"rgba(0,255,65,0.5)", letterSpacing:"0.1em", marginTop:"1px" }}>{PLAYER_DATA.rankWins}</div>
          </div>
        </div>

        {/* Player name */}
        <div style={{ marginBottom:"0.65rem" }}>
          <div style={{ fontSize:"0.52rem", color:"rgba(255,255,255,0.35)", marginBottom:"2px", letterSpacing:"0.2em" }}>PLAYER</div>
          <div style={{ fontSize:"0.82rem", color:"#fff", fontWeight:700, letterSpacing:"0.1em", textShadow:"0 0 8px rgba(255,255,255,0.3)" }}>
            {PLAYER_DATA.name}
            <span style={{ opacity: tick ? 1 : 0, color:"#00ff41", marginLeft:"2px" }}>_</span>
          </div>
          <div style={{ fontSize:"0.52rem", color:"rgba(0,255,65,0.6)", marginTop:"1px" }}>
            steam/{PLAYER_DATA.alias}
          </div>
        </div>

        {/* Divider */}
        <div style={{ height:"1px", background:"linear-gradient(90deg, #00ff41 0%, transparent 100%)", marginBottom:"0.6rem", opacity:0.4 }} />

        {/* Stats grid */}
        <div style={{ display:"flex", flexDirection:"column", gap:"0.35rem" }}>
          <StatRow
            label={PLAYER_DATA.kd.label}
            raw={PLAYER_DATA.kd.sub}
            value={PLAYER_DATA.kd.value}
            color="#00ff41"
            fill={PLAYER_DATA.kd.fill}
          />
          <StatRow
            label={PLAYER_DATA.adr.label}
            raw={PLAYER_DATA.adr.sub}
            value={PLAYER_DATA.adr.value}
            color="#4fc3f7"
            fill={PLAYER_DATA.adr.fill}
          />
          <StatRow
            label={PLAYER_DATA.hs.label}
            raw={PLAYER_DATA.hs.sub}
            value={PLAYER_DATA.hs.value}
            color="#c9aa4c"
            fill={PLAYER_DATA.hs.fill}
            isText
          />
        </div>

        {/* Footer — wingman rank history */}
        <div style={{ marginTop:"0.6rem", borderTop:"1px solid rgba(255,255,255,0.08)", paddingTop:"0.4rem" }}>
          <div style={{ fontSize:"0.46rem", color:"rgba(255,255,255,0.28)", letterSpacing:"0.12em", marginBottom:"3px" }}>WINGMAN BEST RANK</div>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <span style={{ fontSize:"0.52rem", color:"#c9aa4c", letterSpacing:"0.08em", fontWeight:700 }}>{PLAYER_DATA.wingmanBest}</span>
              <span style={{ fontSize:"0.44rem", color:"rgba(201,170,76,0.5)", letterSpacing:"0.08em", marginLeft:"4px" }}>({PLAYER_DATA.wingmanBestSeason})</span>
            </div>
            <span style={{ fontSize:"0.48rem", color:"rgba(255,255,255,0.25)", letterSpacing:"0.08em" }}>eDPI {PLAYER_DATA.eDPI}</span>
          </div>
        </div>
      </div>

      {/* Keyframe for pulse */}
      <style>{`
        @keyframes cs2pulse {
          0%, 100% { opacity:1; box-shadow: 0 0 6px #00ff41; }
          50% { opacity:0.4; box-shadow: 0 0 2px #00ff41; }
        }
      `}</style>
    </motion.div>
  );
}

function StatRow({ label, raw, value, color, fill, isText }: { label:string; raw:string; value:string; color:string; fill:number; isText?:boolean }) {
  return (
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"baseline", marginBottom:"2px" }}>
        <div>
          <span style={{ fontSize:"0.55rem", color:"rgba(255,255,255,0.55)", letterSpacing:"0.14em" }}>{label} </span>
          <span style={{ fontSize:"0.44rem", color:"rgba(255,255,255,0.28)", letterSpacing:"0.08em" }}>({raw})</span>
        </div>
        <span style={{ fontSize: isText ? "0.6rem" : "0.65rem", color, fontWeight:700, textShadow:`0 0 8px ${color}80`, letterSpacing: isText ? "0.06em" : "0" }}>{value}</span>
      </div>
      {/* Thin progress bar */}
      <div style={{ height:"2px", background:"rgba(255,255,255,0.07)", borderRadius:1 }}>
        <motion.div
          initial={{ width:0 }}
          animate={{ width: isText ? "100%" : `${Math.min(fill * 100, 100)}%` }}
          transition={{ duration:1.2, ease:"easeOut", delay:0.8 }}
          style={{ height:"100%", background: isText ? `linear-gradient(90deg, ${color}, transparent)` : color, borderRadius:1, boxShadow: isText ? "none" : `0 0 6px ${color}` }}
        />
      </div>
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────
export default function CS2HUD({ inline = false }: { inline?: boolean }) {
  return (
    <>
      <PlayerCard inline={inline} />
    </>
  );
}
