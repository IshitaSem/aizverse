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
import { useAssistantChat } from "../features/stadium-assistant/useAssistantChat";
import type { AssistantLanguage } from "../features/stadium-assistant/useAssistantChat";

// Matches backend/src/features/stadium-assistant/assistant.schema.ts exactly —
// only languages the backend actually accepts are offered here.
const SUPPORTED_LANGUAGES: { code: AssistantLanguage; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "fr", label: "FR" },
  { code: "es", label: "ES" },
  { code: "pt", label: "PT" },
  { code: "hi", label: "HI" },
];

// ─── AI CHAT PAGE ───
export function AIChatPage({ setPage }: { setPage: (p: Page) => void }) {
  const [lang, setLang] = useState<AssistantLanguage>("en");
  const { messages, sendMessage: sendToAssistant, isLoading: isTyping, error } = useAssistantChat(chatMessages, lang);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    const text = input;
    setInput("");
    void sendToAssistant(text).then(() => {
      if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    });
  };

  const prompts = [
    "Wait time at Gate C?", "Vegetarian food nearby", "Route to seat K-14",
    "Fan zone events today", "Metro status now", "Accessible parking?",
  ];

  return (
    <AppLayout page="chat" setPage={setPage} title="AI Stadium Operations Assistant" subtitle="Multilingual · Real-time Stadium Intelligence · Gemini">
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
            <select value={lang} onChange={e => setLang(e.target.value as AssistantLanguage)}
              aria-label="Assistant response language"
              className="glass border border-indigo-500/[0.15] text-slate-300 text-xs rounded-lg px-2.5 py-1.5 outline-none font-mono-code">
              {SUPPORTED_LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
            <PremiumButton variant="ghost" size="sm">New Chat</PremiumButton>
          </div>
        </motion.div>

        <motion.div variants={slideUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}
          className="flex-1 flex flex-col glass-bright rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.12), 0 20px 60px rgba(0,0,0,0.4)" }}>

          {/* Messages */}
          <div
            ref={scrollRef}
            role="log"
            aria-live="polite"
            aria-label="Conversation with the stadium assistant"
            className="flex-1 overflow-y-auto p-5 space-y-4"
          >
            <AnimatePresence>
              {messages.map((m, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, y: 15, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${m.role === "assistant" ? "" : "bg-slate-700"}`}
                    style={m.role === "assistant" ? { background: "linear-gradient(135deg, #6366f1, #8b5cf6)" } : {}}>
                    {m.role === "assistant" ? <Zap size={14} className="text-white" /> : <User size={14} className="text-white" />}
                  </div>
                  <div className={`max-w-[75%] flex flex-col gap-1 ${m.role === "user" ? "items-end" : "items-start"}`}>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "text-white" : "glass text-slate-300 border border-indigo-500/[0.08]"}`}
                      style={m.role === "user" ? { background: "linear-gradient(135deg, #6366f1, #4f46e5)", borderRadius: "16px 16px 4px 16px" } : { borderRadius: "16px 16px 16px 4px" }}>
                      {m.text}
                    </div>
                    <span className="text-xs text-slate-700 font-mono-code">{m.role === "assistant" ? "AIZA" : "You"}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
                  <Zap size={14} className="text-white" />
                </div>
                <div className="glass border border-indigo-500/[0.08] px-4 py-3 rounded-2xl flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                      className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Suggested prompts */}
          <div className="px-5 py-3 border-t border-indigo-500/[0.08]">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {prompts.map(p => (
                <motion.button key={p} whileHover={{ scale: 1.02, y: -1 }} onClick={() => setInput(p)}
                  className="flex-shrink-0 text-xs glass border border-indigo-500/[0.1] hover:border-indigo-500/[0.3] text-slate-500 hover:text-white px-3 py-1.5 rounded-lg transition-all font-mono-code">
                  {p}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Input */}
          {error && (
            <div role="alert" className="px-5 pt-3 text-xs text-rose-400 font-mono-code">{error}</div>
          )}
          <div className="p-4 border-t border-indigo-500/[0.08]">
            <div className="flex gap-3">
              <div className="flex-1 flex items-center gap-2 glass border border-indigo-500/[0.1] rounded-xl px-4 focus-within:border-indigo-500/[0.4] transition-colors">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
                  aria-label="Ask AIZA about the stadium"
                  placeholder="Ask AIZA about the stadium, events, navigation..."
                  className="flex-1 bg-transparent py-3 text-sm text-white placeholder-slate-600 outline-none" />
                <motion.button whileHover={{ scale: 1.1 }} aria-label="Voice input (not yet available)" className="text-slate-600 hover:text-indigo-400 transition-colors"><Mic size={15} /></motion.button>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={sendMessage}
                aria-label="Send message"
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
                <Send size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
}

