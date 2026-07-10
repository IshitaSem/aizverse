import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import { motion } from "motion/react";
import { Shield, Zap, Lock } from "lucide-react";
import { GlobalStyles } from "../shared/GlobalStyles";
import { AnimatedBackground, ParticleField } from "../shared/AnimatedBackground";
import { PremiumButton } from "../shared/primitives";
import { useAuth } from "../lib/auth/AuthContext";
// ─── LOGIN PAGE ───
export function LoginPage({ setPage }) {
    const { loginOrRegister } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("fan");
    const [loading, setLoading] = useState(false);
    const [authError, setAuthError] = useState(null);
    const roles = [
        { id: "fan", label: "Fan" },
        { id: "organizer", label: "Organizer" },
        { id: "volunteer", label: "Volunteer" },
        { id: "security", label: "Security" },
    ];
    const handleLogin = async () => {
        if (!email.trim() || !password) {
            setAuthError("Enter both an email and a password.");
            return;
        }
        setLoading(true);
        setAuthError(null);
        try {
            // Routes by the account's *actual* stored role, not necessarily
            // whichever role happens to be selected here — the picker only
            // decides the role for brand-new accounts (see AuthContext).
            const user = await loginOrRegister(email.trim(), password, role);
            setPage(user.role);
        }
        catch (err) {
            setAuthError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen relative flex items-center justify-center p-4", style: { fontFamily: "var(--font-body)" }, children: [_jsx(GlobalStyles, {}), _jsx(AnimatedBackground, {}), _jsx(ParticleField, { count: 20 }), _jsxs(motion.div, { initial: { opacity: 0, y: 30, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }, className: "relative w-full max-w-md z-10", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx(motion.div, { whileHover: { rotate: 15, scale: 1.1 }, className: "w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 glow-border", style: { background: "linear-gradient(135deg, #6366f1, #4f46e5)", boxShadow: "0 0 30px rgba(99,102,241,0.4)" }, children: _jsx(Zap, { size: 24, className: "text-white" }) }), _jsx("h1", { className: "font-display text-2xl font-bold gradient-text-primary", children: "Welcome to AIZVerse" }), _jsx("p", { className: "text-slate-500 text-sm mt-1 font-mono-code", children: "AI-Powered Stadium Intelligence Platform" })] }), _jsxs("div", { className: "glass-bright rounded-2xl p-8", style: { boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.06)" }, children: [_jsx("div", { className: "grid grid-cols-4 gap-1 glass rounded-xl p-1 mb-6", children: roles.map(r => (_jsx(motion.button, { whileTap: { scale: 0.97 }, onClick: () => setRole(r.id), className: `py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${role === r.id
                                        ? "text-white shadow-lg"
                                        : "text-slate-500 hover:text-slate-300"}`, style: role === r.id ? { background: "linear-gradient(135deg, #6366f1, #4f46e5)" } : {}, children: r.label }, r.id))) }), _jsxs("form", { onSubmit: (e) => { e.preventDefault(); handleLogin(); }, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "email-input", className: "text-xs text-slate-400 font-semibold block mb-1.5 font-mono-code uppercase tracking-wider", children: "Email" }), _jsx("input", { id: "email-input", value: email, onChange: e => setEmail(e.target.value), placeholder: "you@aizverse.com", className: "w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none border border-indigo-500/[0.1] focus:border-indigo-500/40 transition-colors" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "password-input", className: "text-xs text-slate-400 font-semibold block mb-1.5 font-mono-code uppercase tracking-wider", children: "Password" }), _jsx("input", { id: "password-input", type: "password", value: password, onChange: e => setPassword(e.target.value), placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none border border-indigo-500/[0.1] focus:border-indigo-500/40 transition-colors" })] }), _jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsxs("label", { htmlFor: "remember-me", className: "flex items-center gap-2 text-slate-500 cursor-pointer hover:text-slate-300 transition-colors", children: [_jsx("input", { id: "remember-me", type: "checkbox", className: "rounded" }), " Remember me"] }), _jsx("a", { href: "#", className: "text-indigo-400 hover:text-indigo-300 transition-colors", children: "Forgot password?" })] }), _jsx(PremiumButton, { type: "submit", variant: "primary", size: "md", className: "w-full justify-center", disabled: loading, children: loading ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" }), "Authenticating..."] })) : (_jsxs(_Fragment, { children: [_jsx(Lock, { size: 14 }), " Sign In Securely"] })) }), authError && _jsx("p", { className: "text-xs text-rose-400 font-mono-code text-center", children: authError })] }), _jsxs("div", { className: "relative my-5", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t border-indigo-500/[0.08]" }) }), _jsx("div", { className: "relative flex justify-center", children: _jsx("span", { className: "px-3 text-xs text-slate-600 font-mono-code", style: { background: "rgba(10,15,35,0.9)" }, children: "or continue with" }) })] }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: [["G", "Google", "#4285F4"], ["M", "Microsoft", "#00BCF2"]].map(([i, l, c]) => (_jsxs(motion.button, { type: "button", whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: "flex items-center justify-center gap-2 glass hover:border-indigo-500/25 rounded-xl py-2.5 text-sm text-slate-300 transition-all duration-200", children: [_jsx("span", { className: "font-bold text-base", style: { color: c }, children: i }), _jsx("span", { children: l })] }, l))) }), _jsxs("div", { className: "flex items-center justify-center gap-2 mt-5 pt-5 border-t border-indigo-500/[0.08]", children: [_jsx(Shield, { size: 11, className: "text-emerald-400" }), _jsx("span", { className: "text-xs text-slate-600 font-mono-code", children: "FIFA Security Protocol v3.2 \u00B7 SOC 2 Type II" })] })] })] })] }));
}
