import { ALL_BOND_LEVELS, BOND_CONFIG } from '@/lib/types'

export default function BondLegend() {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm font-semibold">Legend: </span>
      {ALL_BOND_LEVELS.map((level) => {
        const cfg = BOND_CONFIG[level]
        return (
          <div
            key={level}
            className={`legend-badge bond-cell-${level}`}
            title={`Level ${level}: ${cfg.label}`}
          >
            <span className={`text-sm ${cfg.textClass}`}>{cfg.symbol}</span>
            <span className={`${cfg.textClass} text-xs font-bold`}>
              {cfg.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
