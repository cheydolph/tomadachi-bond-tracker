import { BondData, BondLevel, DATA_VERSION, STORAGE_KEY } from "./types";

export function loadData(): BondData {
  if (typeof window === "undefined") {
    return { version: DATA_VERSION, names: [], bonds: {} };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { version: DATA_VERSION, names: [], bonds: {} };
    const parsed = JSON.parse(raw) as BondData;
    // Migrate or validate
    if (!parsed.names || !parsed.bonds) {
      return { version: DATA_VERSION, names: [], bonds: {} };
    }
    return { ...parsed, version: DATA_VERSION };
  } catch {
    return { version: DATA_VERSION, names: [], bonds: {} };
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

export function addName(data: BondData, name: string): BondData {
  if (data.names.includes(name)) return data;
  const newBonds = { ...data.bonds };
  // Initialize bonds for the new name
  newBonds[name] = {};
  data.names.forEach((existing) => {
    newBonds[name][existing] = 0;
    newBonds[existing] = { ...newBonds[existing], [name]: 0 };
  });
  return {
    ...data,
    names: [...data.names, name],
    bonds: newBonds,
  };
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
  if (data.names.includes(newName)) return data; // duplicate
  const newNames = data.names.map((n) => (n === oldName ? newName : n));
  const newBonds: Record<string, Record<string, BondLevel>> = {};
  newNames.forEach((n) => {
    const realN = n;
    const srcName = n === newName ? oldName : n;
    newBonds[realN] = {};
    newNames.forEach((m) => {
      const srcM = m === newName ? oldName : m;
      newBonds[realN][m] = (data.bonds[srcName]?.[srcM] ?? 0) as BondLevel;
    });
    // Remove self
    delete newBonds[realN][realN];
  });
  return { ...data, names: newNames, bonds: newBonds };
}

export function setBond(
  data: BondData,
  from: string,
  to: string,
  level: BondLevel
): BondData {
  // Write both A→B and B→A in one immutable return.
  // Pure function — React calls setState exactly once with the result,
  // so there is no recursive trigger and no infinite loop.
  return {
    ...data,
    bonds: {
      ...data.bonds,
      [from]: {
        ...data.bonds[from],
        [to]: level,
      },
      [to]: {
        ...data.bonds[to],
        [from]: level,
      },
    },
  };
}

export function cycleBond(data: BondData, from: string, to: string): BondData {
  const current = data.bonds[from]?.[to] ?? 0;
  const next = ((current + 1) % 4) as BondLevel;
  return setBond(data, from, to, next);
}

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
        const parsed = JSON.parse(e.target?.result as string) as BondData;
        if (!parsed.names || !Array.isArray(parsed.names)) {
          reject(new Error("Invalid file format"));
          return;
        }
        resolve({ ...parsed, version: DATA_VERSION });
      } catch {
        reject(new Error("Failed to parse JSON"));
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsText(file);
  });
}
