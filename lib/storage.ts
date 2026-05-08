import {
  ALL_BOND_LEVELS,
  BondData,
  BondLevel,
  DATA_VERSION,
  STORAGE_KEY,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Shared validation (P2-16)
// Both loadData and importData run untrusted input through this function.
// Accepting `unknown` prevents premature type-casting before we have verified
// the shape. Returns null when the input is structurally invalid.
// ─────────────────────────────────────────────────────────────────────────────

const MAX_VALID_LEVEL = ALL_BOND_LEVELS.length - 1;

function validateAndSanitizeBondData(raw: unknown): BondData | null {
  if (typeof raw !== "object" || raw === null) return null;

  const parsed = raw as Record<string, unknown>;

  if (!Array.isArray(parsed.names)) return null;
  if (!parsed.names.every((n: unknown) => typeof n === "string")) return null;
  if (typeof parsed.bonds !== "object" || parsed.bonds === null) return null;

  // Sanitize every bond value: clamp out-of-range numbers to 0 so corrupted or
  // old-format files (e.g. from a 4-level version) never cause a UI crash.
  const rawBonds = parsed.bonds as Record<string, unknown>;
  const sanitizedBonds: Record<string, Record<string, BondLevel>> = {};

  for (const from of Object.keys(rawBonds)) {
    const row = rawBonds[from];
    if (typeof row !== "object" || row === null) continue;
    sanitizedBonds[from] = {};
    for (const to of Object.keys(row as object)) {
      const val = (row as Record<string, unknown>)[to];
      sanitizedBonds[from][to] = (
        typeof val === "number" &&
        Number.isInteger(val) &&
        val >= 0 &&
        val <= MAX_VALID_LEVEL
          ? val
          : 0
      ) as BondLevel;
    }
  }

  return {
    version: DATA_VERSION,
    names: parsed.names as string[],
    bonds: sanitizedBonds,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Persistence
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_DATA: BondData = { version: DATA_VERSION, names: [], bonds: {} };

export function loadData(): BondData {
  if (typeof window === "undefined") return EMPTY_DATA;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_DATA;
    const validated = validateAndSanitizeBondData(JSON.parse(raw));
    return validated ?? EMPTY_DATA;
  } catch {
    return EMPTY_DATA;
  }
}

export function saveData(data: BondData): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data:", e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Pure data transformers — each takes BondData, returns new BondData
// ─────────────────────────────────────────────────────────────────────────────

export function addName(data: BondData, name: string): BondData {
  if (data.names.includes(name)) return data;
  const newBonds = { ...data.bonds, [name]: {} as Record<string, BondLevel> };
  data.names.forEach((existing) => {
    newBonds[name][existing] = 0;
    newBonds[existing] = { ...newBonds[existing], [name]: 0 };
  });
  return { ...data, names: [...data.names, name], bonds: newBonds };
}

export function removeName(data: BondData, name: string): BondData {
  const newNames = data.names.filter((n) => n !== name);
  const newBonds: Record<string, Record<string, BondLevel>> = {};
  newNames.forEach((n) => {
    newBonds[n] = { ...data.bonds[n] };
    delete newBonds[n][name];
  });
  return { ...data, names: newNames, bonds: newBonds };
}

export function editName(
  data: BondData,
  oldName: string,
  newName: string
): BondData {
  if (oldName === newName) return data;
  if (data.names.includes(newName)) return data;

  const newNames = data.names.map((n) => (n === oldName ? newName : n));
  const newBonds: Record<string, Record<string, BondLevel>> = {};

  newNames.forEach((n) => {
    const srcName = n === newName ? oldName : n;
    newBonds[n] = {};
    newNames.forEach((m) => {
      const srcM = m === newName ? oldName : m;
      newBonds[n][m] = (data.bonds[srcName]?.[srcM] ?? 0) as BondLevel;
    });
    delete newBonds[n][n]; // no self-bonds
  });

  return { ...data, names: newNames, bonds: newBonds };
}

export function setBond(
  data: BondData,
  from: string,
  to: string,
  level: BondLevel
): BondData {
  // Write both A→B and B→A in one immutable return. Pure function — React calls
  // setState exactly once with the result, so no recursive trigger, no loop.
  return {
    ...data,
    bonds: {
      ...data.bonds,
      [from]: { ...data.bonds[from], [to]: level },
      [to]: { ...data.bonds[to], [from]: level },
    },
  };
}

export function cycleBond(data: BondData, from: string, to: string): BondData {
  const current = data.bonds[from]?.[to] ?? 0;
  // Derive the cycle length from ALL_BOND_LEVELS so adding a new bond type
  // only requires editing types.ts
  const next = ((current + 1) % ALL_BOND_LEVELS.length) as BondLevel;
  return setBond(data, from, to, next);
}

// ─────────────────────────────────────────────────────────────────────────────
// Import / Export
// ─────────────────────────────────────────────────────────────────────────────

export function exportData(data: BondData): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tomadachi-bonds-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importData(file: File): Promise<BondData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed: unknown = JSON.parse(e.target?.result as string);
        const validated = validateAndSanitizeBondData(parsed);
        if (!validated) {
          reject(new Error("Invalid file format"));
          return;
        }
        resolve(validated);
      } catch {
        reject(new Error("Failed to parse JSON"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
