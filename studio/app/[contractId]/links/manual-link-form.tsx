"use client";

import { useState, useTransition } from "react";
import { createManualLinkAction } from "./actions";

interface Column {
  id: string;
  originalName: string;
  columnIndex: number;
}

interface Criterion {
  id: string;
  parameterName: string;
  limitStr: string;
}

export function ManualLinkForm({
  contractId,
  columns,
  criteria,
}: {
  contractId: string;
  columns: Column[];
  criteria: Criterion[];
}) {
  const [isPending, startTransition] = useTransition();
  const [columnId, setColumnId] = useState("");
  const [criterionId, setCriterionId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await createManualLinkAction(
        contractId,
        columnId,
        criterionId
      );
      if (result.error) {
        setError(result.error);
      } else {
        setColumnId("");
        setCriterionId("");
        setIsOpen(false);
      }
    });
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-all hover:border-gray-400 hover:shadow-sm active:scale-[0.98] cursor-pointer"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        Add Manual Link
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background)] p-5"
    >
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
        Manual Link
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Column selector */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Data Column
          </label>
          <select
            value={columnId}
            onChange={(e) => setColumnId(e.target.value)}
            required
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none cursor-pointer"
          >
            <option value="" disabled>
              Select a column...
            </option>
            {columns.map((col) => (
              <option key={col.id} value={col.id}>
                {col.originalName} (Col {col.columnIndex + 1})
              </option>
            ))}
          </select>
        </div>

        {/* Criterion selector */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Acceptance Criterion
          </label>
          <select
            value={criterionId}
            onChange={(e) => setCriterionId(e.target.value)}
            required
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none cursor-pointer"
          >
            <option value="" disabled>
              Select a criterion...
            </option>
            {criteria.map((c) => (
              <option key={c.id} value={c.id}>
                {c.parameterName} ({c.limitStr})
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mt-3 text-sm text-red-600">{error}</div>
      )}

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending || !columnId || !criterionId}
          className="rounded-lg bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Linking..." : "Link"}
        </button>
        <button
          type="button"
          onClick={() => {
            setIsOpen(false);
            setError(null);
          }}
          className="text-sm text-gray-500 hover:text-[var(--foreground)] cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
