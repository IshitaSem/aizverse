import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, Suspense, lazy } from "react";
import { AnimatePresence, motion } from "motion/react";
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
const PUBLIC_PAGES = ["landing", "login"];
function AppShell() {
    const [page, setPage] = useState("landing");
    const { isAuthenticated, isInitializing } = useAuth();
    useEffect(() => {
        document.documentElement.classList.add("dark");
    }, []);
    // Route protection: any page besides landing/login requires a real
    // session. This runs after the localStorage-restored session finishes
    // initializing, so a page refresh doesn't briefly bounce a logged-in
    // user back to login.
    useEffect(() => {
        if (isInitializing)
            return;
        if (!PUBLIC_PAGES.includes(page) && !isAuthenticated) {
            setPage("login");
        }
    }, [page, isAuthenticated, isInitializing]);
    const pages = {
        landing: _jsx(LandingPage, { setPage: setPage }),
        login: _jsx(LoginPage, { setPage: setPage }),
        fan: _jsx(FanDashboard, { setPage: setPage }),
        organizer: _jsx(OrganizerDashboard, { setPage: setPage }),
        volunteer: _jsx(VolunteerDashboard, { setPage: setPage }),
        security: _jsx(SecurityDashboard, { setPage: setPage }),
        chat: _jsx(AIChatPage, { setPage: setPage }),
        map: _jsx(StadiumMapPage, { setPage: setPage }),
        analytics: _jsx(CrowdAnalyticsPage, { setPage: setPage }),
        accessibility: _jsx(AccessibilityPage, { setPage: setPage }),
        transport: _jsx(TransportPage, { setPage: setPage }),
        sustainability: _jsx(SustainabilityPage, { setPage: setPage }),
        emergency: _jsx(EmergencyPage, { setPage: setPage }),
    };
    return (_jsxs(_Fragment, { children: [_jsx(GlobalStyles, {}), _jsx(ChartGradients, {}), _jsx(AnimatePresence, { mode: "wait", children: _jsx(Suspense, { fallback: _jsx("div", { className: "loading-spinner", "aria-live": "polite", children: "Loading\u2026" }), children: _jsx(motion.div, { variants: pageVariants, initial: "initial", animate: "animate", exit: "exit", children: pages[page] }, page) }) })] }));
}
export default function App() {
    return (_jsx(AccessibilityProvider, { children: _jsx(AuthProvider, { children: _jsx(AppShell, {}) }) }));
}
