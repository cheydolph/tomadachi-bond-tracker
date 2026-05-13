import { ALL_BOND_LEVELS, BOND_CONFIG } from '@/lib/types'
import type { BondLevel } from '@/lib/types'

interface BondFilterProps {
  activeFilters: Set<BondLevel>
  onToggle: (level: BondLevel) => void
  onSelectAll: () => void
  onClearAll: () => void
}

export default function BondFilter({
  activeFilters,
  onToggle,
  onSelectAll,
  onClearAll,
}: BondFilterProps) {
  const hasActive = activeFilters.size > 0
  const allSelected = activeFilters.size === ALL_BOND_LEVELS.length

  return (
    <div className="flex flex-col gap-1.5">
      {/* ── Control row ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-xs font-semibold text-gray-400 uppercase tracking-wide"
          style={{ fontFamily: 'Nunito' }}
        >
          Filter:
        </span>

        <button
          onClick={onSelectAll}
          disabled={allSelected}
          aria-label="Select all bond type filters"
          className="touch-target rounded-lg px-2 text-xs font-semibold text-indigo-500
            hover:text-indigo-700 hover:bg-indigo-50
            dark:hover:text-indigo-300 dark:hover:bg-indigo-900/40
            transition-colors
            disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent"
        >
          Select All
        </button>

        {hasActive && (
          <button
            onClick={onClearAll}
            aria-label="Clear all filters"
            className="touch-target rounded-lg px-2 text-xs font-semibold text-gray-400
              hover:text-gray-600 hover:bg-gray-100
              dark:hover:text-gray-200 dark:hover:bg-gray-700/60
              transition-colors"
          >
            Clear
          </button>
        )}

        {hasActive && (
          <span className="text-xs text-gray-400 leading-none">
            {activeFilters.size} of {ALL_BOND_LEVELS.length} shown
          </span>
        )}
      </div>

      {/* ── Pill row ────────────────────────────────────────────────────────
          py-1.5 gives 6px vertical breathing room so the ring-2 ring-offset-1
          on active pills (3px protrusion) + scale-105 aren't clipped.
          overflow-x: auto also makes overflow-y: auto per CSS spec, which would
          clip any protruding ring without this explicit vertical padding.     */}
      <div className="overflow-x-auto -mx-1 px-1 py-1.5">
        <div
          className="flex items-center gap-2.5"
          style={{ width: 'max-content' }}
        >
          {ALL_BOND_LEVELS.map((level) => {
            const cfg = BOND_CONFIG[level]
            const isActive = activeFilters.has(level)

            return (
              <button
                key={level}
                onClick={() => onToggle(level)}
                aria-pressed={isActive}
                title={`${isActive ? 'Remove' : 'Add'} filter: ${cfg.label}`}
                className={`
                  touch-target flex items-center gap-1.5 px-3 py-2.5
                  rounded-full text-xs font-bold whitespace-nowrap
                  transition-all duration-150 select-none border
                  ${
                    isActive
                      ? `bond-cell-${level} ${cfg.textClass} border-transparent ring-2 ring-offset-0 ring-gray-500 dark:ring-offset-gray-900 scale-105`
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-700 dark:hover:text-gray-100'
                  }
                `}
              >
                <span aria-hidden="true">{cfg.symbol}</span>
                <span>{cfg.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
