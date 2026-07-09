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

// ─── SUSTAINABILITY ───
export function SustainabilityPage({ setPage }: { setPage: (p: Page) => void }) {
  return (
    <AppLayout page="sustainability" setPage={setPage} title="Sustainability Dashboard" subtitle="FIFA 2026 Green Goals · Carbon Neutral Target">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard label="Carbon Saved Today" value="42t CO₂" change="+8%" icon={Leaf} color="green" />
          <KpiCard label="Green Transport" value="74%" change="+3%" icon={Train} color="cyan" />
          <KpiCard label="Waste Recycled" value="68%" icon={Recycle} color="green" />
          <KpiCard label="Water Refills" value="12,440" change="+24%" icon={Droplets} color="indigo" />
        </div>

        <div className="grid grid-cols-12 gap-5">
          <motion.div variants={slideUp} className="col-span-12 md:col-span-8">
            <GlassCard className="p-5">
              <h3 className="font-display text-white font-semibold mb-4">Eco Score Trend — This Week</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={carbonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.06)" />
                  <XAxis dataKey="day" tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[50, 100]} tick={{ fill: "#475569", fontSize: 10, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Line isAnimationActive={false} type="monotone" dataKey="score" stroke="#10b981" strokeWidth={2.5} dot={{ fill: "#10b981", r: 5, strokeWidth: 0 }} />
                </LineChart>
              </ResponsiveContainer>
            </GlassCard>
          </motion.div>

          <motion.div variants={slideUp} className="col-span-12 md:col-span-4">
            <GlassCard className="p-5 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                  <Zap size={13} className="text-emerald-400" />
                </div>
                <h3 className="font-display text-white font-semibold text-sm">AI Eco Recommendations</h3>
              </div>
              <div className="space-y-2.5">
                {[
                  { text: "Deploy 8 more water refill stations near Gate C to reduce plastic waste by ~18%.", icon: Droplets, c: "#06b6d4" },
                  { text: "Shift 12% of parking to EV-only bays to incentivize electric vehicles.", icon: Car, c: "#10b981" },
                  { text: "Food waste above target. Suggest 10% batch reduction in concessions.", icon: Recycle, c: "#f59e0b" },
                  { text: "Fan Zone 3 energy 22% above baseline. Check HVAC scheduling.", icon: Wind, c: "#8b5cf6" },
                ].map(({ text, icon: Icon, c }, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex gap-3 p-3 rounded-xl text-xs"
                    style={{ background: `${c}08`, border: `1px solid ${c}15` }}>
                    <Icon size={13} style={{ color: c }} className="flex-shrink-0 mt-0.5" />
                    <span className="text-slate-400 leading-relaxed">{text}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={slideUp} className="col-span-12">
            <GlassCard className="p-5">
              <h3 className="font-display text-white font-semibold mb-4">Waste Management by Zone</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {["Gate A", "Gate B", "Fan Zone 1", "Fan Zone 2", "Concessions", "Parking"].map((zone, i) => {
                  const pct = [72, 81, 64, 58, 55, 43][i] ?? 0;
                  const color = pct >= 70 ? "#10b981" : pct >= 55 ? "#f59e0b" : "#ef4444";
                  return (
                    <div key={zone} className="glass rounded-xl p-3 text-center border border-indigo-500/[0.06]">
                      <div className="font-display text-lg font-bold text-white">{pct}%</div>
                      <div className="text-xs text-slate-600 mb-2 font-mono-code">{zone}</div>
                      <div className="h-1 rounded-full" style={{ background: `${color}15` }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full rounded-full" style={{ background: color }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

