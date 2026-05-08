"use client";

import React from "react";
import { BOND_CONFIG, BondLevel } from "@/lib/types";

export default function BondLegend() {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {([0, 1, 2, 3] as BondLevel[]).map((level) => {
        const cfg = BOND_CONFIG[level];
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
        );
      })}
      <span className="text-xs text-gray-400 ml-1">
        · Click to cycle / choose between bond options
      </span>
    </div>
  );
}
