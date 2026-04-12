"use client";

import { useTransition } from "react";
import { confirmColumnRole, confirmAllColumns } from "./actions";

const ROLES = [
  "UNIT_ID",
  "TIMESTAMP",
  "MEASUREMENT",
  "CONDITION",
  "EQUIPMENT",
  "OPERATOR",
  "METADATA",
  "IGNORE",
] as const;

const ROLE_STYLES: Record<string, { bg: string; text: string; label: string }> =
  {
    MEASUREMENT: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      label: "Measurement",
    },
    CONDITION: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      label: "Condition",
    },
    UNIT_ID: { bg: "bg-green-50", text: "text-green-700", label: "Unit ID" },
    TIMESTAMP: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      label: "Timestamp",
    },
    EQUIPMENT: {
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      label: "Equipment",
    },
    OPERATOR: { bg: "bg-pink-50", text: "text-pink-700", label: "Operator" },
    METADATA: { bg: "bg-gray-100", text: "text-gray-600", label: "Metadata" },
    IGNORE: { bg: "bg-gray-50", text: "text-gray-400", label: "Ignore" },
  };

interface Column {
  id: string;
  columnIndex: number;
  originalName: string;
  displayName: string | null;
  role: string;
  aiSuggestion: string | null;
  aiConfidence: number | null;
  confirmedBy: string | null;
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  let color = "bg-red-100 text-red-700";
  if (pct >= 90) color = "bg-green-100 text-green-700";
  else if (pct >= 70) color = "bg-yellow-100 text-yellow-700";
  else if (pct >= 50) color = "bg-orange-100 text-orange-700";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${color}`}
    >
      {pct}%
    </span>
  );
}

function ColumnCard({
  column,
  contractId,
}: {
  column: Column;
  contractId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const isConfirmed = !!column.confirmedBy;
  const aiStyle = column.aiSuggestion
    ? ROLE_STYLES[column.aiSuggestion]
    : null;

  function handleRoleChange(newRole: string) {
    startTransition(async () => {
      await confirmColumnRole(
        column.id,
        newRole as (typeof ROLES)[number],
        contractId
      );
    });
  }

  function handleAcceptSuggestion() {
    if (column.aiSuggestion) {
      handleRoleChange(column.aiSuggestion);
    }
  }

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        isConfirmed
          ? "border-green-200 bg-green-50/30"
          : "border-[var(--border)] bg-white"
      } ${isPending ? "opacity-60" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {/* Column name */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">
              Col {column.columnIndex + 1}
            </span>
            <span className="text-sm font-semibold text-[var(--foreground)] truncate">
              {column.originalName}
            </span>
            {isConfirmed && (
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                className="shrink-0 text-green-600"
              >
                <path
                  d="M13.333 4L6 11.333L2.667 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          {/* AI suggestion */}
          {column.aiSuggestion && !isConfirmed && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-400">AI suggests:</span>
              {aiStyle && (
                <span
                  className={`role-badge ${aiStyle.bg} ${aiStyle.text}`}
                >
                  {aiStyle.label}
                </span>
              )}
              {column.aiConfidence != null && (
                <ConfidenceBadge confidence={column.aiConfidence} />
              )}
            </div>
          )}

          {/* Current role if confirmed */}
          {isConfirmed && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-gray-400">Role:</span>
              {ROLE_STYLES[column.role] && (
                <span
                  className={`role-badge ${ROLE_STYLES[column.role].bg} ${ROLE_STYLES[column.role].text}`}
                >
                  {ROLE_STYLES[column.role].label}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {!isConfirmed && column.aiSuggestion && (
            <button
              type="button"
              onClick={handleAcceptSuggestion}
              disabled={isPending}
              className="rounded-lg bg-[var(--accent)] px-3 py-1.5 text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer disabled:opacity-50"
            >
              Accept
            </button>
          )}
          <select
            value={isConfirmed ? column.role : ""}
            onChange={(e) => handleRoleChange(e.target.value)}
            disabled={isPending}
            className="rounded-lg border border-[var(--border)] bg-white px-2 py-1.5 text-xs text-[var(--foreground)] outline-none cursor-pointer disabled:opacity-50"
          >
            {!isConfirmed && (
              <option value="" disabled>
                Override...
              </option>
            )}
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_STYLES[role]?.label ?? role}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export function ColumnEditor({
  columns,
  logFormatId,
  contractId,
}: {
  columns: Column[];
  logFormatId: string;
  contractId: string;
}) {
  const [isPending, startTransition] = useTransition();

  const unconfirmedCount = columns.filter((c) => !c.confirmedBy).length;
  const hasAiSuggestions = columns.some((c) => c.aiSuggestion && !c.confirmedBy);

  function handleConfirmAll() {
    startTransition(async () => {
      await confirmAllColumns(logFormatId, contractId);
    });
  }

  return (
    <div>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-gray-500">
          {unconfirmedCount === 0 ? (
            <span className="text-green-600 font-medium">
              All columns confirmed
            </span>
          ) : (
            <span>
              {unconfirmedCount} column{unconfirmedCount !== 1 ? "s" : ""}{" "}
              awaiting confirmation
            </span>
          )}
        </div>
        {hasAiSuggestions && (
          <button
            type="button"
            onClick={handleConfirmAll}
            disabled={isPending}
            className="rounded-lg bg-[var(--foreground)] px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-90 active:scale-95 cursor-pointer disabled:opacity-50"
          >
            {isPending ? "Confirming..." : "Confirm All AI Suggestions"}
          </button>
        )}
      </div>

      {/* Column cards */}
      <div className="grid gap-3">
        {columns.map((column) => (
          <ColumnCard
            key={column.id}
            column={column}
            contractId={contractId}
          />
        ))}
      </div>
    </div>
  );
}
