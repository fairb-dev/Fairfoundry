"use client";

import { useTransition } from "react";
import { deleteCriterionAction } from "./actions";
import { InlineEdit } from "./inline-edit";

interface CriterionCardProps {
  id: string;
  contractId: string;
  parameterName: string;
  criteriaType: string;
  lowerLimit: number | null;
  upperLimit: number | null;
  unit: string | null;
  source: string;
  sourceRef: string | null;
  aiConfidence: number | null;
  mapsToColumn: string | null;
  sortIndex: number;
  totalCount: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

const SOURCE_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  MANUAL: { bg: "bg-gray-100", text: "text-gray-600", label: "Manual" },
  AI_EXTRACTED: { bg: "bg-violet-50", text: "text-violet-700", label: "AI Extracted" },
  TEMPLATE: { bg: "bg-cyan-50", text: "text-cyan-700", label: "Template" },
};

export function CriterionCard({
  id,
  contractId,
  parameterName,
  criteriaType,
  lowerLimit,
  upperLimit,
  unit,
  source,
  sourceRef,
  aiConfidence,
  mapsToColumn,
  sortIndex,
  totalCount,
  onMoveUp,
  onMoveDown,
}: CriterionCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteCriterionAction(id, contractId);
    });
  }

  const style = SOURCE_STYLES[source] ?? SOURCE_STYLES.MANUAL;

  const showLower = criteriaType === "NUMERIC_GTE" || criteriaType === "NUMERIC_RANGE";
  const showUpper = criteriaType === "NUMERIC_LTE" || criteriaType === "NUMERIC_RANGE";

  return (
    <div
      className={`criterion-card relative group ${isPending ? "opacity-50" : ""}`}
    >
      {/* Top-right actions: sort arrows + delete */}
      <div className="absolute top-3 right-3 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Sort arrows */}
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isPending || sortIndex === 0}
          className="rounded-md p-1 text-gray-300 hover:text-gray-600 hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Move up"
          title="Move up"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M4 7l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isPending || sortIndex === totalCount - 1}
          className="rounded-md p-1 text-gray-300 hover:text-gray-600 hover:bg-gray-100 cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Move down"
          title="Move down"
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
            <path d="M8 13V3M4 9l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Delete button */}
        <button
          type="button"
          onClick={handleDelete}
          disabled={isPending}
          className="rounded-md p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 cursor-pointer disabled:cursor-not-allowed"
          aria-label={`Delete ${parameterName}`}
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

      {/* Parameter name — inline editable */}
      <div className="text-sm font-semibold text-[var(--foreground)] leading-snug pr-20">
        <InlineEdit
          criterionId={id}
          contractId={contractId}
          field="parameterName"
          value={parameterName}
          displayClassName="text-sm font-semibold text-[var(--foreground)]"
        />
      </div>

      {/* Limit values — inline editable */}
      <div className="mt-2 flex items-baseline gap-1 font-mono text-lg font-semibold text-[var(--accent)]">
        {criteriaType === "NUMERIC_GTE" && (
          <>
            <span className="text-gray-400 text-base">{"\u2265"}</span>
            <InlineEdit
              criterionId={id}
              contractId={contractId}
              field="lowerLimit"
              value={lowerLimit !== null ? String(lowerLimit) : ""}
              displayClassName="font-mono text-lg font-semibold text-[var(--accent)]"
              mono
            />
          </>
        )}
        {criteriaType === "NUMERIC_LTE" && (
          <>
            <span className="text-gray-400 text-base">{"\u2264"}</span>
            <InlineEdit
              criterionId={id}
              contractId={contractId}
              field="upperLimit"
              value={upperLimit !== null ? String(upperLimit) : ""}
              displayClassName="font-mono text-lg font-semibold text-[var(--accent)]"
              mono
            />
          </>
        )}
        {criteriaType === "NUMERIC_RANGE" && (
          <>
            <InlineEdit
              criterionId={id}
              contractId={contractId}
              field="lowerLimit"
              value={lowerLimit !== null ? String(lowerLimit) : ""}
              displayClassName="font-mono text-lg font-semibold text-[var(--accent)]"
              mono
            />
            <span className="text-gray-400 text-base mx-1">~</span>
            <InlineEdit
              criterionId={id}
              contractId={contractId}
              field="upperLimit"
              value={upperLimit !== null ? String(upperLimit) : ""}
              displayClassName="font-mono text-lg font-semibold text-[var(--accent)]"
              mono
            />
          </>
        )}
        {!showLower && !showUpper && (
          <span className="text-gray-400 text-sm">No limits</span>
        )}
        {/* Unit — inline editable */}
        <InlineEdit
          criterionId={id}
          contractId={contractId}
          field="unit"
          value={unit ?? ""}
          displayClassName="font-mono text-sm text-gray-500"
          mono
        />
      </div>

      {/* Maps to column indicator */}
      {mapsToColumn && (
        <div className="mt-1.5 text-xs text-gray-400 font-mono">
          <span className="text-gray-300 mr-1">{"\u2192"}</span>
          {mapsToColumn}
        </div>
      )}

      {/* Meta info */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className={`role-badge ${style.bg} ${style.text}`}>
          {style.label}
        </span>
        {aiConfidence !== null && (
          <span className="text-xs text-gray-400">
            {Math.round(aiConfidence * 100)}% confidence
          </span>
        )}
      </div>

      {/* Source reference */}
      {sourceRef && (
        <div className="mt-3 text-xs text-gray-400">
          Source: {sourceRef}
        </div>
      )}
    </div>
  );
}
