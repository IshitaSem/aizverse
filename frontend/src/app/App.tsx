import { useEffect, useState, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Page } from "../types";
import { pageVariants } from "../shared/animations";
import { GlobalStyles } from "../shared/GlobalStyles";
import { ChartGradients } from "../shared/ChartGradients";
import { AuthProvider, useAuth } from "../lib/auth/AuthContext";
import { AccessibilityProvider } from "../lib/accessibility/AccessibilityContext";

// Lazy load heavy pages for route‑level code splitting
const LandingPage = lazy(() => import("../pages/LandingPage").then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import("../pages/LoginPage").then(m => ({ default: m.LoginPage })));
const FanDashboard = lazy(() => import("../pages/FanDashboard").then(m => ({ default: m.FanDashboard })));
const OrganizerDashboard = lazy(() => import("../pages/OrganizerDashboard").then(m => ({ default: m.OrganizerDashboard })));
const VolunteerDashboard = lazy(() => import("../pages/VolunteerDashboard").then(m => ({ default: m.VolunteerDashboard })));
const SecurityDashboard = lazy(() => import("../pages/SecurityDashboard").then(m => ({ default: m.SecurityDashboard })));
const AIChatPage = lazy(() => import("../pages/AIChatPage").then(m => ({ default: m.AIChatPage })));
const StadiumMapPage = lazy(() => import("../pages/StadiumMapPage").then(m => ({ default: m.StadiumMapPage })));
const CrowdAnalyticsPage = lazy(() => import("../pages/CrowdAnalyticsPage").then(m => ({ default: m.CrowdAnalyticsPage })));
const AccessibilityPage = lazy(() => import("../pages/AccessibilityPage").then(m => ({ default: m.AccessibilityPage })));
const TransportPage = lazy(() => import("../pages/TransportPage").then(m => ({ default: m.TransportPage })));
const SustainabilityPage = lazy(() => import("../pages/SustainabilityPage").then(m => ({ default: m.SustainabilityPage })));
const EmergencyPage = lazy(() => import("../pages/EmergencyPage").then(m => ({ default: m.EmergencyPage })));

const PUBLIC_PAGES: Page[] = ["landing", "login"];

function AppShell() {
  const [page, setPage] = useState<Page>("landing");
  const { isAuthenticated, isInitializing } = useAuth();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // Route protection: any page besides landing/login requires a real
  // session. This runs after the localStorage-restored session finishes
  // initializing, so a page refresh doesn't briefly bounce a logged-in
  // user back to login.
  useEffect(() => {
    if (isInitializing) return;
    if (!PUBLIC_PAGES.includes(page) && !isAuthenticated) {
      setPage("login");
    }
  }, [page, isAuthenticated, isInitializing]);

  const pages: Record<Page, React.ReactNode> = {
    landing: <LandingPage setPage={setPage} />,
    login: <LoginPage setPage={setPage} />,
    fan: <FanDashboard setPage={setPage} />,
    organizer: <OrganizerDashboard setPage={setPage} />,
    volunteer: <VolunteerDashboard setPage={setPage} />,
    security: <SecurityDashboard setPage={setPage} />,
    chat: <AIChatPage setPage={setPage} />,
    map: <StadiumMapPage setPage={setPage} />,
    analytics: <CrowdAnalyticsPage setPage={setPage} />,
    accessibility: <AccessibilityPage setPage={setPage} />,
    transport: <TransportPage setPage={setPage} />,
    sustainability: <SustainabilityPage setPage={setPage} />,
    emergency: <EmergencyPage setPage={setPage} />,
  };

  return (
    <>
      <GlobalStyles />
      <ChartGradients />
      <AnimatePresence mode="wait">
        <Suspense fallback={<div className="loading-spinner" aria-live="polite">Loading…</div>}>
          <motion.div key={page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            {pages[page]}
          </motion.div>
        </Suspense>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </AccessibilityProvider>
  );
}
