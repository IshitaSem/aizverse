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

// ─── SECURITY DASHBOARD ───
export function SecurityDashboard({ setPage }: { setPage: (p: Page) => void }) {
  const riskData = [
    { zone: "Gate A", risk: 28 },
    { zone: "Gate B", risk: 15 },
    { zone: "Gate C", risk: 72 },
    { zone: "Gate D", risk: 11 },
    { zone: "Sect. F", risk: 45 },
    { zone: "Fan Zone", risk: 33 },
  ];

  return (
    <AppLayout page="security" setPage={setPage} title="Security Operations Center" subtitle="Threat Level: MODERATE · 14 Units Deployed">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">

        {/* Alert banner */}
        <motion.div variants={slideUp}
          className="p-4 rounded-2xl flex items-center gap-3 relative overflow-hidden"
          style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)" }}>
          <div className="absolute inset-0 pointer-events-none scan-container" />
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(245,158,11,0.15)" }}>
            <AlertTriangle size={17} className="text-amber-400" />
          </div>
          <div>
            <div className="font-display font-semibold text-amber-300 text-sm">Threat Level: ELEVATED</div>
            <div className="text-xs text-slate-500 font-mono-code">3 active incidents · Medical team on standby · All exits operational</div>
          </div>
          <div className="ml-auto"><Badge color="amber">MODERATE</Badge></div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Active Alerts" value="3" change="+1" icon={AlertTriangle} color="red" />
          <KpiCard label="Units Deployed" value="14" icon={Shield} color="indigo" />
          <KpiCard label="CCTV Coverage" value="99.2%" icon={Camera} color="green" />
          <KpiCard label="Threat Score" value="32/100" change="-8" icon={Target} color="amber" />
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Timeline */}
          <motion.div variants={slideUp} className="col-span-12 md:col-span-5">
            <GlassCard className="p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-white font-semibold">Live Incident Timeline</h3>
                <LiveBadge />
              </div>
              <div className="space-y-0">
                {incidents.map((inc, i) => (
                  <motion.div key={inc.id}
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="flex gap-3 pb-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${inc.severity === "high" ? "bg-red-500" : inc.severity === "medium" ? "bg-amber-500" : "bg-emerald-500"}`}>
                        {inc.severity === "high" && <span className="absolute w-2.5 h-2.5 rounded-full bg-red-500 animate-ping opacity-60" />}
                      </div>
                      {i < incidents.length - 1 && <div className="flex-1 w-px bg-indigo-500/[0.1] mt-1.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-sm font-medium">{inc.type}</span>
                        <span className="text-xs text-slate-600 font-mono-code">{inc.time}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5 font-mono-code truncate">{inc.location}</div>
                      <div className="flex gap-2 mt-1.5">
                        <Badge color={inc.severity === "high" ? "red" : inc.severity === "medium" ? "amber" : "slate"}>{inc.severity}</Badge>
                        <Badge color={inc.status === "resolved" ? "green" : inc.status === "responding" ? "red" : "amber"}>{inc.status}</Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <div className="col-span-12 md:col-span-7 space-y-5">
            {/* Risk chart */}
            <motion.div variants={slideUp}>
              <GlassCard className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
                    <Gauge size={13} className="text-red-400" />
                  </div>
                  <h3 className="font-display text-white font-semibold">AI Risk Prediction by Zone</h3>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={riskData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                    <XAxis dataKey="zone" tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={chartTooltipStyle} />
                    <Bar dataKey="risk" radius={[6, 6, 0, 0]}>
                      {riskData.map((entry, i) => (
                        <Cell key={i} fill={entry.risk > 60 ? "#ef4444" : entry.risk > 35 ? "#f59e0b" : "#10b981"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </GlassCard>
            </motion.div>

            {/* Emergency actions */}
            <motion.div variants={slideUp}>
              <GlassCard className="p-5">
                <h3 className="font-display text-white font-semibold mb-4">Emergency Response Panel</h3>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "Full Evacuation", icon: Navigation, color: "#ef4444" },
                    { label: "Medical Code", icon: Heart, color: "#ef4444" },
                    { label: "Lockdown", icon: Lock, color: "#f59e0b" },
                    { label: "CCTV Review", icon: Camera, color: "#6366f1" },
                    { label: "Broadcast Alert", icon: Radio, color: "#f59e0b" },
                    { label: "Log Incident", icon: FileText, color: "#64748b" },
                  ].map(({ label, icon: Icon, color }) => (
                    <motion.button key={label} whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.97 }}
                      className="flex flex-col items-center gap-2 p-3 rounded-xl border text-xs font-medium transition-all cursor-pointer"
                      style={{ background: `${color}08`, border: `1px solid ${color}20`, color: `${color}cc` }}>
                      <Icon size={18} />
                      <span className="text-center leading-tight">{label}</span>
                    </motion.button>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

