export type BondLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface BondData {
  version: number;
  names: string[];
  bonds: Record<string, Record<string, BondLevel>>;
}

export const BOND_CONFIG = {
  0: {
    label: "Strangers",
    abbr: "STRGR",
    emoji: "·",
    symbol: "○",
    bgClass: "bg-gray-200",
    textClass: "text-gray-500",
    borderClass: "border-gray-300",
    hex: "#E5E7EB",
    // textHex matches the Tailwind v3 colour rendered by textClass — the single
    // source of truth for inline-style text colouring (replaces getTextColor).
    textHex: "#6b7280", // gray-500
    pattern: "none",
  },
  1: {
    label: "Acquaintances",
    abbr: "ACQNT",
    emoji: "👋",
    symbol: "◎",
    bgClass: "bg-emerald-200",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-300",
    hex: "#BBF7D0",
    textHex: "#047857", // emerald-700
    pattern: "dots",
  },
  2: {
    label: "Friends",
    abbr: "FRND",
    emoji: "⭐",
    symbol: "★",
    bgClass: "bg-yellow-200",
    textClass: "text-yellow-700",
    borderClass: "border-yellow-300",
    hex: "#FEF08A",
    textHex: "#a16207", // yellow-700
    pattern: "stars",
  },
  3: {
    label: "Sweethearts",
    abbr: "SWTHT",
    emoji: "💕",
    symbol: "♥",
    bgClass: "bg-pink-200",
    textClass: "text-pink-700",
    borderClass: "border-pink-300",
    hex: "#FECDD3",
    textHex: "#be185d", // pink-700
    pattern: "hearts",
  },
  4: {
    label: "Family",
    abbr: "FAM",
    emoji: "🏠",
    symbol: "⌂",
    bgClass: "bg-orange-200",
    textClass: "text-orange-700",
    borderClass: "border-orange-300",
    hex: "#FFB347",
    textHex: "#c2410c", // orange-700
    pattern: "house",
  },
  5: {
    // "One-Sided Love" describes the emotional dynamic of the relationship —
    // one party has stronger feelings — not a directional data assignment.
    // It behaves identically to all other bond types: symmetric, reciprocal,
    // and freely selectable by the user for any pair.
    label: "One-Sided Love",
    abbr: "1SIDE",
    emoji: "💜",
    symbol: "→",
    bgClass: "bg-purple-200",
    textClass: "text-purple-700",
    borderClass: "border-purple-300",
    hex: "#C3B1E1",
    textHex: "#7e22ce", // purple-700
    pattern: "arrows",
  },
} as const;

/** All bond levels as a typed array — single source of truth for iteration
 *  and for computing valid level ranges (e.g. cycleBond modulo). */
export const ALL_BOND_LEVELS: BondLevel[] = [0, 1, 2, 3, 4, 5];

export const MAX_NAMES = 70;
export const STORAGE_KEY = "tomadachi-data";
export const DATA_VERSION = 1;
