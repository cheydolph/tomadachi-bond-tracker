"use client";

import React, { useRef, useState } from "react";

import { exportData, importData } from "@/lib/storage";
import { BondData, MAX_NAMES } from "@/lib/types";

interface NamePanelProps {
  data: BondData;
  onAddName: (name: string) => void;
  onRemoveName: (name: string) => void;
  onEditName: (oldName: string, newName: string) => void;
  onImport: (data: BondData) => void;
}

export default function NamePanel({
  data,
  onAddName,
  onRemoveName,
  onEditName,
  onImport,
}: Readonly<NamePanelProps>): JSX.Element {
  const [input, setInput] = useState("");
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [error, setError] = useState("");
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { names } = data;

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    if (names.length >= MAX_NAMES) {
      setError(`Maximum ${MAX_NAMES} names allowed.`);
      return;
    }
    if (names.map((n) => n.toLowerCase()).includes(trimmed.toLowerCase())) {
      setError("That name already exists.");
      return;
    }
    if (trimmed.length > 40) {
      setError("Name must be 40 characters or less.");
      return;
    }
    setError("");
    onAddName(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleAdd();
  };

  const startEdit = (name: string) => {
    setEditingName(name);
    setEditValue(name);
    setError("");
  };

  const commitEdit = () => {
    if (!editingName) return;
    const trimmed = editValue.trim();
    if (!trimmed) {
      setEditingName(null);
      return;
    }
    if (
      trimmed !== editingName &&
      names.map((n) => n.toLowerCase()).includes(trimmed.toLowerCase())
    ) {
      setError("That name already exists.");
      return;
    }
    if (trimmed.length > 40) {
      setError("Name must be 40 characters or less.");
      return;
    }
    setError("");
    onEditName(editingName, trimmed);
    setEditingName(null);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") setEditingName(null);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError("");
    setImportSuccess(false);
    try {
      const imported = await importData(file);
      onImport(imported);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (err) {
      setImportError((err as Error).message || "Import failed.");
    }
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Add Mii */}
      <div className="panel-card">
        <h2 className="font-fredoka mb-3 text-base font-semibold text-gray-700">
          Add Mii
        </h2>
        <div className="flex gap-2">
          <input
            className="input-field"
            type="text"
            placeholder="Enter a Mii…"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            maxLength={40}
            disabled={names.length >= MAX_NAMES}
          />
          <button
            className="btn-primary flex-shrink-0"
            onClick={handleAdd}
            disabled={names.length >= MAX_NAMES || !input.trim()}
            style={{ opacity: names.length >= MAX_NAMES ? 0.5 : 1 }}
          >
            Add
          </button>
        </div>
        {error && <p className="mt-1.5 text-xs font-semibold text-red-500">{error}</p>}
        <p className="mt-1.5 text-xs text-gray-400">
          {names.length}/{MAX_NAMES} Miis added
        </p>
      </div>

      {/* Name list */}
      {names.length > 0 && (
        <div className="panel-card">
          <h2 className="font-fredoka mb-3 text-base font-semibold text-gray-700">
            Miis ({names.length})
          </h2>
          <ul className="flex max-h-64 flex-col gap-1.5 overflow-y-auto pr-1">
            {names.map((name) => (
              <li
                key={name}
                className="group flex items-center gap-2 rounded-xl border border-gray-100 px-2 py-2 transition-colors hover:bg-gray-50"
              >
                <span className="text-xs text-gray-300">👤</span>

                {editingName === name ? (
                  <input
                    className="input-field flex-1 py-1 text-sm"
                    value={editValue}
                    autoFocus
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    onBlur={commitEdit}
                    maxLength={40}
                  />
                ) : (
                  <span className="flex-1 truncate text-xs font-medium text-gray-700">
                    {name}
                  </span>
                )}

                {editingName !== name && (
                  // On touch devices (mobile) there is no hover state, so opacity-0
                  // makes the buttons permanently invisible. md:opacity-0 keeps them
                  // always visible on mobile and hidden-until-hover on desktop.
                  <div className="flex gap-1 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                    <button
                      className="touch-target rounded-lg text-xs font-semibold text-blue-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      onClick={() => startEdit(name)}
                      aria-label={`Edit ${name}`}
                    >
                      Edit
                    </button>
                    <button
                      className="touch-target rounded-lg text-xs font-semibold text-red-300 transition-colors hover:bg-red-50 hover:text-red-500"
                      onClick={() => onRemoveName(name)}
                      aria-label={`Remove ${name}`}
                    >
                      ✕
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Export / Import */}
      <div className="panel-card">
        <h2 className="font-fredoka mb-3 text-base font-semibold text-gray-700">
          Backup & Restore
        </h2>
        <div className="flex flex-col gap-2">
          <button
            className="btn-secondary w-full text-center"
            onClick={() => exportData(data)}
            disabled={names.length === 0}
            style={{ opacity: names.length === 0 ? 0.5 : 1 }}
          >
            📥 Export as JSON
          </button>
          <button
            className="btn-secondary w-full text-center"
            onClick={() => fileInputRef.current?.click()}
          >
            📤 Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          {importError && (
            <p className="text-xs font-semibold text-red-500">{importError}</p>
          )}
          {importSuccess && (
            <p className="animate-fade-in text-xs font-semibold text-emerald-600">
              ✓ Data imported successfully!
            </p>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Export saves all Miis and bonds. Import will replace current data.
        </p>
      </div>
    </div>
  );
}
