import { createContext, useContext } from "react";

export const SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

export const DISPLAY = "'Space Grotesk', Inter, sans-serif";

export const MONO = "'JetBrains Mono', ui-monospace, monospace";

export const DARK = {
  isDark: true,
  bg: "#0a0a0b",
  surface: "#111113",
  surfaceHigh: "#17171a",
  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.20)",
  textPrimary: "#f4f4f5",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
  accent: "#e5484d",
  accentSoft: "rgba(229,72,77,0.10)",
  accentBorder: "rgba(229,72,77,0.30)",
  cyan: "#f4f4f5",
  sky: "#a1a1aa",
  emerald: "#a1a1aa",
  violet: "#7aa2f7",
  navBg: "rgba(10,10,11,0.82)",
  mobileMenuBg: "rgba(10,10,11,0.98)",
  chipBg: "rgba(255,255,255,0.04)",
  chipBorder: "rgba(255,255,255,0.12)",
  outlineBorder: "rgba(255,255,255,0.18)",
  outlineBg: "rgba(255,255,255,0.04)",
  divider: "rgba(255,255,255,0.10)",
  tagBg: "rgba(229,72,77,0.12)",
  stripBorder: "rgba(255,255,255,0.08)",
  shadow: "0 1px 2px rgba(0,0,0,0.35)",
  shadowLg: "0 24px 60px rgba(0,0,0,0.45)",
};

export const LIGHT = {
  isDark: false,
  bg: "#fcfcfc",
  surface: "#ffffff",
  surfaceHigh: "#f4f4f5",
  border: "rgba(9,9,11,0.10)",
  borderStrong: "rgba(9,9,11,0.20)",
  textPrimary: "#09090b",
  textSecondary: "#52525b",
  textMuted: "#71717a",
  accent: "#d92d2d",
  accentSoft: "rgba(217,45,45,0.06)",
  accentBorder: "rgba(217,45,45,0.24)",
  cyan: "#09090b",
  sky: "#52525b",
  emerald: "#52525b",
  violet: "#3b6fd4",
  navBg: "rgba(252,252,252,0.85)",
  mobileMenuBg: "rgba(252,252,252,0.98)",
  chipBg: "#f4f4f5",
  chipBorder: "rgba(9,9,11,0.12)",
  outlineBorder: "rgba(9,9,11,0.18)",
  outlineBg: "#ffffff",
  divider: "rgba(9,9,11,0.10)",
  tagBg: "rgba(217,45,45,0.08)",
  stripBorder: "rgba(9,9,11,0.08)",
  shadow: "0 1px 2px rgba(9,9,11,0.05)",
  shadowLg: "0 24px 60px rgba(9,9,11,0.10)",
};

export const ThemeCtx = createContext(DARK);

export const useColors = () => useContext(ThemeCtx);
