import { useCallback, useState } from "react";

import { ALL_BOND_LEVELS, BondLevel } from "@/lib/types";

// ─────────────────────────────────────────────────────────────────────────────
// Return type
// ─────────────────────────────────────────────────────────────────────────────

export interface BondFilterHook {
  /**
   * The currently active filter set.
   * Empty = show all bond types (default/reset state).
   * Non-empty = show only the bond types present in this set.
   */
  activeFilters: Set<BondLevel>;
  /** Toggle a single bond level in or out of the active filter set. */
  toggleFilter: (level: BondLevel) => void;
  /** Activate every bond level simultaneously. */
  selectAll: () => void;
  /** Deactivate all filters, returning to the "show all" default. */
  clearAll: () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useBondFilter(): BondFilterHook {
  const [activeFilters, setActiveFilters] = useState<Set<BondLevel>>(new Set());

  const toggleFilter = useCallback((level: BondLevel) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(level)) {
        next.delete(level);
      } else {
        next.add(level);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setActiveFilters(new Set(ALL_BOND_LEVELS));
  }, []);

  const clearAll = useCallback(() => {
    setActiveFilters(new Set());
  }, []);

  return { activeFilters, toggleFilter, selectAll, clearAll };
}
