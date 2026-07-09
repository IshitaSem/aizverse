// ─── GLOBAL STYLES ───
export const GlobalStyles = () => (
  <style>{`
    :root { --font-display: 'Plus Jakarta Sans', sans-serif; --font-body: 'Inter', sans-serif; --font-mono: 'JetBrains Mono', monospace; }
    * { scrollbar-width: thin; scrollbar-color: rgba(99,102,241,0.2) transparent; }
    *::-webkit-scrollbar { width: 4px; height: 4px; }
    *::-webkit-scrollbar-track { background: transparent; }
    *::-webkit-scrollbar-thumb { background: rgba(99,102,241,0.25); border-radius: 99px; }
    body { font-family: var(--font-body); background: #030712; }
    .font-display { font-family: var(--font-display); }
    .font-mono-code { font-family: var(--font-mono); }

    @keyframes blob-drift {
      0%, 100% { transform: translate(0,0) scale(1); }
      33% { transform: translate(40px,-30px) scale(1.08); }
      66% { transform: translate(-20px,25px) scale(0.95); }
    }
    @keyframes grid-scroll {
      0% { background-position: 0 0; }
      100% { background-position: 48px 48px; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes glow-pulse {
      0%, 100% { box-shadow: 0 0 8px rgba(99,102,241,0.3), 0 0 24px rgba(99,102,241,0.1); }
      50% { box-shadow: 0 0 16px rgba(99,102,241,0.5), 0 0 40px rgba(99,102,241,0.2); }
    }
    @keyframes spin-slow { to { transform: rotate(360deg); } }
    @keyframes float-up {
      0% { transform: translateY(0) scale(1); opacity: 0.6; }
      100% { transform: translateY(-80px) scale(0.6); opacity: 0; }
    }
    @keyframes scan-line {
      0% { top: -2px; }
      100% { top: 100%; }
    }
    @keyframes neon-flicker {
      0%, 95%, 100% { opacity: 1; }
      96% { opacity: 0.7; }
      97% { opacity: 1; }
      98% { opacity: 0.8; }
    }
    @keyframes border-glow-rotate {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes data-stream {
      0% { opacity: 0; transform: translateY(-10px); }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { opacity: 0; transform: translateY(10px); }
    }
    @keyframes ping-ring {
      0% { transform: scale(1); opacity: 0.6; }
      100% { transform: scale(2.5); opacity: 0; }
    }

    .blob-1 { animation: blob-drift 14s ease-in-out infinite; }
    .blob-2 { animation: blob-drift 18s ease-in-out infinite reverse; }
    .blob-3 { animation: blob-drift 22s ease-in-out infinite 4s; }

    .grid-bg {
      background-image:
        linear-gradient(rgba(99,102,241,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99,102,241,0.04) 1px, transparent 1px);
      background-size: 48px 48px;
      animation: grid-scroll 8s linear infinite;
    }

    .shimmer-skeleton {
      background: linear-gradient(90deg, rgba(99,102,241,0.06) 25%, rgba(99,102,241,0.14) 50%, rgba(99,102,241,0.06) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.8s infinite;
    }

    .glow-border { animation: glow-pulse 3s ease-in-out infinite; }
    .spin-slow { animation: spin-slow 20s linear infinite; }
    .neon-text { animation: neon-flicker 8s ease-in-out infinite; }

    .btn-glow:hover { box-shadow: 0 0 20px rgba(99,102,241,0.5), 0 0 60px rgba(99,102,241,0.2), inset 0 0 20px rgba(99,102,241,0.05); }
    .btn-glow-cyan:hover { box-shadow: 0 0 20px rgba(6,182,212,0.5), 0 0 60px rgba(6,182,212,0.2); }
    .btn-glow-red:hover { box-shadow: 0 0 20px rgba(239,68,68,0.5), 0 0 60px rgba(239,68,68,0.2); }

    .card-glow:hover {
      box-shadow: 0 0 0 1px rgba(99,102,241,0.25), 0 8px 40px rgba(99,102,241,0.1), 0 0 80px rgba(99,102,241,0.04);
    }

    .scan-container { position: relative; overflow: hidden; }
    .scan-container::after {
      content: '';
      position: absolute;
      left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent);
      animation: scan-line 3s linear infinite;
    }

    .particle {
      position: absolute;
      width: 3px; height: 3px;
      border-radius: 50%;
      background: rgba(99,102,241,0.6);
      animation: float-up 4s ease-out infinite;
    }

    .active-nav-glow {
      box-shadow: inset 0 0 20px rgba(99,102,241,0.08), 0 0 0 1px rgba(99,102,241,0.2);
    }

    .gradient-text-primary {
      background: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .gradient-text-indigo {
      background: linear-gradient(135deg, #a5b4fc 0%, #6366f1 50%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .gradient-text-cyan {
      background: linear-gradient(135deg, #67e8f9 0%, #06b6d4 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .glass {
      background: rgba(10, 15, 35, 0.6);
      backdrop-filter: blur(20px) saturate(180%);
      -webkit-backdrop-filter: blur(20px) saturate(180%);
      border: 1px solid rgba(99, 102, 241, 0.1);
    }
    .glass-bright {
      background: rgba(15, 20, 45, 0.7);
      backdrop-filter: blur(24px) saturate(180%);
      border: 1px solid rgba(99, 102, 241, 0.15);
    }
    .glass-nav {
      background: rgba(5, 8, 18, 0.85);
      backdrop-filter: blur(32px) saturate(200%);
      border-right: 1px solid rgba(99, 102, 241, 0.08);
    }
    .glass-topnav {
      background: rgba(3, 7, 18, 0.85);
      backdrop-filter: blur(32px) saturate(200%);
      border-bottom: 1px solid rgba(99, 102, 241, 0.08);
    }

    .hex-pattern {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%236366f1' fill-opacity='0.03'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.3h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .tooltip-recharts .recharts-tooltip-wrapper { outline: none; }

    .ping-dot::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 50%;
      background: inherit;
      opacity: 0.5;
      animation: ping-ring 1.5s cubic-bezier(0,0,0.2,1) infinite;
    }
  `}</style>
);

