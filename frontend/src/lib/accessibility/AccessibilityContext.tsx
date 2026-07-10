import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AccessibilityContextValue {
  fontSize: number;
  setFontSize: (size: number | ((prev: number) => number)) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean | ((prev: boolean) => boolean)) => void;
  toggles: Record<string, boolean>;
  setToggles: (t: Record<string, boolean> | ((prev: Record<string, boolean>) => Record<string, boolean>)) => void;
  language: string;
  setLanguage: (lang: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextValue | null>(null);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [fontSize, setFontSize] = useState<number>(() => {
    const saved = localStorage.getItem("aizverse.fontSize");
    return saved ? parseInt(saved, 10) : 16;
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem("aizverse.highContrast") === "true";
  });
  const [language, setLanguage] = useState<string>(() => {
    return localStorage.getItem("aizverse.language") || "en";
  });
  const [toggles, setToggles] = useState<Record<string, boolean>>(() => {
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
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem("aizverse.language", language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem("aizverse.toggles", JSON.stringify(toggles));
  }, [toggles]);

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        toggles,
        setToggles,
        language,
        setLanguage,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error("useAccessibility must be used within an AccessibilityProvider");
  return ctx;
}
