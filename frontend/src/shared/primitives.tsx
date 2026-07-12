import { useCallback, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { itemVariants } from "./animations";

// ─── SHARED COLOR TOKENS ───
// Single source of truth for the accent colors used across Badge and
// KpiCard, so a palette change doesn't need to be made in two places.
export type AccentColor = "indigo" | "cyan" | "green" | "amber" | "red" | "purple" | "slate";

const ACCENT_HEX: Record<AccentColor, string> = {
  indigo: "99,102,241",
  cyan: "6,182,212",
  green: "16,185,129",
  amber: "245,158,11",
  red: "239,68,68",
  purple: "168,85,247",
  slate: "100,116,139",
};

// ─── LOADING SKELETON ───
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`shimmer-skeleton rounded-xl ${className}`} />;
}

// ─── BADGE ───
export type BadgeColor = AccentColor;

const BADGE_TEXT_CLASS: Record<BadgeColor, string> = {
  indigo: "text-indigo-300",
  cyan: "text-cyan-300",
  green: "text-emerald-300",
  amber: "text-amber-300",
  red: "text-red-300",
  purple: "text-purple-300",
  slate: "text-slate-400",
};

export function Badge({ children, color = "indigo" }: { children: React.ReactNode; color?: BadgeColor }) {
  const rgb = ACCENT_HEX[color] ?? ACCENT_HEX.indigo;
  const textClass = BADGE_TEXT_CLASS[color] ?? BADGE_TEXT_CLASS.indigo;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${textClass}`}
      style={{ background: `rgba(${rgb},0.1)`, borderColor: `rgba(${rgb},0.2)` }}
    >
      {children}
    </span>
  );
}

// ─── KPI CARD ───
export function KpiCard({ label, value, change, icon: Icon, color = "indigo", sub }: {
  label: string; value: string; change?: string; icon: React.ElementType; color?: AccentColor; sub?: string;
}) {
  const isPositive = change?.startsWith("+");
  const rgb = ACCENT_HEX[color] ?? ACCENT_HEX.indigo;
  const textClass = BADGE_TEXT_CLASS[color] ?? BADGE_TEXT_CLASS.indigo;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass rounded-2xl p-5 card-glow cursor-default relative overflow-hidden group"
    >
      {/* Scan effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "linear-gradient(180deg, rgba(99,102,241,0.03) 0%, transparent 100%)" }} />
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-10 h-10 rounded-xl ${textClass} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}
          style={{ background: `rgba(${rgb},0.1)` }}
        >
          <Icon size={18} />
        </div>
        {change && (
          <span className={`flex items-center gap-1 text-xs font-semibold font-mono-code ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {change}
          </span>
        )}
      </div>
      <div className="font-display text-2xl font-bold text-white mb-0.5 gradient-text-primary">{value}</div>
      <div className="text-sm text-slate-400 font-medium">{label}</div>
      {sub && <div className="text-xs text-slate-600 mt-1 font-mono-code">{sub}</div>}
      {/* Bottom accent line */}
      <div className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
    </motion.div>
  );
}

// ─── GLASS CARD ───
export function GlassCard({ children, className = "", glow = false, animate = false, style }: {
  children: React.ReactNode; className?: string; glow?: boolean; animate?: boolean; style?: React.CSSProperties;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={animate ? (inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }) : undefined}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={glow ? { y: -2 } : undefined}
      className={`glass rounded-2xl card-glow transition-all duration-300 ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── PREMIUM BUTTON ───
interface PremiumButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "cyan";
  size?: "sm" | "md" | "lg";
  className?: string;
  disabled?: boolean;
  /** Standard HTML button type — defaults to "button" so it's never accidentally a form submit. */
  type?: "button" | "submit" | "reset";
}

export function PremiumButton({
  children, onClick, variant = "primary", size = "md", className = "", disabled = false, type = "button",
}: PremiumButtonProps) {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples(r => [...r, { x: e.clientX - rect.left, y: e.clientY - rect.top, id }]);
    setTimeout(() => setRipples(r => r.filter(rip => rip.id !== id)), 700);
    onClick?.();
  }, [onClick]);

  const variants = {
    primary: "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white btn-glow border border-indigo-500/30",
    cyan: "bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white btn-glow-cyan border border-cyan-500/30",
    secondary: "glass-bright hover:border-indigo-500/30 text-slate-200 hover:text-white",
    ghost: "hover:bg-white/[0.04] text-slate-400 hover:text-white border border-transparent hover:border-white/[0.08]",
    danger: "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white btn-glow-red border border-red-500/30",
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-sm gap-2.5",
  };

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      disabled={disabled}
      className={`relative overflow-hidden flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
    >
      {ripples.map(r => (
        <span key={r.id} className="absolute rounded-full bg-white/20 pointer-events-none animate-ping"
          style={{ left: r.x - 20, top: r.y - 20, width: 40, height: 40, animationDuration: "0.7s", animationIterationCount: 1 }} />
      ))}
      {children}
    </motion.button>
  );
}

// ─── SEVERITY DOT ───
export type Severity = "high" | "medium" | "low";

export function SeverityDot({ severity }: { severity: Severity }) {
  const c: Record<Severity, string> = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-emerald-500",
  };
  return (
    <span className={`relative inline-block w-2 h-2 rounded-full ${c[severity]}`}>
      {severity === "high" && (
        <span className="absolute inset-0 rounded-full animate-ping opacity-60" style={{ background: "rgba(239,68,68,0.6)" }} />
      )}
    </span>
  );
}

// ─── LIVE INDICATOR ───
export function LiveBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
      <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400">
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
      </span>
      Live
    </span>
  );
}

