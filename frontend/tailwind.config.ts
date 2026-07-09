import type { Config } from "tailwindcss";

/**
 * Design tokens for the AIZVerse "stadium command-center" visual identity:
 * deep stadium-night navy base, floodlight amber for attention/CTA states,
 * pitch-green for AI/live/success states. See README for full rationale.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./features/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        stadium: {
          night: "#0B1220",
          panel: "#121B2E",
          line: "#233047",
        },
        floodlight: {
          DEFAULT: "#F2A93B",
          soft: "#FBD9A0",
        },
        pitch: {
          DEFAULT: "#3DDC84",
          dim: "#1F7A4C",
        },
        alert: "#E5484D",
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
