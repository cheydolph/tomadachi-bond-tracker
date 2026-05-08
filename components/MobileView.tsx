"use client";

import React, { useState } from "react";
import { BondData, BondLevel, BOND_CONFIG } from "@/lib/types";

interface MobileViewProps {
  data: BondData;
  onCycleBond: (from: string, to: string) => void;
  onSetBond: (from: string, to: string, level: BondLevel) => void;
}

export default function MobileView({
  data,
  onCycleBond,
  onSetBond,
}: MobileViewProps) {
  const { names, bonds } = data;
  const [activePerson, setActivePerson] = useState<string | null>(
    names[0] ?? null
  );
  const [pickerCell, setPickerCell] = useState<{ from: string; to: string } | null>(null);

  if (names.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="text-5xl mb-4">🌸</div>
        <h3
          className="text-lg font-semibold text-gray-500 mb-2"
          style={{ fontFamily: "Fredoka" }}
        >
          No names yet!
        </h3>
        <p className="text-sm text-gray-400">
          Tap the panel icon to add people.
        </p>
      </div>
    );
  }

  // Ensure active person is still valid
  const currentPerson =
    activePerson && names.includes(activePerson) ? activePerson : names[0];

  const bonds_for_person = names
    .filter((n) => n !== currentPerson)
    .map((toName) => ({
      toName,
      level: (bonds[currentPerson]?.[toName] ?? 0) as BondLevel,
      reverseLevel: (bonds[toName]?.[currentPerson] ?? 0) as BondLevel,
    }));

  return (
    <div className="flex flex-col gap-4">
      {/* Person selector */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
        <p
          className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1"
          style={{ fontFamily: "Fredoka" }}
        >
          View bonds from:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {names.map((name) => (
            <button
              key={name}
              onClick={() => setActivePerson(name)}
              className={`
                text-sm px-3 py-1.5 rounded-xl font-semibold transition-all
                ${currentPerson === name
                  ? "bg-rose-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Bond cards */}
      {names.length < 2 ? (
        <div className="text-center py-8 text-gray-400 text-sm">
          Add more people to see bonds.
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p
            className="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1"
            style={{ fontFamily: "Fredoka" }}
          >
            {currentPerson}&apos;s bonds
          </p>
          {bonds_for_person.map(({ toName, level, reverseLevel }) => {
            const cfg = BOND_CONFIG[level];
            const revCfg = BOND_CONFIG[reverseLevel];
            const isPickerOpen =
              pickerCell?.from === currentPerson &&
              pickerCell?.to === toName;

            return (
              <div
                key={toName}
                className="mobile-card"
              >
                <div className="flex items-center gap-3 px-4 py-3">
                  {/* Name */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">
                      {toName}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      They see you as:{" "}
                      <span
                        className={`font-semibold ${revCfg.textClass.replace("bg-", "")}`}
                        style={{ color: getTextColor(reverseLevel) }}
                      >
                        {revCfg.label}
                      </span>
                    </p>
                  </div>

                  {/* Current level display */}
                  <div
                    className={`bond-cell-${level} rounded-xl px-3 py-2 flex items-center gap-1.5 cursor-pointer flex-shrink-0`}
                    onClick={() => {
                      setPickerCell(
                        isPickerOpen ? null : { from: currentPerson, to: toName }
                      );
                    }}
                  >
                    <span className={`text-base ${cfg.textClass}`}>
                      {cfg.symbol}
                    </span>
                    <span className={`text-xs font-bold ${cfg.textClass}`}>
                      {cfg.label}
                    </span>
                    <span className="text-xs text-gray-400 ml-0.5">▾</span>
                  </div>
                </div>

                {/* Inline picker */}
                {isPickerOpen && (
                  <div className="border-t border-gray-100 px-4 py-3 flex gap-2 animate-slide-in">
                    {([0, 1, 2, 3] as BondLevel[]).map((lvl) => {
                      const lcfg = BOND_CONFIG[lvl];
                      return (
                        <button
                          key={lvl}
                          onClick={() => {
                            onSetBond(currentPerson, toName, lvl);
                            setPickerCell(null);
                          }}
                          className={`
                            flex-1 flex flex-col items-center py-2.5 rounded-xl text-sm
                            bond-cell-${lvl} transition-all
                            ${level === lvl ? "ring-2 ring-gray-500 scale-105" : "hover:scale-105"}
                          `}
                        >
                          <span className={`text-base ${lcfg.textClass}`}>
                            {lcfg.symbol}
                          </span>
                          <span
                            className={`text-[10px] font-bold mt-0.5 ${lcfg.textClass}`}
                          >
                            {lcfg.label.slice(0, 6)}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function getTextColor(level: BondLevel): string {
  const colors: Record<BondLevel, string> = {
    0: "#6B7280",
    1: "#047857",
    2: "#854D0E",
    3: "#9F1239",
  };
  return colors[level];
}
