import { ALL_BOND_LEVELS, BondData, BondLevel, DATA_VERSION, STORAGE_KEY } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Private localStorage I/O — single source of truth for all reads/writes.
// Nothing outside this module calls localStorage directly.
// ─────────────────────────────────────────────────────────────────────────────

function readFromStorage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeToStorage(json: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, json);
  } catch (e) {
    console.error("Failed to write to localStorage:", e);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Debounce — bond clicks can fire many times per second on a large matrix.
// Structural mutations (add / remove / edit / import) bypass the debounce
// via immediate = true so they are never lost if the tab closes quickly.
// ─────────────────────────────────────────────────────────────────────────────

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// ─────────────────────────────────────────────────────────────────────────────
// Shared validation — both loadData and importData run untrusted input through
// this function. Accepting `unknown` prevents premature type-casting before the
// shape is verified. Returns null when the input is structurally invalid.
// ─────────────────────────────────────────────────────────────────────────────

const MAX_VALID_LEVEL = ALL_BOND_LEVELS.length - 1;

function validateAndSanitizeBondData(raw: unknown): BondData | null {
  if (typeof raw !== "object" || raw === null) return null;

  const parsed = raw as Record<string, unknown>;

  if (!Array.isArray(parsed.names)) return null;
  if (!parsed.names.every((n: unknown) => typeof n === "string")) return null;
  if (typeof parsed.bonds !== "object" || parsed.bonds === null) return null;

  // Sanitize every bond value: clamp out-of-range numbers to 0 so corrupted
  // or old-format files (e.g. from a 4-level version) never cause a UI crash.
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
// Migration — fix asymmetric bonds from older JSON exports.
//
// Old app versions stored only bonds[A][B]; bonds[B][A] was often missing or
// stale. This function ensures symmetry by resolving each (A, B) pair:
//   - If both directions exist and differ  → take Math.max (preserve intent)
//   - If only one direction exists         → copy it to the other
//
// Returns the corrected data plus a count of pairs that were fixed.
// ─────────────────────────────────────────────────────────────────────────────

function migrateToSymmetricBonds(data: BondData): {
  data: BondData;
  corrections: number;
} {
  const { names, bonds } = data;
  let corrections = 0;

  // Deep-clone bonds so we never mutate the input.
  const fixed: Record<string, Record<string, BondLevel>> = {};
  for (const name of names) {
    fixed[name] = { ...(bonds[name] ?? {}) };
  }

  // Iterate each unique ordered pair (i < j).
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const a = names[i];
      const b = names[j];
      const ab = fixed[a]?.[b] ?? 0;
      const ba = fixed[b]?.[a] ?? 0;

      if (ab !== ba) {
        // Math.max preserves the more meaningful bond — if A called B "Friends"
        // but B's record was missing, the user's intent was "Friends".
        const canonical = Math.max(ab, ba) as BondLevel;
        fixed[a][b] = canonical;
        fixed[b][a] = canonical;
        corrections++;
      }
    }
  }

  return {
    data: { ...data, bonds: fixed },
    corrections,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Persistence
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_DATA: BondData = { version: DATA_VERSION, names: [], bonds: {} };

export function loadData(): BondData {
  if (typeof window === "undefined") return EMPTY_DATA;

  const raw = readFromStorage();
  if (!raw) return EMPTY_DATA;

  let validated: BondData | null;
  try {
    validated = validateAndSanitizeBondData(JSON.parse(raw));
  } catch {
    return EMPTY_DATA;
  }
  if (!validated) return EMPTY_DATA;

  // Run migration on every load. If bonds were asymmetric (old export format),
  // fix them and immediately persist the corrected data so future loads are clean.
  const { data: migrated, corrections } = migrateToSymmetricBonds(validated);
  if (corrections > 0) {
    console.info(`[TBT] Migrated ${corrections} asymmetric bond pair(s) to symmetric.`);
    writeToStorage(JSON.stringify(migrated));
  }

  return migrated;
}

/**
 * Persist data to localStorage.
 *
 * @param data      The BondData to serialize.
 * @param immediate When true, write synchronously (used for structural
 *                  mutations: add/remove/edit name, import). When false
 *                  (default), debounce 400 ms to batch rapid bond clicks.
 */
export function saveData(data: BondData, immediate = false): void {
  if (typeof window === "undefined") return;

  // Always minified for storage — pretty-print is only for human-readable exports.
  const json = JSON.stringify(data);

  if (immediate) {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
      debounceTimer = null;
    }
    writeToStorage(json);
    return;
  }

  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    writeToStorage(json);
    debounceTimer = null;
  }, 400);
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

export function editName(data: BondData, oldName: string, newName: string): BondData {
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
  // Derive cycle length from ALL_BOND_LEVELS — adding a bond type only requires
  // editing types.ts.
  const next = ((current + 1) % ALL_BOND_LEVELS.length) as BondLevel;
  return setBond(data, from, to, next);
}

// ─────────────────────────────────────────────────────────────────────────────
// Import / Export
// ─────────────────────────────────────────────────────────────────────────────

export function exportData(data: BondData): void {
  // Pretty-print for human readability; minified is only for localStorage.
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
        // Run migration on import so asymmetric bonds from old exports are
        // corrected before the data enters the app's state.
        const { data: migrated, corrections } = migrateToSymmetricBonds(validated);
        if (corrections > 0) {
          console.info(`[TBT] Import: corrected ${corrections} asymmetric bond pair(s).`);
        }
        resolve(migrated);
      } catch {
        reject(new Error("Failed to parse JSON"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
