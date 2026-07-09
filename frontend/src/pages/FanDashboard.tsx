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

// ─── FAN DASHBOARD ───
export function FanDashboard({ setPage }: { setPage: (p: Page) => void }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState(chatMessages);

  const sendMsg = () => {
    if (!msg.trim()) return;
    setMessages(m => [...m, { role: "user", text: msg }, {
      role: "assistant",
      text: "I'm analyzing real-time stadium data. Based on current conditions, I can help you with directions, wait times, services, and more. What do you need?"
    }]);
    setMsg("");
  };

  const quickActions = [
    { icon: Map, label: "Stadium Map", page: "map" as Page, color: "#6366f1" },
    { icon: Train, label: "Transport", page: "transport" as Page, color: "#06b6d4" },
    { icon: Coffee, label: "Food & Drink", page: "fan" as Page, color: "#f59e0b" },
    { icon: Accessibility, label: "Accessibility", page: "accessibility" as Page, color: "#8b5cf6" },
  ];

  return (
    <AppLayout page="fan" setPage={setPage} title="Fan Dashboard" subtitle="Welcome back, Jamie · Lusail Stadium · Match Day">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-12 gap-5">

        {/* Left column */}
        <div className="col-span-12 md:col-span-8 space-y-5">

          {/* Greeting card */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(99,102,241,0.08), transparent 60%)" }} />
              <div className="flex items-start justify-between relative">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <LiveBadge />
                    <span className="text-slate-500 text-xs font-mono-code">Match Day Active</span>
                  </div>
                  <h2 className="font-display text-2xl font-bold gradient-text-primary">Good afternoon, Jamie!</h2>
                  <p className="text-slate-500 text-sm mt-1.5">Kickoff in <span className="text-amber-400 font-bold font-mono-code">45 minutes</span>. Your experience is ready.</p>
                </div>
                <img src="https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120&h=80&fit=crop&auto=format" alt="Stadium" className="rounded-xl w-24 h-16 object-cover opacity-60" />
              </div>
            </GlassCard>
          </motion.div>

          {/* Ticket */}
          <motion.div variants={itemVariants}>
            <div className="rounded-2xl p-6 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))",
                border: "1px solid rgba(99,102,241,0.2)",
                boxShadow: "0 0 40px rgba(99,102,241,0.08)"
              }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(99,102,241,0.15), transparent 60%)" }} />
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              <div className="relative flex items-start justify-between mb-4">
                <div>
                  <Badge color="indigo">FIFA World Cup 2026</Badge>
                  <h3 className="font-display text-white font-bold text-2xl mt-2">Morocco vs. Portugal</h3>
                  <p className="text-slate-400 text-sm">Lusail Iconic Stadium · Qatar</p>
                </div>
                <div className="text-right">
                  <div className="font-display text-3xl font-black gradient-text-indigo font-mono-code">K-14</div>
                  <div className="text-slate-500 text-xs font-mono-code">Row 8 · Seat 22</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-indigo-500/[0.12]">
                {[["Date", "Jul 14, 2026"], ["Kickoff", "18:00 AST"], ["Gate", "Gate H · Open"]].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs text-slate-500 font-mono-code">{k}</div>
                    <div className="text-white text-sm font-semibold mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick actions */}
          <motion.div variants={containerVariants} className="grid grid-cols-4 gap-3">
            {quickActions.map(({ icon: Icon, label, page: p, color }) => (
              <motion.button
                key={label}
                variants={itemVariants}
                whileHover={{ y: -6, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setPage(p)}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="glass rounded-2xl p-4 flex flex-col items-center gap-3 card-glow group relative overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}15, transparent 70%)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                  style={{ background: `${color}15`, color }}>
                  <Icon size={18} />
                </div>
                <span className="text-xs text-slate-400 font-medium group-hover:text-slate-200 transition-colors">{label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Crowd heatmap */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-white font-semibold">Live Crowd Density</h3>
                <LiveBadge />
              </div>
              <div className="grid grid-cols-8 gap-1 mb-3">
                {Array.from({ length: 64 }, (_, i) => {
                  const intensity = 0.2 + (Math.sin(i * 0.8) + 1) / 2 * 0.8;
                  const bg = intensity > 0.8 ? "#ef4444" : intensity > 0.6 ? "#f59e0b" : intensity > 0.4 ? "#eab308" : intensity > 0.2 ? "#10b981" : "#1e293b";
                  return (
                    <motion.div key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: intensity * 0.85 + 0.15, scale: 1 }}
                      transition={{ delay: i * 0.008, duration: 0.3 }}
                      className="h-6 rounded-sm"
                      style={{ background: bg }}
                    />
                  );
                })}
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                {[["#10b981", "Low"], ["#eab308", "Medium"], ["#f59e0b", "High"], ["#ef4444", "Critical"]].map(([c, l]) => (
                  <div key={l} className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm" style={{ background: c }} />{l}</div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="col-span-12 md:col-span-4 space-y-4">

          {/* Eco score */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-white font-semibold text-sm">Eco Score</span>
                <Leaf size={14} className="text-emerald-400" />
              </div>
              <div className="font-display text-4xl font-black text-emerald-400 mb-1">84<span className="text-xl text-slate-600">/100</span></div>
              <div className="text-xs text-slate-500 mb-3">You used public transport — great choice!</div>
              <div className="h-1.5 rounded-full" style={{ background: "rgba(16,185,129,0.15)" }}>
                <motion.div initial={{ width: 0 }} animate={{ width: "84%" }} transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
                  className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #10b981, #34d399)" }} />
              </div>
            </GlassCard>
          </motion.div>

          {/* Nearby food */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="font-display text-white font-semibold text-sm">Nearby Food</span>
                <span className="text-xs text-indigo-400 cursor-pointer hover:text-indigo-300 transition-colors">See all</span>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Al Rayyan Grill", wait: "4 min", type: "Local Cuisine", dist: "120m" },
                  { name: "Fan Zone Burger", wait: "8 min", type: "Fast Food", dist: "200m" },
                  { name: "Oasis Café", wait: "2 min", type: "Beverages", dist: "80m" },
                ].map(({ name, wait, type, dist }) => (
                  <motion.div key={name} whileHover={{ x: 3 }}
                    className="flex items-center justify-between py-2.5 border-b border-indigo-500/[0.06] last:border-0 cursor-pointer">
                    <div>
                      <div className="text-sm text-white font-medium">{name}</div>
                      <div className="text-xs text-slate-600 font-mono-code">{type} · {dist}</div>
                    </div>
                    <Badge color="green">{wait}</Badge>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Emergency */}
          <motion.div variants={itemVariants}>
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setPage("emergency")}
              className="w-full rounded-2xl p-4 flex items-center gap-3 transition-all cursor-pointer relative overflow-hidden group"
              style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.08), transparent 70%)" }} />
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-red-400 relative"
                style={{ background: "rgba(239,68,68,0.1)" }}>
                <Phone size={17} />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500">
                  <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
                </span>
              </div>
              <div className="text-left">
                <div className="text-red-300 font-semibold text-sm font-display">Emergency Help</div>
                <div className="text-slate-600 text-xs font-mono-code">24/7 rapid response</div>
              </div>
              <ChevronRight size={15} className="ml-auto text-red-400/50 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating AI Chat */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-2xl flex items-center justify-center text-white z-50"
            style={{
              background: "linear-gradient(135deg, #6366f1, #4f46e5)",
              boxShadow: "0 0 30px rgba(99,102,241,0.4), 0 0 60px rgba(99,102,241,0.15)"
            }}
          >
            <MessageSquare size={22} />
          </motion.button>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] glass-bright rounded-2xl flex flex-col z-50 overflow-hidden"
            style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.2), 0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(99,102,241,0.1)" }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-indigo-500/[0.1]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <Zap size={13} className="text-white" />
                </div>
                <div>
                  <div className="text-white text-sm font-display font-semibold">AIZA Assistant</div>
                  <div className="text-xs text-emerald-400 font-mono-code flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" /> Online</div>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-white transition-colors"><X size={15} /></motion.button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${m.role === "user"
                    ? "text-white" : "glass text-slate-300 border border-indigo-500/[0.08]"}`}
                    style={m.role === "user" ? { background: "linear-gradient(135deg, #6366f1, #4f46e5)" } : {}}>
                    {m.text}
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="p-3 border-t border-indigo-500/[0.08]">
              <div className="flex gap-2">
                <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()}
                  placeholder="Ask AIZA anything..."
                  className="flex-1 glass border border-indigo-500/[0.1] rounded-xl px-3 py-2 text-sm text-white placeholder-slate-600 outline-none focus:border-indigo-500/40 transition-colors" />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendMsg}
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-colors"
                  style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                  <Send size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
}

