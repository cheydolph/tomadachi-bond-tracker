import { useCallback, useEffect, useState } from "react";
import { BondData, BondLevel } from "@/lib/types";
import {
  addName as addNameToData,
  cycleBond as cycleBondInData,
  editName as editNameInData,
  importData as parseImportFile,
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

  // The single write path: every mutation goes through here so saves are never
  // forgotten and state is always consistent with localStorage.
  const persist = useCallback((next: BondData) => {
    setData(next);
    saveData(next);
  }, []);

  const addName = useCallback(
    (name: string) => persist(addNameToData(data, name)),
    [data, persist]
  );

  const requestRemoveName = useCallback((name: string) => {
    setPendingRemove(name);
  }, []);

  const confirmRemove = useCallback(() => {
    if (!pendingRemove) return;
    persist(removeNameFromData(data, pendingRemove));
    setPendingRemove(null);
  }, [data, pendingRemove, persist]);

  const cancelRemove = useCallback(() => setPendingRemove(null), []);

  const editName = useCallback(
    (oldName: string, newName: string) =>
      persist(editNameInData(data, oldName, newName)),
    [data, persist]
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
    (imported: BondData) => persist(imported),
    [persist]
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
