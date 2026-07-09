import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Page } from "../types";
import { pageVariants } from "../shared/animations";
import { GlobalStyles } from "../shared/GlobalStyles";
import { ChartGradients } from "../shared/ChartGradients";
import { AuthProvider, useAuth } from "../lib/auth/AuthContext";
import { LandingPage } from "../pages/LandingPage";
import { LoginPage } from "../pages/LoginPage";
import { FanDashboard } from "../pages/FanDashboard";
import { OrganizerDashboard } from "../pages/OrganizerDashboard";
import { VolunteerDashboard } from "../pages/VolunteerDashboard";
import { SecurityDashboard } from "../pages/SecurityDashboard";
import { AIChatPage } from "../pages/AIChatPage";
import { StadiumMapPage } from "../pages/StadiumMapPage";
import { CrowdAnalyticsPage } from "../pages/CrowdAnalyticsPage";
import { AccessibilityPage } from "../pages/AccessibilityPage";
import { TransportPage } from "../pages/TransportPage";
import { SustainabilityPage } from "../pages/SustainabilityPage";
import { EmergencyPage } from "../pages/EmergencyPage";

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
        <motion.div key={page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
          {pages[page]}
        </motion.div>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
