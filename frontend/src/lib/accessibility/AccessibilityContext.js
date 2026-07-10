import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useEffect, useState } from "react";
const AccessibilityContext = createContext(null);
export function AccessibilityProvider({ children }) {
    const [fontSize, setFontSize] = useState(() => {
        const saved = localStorage.getItem("aizverse.fontSize");
        return saved ? parseInt(saved, 10) : 16;
    });
    const [highContrast, setHighContrast] = useState(() => {
        return localStorage.getItem("aizverse.highContrast") === "true";
    });
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem("aizverse.language") || "en";
    });
    const [toggles, setToggles] = useState(() => {
        const saved = localStorage.getItem("aizverse.toggles");
        return saved ? JSON.parse(saved) : {};
    });
    useEffect(() => {
        localStorage.setItem("aizverse.fontSize", fontSize.toString());
        document.documentElement.style.setProperty("--body-font-size", `${fontSize}px`);
    }, [fontSize]);
    useEffect(() => {
        localStorage.setItem("aizverse.highContrast", highContrast.toString());
        if (highContrast) {
            document.documentElement.classList.add("high-contrast");
        }
        else {
            document.documentElement.classList.remove("high-contrast");
        }
    }, [highContrast]);
    useEffect(() => {
        localStorage.setItem("aizverse.language", language);
    }, [language]);
    useEffect(() => {
        localStorage.setItem("aizverse.toggles", JSON.stringify(toggles));
    }, [toggles]);
    return (_jsx(AccessibilityContext.Provider, { value: {
            fontSize,
            setFontSize,
            highContrast,
            setHighContrast,
            toggles,
            setToggles,
            language,
            setLanguage,
        }, children: children }));
}
export function useAccessibility() {
    const ctx = useContext(AccessibilityContext);
    if (!ctx)
        throw new Error("useAccessibility must be used within an AccessibilityProvider");
    return ctx;
}
