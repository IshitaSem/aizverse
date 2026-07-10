import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Home, BarChart2, UserCheck, Shield, Activity, Map, MessageSquare, Train, Leaf, Accessibility, Siren, Menu, LogOut, Bell, Search, Zap, } from "lucide-react";
import { pageVariants } from "./animations";
import { AnimatedBackground } from "./AnimatedBackground";
import { useAuth } from "../lib/auth/AuthContext";
// ─── SIDEBAR ───
export const navItems = [
    { id: "fan", label: "Fan Dashboard", icon: Home },
    { id: "organizer", label: "Organizer", icon: BarChart2 },
    { id: "volunteer", label: "Volunteer", icon: UserCheck },
    { id: "security", label: "Security", icon: Shield },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "map", label: "Stadium Map", icon: Map },
    { id: "chat", label: "AI Assistant", icon: MessageSquare },
    { id: "transport", label: "Transport Hub", icon: Train },
    { id: "sustainability", label: "Sustainability", icon: Leaf },
    { id: "accessibility", label: "Accessibility", icon: Accessibility },
    { id: "emergency", label: "Emergency", icon: Siren },
];
export function Sidebar({ page, setPage, collapsed, setCollapsed }) {
    const { logout } = useAuth();
    return (_jsxs(motion.aside, { animate: { width: collapsed ? 64 : 240 }, transition: { type: "spring", stiffness: 300, damping: 30 }, className: "fixed left-0 top-0 h-full glass-nav flex flex-col z-40 overflow-hidden", children: [_jsxs("div", { className: "flex items-center gap-3 px-4 py-5 border-b border-indigo-500/[0.08] flex-shrink-0", children: [_jsxs(motion.div, { whileHover: { rotate: 15, scale: 1.1 }, transition: { type: "spring", stiffness: 400 }, className: "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative", style: { background: "linear-gradient(135deg, #6366f1, #4f46e5)" }, children: [_jsx(Zap, { size: 15, className: "text-white relative z-10" }), _jsx("div", { className: "absolute inset-0 rounded-xl glow-border" })] }), _jsx(AnimatePresence, { mode: "wait", children: !collapsed && (_jsxs(motion.div, { initial: { opacity: 0, x: -10 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -10 }, transition: { duration: 0.2 }, children: [_jsx("div", { className: "font-display text-white font-bold text-sm tracking-wide", children: "AIZVerse" }), _jsx("div", { className: "text-indigo-400/60 text-[10px] font-mono-code", children: "Stadium Intelligence" })] })) }), _jsx(motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, onClick: () => setCollapsed(!collapsed), className: "ml-auto text-slate-500 hover:text-indigo-400 transition-colors flex-shrink-0", children: _jsx(Menu, { size: 15 }) })] }), _jsx("nav", { className: "flex-1 overflow-y-auto py-3 px-2 space-y-0.5", children: navItems.map(({ id, label, icon: Icon }, i) => {
                    const active = page === id;
                    return (_jsxs(motion.button, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: i * 0.04 }, whileHover: { x: 2 }, onClick: () => setPage(id), className: `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative group ${active
                            ? "active-nav-glow text-indigo-300 bg-indigo-500/8"
                            : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]"}`, children: [active && (_jsx(motion.div, { layoutId: "nav-active", className: "absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-indigo-400", transition: { type: "spring", stiffness: 400, damping: 30 } })), _jsx(Icon, { size: 16, className: `flex-shrink-0 transition-colors ${active ? "text-indigo-400" : "group-hover:text-indigo-400"}` }), _jsx(AnimatePresence, { mode: "wait", children: !collapsed && (_jsx(motion.span, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, transition: { duration: 0.15 }, className: "font-medium truncate text-sm", children: label })) })] }, id));
                }) }), _jsx("div", { className: "p-2 border-t border-indigo-500/[0.08] flex-shrink-0", children: _jsxs(motion.button, { whileHover: { x: 2 }, onClick: () => {
                        logout();
                        setPage("landing");
                    }, className: "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-200 group", children: [_jsx(LogOut, { size: 15, className: "flex-shrink-0" }), !collapsed && _jsx("span", { className: "font-medium", children: "Exit Platform" })] }) })] }));
}
// ─── TOP NAV ───
export function TopNav({ title, subtitle, collapsed }) {
    const [notifOpen, setNotifOpen] = useState(false);
    const { user } = useAuth();
    const initials = user
        ? user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
        : "JD";
    return (_jsxs(motion.header, { animate: { left: collapsed ? 64 : 240 }, transition: { type: "spring", stiffness: 300, damping: 30 }, className: "fixed top-0 right-0 z-30 flex items-center gap-4 px-6 py-4 glass-topnav", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h1", { className: "font-display text-white font-bold text-base leading-tight truncate", children: title }), subtitle && _jsx("p", { className: "text-slate-500 text-xs font-mono-code", children: subtitle })] }), _jsxs("div", { className: "flex items-center gap-2 flex-shrink-0", children: [_jsxs("div", { className: "hidden md:flex items-center gap-2 glass rounded-xl px-3 py-2 border border-indigo-500/[0.1] hover:border-indigo-500/[0.25] transition-colors", children: [_jsx(Search, { size: 13, className: "text-slate-500" }), _jsx("input", { placeholder: "Search...", className: "bg-transparent text-sm text-white placeholder-slate-600 outline-none w-32 font-body" }), _jsx("kbd", { className: "hidden lg:block text-[10px] text-slate-600 bg-white/[0.04] rounded px-1.5 py-0.5 font-mono-code", children: "\u2318K" })] }), _jsxs("div", { className: "relative", children: [_jsxs(motion.button, { whileHover: { scale: 1.05 }, whileTap: { scale: 0.95 }, onClick: () => setNotifOpen(!notifOpen), className: "relative w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors", children: [_jsx(Bell, { size: 15 }), _jsx("span", { className: "absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500", children: _jsx("span", { className: "absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" }) })] }), _jsx(AnimatePresence, { children: notifOpen && (_jsxs(motion.div, { initial: { opacity: 0, y: 8, scale: 0.95 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 8, scale: 0.95 }, transition: { duration: 0.2 }, className: "absolute right-0 top-12 w-80 glass-bright rounded-2xl shadow-2xl p-3 space-y-1", style: { boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 20px 60px rgba(0,0,0,0.5)" }, children: [_jsx("div", { className: "text-xs font-semibold text-slate-500 px-2 pb-1 font-mono-code", children: "NOTIFICATIONS" }), ["Crowd density at Gate C elevated", "Medical team dispatched to Section F", "Match kickoff in 45 minutes"].map((n, i) => (_jsxs(motion.div, { whileHover: { x: 3 }, className: "flex gap-3 items-start p-2.5 rounded-xl hover:bg-indigo-500/[0.05] cursor-pointer transition-colors", children: [_jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" }), _jsx("span", { className: "text-sm text-slate-300 leading-relaxed", children: n })] }, i)))] })) })] }), _jsx(motion.div, { whileHover: { scale: 1.05 }, className: "w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold font-display cursor-pointer", style: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }, children: initials })] })] }));
}
// ─── APP LAYOUT ───
export function AppLayout({ page, setPage, title, subtitle, children }) {
    const [collapsed, setCollapsed] = useState(false);
    return (_jsxs("div", { className: "min-h-screen relative", style: { fontFamily: "var(--font-body)" }, children: [_jsx(AnimatedBackground, {}), _jsx(Sidebar, { page: page, setPage: setPage, collapsed: collapsed, setCollapsed: setCollapsed }), _jsx(TopNav, { title: title, subtitle: subtitle, collapsed: collapsed }), _jsx(motion.main, { animate: { paddingLeft: collapsed ? 64 : 240 }, transition: { type: "spring", stiffness: 300, damping: 30 }, className: "min-h-screen pt-20 relative z-10", children: _jsx(AnimatePresence, { mode: "wait", children: _jsx(motion.div, { variants: pageVariants, initial: "initial", animate: "animate", exit: "exit", className: "p-6", children: children }, page) }) })] }));
}
