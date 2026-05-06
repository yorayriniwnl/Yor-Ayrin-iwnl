'use client'

/**
 * GlobalStyles
 *
 * Holds the entire `<style jsx global>` block for the homepage.
 * Kept as a client component because styled-jsx global injection
 * requires a client boundary in Next.js 14 App Router.
 *
 * Zero logic here — only the verbatim CSS from the original HomeClient.tsx.
 */
export default function GlobalStyles() {
  return (
    <style jsx global>{`
      :root {
        --bg: #0a0906;
        --bg2: #111009;
        --surface: #1a1710;
        --surface2: #252118;
        --gold: #c9a84c;
        --gold-light: #e8c96e;
        --gold-dim: #7a6228;
        --cream: #f0e8d8;
        --cream-dim: #a89878;
        --red: #c04a3a;
        --teal: #3a8a7c;
        --blue: #4a6a9a;
        --text: #ddd5c0;
        --text-dim: #7a7060;
        --border: #2a2520;
      }

      [data-theme='light'] {
        --bg: #f6f0e4;
        --bg2: #ece2cf;
        --surface: #f4ead8;
        --surface2: #e8dbc2;
        --gold: #9a6f11;
        --gold-light: #b8891f;
        --gold-dim: #7d5b14;
        --cream: #1e1a12;
        --cream-dim: #4b4336;
        --red: #a3483b;
        --teal: #2f7267;
        --blue: #3e5f8e;
        --text: #2a2317;
        --text-dim: #6a604f;
        --border: #d8c7a9;
      }

      *,
      *::before,
      *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        background: var(--bg);
        color: var(--text);
        font-family: var(--ds-font-body, 'DM Sans', ui-sans-serif, system-ui, -apple-system, sans-serif);
        font-weight: 300;
        line-height: 1.7;
        overflow-x: hidden;
      }

      body::before {
        content: '';
        position: fixed;
        inset: 0;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
        pointer-events: none;
        z-index: 1000;
        opacity: 0.35;
      }

      [data-theme='light'] body::before {
        opacity: 0.16;
      }

      .view-all,
      .link-pill,
      .hero-cta,
      .contact-link-row,
      .footer-links a,
      .proj-link {
        text-decoration: none;
      }

      .hero {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 0 3.5rem 5rem;
        position: relative;
        overflow: hidden;
      }

      .hero-bg {
        position: absolute;
        inset: 0;
        background:
          radial-gradient(ellipse 60% 70% at 75% 40%, rgba(201,168,76,0.07) 0%, transparent 60%),
          radial-gradient(ellipse 40% 50% at 20% 80%, rgba(58,138,124,0.05) 0%, transparent 55%),
          linear-gradient(160deg, #0d0b08 0%, #0a0906 60%, #0f0d0a 100%);
      }

      [data-theme='light'] .hero-bg {
        background:
          radial-gradient(ellipse 60% 70% at 75% 40%, rgba(154,111,17,0.10) 0%, transparent 62%),
          radial-gradient(ellipse 40% 50% at 20% 80%, rgba(47,114,103,0.08) 0%, transparent 58%),
          linear-gradient(160deg, #f4ecdc 0%, #f6f0e4 60%, #efe4d1 100%);
      }

      .hero-line {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 1px;
        background: linear-gradient(to bottom, transparent, var(--border), transparent);
        animation: lineFade 3s ease-in-out infinite alternate;
      }

      .hero-line:nth-child(2) {
        left: 33.3%;
      }

      .hero-line:nth-child(3) {
        left: 66.6%;
        animation-delay: 1.5s;
      }

      @keyframes lineFade {
        from { opacity: 0.3; }
        to { opacity: 0.8; }
      }

      .hero-issue {
        font-family: 'DM Mono', monospace;
        font-size: 0.65rem;
        letter-spacing: 0.3em;
        color: var(--gold-dim);
        text-transform: uppercase;
        margin-bottom: 1.8rem;
        animation: fadeUp 1s ease both;
        position: relative;
        z-index: 1;
      }

      .hero-title {
        font-family: var(--ds-font-display, 'Playfair Display', Georgia, serif);
        font-size: clamp(4rem, 10vw, 9.5rem);
        font-weight: 900;
        line-height: 0.9;
        color: var(--cream);
        letter-spacing: -0.02em;
        max-width: 900px;
        animation: fadeUp 1s 0.15s ease both;
        position: relative;
        z-index: 1;
      }

      .hero-title em,
      .about-heading em,
      .projects-title em,
      .feature-title em,
      .skills-heading em,
      .exp-heading em,
      .blog-title em,
      .contact-heading em {
        font-style: italic;
        color: var(--gold);
      }

      .hero-sub {
        display: flex;
        align-items: flex-end;
        gap: 3rem;
        margin-top: 2.5rem;
        animation: fadeUp 1s 0.3s ease both;
        position: relative;
        z-index: 1;
      }

      .hero-desc,
      .about-body p,
      .skills-desc p,
      .exp-summary,
      .blog-excerpt,
      .contact-desc {
        color: var(--cream-dim);
        line-height: 1.9;
      }

      .hero-desc {
        max-width: 380px;
        font-size: 0.9rem;
      }

      .hero-links {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
      }

      .hero-cta {
        display: inline-flex;
        align-items: center;
        gap: 1rem;
        padding: 0.9rem 2rem;
        border: 1px solid var(--gold);
        color: var(--gold);
        font-family: 'DM Mono', monospace;
        font-size: 0.7rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        transition: background 0.3s, color 0.3s;
        white-space: nowrap;
      }

      .hero-cta:hover {
        background: var(--gold);
        color: var(--bg);
      }

      .hero-cta svg,
      .contact-link-arrow {
        transition: transform 0.3s;
      }

      .hero-cta:hover svg,
      .contact-link-row:hover .contact-link-arrow {
        transform: translateX(4px);
      }

      .hero-cta.secondary {
        border-color: var(--border);
        color: var(--cream-dim);
      }

      .hero-cta.secondary:hover {
        background: var(--surface);
        color: var(--cream);
      }

      .scroll-hint {
        position: absolute;
        bottom: 2.5rem;
        right: 3.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        font-family: 'DM Mono', monospace;
        font-size: 0.6rem;
        letter-spacing: 0.3em;
        color: var(--text-dim);
        text-transform: uppercase;
        animation: fadeUp 1s 0.5s ease both;
        z-index: 1;
      }

      .scroll-hint .line {
        width: 1px;
        height: 60px;
        background: linear-gradient(to bottom, var(--gold-dim), transparent);
        animation: scrollPulse 2s ease-in-out infinite;
      }

      @keyframes scrollPulse {
        0%, 100% { opacity: 0.3; transform: scaleY(1); }
        50% { opacity: 1; transform: scaleY(0.6); }
      }

      @keyframes fadeUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .ticker {
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
        padding: 0.75rem 0;
        overflow: hidden;
        background: var(--bg2);
      }

      .ticker-track {
        display: flex;
        width: max-content;
        animation: ticker 30s linear infinite;
      }

      .ticker-item {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        padding: 0 2rem;
        font-family: 'DM Mono', monospace;
        font-size: 0.68rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--text-dim);
        white-space: nowrap;
      }

      .ticker-dot {
        width: 4px;
        height: 4px;
        background: var(--gold);
        border-radius: 50%;
        flex-shrink: 0;
      }

      @keyframes ticker {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }

      .section-wrap {
        max-width: 1300px;
        margin: 0 auto;
        padding: 0 3.5rem;
      }

      .section-label {
        font-family: 'DM Mono', monospace;
        font-size: 0.65rem;
        letter-spacing: 0.35em;
        color: var(--gold);
        text-transform: uppercase;
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2.5rem;
      }

      .section-label::before {
        content: '';
        width: 40px;
        height: 1px;
        background: var(--gold);
      }

      .about,
      .experience,
      .contact {
        padding: 9rem 0;
      }

      .projects,
      .blog {
        padding: 5rem 0 9rem;
      }

      .feature-layer {
        padding: 6rem 0 8rem;
        background:
          linear-gradient(135deg, rgba(58,138,124,0.08), transparent 36%),
          linear-gradient(315deg, rgba(74,106,154,0.08), transparent 40%),
          var(--bg);
        border-top: 1px solid var(--border);
      }

      .skills {
        padding: 7rem 0;
        background: var(--bg2);
        border-top: 1px solid var(--border);
        border-bottom: 1px solid var(--border);
      }

      .about-inner,
      .skills-inner,
      .exp-inner,
      .contact-inner {
        display: grid;
        gap: 6rem;
        align-items: start;
      }

      .about-inner,
      .contact-inner {
        grid-template-columns: 1fr 1fr;
      }

      .skills-inner {
        grid-template-columns: 1fr 1.4fr;
      }

      .exp-inner {
        grid-template-columns: 1fr 1.6fr;
      }

      .about-heading,
      .skills-heading,
      .exp-heading,
      .contact-heading,
      .projects-title,
      .feature-title,
      .blog-title {
        font-family: var(--ds-font-display, 'Playfair Display', Georgia, serif);
        line-height: 1.1;
        color: var(--cream);
        letter-spacing: -0.02em;
      }

      .about-heading {
        font-size: clamp(2.2rem, 4.5vw, 4rem);
        font-weight: 700;
        margin-bottom: 2rem;
      }

      .about-stats {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        background: var(--border);
        margin-top: 3rem;
        border: 1px solid var(--border);
      }

      .stat {
        background: var(--bg);
        padding: 1.5rem;
      }

      .stat-num {
        font-family: var(--ds-font-display, 'Playfair Display', Georgia, serif);
        font-size: 2.5rem;
        font-weight: 900;
        color: var(--gold);
        line-height: 1;
      }

      .stat-label {
        font-family: 'DM Mono', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--text-dim);
        margin-top: 0.4rem;
      }

      .about-body p,
      .skills-desc p,
      .contact-desc,
      .exp-summary,
      .blog-excerpt {
        font-size: 0.95rem;
      }

      .about-body p {
        font-size: 0.97rem;
        margin-bottom: 1.5rem;
      }

      .about-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.8rem;
        margin-top: 2rem;
      }

      .link-pill,
      .view-all,
      .proj-link,
      .footer-links a,
      .contact-link-row,
      .blog-card,
      .project-card {
        transition: color 0.3s, background 0.3s, border-color 0.3s;
      }

      .link-pill {
        font-family: 'DM Mono', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--gold-dim);
        border: 1px solid var(--border);
        padding: 0.4rem 0.9rem;
      }

      .link-pill:hover {
        border-color: var(--gold);
        color: var(--gold);
      }

      .projects-header,
      .feature-header,
      .blog-header {
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
        margin-bottom: 4rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--border);
      }

      .projects-title,
      .feature-title,
      .blog-title {
        font-size: clamp(2rem, 4vw, 3.2rem);
        font-weight: 700;
      }

      .view-all {
        font-family: 'DM Mono', monospace;
        font-size: 0.68rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--gold-dim);
      }

      .view-all:hover,
      .proj-link:hover,
      .footer-links a:hover {
        color: var(--gold);
      }

      .projects-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1px;
        background: var(--border);
        border: 1px solid var(--border);
      }

      .feature-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 1px;
        background: var(--border);
        border: 1px solid var(--border);
      }

      .blog-grid {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-auto-flow: dense;
        grid-auto-rows: minmax(240px, auto);
        gap: 1px;
        background: var(--border);
        border: 1px solid var(--border);
      }

      .project-card,
      .feature-card,
      .blog-card {
        background: var(--bg);
        padding: 2.5rem;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        min-height: 100%;
      }

      .project-card {
        aspect-ratio: 1 / 1;
      }

      .project-card::before,
      .feature-card::before,
      .blog-card::before {
        content: '';
        position: absolute;
        inset: 0;
        background: linear-gradient(135deg, rgba(201,168,76,0.04) 0%, transparent 60%);
        opacity: 0;
        transition: opacity 0.4s;
      }

      .project-card:hover,
      .feature-card:hover,
      .blog-card:hover {
        background: var(--surface);
      }

      .project-card:hover::before,
      .feature-card:hover::before,
      .blog-card:hover::before {
        opacity: 1;
      }

      .feature-card {
        min-height: 260px;
        text-decoration: none;
        color: inherit;
        border-color: rgba(58,138,124,0.18);
        background:
          radial-gradient(circle at top right, rgba(58,138,124,0.10), transparent 38%),
          linear-gradient(180deg, rgba(17,16,9,0.96), rgba(9,8,6,0.98));
      }

      .feature-card:hover {
        border-color: rgba(58,138,124,0.35);
        background:
          radial-gradient(circle at top right, rgba(58,138,124,0.16), transparent 38%),
          linear-gradient(180deg, rgba(18,18,12,0.98), rgba(10,9,7,0.99));
      }

      .feature-card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
      }

      .feature-eyebrow,
      .feature-status,
      .feature-card-link {
        font-family: 'DM Mono', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.18em;
        text-transform: uppercase;
      }

      .feature-eyebrow {
        color: var(--teal);
      }

      .feature-status {
        color: var(--blue);
        border: 1px solid rgba(74,106,154,0.45);
        padding: 0.25rem 0.55rem;
        white-space: nowrap;
      }

      .feature-card-title {
        font-family: var(--ds-font-display, 'Playfair Display', Georgia, serif);
        font-size: 1.35rem;
        font-weight: 700;
        line-height: 1.2;
        color: var(--cream);
        margin-bottom: 1rem;
      }

      .feature-card-summary {
        color: var(--cream-dim);
        font-size: 0.92rem;
        line-height: 1.8;
        margin-bottom: 2rem;
      }

      .feature-card-link {
        color: var(--gold-dim);
        margin-top: auto;
        transition: color 0.3s;
      }

      .feature-card:hover .feature-card-link,
      .feature-card:hover .feature-card-title {
        color: var(--gold-light);
      }

      .project-card.featured,
      .blog-card.featured {
        grid-column: span 2;
        grid-row: span 2;
      }

      .project-card.featured {
        grid-column: span 1;
        grid-row: span 1;
      }

      .project-card {
        background:
          radial-gradient(circle at top left, rgba(201,168,76,0.08), transparent 42%),
          linear-gradient(180deg, rgba(17,16,9,0.96), rgba(9,8,6,0.98));
        border-color: rgba(201,168,76,0.12);
        box-shadow:
          0 0 0 1px rgba(255,255,255,0.03) inset,
          0 28px 60px rgba(0,0,0,0.35);
      }

      .project-card:hover {
        border-color: rgba(201,168,76,0.28);
        background:
          radial-gradient(circle at top left, rgba(201,168,76,0.14), transparent 42%),
          linear-gradient(180deg, rgba(19,17,10,0.98), rgba(12,10,7,0.99));
        box-shadow:
          0 0 0 1px rgba(201,168,76,0.09) inset,
          0 34px 70px rgba(0,0,0,0.44),
          0 0 48px rgba(201,168,76,0.06);
      }

      .proj-badge,
      .blog-cat {
        font-family: 'DM Mono', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        padding: 0.3rem 0.7rem;
        border: 1px solid currentColor;
        display: inline-block;
        margin-bottom: 1.5rem;
      }

      .badge-premium {
        color: #f3dfad;
        border-color: rgba(201,168,76,0.42);
        background: linear-gradient(180deg, rgba(201,168,76,0.10), rgba(201,168,76,0.04));
        box-shadow: 0 0 0 1px rgba(201,168,76,0.06) inset;
      }
      .badge-ai {
        color: #b8d4f8;
        border-color: rgba(122,122,200,0.38);
        background: rgba(122,122,200,0.07);
      }
      .badge-systems {
        color: #a8c4a8;
        border-color: rgba(122,154,122,0.38);
        background: rgba(122,154,122,0.07);
      }
      .badge-python {
        color: #f3dfad;
        border-color: rgba(201,168,76,0.30);
        background: rgba(201,168,76,0.06);
      }
      .badge-web {
        color: #f0c4a8;
        border-color: rgba(192,120,74,0.36);
        background: rgba(192,120,74,0.06);
      }
      .badge-3d {
        color: #c8b4e8;
        border-color: rgba(160,120,200,0.36);
        background: rgba(160,120,200,0.06);
      }
      .badge-github {
        color: #b8b8b8;
        border-color: rgba(180,180,180,0.28);
        background: rgba(180,180,180,0.05);
      }
      .badge-other {
        color: var(--cream-dim);
        border-color: rgba(168,152,120,0.28);
        background: transparent;
      }
      .cat-life { color: var(--gold-dim); }
      .cat-personal { color: #7a9a7a; }
      .cat-real { color: var(--red); }
      .cat-thoughts { color: #7a7aaa; }

      .proj-title,
      .blog-post-title {
        font-family: var(--ds-font-display, 'Playfair Display', Georgia, serif);
        font-weight: 700;
        color: var(--cream);
        line-height: 1.2;
        margin-bottom: 1rem;
      }

      .project-card.featured .proj-title,
      .blog-card.featured .blog-post-title {
        font-size: clamp(1.5rem, 2.5vw, 2.2rem);
      }

      .project-card .proj-title {
        font-size: 1.1rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }

      .project-card.featured .proj-title {
        font-size: 1.1rem;
      }

      .project-card:not(.featured) .proj-title,
      .blog-card:not(.featured) .blog-post-title {
        font-size: 1.1rem;
      }

      .project-card:hover .proj-title,
      .blog-card:hover .blog-post-title {
        color: var(--gold-light);
      }

      .proj-excerpt,
      .blog-excerpt {
        margin-bottom: 1.5rem;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
      }

      .project-card .proj-excerpt {
        -webkit-line-clamp: 3;
      }

      .proj-tech {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        margin-bottom: 1.5rem;
      }

      .tech-tag {
        font-family: 'DM Mono', monospace;
        font-size: 0.58rem;
        letter-spacing: 0.1em;
        color: var(--text-dim);
        background: var(--surface2);
        padding: 0.2rem 0.5rem;
        border: 1px solid var(--border);
      }

      .proj-meta,
      .blog-meta {
        display: flex;
        align-items: center;
        gap: 1.2rem;
        margin-top: auto;
      }

      .proj-date,
      .blog-date,
      .blog-read,
      .exp-date,
      .footer-copy,
      .form-note,
      .skill-val {
        font-family: 'DM Mono', monospace;
        letter-spacing: 0.15em;
        color: var(--text-dim);
      }

      .proj-date,
      .blog-date,
      .blog-read,
      .exp-date,
      .form-note,
      .skill-val {
        font-size: 0.62rem;
      }

      .proj-link {
        font-family: 'DM Mono', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.15em;
        color: var(--gold-dim);
      }

      .proj-number,
      .blog-number {
        position: absolute;
        bottom: 1.5rem;
        right: 2rem;
        font-family: var(--ds-font-display, 'Playfair Display', Georgia, serif);
        font-size: 5rem;
        font-weight: 900;
        color: var(--surface2);
        line-height: 1;
        pointer-events: none;
        transition: color 0.3s;
      }

      .project-card:hover .proj-number,
      .blog-card:hover .blog-number {
        color: rgba(201,168,76,0.08);
      }

      .skills-categories {
        display: flex;
        flex-direction: column;
        gap: 2.5rem;
      }

      .skill-category-title {
        font-family: 'DM Mono', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: var(--gold);
        margin-bottom: 1.2rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid var(--border);
      }

      .skill-bar-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 0.8rem;
      }

      .skill-name {
        font-family: 'DM Mono', monospace;
        font-size: 0.68rem;
        letter-spacing: 0.1em;
        color: var(--cream-dim);
        width: 120px;
        flex-shrink: 0;
      }

      .skill-track {
        flex: 1;
        height: 2px;
        background: var(--border);
        position: relative;
        overflow: hidden;
      }

      .skill-fill {
        height: 100%;
        background: linear-gradient(to right, var(--gold-dim), var(--gold));
        transform-origin: left;
        transform: scaleX(0);
        transition: transform 1s cubic-bezier(.16,1,.3,1);
      }

      .skill-fill.animate {
        transform: scaleX(1);
      }

      .skills-heading {
        font-size: clamp(2rem, 3.5vw, 3rem);
        font-weight: 700;
        margin-bottom: 2rem;
      }

      .exp-heading,
      .contact-heading {
        font-size: clamp(2.2rem, 4vw, 3.8rem);
        font-weight: 700;
      }

      .exp-list {
        display: flex;
        flex-direction: column;
        gap: 1px;
        background: var(--border);
        border: 1px solid var(--border);
      }

      .exp-item {
        background: var(--bg);
        padding: 2rem 2.5rem;
        position: relative;
      }

      .exp-item:hover {
        background: var(--surface);
      }

      .exp-item-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 0.8rem;
      }

      .exp-title {
        font-family: var(--ds-font-display, 'Playfair Display', Georgia, serif);
        font-size: 1.1rem;
        font-weight: 700;
        color: var(--cream);
      }

      .exp-meta {
        font-family: 'DM Mono', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: var(--gold-dim);
        margin-bottom: 0.8rem;
      }

      .exp-bullets {
        list-style: none;
      }

      .exp-bullets li {
        font-size: 0.85rem;
        color: var(--text-dim);
        padding-left: 1.2rem;
        position: relative;
        margin-bottom: 0.4rem;
        line-height: 1.7;
      }

      .exp-bullets li::before {
        content: '-';
        position: absolute;
        left: 0;
        color: var(--gold-dim);
        font-size: 0.7rem;
      }

      .exp-kind {
        display: inline-block;
        font-family: 'DM Mono', monospace;
        font-size: 0.55rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        padding: 0.2rem 0.6rem;
        border: 1px solid;
        margin-top: 1rem;
      }

      .kind-verified { color: var(--teal); border-color: var(--teal); }
      .kind-placeholder { color: var(--text-dim); border-color: var(--border); }
      .kind-education { color: var(--blue); border-color: var(--blue); }

      .blog {
        background: var(--bg2);
        border-top: 1px solid var(--border);
      }

      .contact-links {
        display: flex;
        flex-direction: column;
        gap: 1px;
        background: var(--border);
        border: 1px solid var(--border);
        margin-bottom: 2.5rem;
      }

      .contact-link-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        background: var(--bg);
        padding: 1.2rem 1.5rem;
        gap: 1rem;
      }

      .contact-link-row:hover {
        background: var(--surface);
      }

      .contact-link-label {
        font-family: 'DM Mono', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--text-dim);
        width: 80px;
        flex-shrink: 0;
      }

      .contact-link-val {
        font-size: 0.88rem;
        color: var(--cream-dim);
        flex: 1;
        min-width: 0;
        overflow-wrap: anywhere;
        transition: color 0.3s;
      }

      .contact-link-arrow {
        margin-left: auto;
        white-space: nowrap;
      }

      .contact-link-row:hover .contact-link-val {
        color: var(--gold);
      }

      .contact-form {
        background: var(--surface);
        border: 1px solid var(--border);
      }

      .contact-form-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--border);
        background: var(--surface2);
      }

      .contact-form-title {
        font-family: 'DM Mono', monospace;
        font-size: 0.62rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--text-dim);
      }

      .form-dots {
        display: flex;
        gap: 0.4rem;
      }

      .form-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--border);
      }

      .form-field {
        border-bottom: 1px solid var(--border);
      }

      .form-field label {
        display: block;
        font-family: 'DM Mono', monospace;
        font-size: 0.58rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--text-dim);
        padding: 0.8rem 1.5rem 0.2rem;
      }

      .form-field input,
      .form-field textarea {
        width: 100%;
        background: none;
        border: none;
        outline: none;
        padding: 0.4rem 1.5rem 0.8rem;
        color: var(--cream);
        font: inherit;
        font-size: 0.9rem;
        resize: none;
      }

      .form-field textarea {
        min-height: 120px;
      }

      .form-field input::placeholder,
      .form-field textarea::placeholder {
        color: var(--surface2);
      }

      .form-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 0.9rem;
        padding: 1rem 1.5rem;
        background: var(--surface2);
      }

      .btn-send {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.7rem;
        padding: 0.7rem 1.6rem;
        background: var(--gold);
        color: var(--bg);
        border: none;
        font-family: 'DM Mono', monospace;
        font-size: 0.68rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.3s, transform 0.2s;
      }

      .btn-send:hover {
        background: var(--gold-light);
        transform: translateY(-1px);
      }

      footer {
        border-top: 1px solid var(--border);
        padding: 4rem 3.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2rem;
      }

      .footer-brand {
        font-family: var(--ds-font-display, 'Playfair Display', Georgia, serif);
        font-size: 1.8rem;
        font-weight: 900;
        font-style: italic;
        color: var(--gold);
      }

      .footer-links {
        display: flex;
        gap: 2rem;
      }

      .footer-links a {
        font-family: 'DM Mono', monospace;
        font-size: 0.65rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: var(--text-dim);
      }

      .footer-copy {
        font-size: 0.62rem;
        letter-spacing: 0.12em;
      }

      @media (max-width: 900px) {
        .hero {
          padding: 0 1.5rem 4rem;
        }

        .section-wrap {
          padding: 0 1.5rem;
        }

        .about-inner,
        .skills-inner,
        .exp-inner,
        .contact-inner {
          grid-template-columns: 1fr;
          gap: 3rem;
        }

        .projects-grid,
        .feature-grid,
        .blog-grid {
          grid-template-columns: 1fr;
        }

        .project-card.featured,
        .blog-card.featured {
          grid-column: span 1;
          grid-row: span 1;
        }

        footer {
          flex-direction: column;
          text-align: center;
          padding: 3rem 1.5rem;
        }

        .hero-sub {
          flex-direction: column;
          gap: 1.5rem;
        }

        .about-stats {
          grid-template-columns: 1fr 1fr;
        }

        .form-footer {
          align-items: stretch;
        }

        .btn-send {
          width: 100%;
        }
      }
    `}</style>
  )
}
