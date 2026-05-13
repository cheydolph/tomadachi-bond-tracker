import { useState } from 'react'
import type { BondData, BondLevel } from '@/lib/types'
import BondCard from '@/components/BondCard'

interface MobileViewProps {
  data: BondData
  onSetBond: (from: string, to: string, level: BondLevel) => void
  activeFilters: Set<BondLevel>
}

type PersonSelection = string | null

export default function MobileView({
  data,
  onSetBond,
  activeFilters,
}: MobileViewProps) {
  const { names, bonds } = data
  const [activePerson, setActivePerson] = useState<PersonSelection>(null)
  const [openPickerKey, setOpenPickerKey] = useState<string | null>(null)

  if (names.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="text-5xl mb-4">👤</div>
        <h3 className="text-lg font-semibold text-gray-500 dark:text-yellow-300/70 mb-2 font-fredoka">
          No names yet!
        </h3>
        <p className="text-sm text-gray-400 dark:text-yellow-200/40">
          Tap the panel icon to add Miis.
        </p>
      </div>
    )
  }

  const currentPerson: PersonSelection =
    activePerson !== null && names.includes(activePerson) ? activePerson : null

  const allPairBonds: { from: string; to: string; level: BondLevel }[] = []
  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const from = names[i]
      const to = names[j]
      const level = bonds[from][to] ?? 0
      if (activeFilters.size === 0 || activeFilters.has(level)) {
        allPairBonds.push({ from, to, level })
      }
    }
  }

  const personBonds =
    currentPerson === null
      ? []
      : names
          .filter((n) => n !== currentPerson)
          .map((to) => ({
            to,
            level: bonds[currentPerson][to] ?? 0,
            reverseLevel: bonds[to][currentPerson] ?? 0,
          }))
          .filter(
            ({ level }) => activeFilters.size === 0 || activeFilters.has(level),
          )

  const pairKey = (from: string, to: string) => `${from}↔${to}`
  const personKey = (to: string) => `${currentPerson}→${to}`
  const togglePicker = (key: string) =>
    setOpenPickerKey((prev) => (prev === key ? null : key))

  const handleSetBond = (from: string, to: string, level: BondLevel) => {
    onSetBond(from, to, level)
    setOpenPickerKey(null)
  }

  const handleSelectPerson = (name: string | null) => {
    setActivePerson(name)
    setOpenPickerKey(null)
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      {/* Person selector */}
      <div className="bg-white dark:bg-[#201c00] rounded-2xl p-3 shadow-sm border border-gray-100 dark:border-white/8">
        <p className="text-xs font-semibold text-gray-400 dark:text-yellow-300/60 uppercase tracking-wide mb-2 px-1 font-fredoka">
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

      {names.length < 2 ? (
        <EmptyState message="Add more Miis to see bonds." />
      ) : currentPerson === null ? (
        <div className="flex flex-col gap-2">
          <SectionLabel>
            All bonds ({allPairBonds.length} pair
            {allPairBonds.length !== 1 ? 's' : ''})
          </SectionLabel>
          {allPairBonds.length === 0 ? (
            <EmptyState
              message={
                activeFilters.size > 0
                  ? 'No bonds of the selected type found.'
                  : 'Add more Miis to see bonds.'
              }
            />
          ) : (
            allPairBonds.map(({ from, to, level }) => {
              const key = pairKey(from, to)
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
              )
            })
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <SectionLabel>{currentPerson}&apos;s bonds</SectionLabel>
          {personBonds.length === 0 ? (
            <EmptyState
              message={
                activeFilters.size > 0
                  ? `No bonds of the selected type for ${currentPerson}.`
                  : 'Add more Miis to see bonds.'
              }
            />
          ) : (
            personBonds.map(({ to, level, reverseLevel: _r }) => {
              const key = personKey(to)
              return (
                <BondCard
                  key={key}
                  from={currentPerson}
                  to={to}
                  displayMode="target"
                  level={level}
                  isPickerOpen={openPickerKey === key}
                  onTogglePicker={() => togglePicker(key)}
                  onSetBond={handleSetBond}
                />
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

function PersonButton({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`
        min-h-[44px] flex items-center text-sm px-3 rounded-xl font-semibold transition-all
        ${
          isActive
            ? 'bg-rose-500 text-white shadow-sm'
            : 'bg-gray-100 dark:bg-white/8 text-gray-600 dark:text-yellow-100/70 hover:bg-gray-200 dark:hover:bg-white/12'
        }
      `}
    >
      {label}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-gray-400 dark:text-yellow-300/50 uppercase tracking-wide px-1 font-fredoka">
      {children}
    </p>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-gray-400 dark:text-yellow-200/40 text-sm">
      {message}
    </div>
  )
}
