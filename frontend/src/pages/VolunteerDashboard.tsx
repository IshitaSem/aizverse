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

// ─── VOLUNTEER DASHBOARD ───
export function VolunteerDashboard({ setPage }: { setPage: (p: Page) => void }) {
  const [taskStates, setTaskStates] = useState<Record<number, string>>(
    Object.fromEntries(volunteerTasks.map(t => [t.id, t.status]))
  );

  return (
    <AppLayout page="volunteer" setPage={setPage} title="Volunteer Hub" subtitle="Hi, Alex · Zone C · Shift 14:00–20:00">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-8 space-y-5">

          {/* Tasks */}
          <motion.div variants={slideUp}>
            <GlassCard className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-white font-semibold">Assigned Tasks</h3>
                <Badge color="indigo">{volunteerTasks.filter(t => taskStates[t.id] !== "completed").length} pending</Badge>
              </div>
              <motion.div variants={containerVariants} className="space-y-2.5">
                {volunteerTasks.map((task, i) => {
                  const done = taskStates[task.id] === "completed";
                  return (
                    <motion.div key={task.id} variants={itemVariants}
                      className={`p-4 rounded-xl border transition-all duration-300 ${done
                        ? "border-emerald-500/10 opacity-50"
                        : "border-indigo-500/[0.08] hover:border-indigo-500/[0.2] glass"}`}>
                      <div className="flex items-start gap-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                          onClick={() => setTaskStates(s => ({ ...s, [task.id]: done ? "pending" : "completed" }))}
                          className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${done ? "border-emerald-500" : "border-slate-600 hover:border-indigo-500"}`}
                          style={done ? { background: "#10b981" } : {}}
                        >
                          {done && <CheckSquare size={11} className="text-white" />}
                        </motion.button>
                        <div className="flex-1">
                          <div className={`text-sm font-medium ${done ? "line-through text-slate-600" : "text-white"}`}>{task.task}</div>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-xs text-slate-600 font-mono-code flex items-center gap-1"><MapPin size={9} />{task.zone}</span>
                            <Badge color={task.priority === "high" ? "red" : task.priority === "medium" ? "amber" : "slate"}>{task.priority}</Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </GlassCard>
          </motion.div>

          {/* SOP */}
          <motion.div variants={slideUp}>
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clipboard size={15} className="text-indigo-400" />
                <h3 className="font-display text-white font-semibold">SOP Quick Reference</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { title: "Crowd Surge Protocol", steps: ["Stay calm, broadcast alert", "Open auxiliary exits", "Contact security team", "Document incident"] },
                  { title: "Medical Response", steps: ["Call medical radio", "Keep area clear", "Guide paramedics", "Complete incident form"] },
                ].map(({ title, steps }) => (
                  <div key={title} className="glass rounded-xl p-4 border border-indigo-500/[0.06]">
                    <div className="text-sm font-display font-semibold text-white mb-3">{title}</div>
                    {steps.map((s, i) => (
                      <div key={i} className="flex items-start gap-2 mb-1.5">
                        <span className="text-xs text-indigo-400 font-mono-code font-bold mt-0.5">{i + 1}.</span>
                        <span className="text-xs text-slate-500">{s}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <div className="col-span-12 md:col-span-4 space-y-4">
          {/* AI Copilot */}
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5" style={{ border: "1px solid rgba(99,102,241,0.2)" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}>
                  <Zap size={13} className="text-white" />
                </div>
                <span className="font-display text-white font-semibold text-sm">AI Copilot</span>
              </div>
              <div className="glass rounded-xl p-3 mb-3 border border-indigo-500/[0.08]">
                <p className="text-slate-400 text-sm leading-relaxed">Gate C queue at 540 people — suggest redirecting fans through Gate D. Your zone has capacity.</p>
              </div>
              <div className="flex gap-2">
                <PremiumButton variant="primary" size="sm" className="flex-1 justify-center">Accept</PremiumButton>
                <PremiumButton variant="ghost" size="sm" className="flex-1 justify-center">Dismiss</PremiumButton>
              </div>
            </GlassCard>
          </motion.div>

          {[
            { icon: Package, label: "Lost & Found", color: "#f59e0b" },
            { icon: Heart, label: "Medical Request", color: "#ef4444" },
            { icon: Bell, label: "Emergency Alert", color: "#ef4444" },
          ].map(({ icon: Icon, label, color }, i) => (
            <motion.div key={label} variants={itemVariants}>
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer"
                style={{ background: `${color}06`, border: `1px solid ${color}20` }}
              >
                <Icon size={17} style={{ color }} />
                <span className="font-display font-medium text-sm" style={{ color: color + "cc" }}>{label}</span>
                <ChevronRight size={13} className="ml-auto text-slate-600" />
              </motion.button>
            </motion.div>
          ))}

          <motion.div variants={itemVariants}>
            <GlassCard className="p-5">
              <div className="font-display text-white font-semibold text-sm mb-3">My Status</div>
              {[["Shift", "14:00–20:00"], ["Zone", "Gate C / C1"], ["Supervisor", "Omar Al-Rashid"], ["Radio", "Channel 7"]].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-indigo-500/[0.06] last:border-0">
                  <span className="text-xs text-slate-600 font-mono-code">{k}</span>
                  <span className="text-xs text-white font-medium">{v}</span>
                </div>
              ))}
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

