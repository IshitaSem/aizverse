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

// ─── TRANSPORT HUB ───
export function TransportPage({ setPage }: { setPage: (p: Page) => void }) {
  const [mode, setMode] = useState("metro");

  const modes = [
    { id: "metro", icon: Train, label: "Metro" },
    { id: "bus", icon: Bus, label: "Bus" },
    { id: "taxi", icon: Car, label: "Taxi/Ride" },
    { id: "bike", icon: Bike, label: "Bike" },
  ];

  const departures = [
    { line: "Red Line", from: "Doha Airport", dep: "16:45", arr: "17:12", crowd: "high" },
    { line: "Gold Line", from: "Msheireb", dep: "16:50", arr: "17:18", crowd: "medium" },
    { line: "Green Line", from: "Al Sadd", dep: "17:00", arr: "17:22", crowd: "low" },
  ];

  return (
    <AppLayout page="transport" setPage={setPage} title="Transport Hub" subtitle="Integrated mobility for 94,000 attendees · Carbon-smart routing">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-8 space-y-5">

          {/* Mode selector */}
          <motion.div variants={containerVariants} className="grid grid-cols-4 gap-3">
            {modes.map(({ id, icon: Icon, label }) => (
              <motion.button key={id} variants={itemVariants}
                whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => setMode(id)}
                className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all ${mode === id ? "" : "glass border-indigo-500/[0.06] text-slate-400 hover:text-white"}`}
                style={mode === id ? {
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#a5b4fc",
                  boxShadow: "0 0 20px rgba(99,102,241,0.1)"
                } : {}}>
                <Icon size={22} />
                <span className="text-sm font-semibold font-display">{label}</span>
              </motion.button>
            ))}
          </motion.div>

          <motion.div variants={slideUp}>
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-white font-semibold">Available Departures</h3>
                <LiveBadge />
              </div>
              <div className="space-y-3">
                {departures.map((opt, i) => (
                  <motion.div key={i}
                    whileHover={{ x: 4 }}
                    className="p-4 glass rounded-xl border border-indigo-500/[0.06] hover:border-indigo-500/[0.2] transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-indigo-400" />
                        <span className="font-display text-white font-semibold">{opt.line}</span>
                      </div>
                      <Badge color={opt.crowd === "high" ? "red" : opt.crowd === "medium" ? "amber" : "green"}>{opt.crowd} crowd</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-slate-500 font-mono-code text-xs">From {opt.from}</div>
                      <div className="flex items-center gap-3 font-mono-code text-xs">
                        <span>Dep <span className="text-white font-bold">{opt.dep}</span></span>
                        <ArrowRight size={10} className="text-slate-600" />
                        <span>Arr <span className="text-emerald-400 font-bold">{opt.arr}</span></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge color="green"><Leaf size={9} /> Low carbon</Badge>
                      <span className="text-xs text-slate-600 font-mono-code">27 min journey</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <div className="col-span-12 md:col-span-4 space-y-4">
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4"><Leaf size={14} className="text-emerald-400" /><h3 className="font-display text-white font-semibold text-sm">Carbon Footprint</h3></div>
              {[
                { mode: "Metro", kg: 0.3, color: "#10b981" },
                { mode: "Bus", kg: 0.6, color: "#6366f1" },
                { mode: "Ride Share", kg: 2.1, color: "#f59e0b" },
                { mode: "Private Car", kg: 4.8, color: "#ef4444" },
              ].map(({ mode: m, kg, color }) => (
                <div key={m} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">{m}</span>
                    <span className="text-white font-bold font-mono-code">{kg} kg CO₂</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: `${color}15` }}>
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(kg / 4.8) * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                      className="h-full rounded-full" style={{ background: color }} />
                  </div>
                </div>
              ))}
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="p-5">
              <h3 className="font-display text-white font-semibold text-sm mb-3">Parking Availability</h3>
              {[
                { zone: "P1 — VIP", avail: "Full", color: "red" },
                { zone: "P2 — West", avail: "12 spots", color: "amber" },
                { zone: "P3 — South", avail: "234 spots", color: "green" },
                { zone: "P4 — Accessible", avail: "48 spots", color: "green" },
              ].map(({ zone, avail, color }) => (
                <div key={zone} className="flex items-center justify-between py-2 border-b border-indigo-500/[0.06] last:border-0">
                  <span className="text-sm text-slate-400">{zone}</span>
                  <Badge color={color as any}>{avail}</Badge>
                </div>
              ))}
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="p-5" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
              <div className="flex items-center gap-2 mb-2"><Clock size={14} className="text-indigo-400" /><span className="font-display text-white font-semibold text-sm">Estimated Travel</span></div>
              <div className="font-display text-3xl font-black gradient-text-indigo mb-1 font-mono-code">27 <span className="text-lg text-slate-600 font-sans">min</span></div>
              <div className="text-xs text-slate-500 font-mono-code mb-3">Via Metro Red Line from your location</div>
              <div className="p-3 rounded-xl text-xs text-indigo-300 font-mono-code" style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.12)" }}>
                ⚡ Leave by 17:15 to arrive before kickoff
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

