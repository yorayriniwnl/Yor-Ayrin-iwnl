module.exports = {
  content: [
    './app/**/*.{ts,tsx,js,jsx}',
    './components/**/*.{ts,tsx,js,jsx}',
    './pages/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Primary palette — obsidian & gold ── */
        gold: {
          DEFAULT: '#c9a84c',
          light:   '#e8c96e',
          soft:    'rgba(201,168,76,0.14)',
          glow:    'rgba(201,168,76,0.28)',
        },
        rust: {
          DEFAULT: '#c04a3a',
          light:   '#d96b58',
          soft:    'rgba(192,74,58,0.14)',
        },
        warm: {
          DEFAULT: '#a89878',
          light:   '#c8b898',
          muted:   '#7a7060',
        },
        /* ── Surface scale ── */
        obsidian: {
          50:  '#f5efe5',
          100: '#ddd5c0',
          200: '#a89878',
          300: '#7a7060',
          400: '#4a4538',
          500: '#2d2820',
          600: '#1a1710',
          700: '#111009',
          800: '#0a0906',
          900: '#070604',
        },
        /* ── Semantic aliases (map to obsidian/gold/rust) ── */
        primary:   { DEFAULT: '#c9a84c', 600: '#b8943e' },
        accent:    '#c04a3a',
        surface:   'rgba(26,23,16,0.94)',
        muted:     '#a89878',
      },

      fontFamily: {
        /* display serif: Cormorant Garamond (editorial hero text) */
        serif:   ['Cormorant Garamond', 'var(--font-ds-serif)', 'ui-serif', 'Georgia', 'serif'],
        /* body sans: DM Sans */
        sans:    ['DM Sans', 'var(--font-ds-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        /* mono: DM Mono */
        mono:    ['DM Mono', 'var(--font-ds-mono)', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        /* legacy display alias (Playfair Display via CSS var) */
        display: ['var(--font-ds-display)', 'Playfair Display', 'ui-serif', 'Georgia', 'serif'],
      },

      borderRadius: {
        xl:  '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },

      backdropBlur: {
        xs:  '2px',
        sm:  '6px',
        md:  '12px',
        lg:  '20px',
        xl:  '32px',
      },

      boxShadow: {
        'gold-sm':  '0 8px 24px rgba(201,168,76,0.16)',
        'gold-md':  '0 14px 40px rgba(201,168,76,0.24)',
        'gold-lg':  '0 20px 60px rgba(201,168,76,0.32)',
        'gold-glow':'0 0 0 4px rgba(201,168,76,0.16), 0 20px 48px rgba(201,168,76,0.28)',
        'rust-sm':  '0 8px 24px rgba(192,74,58,0.18)',
        'obsidian': '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)',
        'surface':  '0 32px 80px rgba(0,0,0,0.48)',
      },

      letterSpacing: {
        tightest: '-0.04em',
        tighter:  '-0.03em',
        tight:    '-0.02em',
        snug:     '-0.01em',
        normal:   '0em',
        wide:     '0.06em',
        wider:    '0.12em',
        widest:   '0.22em',
        ultra:    '0.32em',
      },

      keyframes: {
        /* Slow warm shimmer — card highlight sweep */
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
        /* Gentle vertical float */
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        /* Gold pulse glow ring */
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,168,76,0.0)' },
          '50%':      { boxShadow: '0 0 0 8px rgba(201,168,76,0.18)' },
        },
        /* Grain texture drift */
        'grain-drift': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%':      { transform: 'translate(-2%, -3%)' },
          '30%':      { transform: 'translate(3%, -1%)' },
          '50%':      { transform: 'translate(-1%, 2%)' },
          '70%':      { transform: 'translate(2%, 3%)' },
          '90%':      { transform: 'translate(-3%, 1%)' },
        },
        /* Hero name gradient sweep */
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        /* Skeleton loading */
        'skeleton-shimmer': {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        /* Mesh drift (cinematic bg) */
        'mesh-drift': {
          '0%, 100%': { transform: 'translate3d(-3%, 0, 0)' },
          '50%':      { transform: 'translate3d(3%, 1.5%, 0)' },
        },
        /* Blob float */
        'blob-float': {
          '0%, 100%': { transform: 'translateY(-6px) rotate(-2deg) scale(1)' },
          '50%':      { transform: 'translateY(6px) rotate(2deg) scale(1.02)' },
        },
        /* Star twinkle */
        'star-twinkle': {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.25)' },
        },
      },

      animation: {
        shimmer:       'shimmer 3.6s linear infinite',
        float:         'float 6s ease-in-out infinite',
        'pulse-glow':  'pulse-glow 2.4s ease-in-out infinite',
        'grain-drift': 'grain-drift 8s steps(10, end) infinite',
        'gradient-shift': 'gradient-shift 7s linear infinite',
        'mesh-drift':  'mesh-drift 36s linear infinite',
        'blob-float':  'blob-float 12s ease-in-out infinite',
        'star-twinkle':'star-twinkle 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
