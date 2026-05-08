export type BondLevel = 0 | 1 | 2 | 3;

export interface BondData {
  version: number;
  names: string[];
  bonds: Record<string, Record<string, BondLevel>>;
}

export const BOND_CONFIG = {
  0: {
    label: "Strangers",
    emoji: "·",
    symbol: "○", // for colorblind
    bgClass: "bg-gray-200",
    textClass: "text-gray-500",
    borderClass: "border-gray-300",
    hex: "#E5E7EB",
    pattern: "none",
  },
  1: {
    label: "Acquaintances",
    emoji: "👋",
    symbol: "◎",
    bgClass: "bg-emerald-200",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-300",
    hex: "#BBF7D0",
    pattern: "dots",
  },
  2: {
    label: "Friends",
    emoji: "⭐",
    symbol: "★",
    bgClass: "bg-yellow-200",
    textClass: "text-yellow-700",
    borderClass: "border-yellow-300",
    hex: "#FEF08A",
    pattern: "stars",
  },
  3: {
    label: "Sweethearts",
    emoji: "💕",
    symbol: "♥",
    bgClass: "bg-pink-200",
    textClass: "text-pink-700",
    borderClass: "border-pink-300",
    hex: "#FECDD3",
    pattern: "hearts",
  },
} as const;

export const MAX_NAMES = 70;
export const STORAGE_KEY = "tomadachi-data";
export const DATA_VERSION = 1;
