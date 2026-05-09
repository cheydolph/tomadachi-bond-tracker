"use client";

import React, { useRef, useState } from "react";
import { BondData, MAX_NAMES } from "@/lib/types";
import { exportData, importData } from "@/lib/storage";

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
}: NamePanelProps) {
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
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h2
          className="text-base font-semibold text-gray-700 mb-3"
          style={{ fontFamily: "Fredoka" }}
        >
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
        {error && (
          <p className="text-xs text-red-500 mt-1.5 font-semibold">{error}</p>
        )}
        <p className="text-xs text-gray-400 mt-1.5">
          {names.length}/{MAX_NAMES} Miis added
        </p>
      </div>

      {/* Name list */}
      {names.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h2
            className="text-base font-semibold text-gray-700 mb-3"
            style={{ fontFamily: "Fredoka" }}
          >
            Miis ({names.length})
          </h2>
          <ul className="flex flex-col gap-1.5 max-h-64 overflow-y-auto pr-1">
            {names.map((name) => (
              <li
                key={name}
                className="flex items-center gap-2 group rounded-xl px-2 py-2 hover:bg-gray-50 transition-colors border"
              >
                <span className="text-gray-300 text-xs">👤</span>

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
                  <span className="flex-1 text-xs text-gray-700 font-medium truncate">
                    {name}
                  </span>
                )}

                {editingName !== name && (
                  // On touch devices (mobile) there is no hover state, so opacity-0
                  // makes the buttons permanently invisible. md:opacity-0 keeps them
                  // always visible on mobile and hidden-until-hover on desktop.
                  <div className="flex gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <button
                      className="touch-target rounded-lg text-xs text-blue-400
                        hover:text-blue-600 hover:bg-blue-50 transition-colors font-semibold"
                      onClick={() => startEdit(name)}
                      aria-label={`Edit ${name}`}
                    >
                      Edit
                    </button>
                    <button
                      className="touch-target rounded-lg text-xs text-red-300
                        hover:text-red-500 hover:bg-red-50 transition-colors font-semibold"
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
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h2
          className="text-base font-semibold text-gray-700 mb-3"
          style={{ fontFamily: "Fredoka" }}
        >
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
            <p className="text-xs text-red-500 font-semibold">{importError}</p>
          )}
          {importSuccess && (
            <p className="text-xs text-emerald-600 font-semibold animate-fade-in">
              ✓ Data imported successfully!
            </p>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Export saves all Miis and bonds. Import will replace current
          data.
        </p>
      </div>
    </div>
  );
}
