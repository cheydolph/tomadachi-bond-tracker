import { useCallback, useEffect, useState } from "react";
import { BondData, BondLevel } from "@/lib/types";
import {
  addName as addNameToData,
  cycleBond as cycleBondInData,
  editName as editNameInData,
  loadData,
  removeName as removeNameFromData,
  saveData,
  setBond as setBondInData,
} from "@/lib/storage";

// ─────────────────────────────────────────────────────────────────────────────
// Return type — explicit interface keeps consumers honest about what the hook
// exposes and makes the shape easy to audit without reading the implementation.
// ─────────────────────────────────────────────────────────────────────────────

export interface BondDataHook {
  /** Current bond dataset, including names and bond levels. */
  data: BondData;
  /** False until the initial localStorage load completes; prevents hydration flash. */
  hydrated: boolean;
  /** Non-null when a remove confirmation dialog should be shown. */
  pendingRemove: string | null;

  addName: (name: string) => void;
  /** Stages a remove; shows the confirmation dialog rather than deleting immediately. */
  requestRemoveName: (name: string) => void;
  confirmRemove: () => void;
  cancelRemove: () => void;
  editName: (oldName: string, newName: string) => void;
  cycleBond: (from: string, to: string) => void;
  setBond: (from: string, to: string, level: BondLevel) => void;
  importBondData: (imported: BondData) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useBondData(): BondDataHook {
  const [data, setData] = useState<BondData>({
    version: 1,
    names: [],
    bonds: {},
  });
  const [hydrated, setHydrated] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<string | null>(null);

  // Load persisted data once on mount (client-side only).
  useEffect(() => {
    setData(loadData());
    setHydrated(true);
  }, []);

  // ── Write paths ────────────────────────────────────────────────────────────

  // Bond mutations: debounced (400 ms). Rapid clicking 70×70 matrix cells
  // can fire dozens of writes per second — debouncing prevents excessive I/O.
  const persist = useCallback((next: BondData) => {
    setData(next);
    saveData(next);
  }, []);

  // Structural mutations: immediate. A name deletion must be flushed now;
  // if the tab closes within 400 ms the debounced write would never fire.
  const persistImmediate = useCallback((next: BondData) => {
    setData(next);
    saveData(next, true);
  }, []);

  // ── Mutations ─────────────────────────────────────────────────────────────

  const addName = useCallback(
    (name: string) => persistImmediate(addNameToData(data, name)),
    [data, persistImmediate]
  );

  const requestRemoveName = useCallback((name: string) => {
    setPendingRemove(name);
  }, []);

  const confirmRemove = useCallback(() => {
    if (!pendingRemove) return;
    persistImmediate(removeNameFromData(data, pendingRemove));
    setPendingRemove(null);
  }, [data, pendingRemove, persistImmediate]);

  const cancelRemove = useCallback(() => setPendingRemove(null), []);

  const editName = useCallback(
    (oldName: string, newName: string) =>
      persistImmediate(editNameInData(data, oldName, newName)),
    [data, persistImmediate]
  );

  const cycleBond = useCallback(
    (from: string, to: string) => persist(cycleBondInData(data, from, to)),
    [data, persist]
  );

  const setBond = useCallback(
    (from: string, to: string, level: BondLevel) =>
      persist(setBondInData(data, from, to, level)),
    [data, persist]
  );

  const importBondData = useCallback(
    (imported: BondData) => persistImmediate(imported),
    [persistImmediate]
  );

  return {
    data,
    hydrated,
    pendingRemove,
    addName,
    requestRemoveName,
    confirmRemove,
    cancelRemove,
    editName,
    cycleBond,
    setBond,
    importBondData,
  };
}
