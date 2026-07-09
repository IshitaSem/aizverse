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

// ─── LANDING PAGE ───
// ══════════════════════════════════════════════════════════════════════════════
export function LandingPage({ setPage }: { setPage: (p: Page) => void }) {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });
  const featuresInView = useInView(featuresRef, { once: true });

  const features = [
    { icon: Activity, title: "Real-Time Crowd Intelligence", desc: "AI-powered crowd flow prediction with 97% accuracy across all stadium zones and entry points." },
    { icon: Shield, title: "Predictive Security", desc: "Machine learning risk assessment scanning 50+ threat vectors simultaneously, in real time." },
    { icon: MessageSquare, title: "AIZA AI Assistant", desc: "Multilingual conversational AI serving fans, staff, and officials across 16 host cities." },
    { icon: Map, title: "3D Stadium Mapping", desc: "Live interactive maps with accessible routing, density heatmaps, and AI-guided navigation." },
    { icon: Leaf, title: "Sustainability Tracking", desc: "Carbon footprint monitoring and green transportation scoring for every event attendee." },
    { icon: Train, title: "Transport Orchestration", desc: "Integrated mobility management reducing congestion by up to 40% on match day." },
  ];

  const stats = [
    { value: "94", unit: "Stadiums", label: "across 16 host cities" },
    { value: "5M+", unit: "Attendees", label: "served by AI in 2026" },
    { value: "97%", unit: "Accuracy", label: "crowd flow prediction" },
    { value: "<200ms", unit: "Latency", label: "real-time AI response" },
  ];

  return (
    <div className="min-h-screen relative overflow-x-hidden" style={{ fontFamily: "var(--font-body)" }}>
      <GlobalStyles />
      <AnimatedBackground />
      <ParticleField count={24} />

      {/* NAV */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 glass-topnav"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
            <Zap size={15} className="text-white" />
          </div>
          <span className="font-display text-white font-bold">AIZVerse</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-slate-500">
          {["Platform", "Solutions", "Analytics", "Security", "Pricing"].map(l => (
            <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <PremiumButton variant="ghost" size="sm" onClick={() => setPage("login")}>Sign In</PremiumButton>
          <PremiumButton variant="primary" size="sm" onClick={() => setPage("fan")}>
            Get Started <ArrowRight size={14} />
          </PremiumButton>
        </div>
      </motion.nav>

      {/* HERO */}
      <section ref={heroRef} className="relative pt-32 pb-24 px-8">
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 border border-indigo-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-indigo-300 text-xs font-semibold font-mono-code tracking-wide">
              FIFA WORLD CUP 2026 · OFFICIAL PLATFORM
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl font-bold mb-6 leading-[1.08] tracking-tight"
          >
            <span className="gradient-text-primary">AI-Powered</span>
            <br />
            <span className="gradient-text-indigo neon-text">Stadium Intelligence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            AIZVerse unifies crowd analytics, predictive security, fan experience, and operational intelligence —
            engineered for the world's largest sporting event.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <PremiumButton variant="primary" size="lg" onClick={() => setPage("fan")}>
              Explore Platform <ArrowRight size={16} />
            </PremiumButton>
            <PremiumButton variant="secondary" size="lg" onClick={() => setPage("organizer")}>
              Organizer Demo <ChevronRight size={16} />
            </PremiumButton>
          </motion.div>
        </div>

        {/* Hero dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative max-w-5xl mx-auto mt-16"
        >
          {/* Glow under card */}
          <div className="absolute inset-x-20 bottom-0 h-20 blur-3xl opacity-30"
            style={{ background: "linear-gradient(90deg, #6366f1, #06b6d4)" }} />

          <div className="glass-bright rounded-2xl overflow-hidden scan-container"
            style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 40px 100px rgba(0,0,0,0.6), 0 0 80px rgba(99,102,241,0.08)" }}>
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-indigo-500/[0.08] bg-black/20">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
              </div>
              <div className="mx-auto flex items-center gap-2 glass rounded-lg px-3 py-1">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                <span className="text-xs text-slate-400 font-mono-code">aizverse.app/dashboard/lusail</span>
              </div>
            </div>
            {/* Mini KPIs */}
            <div className="p-6 grid grid-cols-4 gap-4">
              {[
                ["88,966", "Current Attendance", "#6366f1"],
                ["97.3%", "AI Confidence", "#06b6d4"],
                ["3 Active", "Incidents", "#f59e0b"],
                ["4.2 min", "Avg Queue", "#8b5cf6"]
              ].map(([v, l, c]) => (
                <div key={l} className="glass rounded-xl p-4 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c}40, transparent)` }} />
                  <div className="font-display text-xl font-bold text-white">{v}</div>
                  <div className="text-xs text-slate-500 mt-0.5 font-mono-code">{l}</div>
                  <div className="mt-3 h-0.5 rounded-full" style={{ background: `${c}30`, width: "100%" }}>
                    <div className="h-full rounded-full" style={{ background: c, width: "60%" }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              {/* Pure SVG sparkline — no recharts, avoids internal key conflicts */}
              <svg viewBox="0 0 560 180" className="w-full" style={{ height: 180 }}>
                <defs>
                  <linearGradient id="heroSparkFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                {/* grid lines */}
                <line x1="0" y1="40"  x2="560" y2="40"  stroke="rgba(99,102,241,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="80"  x2="560" y2="80"  stroke="rgba(99,102,241,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="120" x2="560" y2="120" stroke="rgba(99,102,241,0.06)" strokeDasharray="3 3" />
                <line x1="0" y1="160" x2="560" y2="160" stroke="rgba(99,102,241,0.06)" strokeDasharray="3 3" />
                {/* y-axis labels */}
                <text x="4" y="38"  fill="#475569" fontSize={9} fontFamily="JetBrains Mono">90k</text>
                <text x="4" y="78"  fill="#475569" fontSize={9} fontFamily="JetBrains Mono">60k</text>
                <text x="4" y="118" fill="#475569" fontSize={9} fontFamily="JetBrains Mono">30k</text>
                <text x="4" y="158" fill="#475569" fontSize={9} fontFamily="JetBrains Mono">0k</text>
                {/* area fill — actual */}
                <path
                  d="M28,152 C84,138 140,112 196,88 C252,64 308,50 364,38 C420,27 476,22 532,20 L532,160 L28,160 Z"
                  fill="url(#heroSparkFill)"
                />
                {/* stroke — actual */}
                <path
                  d="M28,152 C84,138 140,112 196,88 C252,64 308,50 364,38 C420,27 476,22 532,20"
                  fill="none" stroke="#6366f1" strokeWidth={2}
                />
                {/* stroke — predicted dashed */}
                <path
                  d="M28,155 C84,141 140,115 196,91 C252,67 308,53 364,41 C420,30 476,25 532,23"
                  fill="none" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 2"
                />
                {/* x-axis labels */}
                <text x="22"  y="174" fill="#475569" fontSize={9} fontFamily="JetBrains Mono">09:00</text>
                <text x="134" y="174" fill="#475569" fontSize={9} fontFamily="JetBrains Mono">11:00</text>
                <text x="246" y="174" fill="#475569" fontSize={9} fontFamily="JetBrains Mono">13:00</text>
                <text x="358" y="174" fill="#475569" fontSize={9} fontFamily="JetBrains Mono">15:00</text>
                <text x="470" y="174" fill="#475569" fontSize={9} fontFamily="JetBrains Mono">17:00</text>
              </svg>
            </div>
          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-16 px-8 border-y border-indigo-500/[0.06]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={statsInView ? "visible" : "hidden"}
          className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map(({ value, unit, label }) => (
            <motion.div key={unit} variants={slideUp} className="text-center">
              <div className="font-display text-4xl font-black gradient-text-indigo">{value}</div>
              <div className="text-indigo-400 font-semibold text-sm mt-1">{unit}</div>
              <div className="text-slate-600 text-xs mt-0.5 font-mono-code">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section ref={featuresRef} className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeIn} initial="hidden" animate={featuresInView ? "visible" : "hidden"} className="text-center mb-14">
            <Badge color="indigo">Platform Capabilities</Badge>
            <h2 className="font-display text-3xl font-bold gradient-text-primary mt-4 mb-3">Everything your stadium needs</h2>
            <p className="text-slate-500 max-w-xl mx-auto">A unified intelligence layer for every stakeholder — from first-time fans to security commanders.</p>
          </motion.div>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {features.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="glass rounded-2xl p-6 card-glow cursor-default relative overflow-hidden group"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.05), transparent 70%)" }} />
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4 transition-all group-hover:bg-indigo-500/20 group-hover:scale-110 duration-300">
                  <Icon size={18} />
                </div>
                <h3 className="font-display text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="glass-bright rounded-3xl p-12 relative overflow-hidden"
            style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 0 80px rgba(99,102,241,0.06)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.1), transparent 70%)" }} />
            <ParticleField count={12} />
            <Badge color="indigo">Enterprise Ready</Badge>
            <h2 className="font-display text-3xl font-bold gradient-text-primary mt-4 mb-4">Ready to transform your stadium?</h2>
            <p className="text-slate-500 mb-8">Deploy AIZVerse across your venue in days, not months. Full FIFA 2026 compliance included.</p>
            <PremiumButton variant="primary" size="lg" onClick={() => setPage("login")}>
              Start Free Trial <ArrowRight size={16} />
            </PremiumButton>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-indigo-500/[0.06] py-10 px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
              <Zap size={12} className="text-white" />
            </div>
            <span className="font-display text-white font-bold text-sm">AIZVerse</span>
          </div>
          <div className="text-slate-600 text-xs font-mono-code">© 2026 AIZVerse · FIFA World Cup 2026 Official Technology Partner</div>
          <div className="flex gap-4 text-slate-600 text-xs">
            {["Privacy", "Terms", "Security"].map(l => (
              <a key={l} href="#" className="hover:text-indigo-400 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

