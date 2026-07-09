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

// ─── ORGANIZER DASHBOARD ───
export function OrganizerDashboard({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <AppLayout page="organizer" setPage={setPage} title="Operations Center" subtitle="Lusail Stadium · Match Day 22 · Commander View">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">

        {/* KPIs */}
        <motion.div variants={containerVariants} className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <KpiCard label="Current Attendance" value="88,966" change="+2.1%" icon={Users} color="indigo" sub="of 94,000 capacity" />
          <KpiCard label="Active Volunteers" value="1,247" change="+12" icon={UserCheck} color="green" sub="94% on station" />
          <KpiCard label="Open Incidents" value="3" change="-2" icon={AlertTriangle} color="amber" sub="2 medium, 1 high" />
          <KpiCard label="Avg Queue Time" value="4.2m" change="-1.1m" icon={Clock} color="cyan" sub="All gates combined" />
          <KpiCard label="AI Confidence" value="97.3%" icon={Zap} color="green" sub="Operational accuracy" />
        </motion.div>

        <div className="grid grid-cols-12 gap-5">
          {/* Crowd chart */}
          <motion.div variants={slideUp} className="col-span-12 md:col-span-8">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display text-white font-semibold">Crowd Flow — Today</h3>
                  <p className="text-slate-500 text-xs font-mono-code">Actual vs. AI-predicted attendance</p>
                </div>
                <div className="flex gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ background: "#6366f1" }} /> Actual</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded border-dashed" style={{ borderColor: "#06b6d4", borderWidth: 1, borderStyle: "dashed" }} /> Predicted</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={crowdData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                  <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area key="capacity" isAnimationActive={false} type="monotone" dataKey="capacity" stroke="#6366f1" fill="url(#crowd1)" strokeWidth={2} />
                  <Line key="predicted" isAnimationActive={false} type="monotone" dataKey="predicted" stroke="#06b6d4" strokeWidth={1.5} strokeDasharray="4 2" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* Incidents */}
          <motion.div variants={slideUp} className="col-span-12 md:col-span-4">
            <GlassCard className="p-5 h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-white font-semibold">Active Incidents</h3>
                <Badge color="red">3 Open</Badge>
              </div>
              <div className="space-y-3">
                {incidents.slice(0, 4).map((inc, i) => (
                  <motion.div key={inc.id}
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="p-3 glass rounded-xl border border-indigo-500/[0.06] hover:border-indigo-500/[0.15] transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <SeverityDot severity={inc.severity} />
                        <span className="text-white text-sm font-medium">{inc.type}</span>
                      </div>
                      <span className="text-xs text-slate-600 font-mono-code">{inc.time}</span>
                    </div>
                    <div className="text-xs text-slate-500 mb-1.5 font-mono-code">{inc.location}</div>
                    <Badge color={inc.status === "resolved" ? "green" : inc.status === "responding" ? "red" : "amber"}>{inc.status}</Badge>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          {/* Queue chart */}
          <motion.div variants={slideUp} className="col-span-12 md:col-span-6">
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-white font-semibold">Gate Queue Monitoring</h3>
                <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.4 }}>
                  <RefreshCw size={13} className="text-slate-500 cursor-pointer hover:text-indigo-400 transition-colors" />
                </motion.div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={queueData} barSize={26}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                  <XAxis dataKey="gate" tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="queue" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          {/* AI Summary */}
          <motion.div variants={slideUp} className="col-span-12 md:col-span-6">
            <GlassCard className="p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                  <Zap size={13} className="text-white" />
                </div>
                <h3 className="font-display text-white font-semibold">AI Operational Summary</h3>
                <LiveBadge />
              </div>
              <div className="space-y-2.5">
                {[
                  { color: "#6366f1", text: "Gate C experiencing 25% above-normal queue. Recommend opening auxiliary lanes immediately." },
                  { color: "#f59e0b", text: "Medical team response time averaging 3.2 min — within protocol. Section F flagged." },
                  { color: "#10b981", text: "Transportation modal split optimal. 42% metro usage reducing parking pressure." },
                  { color: "#8b5cf6", text: "Predict 91,200 peak attendance at 18:15. Initiate overflow seating protocol by 17:45." },
                ].map(({ color, text }, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex gap-3 p-3 rounded-xl text-sm"
                    style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
                    <div className="w-1 h-full rounded-full flex-shrink-0 mt-0.5" style={{ background: color, minHeight: 14, width: 3 }} />
                    <span className="text-slate-400">{text}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

