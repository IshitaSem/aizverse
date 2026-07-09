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
import { useRoute } from "../features/navigation/useRoute";

// ─── STADIUM MAP ───
export function StadiumMapPage({ setPage }: { setPage: (p: Page) => void }) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [layer, setLayer] = useState("density");
  const { route, findRoute, isLoading: isRouting, error: routeError } = useRoute();

  // TODO(API): these six schematic zones (A–F) don't have a defined mapping
  // to the crowd-intelligence service's zoneId scheme yet, so density here
  // stays mock/demo data until that mapping is defined. Do not silently
  // wire this to /api/v1/crowd/summary without agreeing that mapping first —
  // it would show real numbers next to fabricated zone labels.
  const zones = [
    { id: "A", x: 25, y: 30, density: "high" },
    { id: "B", x: 50, y: 15, density: "medium" },
    { id: "C", x: 75, y: 30, density: "critical" },
    { id: "D", x: 75, y: 60, density: "medium" },
    { id: "E", x: 50, y: 75, density: "low" },
    { id: "F", x: 25, y: 60, density: "high" },
  ];

  const densityColor: Record<string, string> = {
    critical: "#ef4444", high: "#f59e0b", medium: "#eab308", low: "#10b981",
  };

  return (
    <AppLayout page="map" setPage={setPage} title="Interactive Stadium Map" subtitle="Lusail Iconic Stadium · Live Density Overlay">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-12 gap-5">

        <motion.div variants={slideUp} className="col-span-12 md:col-span-8">
          <GlassCard className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex gap-1.5 p-1 glass rounded-xl">
                {["density", "exits", "food", "accessible"].map(l => (
                  <motion.button key={l} whileTap={{ scale: 0.97 }} onClick={() => setLayer(l)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${layer === l ? "text-white" : "text-slate-500 hover:text-slate-300"}`}
                    style={layer === l ? { background: "linear-gradient(135deg, #6366f1, #4f46e5)" } : {}}>
                    {l}
                  </motion.button>
                ))}
              </div>
              <LiveBadge />
            </div>

            {/* Stadium layout */}
            <div className="relative w-full aspect-square max-h-[480px] glass rounded-2xl border border-indigo-500/[0.08] overflow-hidden scan-container">
              {/* Rings */}
              <div className="absolute inset-3 rounded-full border border-indigo-500/20" />
              <div className="absolute inset-14 rounded-full border border-cyan-500/15" />
              <div className="absolute inset-28 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.15)" }}>
                <span className="text-emerald-500/50 text-xs font-mono-code tracking-widest">PITCH</span>
              </div>
              {/* Glow in center */}
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(16,185,129,0.04), transparent 60%)" }} />

              {/* Zone buttons */}
              {zones.map(zone => (
                <motion.button key={zone.id}
                  whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedZone(zone.id === selectedZone ? null : zone.id)}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%`, transform: "translate(-50%,-50%)", background: densityColor[zone.density] }}
                  className={`absolute w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold font-display transition-all ${selectedZone === zone.id ? "ring-2 ring-white shadow-lg" : ""}`}
                  animate={selectedZone === zone.id ? { boxShadow: `0 0 20px ${densityColor[zone.density]}80` } : {}}
                >
                  {zone.id}
                </motion.button>
              ))}

              {/* Gate labels */}
              {[{ label: "Gate A", x: 50, y: 3 }, { label: "Gate C", x: 90, y: 45 }, { label: "Gate E", x: 50, y: 94 }, { label: "Gate F", x: 10, y: 45 }].map(g => (
                <div key={g.label} style={{ left: `${g.x}%`, top: `${g.y}%`, transform: "translate(-50%,-50%)" }}
                  className="absolute flex items-center gap-1 glass rounded-lg px-2 py-1 border border-indigo-500/[0.15]">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span className="text-xs text-slate-400 whitespace-nowrap font-mono-code">{g.label}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 mt-3 text-xs text-slate-600">
              {[["#ef4444", "Critical"], ["#f59e0b", "High"], ["#eab308", "Medium"], ["#10b981", "Low"]].map(([c, l]) => (
                <div key={l} className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}</div>
              ))}
            </div>
          </GlassCard>
        </motion.div>

        <div className="col-span-12 md:col-span-4 space-y-4">
          <AnimatePresence>
            {selectedZone && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <GlassCard className="p-5" style={{ border: "1px solid rgba(99,102,241,0.25)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-display text-white font-semibold">Section {selectedZone}</h3>
                    <motion.button whileHover={{ scale: 1.1 }} onClick={() => setSelectedZone(null)}>
                      <X size={13} className="text-slate-500 hover:text-white transition-colors" />
                    </motion.button>
                  </div>
                  {[["Capacity", "8,200 seats"], ["Current", "6,934 fans"], ["Density", "85% full"], ["Nearest Exit", "Gate C — 2 min"], ["Food Court", "Level 1, Court 4"]].map(([k, v]) => (
                    <div key={k} className="flex justify-between py-2 border-b border-indigo-500/[0.06] last:border-0">
                      <span className="text-xs text-slate-600 font-mono-code">{k}</span>
                      <span className="text-xs text-white font-medium">{v}</span>
                    </div>
                  ))}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={itemVariants}>
            <GlassCard className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Navigation size={14} className="text-indigo-400" />
                <h3 className="font-display text-white font-semibold text-sm">Navigate to</h3>
              </div>
              <div className="space-y-1.5">
                {[
                  { label: "My Seat K-14", icon: Star, color: "#6366f1" },
                  { label: "Nearest Restroom", icon: MapPin, color: "#64748b" },
                  { label: "Food Court 4", icon: Coffee, color: "#f59e0b" },
                  { label: "Accessible Route", icon: Accessibility, color: "#10b981" },
                  { label: "First Aid", icon: Heart, color: "#ef4444" },
                ].map(({ label, icon: Icon, color }) => (
                  <motion.button key={label} whileHover={{ x: 4 }}
                    onClick={() => findRoute(label, label === "Accessible Route" ? "accessible" : "fastest")}
                    disabled={isRouting}
                    style={{ borderColor: "rgba(99,102,241,0.06)" }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border text-sm transition-all glass cursor-pointer group disabled:opacity-50">
                    <Icon size={14} style={{ color }} />
                    <span className="text-slate-400 group-hover:text-white transition-colors">{label}</span>
                    <ChevronRight size={12} className="ml-auto text-slate-700 group-hover:text-indigo-400 transition-colors" />
                  </motion.button>
                ))}
              </div>
            </GlassCard>
          </motion.div>

          <AnimatePresence>
            {(route || routeError) && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
                <GlassCard className="p-5" style={{ border: "1px solid rgba(99,102,241,0.25)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Navigation size={13} className="text-indigo-400" />
                    <h3 className="font-display text-white font-semibold text-sm">AI route summary</h3>
                  </div>
                  {routeError && <p className="text-xs text-rose-400 font-mono-code">{routeError}</p>}
                  {route && (
                    <>
                      <p className="text-sm text-slate-300 leading-relaxed">{route.summary}</p>
                      <p className="text-xs text-emerald-400 font-mono-code mt-2">~{route.estimatedMinutes} min walk</p>
                    </>
                  )}
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AppLayout>
  );
}

