import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { motion } from "motion/react";
import { Zap } from "lucide-react";
import { slideUp } from "../shared/animations";
import { PremiumButton } from "../shared/primitives";
import { AppLayout } from "../shared/layout";
import { useAccessibility } from "../lib/accessibility/AccessibilityContext";
import { ChatWindow } from "../features/stadium-assistant/ChatWindow";
// ─── AI CHAT PAGE ───
export function AIChatPage({ setPage }) {
    const { language: lang, setLanguage: setLang } = useAccessibility();
    return (_jsx(AppLayout, { page: "chat", setPage: setPage, title: "AIZA AI Assistant", subtitle: "Multilingual \u00B7 Real-time Stadium Intelligence", children: _jsxs("div", { className: "max-w-3xl mx-auto h-[calc(100vh-160px)] flex flex-col", children: [_jsxs(motion.div, { variants: slideUp, initial: "hidden", animate: "visible", className: "flex items-center justify-between mb-4", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg", style: { background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }, children: _jsx(Zap, { size: 18, className: "text-white" }) }), _jsxs("div", { children: [_jsx("div", { className: "font-display text-white font-bold", children: "AIZA" }), _jsxs("div", { className: "text-xs font-mono-code flex items-center gap-1.5 text-emerald-400", children: [_jsx("span", { className: "relative w-1.5 h-1.5 rounded-full bg-emerald-400", children: _jsx("span", { className: "absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" }) }), "Online \u00B7 Stadium Intelligence Active"] })] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("select", { value: lang.toUpperCase(), onChange: e => setLang(e.target.value.toLowerCase()), className: "glass border border-indigo-500/[0.15] text-slate-300 text-xs rounded-lg px-2.5 py-1.5 outline-none font-mono-code", children: ["EN", "AR", "FR", "ES", "PT", "HI"].map(l => _jsx("option", { value: l, children: l }, l)) }), _jsx(PremiumButton, { variant: "ghost", size: "sm", children: "New Chat" })] })] }), _jsx(ChatWindow, { stadiumId: "stadium-atl-01", language: lang })] }) }));
}
