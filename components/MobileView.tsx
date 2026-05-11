"use client";

import React, { useState } from "react";

import BondCard from "@/components/BondCard";
import { BondData, BondLevel } from "@/lib/types";

interface MobileViewProps {
  data: BondData;
  onSetBond: (from: string, to: string, level: BondLevel) => void;
  /** Empty set = show all. Non-empty = show only matching bond types. */
  activeFilters: Set<BondLevel>;
}

/** null = ALL mode (every unique pair). string = person mode (bonds from that person). */
type PersonSelection = string | null;

export default function MobileView({ data, onSetBond, activeFilters }: MobileViewProps) {
  const { names, bonds } = data;
  const [activePerson, setActivePerson] = useState<PersonSelection>(null);
  const [openPickerKey, setOpenPickerKey] = useState<string | null>(null);

  if (names.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-4 text-5xl">👤</div>
        <h3 className="font-fredoka mb-2 text-lg font-semibold text-gray-500">
          No names yet!
        </h3>
        <p className="text-sm text-gray-400">Tap the panel icon to add Miis.</p>
      </div>
    );
  }

  // If the stored activePerson was removed, fall back to ALL mode.
  const currentPerson: PersonSelection =
    activePerson !== null && names.includes(activePerson) ? activePerson : null;

  // ── Bond lists ────────────────────────────────────────────────────────────

  // ALL mode: deduplicated pairs (i < j by insertion order) with filter applied.
  const allPairBonds: { from: string; to: string; level: BondLevel }[] = [];
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const from = names[i];
      const to = names[j];
      const level = (bonds[from]?.[to] ?? 0) as BondLevel;
      if (activeFilters.size === 0 || activeFilters.has(level)) {
        allPairBonds.push({ from, to, level });
      }
    }
  }

  // Person mode: bonds from currentPerson to everyone else, with filter applied.
  const personBonds =
    currentPerson !== null
      ? names
          .filter((n) => n !== currentPerson)
          .map((to) => ({
            to,
            level: (bonds[currentPerson]?.[to] ?? 0) as BondLevel,
            reverseLevel: (bonds[to]?.[currentPerson] ?? 0) as BondLevel,
          }))
          .filter(({ level }) => activeFilters.size === 0 || activeFilters.has(level))
      : [];

  // ── Helpers ───────────────────────────────────────────────────────────────

  function pairKey(from: string, to: string) {
    return `${from}↔${to}`;
  }

  function personKey(to: string) {
    return `${currentPerson}→${to}`;
  }

  function togglePicker(key: string) {
    setOpenPickerKey((prev) => (prev === key ? null : key));
  }

  function handleSetBond(from: string, to: string, level: BondLevel) {
    onSetBond(from, to, level);
    setOpenPickerKey(null);
  }

  function handleSelectPerson(name: string | null) {
    setActivePerson(name);
    setOpenPickerKey(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    // pb-24 (~96px) ensures the fixed Scroll-to-Top FAB never overlaps the last card.
    <div className="flex flex-col gap-4 pb-24">
      {/* Person selector */}
      <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <p className="font-fredoka mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
          View bonds from:
        </p>
        <div className="flex flex-wrap gap-1.5">
          <PersonButton
            label="ALL"
            isActive={currentPerson === null}
            onClick={() => handleSelectPerson(null)}
          />
          {names.map((name) => (
            <PersonButton
              key={name}
              label={name}
              isActive={currentPerson === name}
              onClick={() => handleSelectPerson(name)}
            />
          ))}
        </div>
      </div>

      {/* Bond cards */}
      {names.length < 2 ? (
        <EmptyState message="Add more Miis to see bonds." />
      ) : currentPerson === null ? (
        /* ALL mode */
        <div className="flex flex-col gap-2">
          <SectionLabel>
            All bonds ({allPairBonds.length} pair{allPairBonds.length !== 1 ? "s" : ""})
          </SectionLabel>
          {allPairBonds.length === 0 ? (
            <EmptyState
              message={
                activeFilters.size > 0
                  ? "No bonds of the selected type found."
                  : "Add more Miis to see bonds."
              }
            />
          ) : (
            allPairBonds.map(({ from, to, level }) => {
              const key = pairKey(from, to);
              return (
                <BondCard
                  key={key}
                  from={from}
                  to={to}
                  displayMode="pair"
                  level={level}
                  isPickerOpen={openPickerKey === key}
                  onTogglePicker={() => togglePicker(key)}
                  onSetBond={handleSetBond}
                />
              );
            })
          )}
        </div>
      ) : (
        /* Person mode */
        <div className="flex flex-col gap-2">
          <SectionLabel>{currentPerson}&apos;s bonds</SectionLabel>
          {personBonds.length === 0 ? (
            <EmptyState
              message={
                activeFilters.size > 0
                  ? `No bonds of the selected type for ${currentPerson}.`
                  : "Add more Miis to see bonds."
              }
            />
          ) : (
            personBonds.map(({ to, level, reverseLevel }) => {
              const key = personKey(to);
              return (
                <BondCard
                  key={key}
                  from={currentPerson}
                  to={to}
                  displayMode="target"
                  level={level}
                  reverseLevel={reverseLevel}
                  isPickerOpen={openPickerKey === key}
                  onTogglePicker={() => togglePicker(key)}
                  onSetBond={handleSetBond}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Small focused sub-components — keeps MobileView's JSX scannable
// ─────────────────────────────────────────────────────────────────────────────

function PersonButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      // min-h-[44px] meets the 44×44px touch target minimum on all target devices.
      // flex items-center keeps the label vertically centred within the expanded hit area.
      className={`flex min-h-[44px] items-center rounded-xl px-3 text-sm font-semibold transition-all ${
        isActive
          ? "bg-rose-500 text-white shadow-sm"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } `}
    >
      {label}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-fredoka px-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
      {children}
    </p>
  );
}

function EmptyState({ message }: { message: string }) {
  return <div className="py-8 text-center text-sm text-gray-400">{message}</div>;
}
