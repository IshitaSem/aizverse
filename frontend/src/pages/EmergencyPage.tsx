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

// ─── EMERGENCY RESPONSE ───
export function EmergencyPage({ setPage }: { setPage: (p: Page) => void }) {
  const [alertLevel, setAlertLevel] = useState<"normal" | "elevated" | "critical">("elevated");
  const alertColors = {
    normal: { bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)", text: "#34d399", badge: "green" },
    elevated: { bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)", text: "#fbbf24", badge: "amber" },
    critical: { bg: "rgba(239,68,68,0.1)", border: "rgba(239,68,68,0.3)", text: "#f87171", badge: "red" },
  };
  const ac = alertColors[alertLevel];

  return (
    <AppLayout page="emergency" setPage={setPage} title="Emergency Response Center" subtitle="24/7 · AI-Coordinated · 14 Units Deployed">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">

        {/* Alert banner */}
        <motion.div variants={slideUp}
          className="p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden"
          style={{ background: ac.bg, border: `1px solid ${ac.border}` }}
          animate={{ boxShadow: alertLevel === "critical" ? "0 0 30px rgba(239,68,68,0.2)" : "0 0 0px rgba(239,68,68,0)" }}
        >
          {alertLevel === "critical" && <div className="absolute inset-0 scan-container pointer-events-none" />}
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${ac.text}18` }}>
            <Siren size={18} style={{ color: ac.text }} />
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-sm" style={{ color: ac.text }}>Alert Level: {alertLevel.toUpperCase()}</div>
            <div className="text-xs text-slate-500 font-mono-code">3 active incidents · Medical team on standby · All exits operational</div>
          </div>
          <div className="flex gap-1.5 p-1 glass rounded-xl">
            {(["normal", "elevated", "critical"] as const).map(l => (
              <motion.button key={l} whileTap={{ scale: 0.97 }} onClick={() => setAlertLevel(l)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${alertLevel === l ? "text-white" : "text-slate-600 hover:text-slate-400"}`}
                style={alertLevel === l ? { background: alertColors[l].text + "30" } : {}}>
                {l}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-12 gap-5">
          {/* Incidents */}
          <motion.div variants={slideUp} className="col-span-12 md:col-span-5">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-white font-semibold">Active Incidents</h3>
                <Badge color="red">3 Open</Badge>
              </div>
              <div className="space-y-2.5">
                {incidents.map((inc, i) => (
                  <motion.div key={inc.id}
                    initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    className={`p-4 rounded-xl border transition-all ${inc.status !== "resolved"
                      ? "border-red-500/15" : "border-indigo-500/[0.04] opacity-40"}`}
                    style={inc.status !== "resolved" ? { background: "rgba(239,68,68,0.04)" } : { background: "rgba(99,102,241,0.02)" }}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <SeverityDot severity={inc.severity} />
                        <span className="text-white font-semibold text-sm">{inc.type}</span>
                      </div>
                      <span className="font-mono-code text-xs text-slate-600">{inc.time}</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-2 font-mono-code">{inc.location}</div>
                    <div className="flex gap-2">
                      <Badge color={inc.status === "resolved" ? "green" : inc.status === "responding" ? "red" : "amber"}>{inc.status}</Badge>
                      <span className="text-xs text-slate-700 font-mono-code">{inc.id}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <div className="col-span-12 md:col-span-7 space-y-5">
            {/* Evacuation routes */}
            <motion.div variants={slideUp}>
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Navigation size={15} className="text-indigo-400" />
                  <h3 className="font-display text-white font-semibold">Evacuation Routes</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { route: "Route Alpha", exits: "Gates A, B", est: "8 min", capacity: "25,000/hr", status: "clear" },
                    { route: "Route Beta", exits: "Gates C, D", est: "11 min", capacity: "18,000/hr", status: "congested" },
                    { route: "Route Gamma", exits: "Gates E, F", est: "7 min", capacity: "22,000/hr", status: "clear" },
                    { route: "Route Delta", exits: "Emergency X1–X4", est: "4 min", capacity: "8,000/hr", status: "standby" },
                  ].map(({ route, exits, est, capacity, status }) => (
                    <motion.div key={route} whileHover={{ y: -2 }}
                      className="glass rounded-xl p-4 border border-indigo-500/[0.06] hover:border-indigo-500/[0.2] transition-all">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-display text-white font-semibold text-sm">{route}</span>
                        <Badge color={status === "clear" ? "green" : status === "congested" ? "red" : "amber"}>{status}</Badge>
                      </div>
                      <div className="text-xs text-slate-500 font-mono-code mb-2">{exits}</div>
                      <div className="flex gap-3 text-xs text-slate-600 font-mono-code">
                        <span><Clock size={9} className="inline mr-1" />{est}</span>
                        <span><Users size={9} className="inline mr-1" />{capacity}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Emergency actions */}
            <motion.div variants={slideUp}>
              <GlassCard className="p-5">
                <h3 className="font-display text-white font-semibold mb-4">Emergency Actions</h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "Full Evacuation", icon: Navigation, color: "#ef4444" },
                    { label: "Medical Code", icon: Heart, color: "#ef4444" },
                    { label: "Police Alert", icon: Shield, color: "#ef4444" },
                    { label: "PA Broadcast", icon: Radio, color: "#f59e0b" },
                    { label: "Safe Zones", icon: MapPin, color: "#6366f1" },
                    { label: "Incident Log", icon: FileText, color: "#64748b" },
                  ].map(({ label, icon: Icon, color }) => (
                    <motion.button key={label} whileHover={{ scale: 1.04, y: -3 }} whileTap={{ scale: 0.96 }}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border text-xs font-semibold transition-all font-display cursor-pointer"
                      style={{ background: `${color}08`, border: `1px solid ${color}20`, color: `${color}cc` }}>
                      <Icon size={20} />
                      <span className="text-center leading-tight">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* AI summary */}
            <motion.div variants={slideUp}>
              <GlassCard className="p-5" style={{ border: "1px solid rgba(99,102,241,0.15)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                    <Zap size={13} className="text-white" />
                  </div>
                  <h3 className="font-display text-white font-semibold text-sm">AI Emergency Summary</h3>
                  <div className="ml-auto text-xs text-slate-600 font-mono-code">Updated 16:42:08</div>
                </div>
                <div className="glass rounded-xl p-4 text-sm text-slate-400 leading-relaxed border border-indigo-500/[0.08]">
                  Current threat level is <span className="text-amber-400 font-bold">ELEVATED</span>. Medical incident in Section C is being handled — ETA 2 minutes. Gate C congestion elevated but manageable with current protocols. No structural threats identified. Recommend deploying 2 additional stewards to Gate C. All emergency exits clear and operational.
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

