// ─── ANIMATED BACKGROUND ───
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep grid */}
      <div className="absolute inset-0 grid-bg opacity-60" />
      {/* Hex pattern overlay */}
      <div className="absolute inset-0 hex-pattern opacity-40" />
      {/* Blobs */}
      <div className="blob-1 absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)" }} />
      <div className="blob-2 absolute top-1/3 -right-60 w-[500px] h-[500px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)" }} />
      <div className="blob-3 absolute -bottom-40 left-1/3 w-[700px] h-[700px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)" }} />
      {/* Vignette */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(3,7,18,0.6) 100%)" }} />
    </div>
  );
}

// ─── PARTICLE FIELD ───
export function ParticleField({ count = 20 }: { count?: number }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${3 + Math.random() * 4}s`,
    color: i % 3 === 0 ? "rgba(6,182,212,0.5)" : i % 3 === 1 ? "rgba(139,92,246,0.5)" : "rgba(99,102,241,0.5)",
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <div key={p.id} className="particle" style={{
          left: p.left, bottom: "0", backgroundColor: p.color,
          animationDelay: p.delay, animationDuration: p.duration,
        }} />
      ))}
    </div>
  );
}

