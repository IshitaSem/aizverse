import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { useAccessibility } from "../lib/accessibility/AccessibilityContext";
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

// ─── ACCESSIBILITY ───
export function AccessibilityPage({ setPage }: { setPage: (p: Page) => void }) {
  const { fontSize, setFontSize, highContrast, setHighContrast, toggles, setToggles } = useAccessibility();

  return (
    <AppLayout page="accessibility" setPage={setPage} title="Accessibility Center" subtitle="WCAG AA Compliant · Inclusive Experience for All Fans">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-4 space-y-4">
          <motion.div variants={itemVariants}>
            <GlassCard className="p-5">
              <h3 className="font-display text-white font-semibold mb-4">Display Settings</h3>
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-2.5">
                    <span className="text-slate-400">Font Size</span>
                    <span className="text-white font-bold font-mono-code">{fontSize}px</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => setFontSize(f => Math.max(12, f - 2))}
                      aria-label="Decrease font size"
                      className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white border border-indigo-500/[0.15] hover:border-indigo-500/40 transition-colors">
                      <Minus size={13} />
                    </motion.button>
                    <div className="flex-1 h-1.5 rounded-full" style={{ background: "rgba(99,102,241,0.1)" }}>
                      <motion.div animate={{ width: `${((fontSize - 12) / 12) * 100}%` }}
                        transition={{ duration: 0.3 }} className="h-full rounded-full" style={{ background: "linear-gradient(90deg, #6366f1, #8b5cf6)" }} />
                    </div>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => setFontSize(f => Math.min(24, f + 2))}
                      aria-label="Increase font size"
                      className="w-8 h-8 glass rounded-lg flex items-center justify-center text-white border border-indigo-500/[0.15] hover:border-indigo-500/40 transition-colors">
                      <Plus size={13} />
                    </motion.button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-300 font-medium">High Contrast</div>
                    <div className="text-xs text-slate-600 font-mono-code">Enhanced visibility mode</div>
                  </div>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => setHighContrast(h => !h)}
                    role="switch" aria-checked={highContrast} aria-label="Toggle high contrast mode"
                    className={`w-12 h-6 rounded-full relative transition-all duration-300 ${highContrast ? "" : ""}`}
                    style={{ background: highContrast ? "linear-gradient(90deg, #6366f1, #4f46e5)" : "rgba(99,102,241,0.15)" }}>
                    <motion.div animate={{ left: highContrast ? "calc(100% - 20px)" : "2px" }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-lg" />
                  </motion.button>
                </div>
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassCard className="p-5">
              <h3 className="font-display text-white font-semibold mb-4">Assistance Modes</h3>
              <div className="space-y-2.5">
                {[
                  { key: "audio", icon: Volume2, label: "Audio Navigation", desc: "Turn-by-turn voice guidance" },
                  { key: "screen", icon: Headphones, label: "Screen Reader", desc: "Full ARIA compatibility" },
                  { key: "sign", icon: Wifi, label: "Sign Language", desc: "AI-powered interpreter" },
                  { key: "motion", icon: Sun, label: "Reduced Motion", desc: "Minimal animations" },
                ].map(({ key, icon: Icon, label, desc }) => (
                  <div key={key} className="flex items-center justify-between p-3 glass rounded-xl border border-indigo-500/[0.06]">
                    <div className="flex items-center gap-3">
                      <Icon size={15} className="text-indigo-400" />
                      <div>
                        <div className="text-sm text-white font-medium">{label}</div>
                        <div className="text-xs text-slate-600 font-mono-code">{desc}</div>
                      </div>
                    </div>
                    <motion.button whileTap={{ scale: 0.95 }}
                      onClick={() => setToggles(t => ({ ...t, [key]: !t[key] }))}
                      role="switch" aria-checked={toggles[key] || false} aria-label={`Toggle ${label}`}
                      className="w-10 h-5 rounded-full relative transition-all duration-300 flex-shrink-0"
                      style={{ background: toggles[key] ? "linear-gradient(90deg, #6366f1, #4f46e5)" : "rgba(99,102,241,0.12)" }}>
                      <motion.div animate={{ left: toggles[key] ? "calc(100% - 18px)" : "2px" }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow" />
                    </motion.button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <div className="col-span-12 md:col-span-8 space-y-4">
          <motion.div variants={slideUp}>
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Accessibility size={17} className="text-indigo-400" />
                <h3 className="font-display text-white font-semibold">Accessible Routes</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { from: "Main Entrance", to: "Section A Accessible Seating", time: "4 min", lift: true },
                  { from: "Gate H", to: "Section K Row 1–3", time: "6 min", lift: true },
                  { from: "Parking Level P2", to: "Stadium Level 0", time: "3 min", lift: false },
                  { from: "Any Gate", to: "Accessible Restrooms", time: "2 min", lift: false },
                ].map(({ from, to, time, lift }) => (
                  <motion.div key={to} whileHover={{ y: -2 }} className="glass rounded-xl p-4 border border-indigo-500/[0.06] hover:border-indigo-500/[0.2] transition-colors cursor-default">
                    <div className="text-xs text-slate-600 mb-1 font-mono-code">From: {from}</div>
                    <div className="text-sm text-white font-medium mb-2">{to}</div>
                    <div className="flex items-center gap-2">
                      <Badge color="indigo">{time}</Badge>
                      {lift && <Badge color="green">Lift Available</Badge>}
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div variants={slideUp}>
            <GlassCard className="p-5">
              <h3 className="font-display text-white font-semibold mb-4">Accessibility Services</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Companion Seating", icon: Users },
                  { label: "Hearing Loop", icon: Headphones },
                  { label: "Priority Parking", icon: Car },
                  { label: "Sensory Room", icon: Heart },
                  { label: "Sign Language", icon: Wifi },
                  { label: "Medical Assistance", icon: Heart },
                ].map(({ label, icon: Icon }) => (
                  <motion.button key={label} whileHover={{ y: -4, scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    className="flex flex-col items-center gap-2.5 p-4 glass border border-indigo-500/[0.06] hover:border-indigo-500/[0.25] rounded-xl transition-all text-center group">
                    <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all">
                      <Icon size={15} />
                    </div>
                    <span className="text-xs text-slate-500 group-hover:text-slate-300 transition-colors leading-tight">{label}</span>
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>
    </AppLayout>
  );
}

