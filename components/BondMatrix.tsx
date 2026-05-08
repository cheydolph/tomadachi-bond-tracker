"use client";

import React, { useCallback, useRef, useState } from "react";
import { BondData, BondLevel, BOND_CONFIG } from "@/lib/types";

interface BondMatrixProps {
  data: BondData;
  onCycleBond: (from: string, to: string) => void;
  onSetBond: (from: string, to: string, level: BondLevel) => void;
  // Empty set means no filter (show all). Non-empty means show only matching levels.
  activeFilters: Set<BondLevel>;
}

interface PickerState {
  from: string;
  to: string;
  x: number;
  y: number;
}

export default function BondMatrix({
  data,
  onCycleBond,
  onSetBond,
  activeFilters,
}: BondMatrixProps) {
  const { names, bonds } = data;
  const [changedCell, setChangedCell] = useState<string | null>(null);
  const [picker, setPicker] = useState<PickerState | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCellClick = useCallback(
    (from: string, to: string) => {
      onCycleBond(from, to);
      const key = `${from}→${to}`;
      setChangedCell(key);
      setTimeout(() => setChangedCell(null), 300);
    },
    [onCycleBond]
  );

  const handleCellLongPress = useCallback(
    (from: string, to: string, e: React.MouseEvent | React.TouchEvent) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      setPicker({
        from,
        to,
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      });
    },
    []
  );

  const startLongPress = (
    from: string,
    to: string,
    e: React.MouseEvent | React.TouchEvent
  ) => {
    longPressTimer.current = setTimeout(() => {
      handleCellLongPress(from, to, e);
    }, 400);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  };

  if (names.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🌸</div>
        <h3
          className="text-xl font-semibold text-gray-500 mb-2"
          style={{ fontFamily: "Fredoka" }}
        >
          No names yet!
        </h3>
        <p className="text-sm text-gray-400">
          Add some names in the panel to get started.
        </p>
      </div>
    );
  }

  if (names.length === 1) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="text-6xl mb-4">🫧</div>
        <h3
          className="text-xl font-semibold text-gray-500 mb-2"
          style={{ fontFamily: "Fredoka" }}
        >
          Add one more person!
        </h3>
        <p className="text-sm text-gray-400">
          You need at least 2 names to track bonds.
        </p>
      </div>
    );
  }

  const CELL_SIZE = 40;
  const ROW_HEADER_W = 130;

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
            ref={pickerRef}
            className="absolute bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 flex gap-1"
            style={{
              left: Math.min(picker.x - 96, window.innerWidth - 208),
              top: Math.max(picker.y - 64, 8),
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {([0, 1, 2, 3] as BondLevel[]).map((level) => {
              const cfg = BOND_CONFIG[level];
              const isCurrent = (bonds[picker.from]?.[picker.to] ?? 0) === level;
              return (
                <button
                  key={level}
                  className={`
                    flex flex-col items-center justify-center w-[46px] h-[46px] rounded-xl text-lg
                    bond-cell-${level} transition-all
                    ${isCurrent ? "ring-2 ring-offset-1 ring-gray-600 scale-110" : "hover:scale-105"}
                  `}
                  title={cfg.label}
                  onClick={() => {
                    onSetBond(picker.from, picker.to, level);
                    setPicker(null);
                  }}
                >
                  <span>{cfg.symbol}</span>
                  <span className="text-[9px] font-bold mt-0.5 opacity-70">
                    {cfg.label.slice(0, 5)}
                  </span>
                </button>
              );
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
                    padding: "0 1px",
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
                      className="text-xs font-semibold text-gray-700 truncate max-w-[110px]"
                      title={fromName}
                    >
                      {fromName}
                    </span>
                  </div>
                </td>

                {/* Bond cells */}
                {names.map((toName) => {
                  const isDiagonal = fromName === toName;
                  const level = isDiagonal
                    ? null
                    : ((bonds[fromName]?.[toName] ?? 0) as BondLevel);
                  const cfg = level !== null ? BOND_CONFIG[level] : null;
                  const cellKey = `${fromName}→${toName}`;

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
                              ${changedCell === cellKey ? "just-changed" : ""}
                              ${activeFilters.size > 0 && !activeFilters.has(level as BondLevel)
                                ? "opacity-20 saturate-0"
                                : ""}
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
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
