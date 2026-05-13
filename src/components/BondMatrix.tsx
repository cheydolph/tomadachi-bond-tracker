import { useCallback, useRef, useState } from 'react'
import { ALL_BOND_LEVELS, BOND_CONFIG } from '@/lib/types'
import type { BondData, BondLevel } from '@/lib/types'

interface BondMatrixProps {
  data: BondData
  onCycleBond: (from: string, to: string) => void
  onSetBond: (from: string, to: string, level: BondLevel) => void
  // Empty set means no filter (show all). Non-empty means show only matching levels.
  activeFilters: Set<BondLevel>
}

interface PickerState {
  from: string
  to: string
  x: number
  y: number
}

export default function BondMatrix({
  data,
  onCycleBond,
  onSetBond,
  activeFilters,
}: BondMatrixProps) {
  const { names, bonds } = data
  // Track both directions of a bond change so the mirrored cell also animates.
  const [changedCells, setChangedCells] = useState<Set<string>>(new Set())
  const [picker, setPicker] = useState<PickerState | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleCellClick = useCallback(
    (from: string, to: string) => {
      onCycleBond(from, to)
      const both = new Set([`${from}→${to}`, `${to}→${from}`])
      setChangedCells(both)
      setTimeout(() => setChangedCells(new Set()), 300)
    },
    [onCycleBond],
  )

  const startLongPress = (
    from: string,
    to: string,
    e: React.MouseEvent | React.TouchEvent,
  ) => {
    // Capture rect immediately — SyntheticEvent.currentTarget becomes null
    // after the event handler returns (React event pooling).
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    longPressTimer.current = setTimeout(() => {
      setPicker({
        from,
        to,
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      })
    }, 400)
  }

  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
  }

  if (names.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h3 className="text-xl font-semibold text-gray-500 mb-2 font-fredoka">
          No names yet!
        </h3>
        <p className="text-sm text-gray-400">
          Add Miis in the panel to get started.
        </p>
      </div>
    )
  }

  if (names.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🫧</div>
        <h3 className="text-xl font-semibold text-gray-500 mb-2 font-fredoka">
          Add one more Mii!
        </h3>
        <p className="text-sm text-gray-400">
          You need at least 2 Miis to track bonds.
        </p>
      </div>
    )
  }

  const CELL_SIZE = 40
  const ROW_HEADER_W = 130

  return (
    <div className="relative">
      {/* Bond picker overlay */}
      {picker && (
        <div
          className="fixed inset-0 z-50"
          onClick={() => setPicker(null)}
          onTouchStart={() => setPicker(null)}
        >
          <div
            className="absolute bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 grid grid-cols-3 gap-2"
            style={{
              left: Math.min(picker.x - 80, window.innerWidth - 168),
              top: Math.max(picker.y - 8, 8),
              width: 160,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {ALL_BOND_LEVELS.map((level) => {
              const cfg = BOND_CONFIG[level]
              const isCurrent =
                (bonds[picker.from]?.[picker.to] ?? 0) === level
              return (
                <button
                  key={level}
                  className={`
                    flex flex-col items-center justify-center w-10 h-10 rounded-xl
                    bond-cell-${level} transition-all ${cfg.textClass}
                    ${isCurrent ? 'ring-1 ring-offset-1 ring-gray-600 scale-105' : 'hover:scale-105'}
                  `}
                  title={cfg.label}
                  aria-label={`Set bond to ${cfg.label}`}
                  aria-pressed={isCurrent}
                  onClick={() => {
                    onSetBond(picker.from, picker.to, level)
                    setPicker(null)
                  }}
                >
                  <span className="text-base">{cfg.symbol}</span>
                  <span className="text-[9px] font-bold mt-0.5 opacity-70 leading-none">
                    {cfg.abbr}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Matrix scroll container */}
      <div className="matrix-scroll">
        <table className="matrix-table">
          <thead>
            <tr>
              {/* Corner cell */}
              <th
                className="corner-cell"
                style={{ minWidth: ROW_HEADER_W, width: ROW_HEADER_W }}
              >
                <div className="flex items-end justify-end h-20 pb-2 pr-3">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">
                    From ↓ To →
                  </span>
                </div>
              </th>

              {/* Column headers */}
              {names.map((name) => (
                <th
                  key={name}
                  className="col-header"
                  style={{
                    minWidth: CELL_SIZE,
                    width: CELL_SIZE,
                    padding: '0 1px',
                  }}
                >
                  <div className="col-header-inner">
                    <span className="col-header-text" title={name}>
                      {name}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {names.map((fromName) => (
              <tr key={fromName}>
                {/* Row header */}
                <td
                  className="row-header border-t border-gray-100"
                  style={{ minWidth: ROW_HEADER_W, width: ROW_HEADER_W }}
                >
                  <div
                    className="px-3 py-0 flex items-center"
                    style={{ height: CELL_SIZE }}
                  >
                    <span
                      className="text-sm font-semibold text-gray-700 truncate max-w-[110px]"
                      title={fromName}
                    >
                      {fromName}
                    </span>
                  </div>
                </td>

                {/* Bond cells */}
                {names.map((toName) => {
                  const isDiagonal = fromName === toName
                  const level = isDiagonal
                    ? null
                    : ((bonds[fromName]?.[toName] ?? 0) as BondLevel)
                  const cfg = level !== null ? BOND_CONFIG[level] : null
                  const cellKey = `${fromName}→${toName}`

                  return (
                    <td
                      key={toName}
                      className="border-t border-l border-gray-100"
                      style={{
                        width: CELL_SIZE,
                        minWidth: CELL_SIZE,
                        height: CELL_SIZE,
                        padding: 0,
                      }}
                    >
                      {isDiagonal ? (
                        <div
                          className="flex items-center justify-center w-full h-full bg-gray-50"
                          style={{ width: CELL_SIZE, height: CELL_SIZE }}
                        >
                          <span className="text-gray-300 text-xs">—</span>
                        </div>
                      ) : (
                        <div className="relative group">
                          <button
                            className={`
                              bond-cell-btn bond-cell-${level}
                              flex items-center justify-center
                              text-sm font-bold select-none
                              ${changedCells.has(cellKey) ? 'just-changed' : ''}
                              ${
                                activeFilters.size > 0 &&
                                !activeFilters.has(level as BondLevel)
                                  ? 'opacity-20 saturate-0'
                                  : ''
                              }
                            `}
                            style={{ width: CELL_SIZE, height: CELL_SIZE }}
                            onClick={() => handleCellClick(fromName, toName)}
                            onMouseDown={(e) =>
                              startLongPress(fromName, toName, e)
                            }
                            onMouseUp={cancelLongPress}
                            onMouseLeave={cancelLongPress}
                            onTouchStart={(e) =>
                              startLongPress(fromName, toName, e)
                            }
                            onTouchEnd={cancelLongPress}
                            aria-label={`Bond from ${fromName} to ${toName}: ${cfg?.label}`}
                            title={`${fromName} → ${toName}: ${cfg?.label}`}
                          >
                            <span
                              className={`text-sm ${cfg?.textClass}`}
                              aria-hidden="true"
                            >
                              {cfg?.symbol}
                            </span>
                            <div className="tooltip">
                              {fromName} → {toName}: {cfg?.label}
                            </div>
                          </button>
                        </div>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
