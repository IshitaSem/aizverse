import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { itemVariants } from "./animations";
// ─── LOADING SKELETON ───
export function Skeleton({ className = "" }) {
    return _jsx("div", { className: `shimmer-skeleton rounded-xl ${className}` });
}
// ─── BADGE ───
export function Badge({ children, color = "indigo" }) {
    const styles = {
        indigo: "bg-indigo-500/10 text-indigo-300 border-indigo-500/20",
        cyan: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20",
        green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20",
        amber: "bg-amber-500/10 text-amber-300 border-amber-500/20",
        red: "bg-red-500/10 text-red-300 border-red-500/20",
        purple: "bg-purple-500/10 text-purple-300 border-purple-500/20",
        slate: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    };
    return (_jsx("span", { className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles[color] || styles.indigo}`, children: children }));
}
// ─── KPI CARD ───
export function KpiCard({ label, value, change, icon: Icon, color = "indigo", sub }) {
    const isPositive = change?.startsWith("+");
    const colorMap = {
        indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", glow: "shadow-indigo-500/20" },
        cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", glow: "shadow-cyan-500/20" },
        green: { bg: "bg-emerald-500/10", text: "text-emerald-400", glow: "shadow-emerald-500/20" },
        amber: { bg: "bg-amber-500/10", text: "text-amber-400", glow: "shadow-amber-500/20" },
        red: { bg: "bg-red-500/10", text: "text-red-400", glow: "shadow-red-500/20" },
        purple: { bg: "bg-purple-500/10", text: "text-purple-400", glow: "shadow-purple-500/20" },
    };
    const c = colorMap[color] ?? colorMap.indigo;
    const iconClasses = c ? `${c.bg} ${c.text}` : "bg-indigo-500/10 text-indigo-400";
    return (_jsxs(motion.div, { variants: itemVariants, whileHover: { y: -4, scale: 1.02 }, transition: { type: "spring", stiffness: 300, damping: 20 }, className: "glass rounded-2xl p-5 card-glow cursor-default relative overflow-hidden group", children: [_jsx("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none", style: { background: "linear-gradient(180deg, rgba(99,102,241,0.03) 0%, transparent 100%)" } }), _jsxs("div", { className: "flex items-start justify-between mb-4", children: [_jsx("div", { className: `w-10 h-10 rounded-xl ${iconClasses} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`, children: _jsx(Icon, { size: 18 }) }), change && (_jsxs("span", { className: `flex items-center gap-1 text-xs font-semibold font-mono-code ${isPositive ? "text-emerald-400" : "text-red-400"}`, children: [isPositive ? _jsx(ArrowUpRight, { size: 12 }) : _jsx(ArrowDownRight, { size: 12 }), change] }))] }), _jsx("div", { className: "font-display text-2xl font-bold text-white mb-0.5 gradient-text-primary", children: value }), _jsx("div", { className: "text-sm text-slate-400 font-medium", children: label }), sub && _jsx("div", { className: "text-xs text-slate-600 mt-1 font-mono-code", children: sub }), _jsx("div", { className: `absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500` })] }));
}
// ─── GLASS CARD ───
export function GlassCard({ children, className = "", glow = false, animate = false, style }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-50px" });
    return (_jsx(motion.div, { ref: ref, initial: animate ? { opacity: 0, y: 24 } : false, animate: animate ? (inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }) : undefined, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }, whileHover: glow ? { y: -2 } : undefined, className: `glass rounded-2xl card-glow transition-all duration-300 ${className}`, style: style, children: children }));
}
// ─── PREMIUM BUTTON ───
export function PremiumButton({ children, onClick, variant = "primary", size = "md", className = "", disabled = false, type = "button" }) {
    const [ripples, setRipples] = useState([]);
    const handleClick = useCallback((e) => {
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
    return (_jsxs(motion.button, { type: type, whileHover: { scale: 1.02 }, whileTap: { scale: 0.97 }, onClick: handleClick, disabled: disabled, className: `relative overflow-hidden flex items-center justify-center font-semibold rounded-xl transition-all duration-200 ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`, children: [ripples.map(r => (_jsx("span", { className: "absolute rounded-full bg-white/20 pointer-events-none animate-ping", style: { left: r.x - 20, top: r.y - 20, width: 40, height: 40, animationDuration: "0.7s", animationIterationCount: 1 } }, r.id))), children] }));
}
// ─── SEVERITY DOT ───
export function SeverityDot({ severity }) {
    const c = {
        high: "bg-red-500",
        medium: "bg-amber-500",
        low: "bg-emerald-500",
    };
    return (_jsx("span", { className: `relative inline-block w-2 h-2 rounded-full ${c[severity] || "bg-slate-500"}`, children: severity === "high" && (_jsx("span", { className: "absolute inset-0 rounded-full animate-ping opacity-60", style: { background: "rgba(239,68,68,0.6)" } })) }));
}
// ─── LIVE INDICATOR ───
export function LiveBadge() {
    return (_jsxs("span", { className: "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold", children: [_jsx("span", { className: "relative w-1.5 h-1.5 rounded-full bg-emerald-400", children: _jsx("span", { className: "absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" }) }), "Live"] }));
}
