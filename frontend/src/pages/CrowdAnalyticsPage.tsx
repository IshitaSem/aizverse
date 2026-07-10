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
import { useCrowdData } from "../features/crowd-intelligence/useCrowdData";
import { OperationalSummaryCard } from "../features/crowd-intelligence/OperationalSummaryCard";

// ─── CROWD ANALYTICS ───
export function CrowdAnalyticsPage({ setPage }: { setPage: (p: Page) => void }) {
  const { data: liveCrowd, isLoading: isCrowdLoading, error: crowdError } = useCrowdData();

  // TODO(API): the three charts below (attendance flow, transport modal
  // split, gate queue analysis) use crowdData/transportData/queueData from
  // ../data/mockData — GET /api/v1/crowd/summary returns per-zone density
  // + an AI summary, not this time-series/modal-split/queue shape, so there
  // is no honest 1:1 mapping today. Real data for these specific charts
  // will need matching backend endpoints before they can be wired up.
  return (
    <AppLayout page="analytics" setPage={setPage} title="Crowd Analytics" subtitle="Real-time intelligence · Predictive modeling · 15s refresh">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Current Occupancy" value="88,966" change="+1,200" icon={Users} color="indigo" />
          <KpiCard label="Peak Predicted" value="91,200" icon={TrendingUp} color="amber" sub="At 18:15" />
          <KpiCard label="Avg Dwell Time" value="3.4 hrs" icon={Clock} color="green" />
          <KpiCard label="Exit Flow Rate" value="2,340/hr" change="-4%" icon={Activity} color="cyan" />
        </div>

        <motion.div variants={slideUp}>
          {isCrowdLoading && <p className="text-xs text-slate-500 font-mono-code">Loading live crowd data…</p>}
          {crowdError && <p className="text-xs text-rose-400 font-mono-code">{crowdError}</p>}
          {liveCrowd && <OperationalSummaryCard data={liveCrowd} />}
        </motion.div>

        <div className="grid grid-cols-12 gap-5">
          <motion.div variants={slideUp} className="col-span-12 md:col-span-8">
            <GlassCard className="p-5">
              <h3 className="font-display text-white font-semibold mb-4">Attendance Flow — Today</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={crowdData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                  <XAxis dataKey="time" tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Area key="actual" isAnimationActive={false} type="monotone" dataKey="capacity" stroke="#6366f1" fill="url(#a1)" strokeWidth={2} name="Actual" />
                  <Area key="predicted" isAnimationActive={false} type="monotone" dataKey="predicted" stroke="#06b6d4" fill="url(#a2)" strokeWidth={1.5} strokeDasharray="4 2" name="Predicted" />
                </AreaChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          <motion.div variants={slideUp} className="col-span-12 md:col-span-4">
            <GlassCard className="p-5 h-full">
              <h3 className="font-display text-white font-semibold mb-4">Transport Modal Split</h3>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={transportData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={4} dataKey="value">
                    {transportData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-1">
                {transportData.map(t => (
                  <div key={t.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{ background: t.color }} /><span className="text-xs text-slate-500 font-mono-code">{t.name}</span></div>
                    <span className="text-xs text-white font-bold font-mono-code">{t.value}%</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={slideUp} className="col-span-12">
            <GlassCard className="p-5">
              <h3 className="font-display text-white font-semibold mb-4">Gate Queue Analysis</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={queueData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                  <XAxis dataKey="gate" tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#475569", fontFamily: "JetBrains Mono" }} />
                  <Bar key="queue" dataKey="queue" name="Queue Length" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  <Bar key="avg" dataKey="avg" name="Avg Wait (min)" fill="#06b6d4" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

