import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Home, BarChart2, UserCheck, Shield, Activity, Map, MessageSquare,
  Train, Leaf, Accessibility, Siren, Menu, LogOut, Bell, Search, Zap,
} from "lucide-react";
import type { Page } from "../types";
import { pageVariants } from "./animations";
import { AnimatedBackground } from "./AnimatedBackground";
import { useAuth } from "../lib/auth/AuthContext";

// ─── SIDEBAR ───
export const navItems = [
  { id: "fan", label: "Fan Dashboard", icon: Home },
  { id: "organizer", label: "Operations Center", icon: BarChart2 },
  { id: "volunteer", label: "Volunteer", icon: UserCheck },
  { id: "security", label: "Security", icon: Shield },
  { id: "analytics", label: "Crowd Intelligence", icon: Activity },
  { id: "map", label: "Navigation", icon: Map },
  { id: "chat", label: "AI Assistant", icon: MessageSquare },
  { id: "transport", label: "Transport Hub", icon: Train },
  { id: "sustainability", label: "Sustainability", icon: Leaf },
  { id: "accessibility", label: "Accessibility", icon: Accessibility },
  { id: "emergency", label: "Emergency", icon: Siren },
];

export function Sidebar({ page, setPage, collapsed, setCollapsed }: {
  page: Page; setPage: (p: Page) => void; collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  const { logout } = useAuth();
  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full glass-nav flex flex-col z-40 overflow-hidden"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-indigo-500/[0.08] flex-shrink-0">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 400 }}
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 relative"
          style={{ background: "linear-gradient(135deg, #6366f1, #4f46e5)" }}
        >
          <Zap size={15} className="text-white relative z-10" />
          <div className="absolute inset-0 rounded-xl glow-border" />
        </motion.div>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <div className="font-display text-white font-bold text-sm tracking-wide">AIZVerse</div>
              <div className="text-indigo-400/60 text-[10px] font-mono-code">Stadium Intelligence</div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-slate-500 hover:text-indigo-400 transition-colors flex-shrink-0"
        >
          <Menu size={15} />
        </motion.button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map(({ id, label, icon: Icon }, i) => {
          const active = page === id;
          return (
            <motion.button
              key={id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ x: 2 }}
              onClick={() => setPage(id as Page)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 relative group ${
                active
                  ? "active-nav-glow text-indigo-300 bg-indigo-500/8"
                  : "text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-full bg-indigo-400"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={16} className={`flex-shrink-0 transition-colors ${active ? "text-indigo-400" : "group-hover:text-indigo-400"}`} />
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}
                    className="font-medium truncate text-sm">{label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t border-indigo-500/[0.08] flex-shrink-0">
        <motion.button
          whileHover={{ x: 2 }}
          onClick={() => {
            logout();
            setPage("landing");
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate-500 hover:text-red-400 hover:bg-red-500/[0.05] transition-all duration-200 group"
        >
          <LogOut size={15} className="flex-shrink-0" />
          {!collapsed && <span className="font-medium">Exit Platform</span>}
        </motion.button>
      </div>
    </motion.aside>
  );
}

// ─── TOP NAV ───
export function TopNav({ title, subtitle, collapsed }: { title: string; subtitle?: string; collapsed: boolean }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const { user } = useAuth();
  const initials = user
    ? user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase()
    : "JD";

  return (
    <motion.header
      animate={{ left: collapsed ? 64 : 240 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 right-0 z-30 flex items-center gap-4 px-6 py-4 glass-topnav"
    >
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-white font-bold text-base leading-tight truncate">{title}</h1>
        {subtitle && <p className="text-slate-500 text-xs font-mono-code">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 glass rounded-xl px-3 py-2 border border-indigo-500/[0.1] hover:border-indigo-500/[0.25] transition-colors">
          <Search size={13} className="text-slate-500" />
          <input placeholder="Search..." className="bg-transparent text-sm text-white placeholder-slate-600 outline-none w-32 font-body" />
          <kbd className="hidden lg:block text-[10px] text-slate-600 bg-white/[0.04] rounded px-1.5 py-0.5 font-mono-code">⌘K</kbd>
        </div>
        {/* Notifs */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <Bell size={15} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500">
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
            </span>
          </motion.button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 w-80 glass-bright rounded-2xl shadow-2xl p-3 space-y-1"
                style={{ boxShadow: "0 0 0 1px rgba(99,102,241,0.15), 0 20px 60px rgba(0,0,0,0.5)" }}
              >
                <div className="text-xs font-semibold text-slate-500 px-2 pb-1 font-mono-code">NOTIFICATIONS</div>
                {["Crowd density at Gate C elevated", "Medical team dispatched to Section F", "Match kickoff in 45 minutes"].map((n, i) => (
                  <motion.div key={i} whileHover={{ x: 3 }}
                    className="flex gap-3 items-start p-2.5 rounded-xl hover:bg-indigo-500/[0.05] cursor-pointer transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                    <span className="text-sm text-slate-300 leading-relaxed">{n}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {/* Avatar */}
        <motion.div whileHover={{ scale: 1.05 }}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold font-display cursor-pointer"
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}>
          {initials}
        </motion.div>
      </div>
    </motion.header>
  );
}

// ─── APP LAYOUT ───
export function AppLayout({ page, setPage, title, subtitle, children }: {
  page: Page; setPage: (p: Page) => void; title: string; subtitle?: string; children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen relative" style={{ fontFamily: "var(--font-body)" }}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-indigo-500 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>
      <AnimatedBackground />
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <TopNav title={title} subtitle={subtitle} collapsed={collapsed} />
      <motion.main
        id="main-content"
        animate={{ paddingLeft: collapsed ? 64 : 240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="min-h-screen pt-20 relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div key={page} variants={pageVariants} initial="initial" animate="animate" exit="exit" className="p-6">
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
}

