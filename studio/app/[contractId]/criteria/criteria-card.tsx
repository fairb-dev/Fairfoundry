"use client";

import { useTransition } from "react";
import { deleteCriterionAction } from "./actions";

interface CriterionCardProps {
  id: string;
  contractId: string;
  parameterName: string;
  limitStr: string;
  source: string;
  sourceRef: string | null;
  aiConfidence: number | null;
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
  limitStr,
  source,
  sourceRef,
  aiConfidence,
}: CriterionCardProps) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteCriterionAction(id, contractId);
    });
  }

  const style = SOURCE_STYLES[source] ?? SOURCE_STYLES.MANUAL;

  return (
    <div
      className={`criterion-card relative group ${isPending ? "opacity-50" : ""}`}
    >
      {/* Delete button */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="absolute top-3 right-3 rounded-md p-1 text-gray-300 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 cursor-pointer disabled:cursor-not-allowed"
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

      {/* Parameter name */}
      <div className="text-sm font-semibold text-[var(--foreground)] leading-snug pr-6">
        {parameterName}
      </div>

      {/* Limit display */}
      <div className="mt-2 font-mono text-lg font-semibold text-[var(--accent)]">
        {limitStr}
      </div>

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
