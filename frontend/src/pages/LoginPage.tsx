import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  Shield, Users, Map, MessageSquare, Bell, Home, BarChart2,
  Leaf, AlertTriangle, ChevronRight, Search, Mic, Send, X,
  Menu, LogOut, Star, Zap, Lock, ArrowRight, TrendingUp,
  Activity, Radio, Navigation, Coffee,
  Accessibility, Volume2, Sun, Phone, Wifi, Clock,
  UserCheck, FileText, Package, Heart, Siren, Car, Train, Bus, Bike,
  Droplets, Recycle, Wind, MapPin, Target,
  MoreHorizontal, RefreshCw, Plus, Minus,
  Info, CheckSquare, User, Camera, Headphones, Clipboard,
  ArrowUpRight, ArrowDownRight, Gauge
} from "lucide-react";
import type { Page } from "../types";
import { pageVariants, containerVariants, itemVariants, slideUp, fadeIn } from "../shared/animations";
import { chartTooltipStyle } from "../shared/chartTheme";
import { ChartGradients } from "../shared/ChartGradients";
import { GlobalStyles } from "../shared/GlobalStyles";
import { AnimatedBackground, ParticleField } from "../shared/AnimatedBackground";
import { Skeleton, Badge, KpiCard, GlassCard, PremiumButton, SeverityDot, LiveBadge } from "../shared/primitives";
import { AppLayout } from "../shared/layout";
import {
  crowdData, queueData, transportData, carbonData, incidents, volunteerTasks, chatMessages,
} from "../data/mockData";
import { useAuth } from "../lib/auth/AuthContext";
import type { Role } from "../lib/auth/AuthContext";

// ─── LOGIN PAGE ───
export function LoginPage({ setPage }: { setPage: (p: Page) => void }) {
  const { loginOrRegister } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("fan");
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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
      const user = await loginOrRegister(email.trim(), password, role as Role);
      setPage(user.role as Page);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4" style={{ fontFamily: "var(--font-body)" }}>
      <GlobalStyles />
      <AnimatedBackground />
      <ParticleField count={20} />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-md z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 glow-border"
            style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", boxShadow: "0 0 30px rgba(99,102,241,0.4)" }}
          >
            <Zap size={24} className="text-white" />
          </motion.div>
          <h1 className="font-display text-2xl font-bold gradient-text-primary">Welcome to AIZVerse</h1>
          <p className="text-slate-500 text-sm mt-1 font-mono-code">AI-Powered Stadium Intelligence Platform</p>
        </div>

        <div className="glass-bright rounded-2xl p-8"
          style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 40px 100px rgba(0,0,0,0.5), 0 0 60px rgba(99,102,241,0.06)" }}>

          {/* Role selector */}
          <div className="grid grid-cols-4 gap-1 glass rounded-xl p-1 mb-6">
            {roles.map(r => (
              <motion.button key={r.id}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRole(r.id)}
                className={`py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  role === r.id
                    ? "text-white shadow-lg"
                    : "text-slate-500 hover:text-slate-300"
                }`}
                style={role === r.id ? { background: "linear-gradient(135deg, #6366f1, #4f46e5)" } : {}}
              >
                {r.label}
              </motion.button>
            ))}
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1.5 font-mono-code uppercase tracking-wider">Email</label>
              <input
                value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@aizverse.com"
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none border border-indigo-500/[0.1] focus:border-indigo-500/40 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 font-semibold block mb-1.5 font-mono-code uppercase tracking-wider">Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full glass rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 outline-none border border-indigo-500/[0.1] focus:border-indigo-500/40 transition-colors"
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-slate-500 cursor-pointer hover:text-slate-300 transition-colors">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">Forgot password?</a>
            </div>

            <PremiumButton variant="primary" size="md" onClick={handleLogin} className="w-full justify-center" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Authenticating...
                </div>
              ) : (
                <><Lock size={14} /> Sign In Securely</>
              )}
            </PremiumButton>
            {authError && <p className="text-xs text-rose-400 font-mono-code text-center">{authError}</p>}
          </div>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-indigo-500/[0.08]" /></div>
            <div className="relative flex justify-center"><span className="px-3 text-xs text-slate-600 font-mono-code" style={{ background: "rgba(10,15,35,0.9)" }}>or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[["G", "Google", "#4285F4"], ["M", "Microsoft", "#00BCF2"]].map(([i, l, c]) => (
              <motion.button key={l} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 glass hover:border-indigo-500/25 rounded-xl py-2.5 text-sm text-slate-300 transition-all duration-200">
                <span className="font-bold text-base" style={{ color: c }}>{i}</span>
                <span>{l}</span>
              </motion.button>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 mt-5 pt-5 border-t border-indigo-500/[0.08]">
            <Shield size={11} className="text-emerald-400" />
            <span className="text-xs text-slate-600 font-mono-code">FIFA Security Protocol v3.2 · SOC 2 Type II</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

