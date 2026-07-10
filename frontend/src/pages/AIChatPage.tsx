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
import { useAccessibility } from "../lib/accessibility/AccessibilityContext";
import { ChatWindow } from "../features/stadium-assistant/ChatWindow";

// ─── AI CHAT PAGE ───
export function AIChatPage({ setPage }: { setPage: (p: Page) => void }) {
  const { language: lang, setLanguage: setLang } = useAccessibility();

  return (
    <AppLayout page="chat" setPage={setPage} title="AIZA AI Assistant" subtitle="Multilingual · Real-time Stadium Intelligence">
      <div className="max-w-3xl mx-auto h-[calc(100vh-160px)] flex flex-col">

        {/* Header */}
        <motion.div variants={slideUp} initial="hidden" animate="visible" className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
               style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <div className="font-display text-white font-bold">AIZA</div>
              <div className="text-xs font-mono-code flex items-center gap-1.5 text-emerald-400">
                <span className="relative w-1.5 h-1.5 rounded-full bg-emerald-400">
                  <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
                </span>
                Online · Stadium Intelligence Active
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select value={lang.toUpperCase()} onChange={e => setLang(e.target.value.toLowerCase())}
              className="glass border border-indigo-500/[0.15] text-slate-300 text-xs rounded-lg px-2.5 py-1.5 outline-none font-mono-code">
              {["EN", "AR", "FR", "ES", "PT", "HI"].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <PremiumButton variant="ghost" size="sm">New Chat</PremiumButton>
          </div>
        </motion.div>

        <ChatWindow stadiumId="stadium-atl-01" language={lang} />
      </div>
    </AppLayout>
  );
}

