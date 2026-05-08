"use client";

import { useTransition } from "react";
import { deleteLinkAction } from "./actions";

interface LinkCardProps {
  id: string;
  contractId: string;
  columnName: string;
  columnIndex: number;
  columnRole: string;
  parameterName: string;
  limitStr: string;
  sourceRef: string | null;
  aiSuggested: boolean;
  aiConfidence: number | null;
}

const ROLE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  MEASUREMENT: { bg: "bg-blue-50", text: "text-blue-700", label: "Measurement" },
  CONDITION: { bg: "bg-yellow-50", text: "text-yellow-700", label: "Condition" },
  UNIT_ID: { bg: "bg-green-50", text: "text-green-700", label: "Unit ID" },
  TIMESTAMP: { bg: "bg-purple-50", text: "text-purple-700", label: "Timestamp" },
  EQUIPMENT: { bg: "bg-indigo-50", text: "text-indigo-700", label: "Equipment" },
  OPERATOR: { bg: "bg-pink-50", text: "text-pink-700", label: "Operator" },
  METADATA: { bg: "bg-gray-100", text: "text-gray-600", label: "Metadata" },
  IGNORE: { bg: "bg-gray-50", text: "text-gray-400", label: "Ignore" },
};

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

export function LinkCard({
  id,
  contractId,
  columnName,
  columnIndex,
  columnRole,
  parameterName,
  limitStr,
  sourceRef,
  aiSuggested,
  aiConfidence,
}: LinkCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteLinkAction(id, contractId);
    });
  }

  const roleStyle = ROLE_STYLES[columnRole] ?? ROLE_STYLES.METADATA;

  return (
    <div
      className={`link-card relative group ${isPending ? "opacity-50" : ""}`}
    >
      {/* Column side */}
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Data Column
        </div>
        <div className="font-mono text-sm font-semibold text-[var(--foreground)]">
          {columnName}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          <span className={`role-badge ${roleStyle.bg} ${roleStyle.text}`}>
            {roleStyle.label}
          </span>
          <span className="text-xs text-gray-400">
            Col {columnIndex + 1}
          </span>
        </div>
      </div>

      {/* Arrow + badge */}
      <div className="flex flex-col items-center gap-1 px-2 shrink-0">
        <svg
          width="32"
          height="16"
          viewBox="0 0 32 16"
          fill="none"
          className="text-[var(--accent)]"
        >
          <path
            d="M0 8H28M28 8L22 2M28 8L22 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {aiSuggested ? (
          <div className="flex items-center gap-1">
            <span className="role-badge bg-violet-50 text-violet-700">
              AI
            </span>
            {aiConfidence !== null && (
              <ConfidenceBadge confidence={aiConfidence} />
            )}
          </div>
        ) : (
          <span className="role-badge bg-emerald-50 text-emerald-700">
            Exact
          </span>
        )}
      </div>

      {/* Criterion side */}
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
          Acceptance Criterion
        </div>
        <div className="text-sm font-semibold text-[var(--foreground)]">
          {parameterName}
        </div>
        <div className="mt-0.5 font-mono text-xs text-[var(--accent)]">
          {limitStr}
        </div>
        {sourceRef && (
          <div className="mt-0.5 text-xs text-gray-400">{sourceRef}</div>
        )}
      </div>

      {/* Delete button */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="absolute top-3 right-3 rounded-md p-1 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 cursor-pointer disabled:cursor-not-allowed"
        aria-label={`Remove link ${columnName} to ${parameterName}`}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M4 4l8 8M12 4l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  );
}
