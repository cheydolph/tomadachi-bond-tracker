import { ALL_BOND_LEVELS, BOND_CONFIG } from '@/lib/types'
import type { BondLevel } from '@/lib/types'

interface BondCardProps {
  from: string
  to: string
  displayMode: 'pair' | 'target'
  level: BondLevel
  isPickerOpen: boolean
  onTogglePicker: () => void
  onSetBond: (from: string, to: string, level: BondLevel) => void
}

export default function BondCard({
  from,
  to,
  displayMode,
  level,
  isPickerOpen,
  onTogglePicker,
  onSetBond,
}: BondCardProps) {
  const cfg = BOND_CONFIG[level]

  const renderPickerBtn = (lvl: BondLevel) => {
    const lcfg = BOND_CONFIG[lvl]
    return (
      <button
        key={lvl}
        onClick={() => onSetBond(from, to, lvl)}
        aria-label={`Set bond to ${lcfg.label}`}
        aria-pressed={level === lvl}
        className={`
          flex-1 min-w-[60px] min-h-[44px] flex flex-col items-center
          justify-center py-3 rounded-xl text-sm bond-cell-${lvl} transition-all
          ${level === lvl ? 'ring-2 ring-gray-500 dark:ring-offset-gray-900 scale-105' : 'hover:scale-105'}
        `}
      >
        <span className={`text-base ${lcfg.textClass}`} aria-hidden="true">
          {lcfg.symbol}
        </span>
        <span className={`text-[10px] font-bold mt-0.5 ${lcfg.textClass}`}>
          {lcfg.abbr}
        </span>
      </button>
    )
  }

  return (
    <div className="mobile-card">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          {displayMode === 'pair' ? (
            <p className="text-xs font-bold text-gray-800 dark:text-yellow-100/90 truncate">
              {from}{' '}
              <span className="font-normal text-gray-400 dark:text-yellow-200/40">
                ↔
              </span>{' '}
              {to}
            </p>
          ) : (
            <p className="text-lg font-bold text-gray-800 dark:text-yellow-100/90 truncate">
              {to}
            </p>
          )}
        </div>

        <button
          className={`bond-cell-${level} min-h-[44px] rounded-xl px-3 py-2 flex items-center gap-1.5 flex-shrink-0`}
          onClick={onTogglePicker}
          aria-label={`${displayMode === 'pair' ? `${from} and ${to}` : to}: ${cfg.label}. Tap to change.`}
          aria-expanded={isPickerOpen}
        >
          <span className={`text-base ${cfg.textClass}`} aria-hidden="true">
            {cfg.symbol}
          </span>
          <span className={`text-xs font-bold ${cfg.textClass}`}>
            {cfg.label}
          </span>
          <span className="text-xs text-gray-400 ml-0.5" aria-hidden="true">
            ▾
          </span>
        </button>
      </div>

      {isPickerOpen && (
        <div
          className="border-t border-gray-100 dark:border-white/8 px-4 py-3 flex flex-col gap-2 animate-slide-in"
          role="group"
          aria-label={`Choose bond level for ${displayMode === 'pair' ? `${from} and ${to}` : to}`}
        >
          <div className="flex gap-2">
            {ALL_BOND_LEVELS.slice(0, 4).map(renderPickerBtn)}
          </div>
          <div className="flex gap-2 justify-center">
            {ALL_BOND_LEVELS.slice(4).map(renderPickerBtn)}
          </div>
        </div>
      )}
    </div>
  )
}
