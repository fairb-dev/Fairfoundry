"use client";

import { useState, useTransition } from "react";
import { triggerAutoMatchAction } from "./actions";
import type { MatchSummary } from "@/lib/match-agent";

export function MatchButton({
  contractId,
  compact = false,
}: {
  contractId: string;
  compact?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{
    summary?: MatchSummary | null;
    error?: string;
  } | null>(null);

  function handleMatch() {
    setResult(null);
    startTransition(async () => {
      const res = await triggerAutoMatchAction(contractId);
      setResult(res);
    });
  }

  // Spinner icon reused in both modes
  const spinnerIcon = (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M4 12a8 8 0 018-8"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="opacity-75"
      />
    </svg>
  );

  // Link icon reused in both modes
  const linkIcon = (size: number, strokeWidth: number) => (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  // ── Compact mode: small re-match button for header bar ──
  if (compact) {
    // After success in compact mode, show inline success text
    if (result?.summary && result.summary.matches.length > 0) {
      const { exactCount, aiCount, matches } = result.summary;
      return (
        <span className="inline-flex items-center gap-2 text-sm text-green-700">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M13.333 4L6 11.333L2.667 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          +{matches.length} ({exactCount} exact, {aiCount} AI)
        </span>
      );
    }

    return (
      <div className="flex items-center gap-2">
        {result?.error && (
          <span className="text-xs text-red-600">{result.error}</span>
        )}
        <button
          type="button"
          onClick={handleMatch}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold text-[var(--foreground)] transition-all hover:border-gray-400 hover:shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <>{spinnerIcon} Matching...</>
          ) : (
            <>{linkIcon(14, 2)} Re-match</>
          )}
        </button>
      </div>
    );
  }

  // ── Full mode: hero CTA for empty state ──

  // After success, show result summary
  if (result?.summary && result.summary.matches.length > 0) {
    const { exactCount, aiCount, matches } = result.summary;
    return (
      <div className="rounded-2xl border-2 border-green-200 bg-green-50/50 p-8 text-center">
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          className="mx-auto mb-4 text-green-500"
        >
          <path
            d="M9 12l2 2 4-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
        <p className="text-lg font-semibold text-green-800">
          {matches.length} {matches.length === 1 ? "link" : "links"} created
        </p>
        <p className="mt-2 text-sm text-green-600">
          {exactCount > 0 && (
            <span>
              {exactCount} exact {exactCount === 1 ? "match" : "matches"}
            </span>
          )}
          {exactCount > 0 && aiCount > 0 && <span>, </span>}
          {aiCount > 0 && (
            <span>
              {aiCount} AI {aiCount === 1 ? "suggestion" : "suggestions"}
            </span>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--muted)] p-12 text-center">
      {/* Linking icon */}
      <div className="mx-auto mb-5 text-[var(--accent)]">
        {linkIcon(56, 1.5)}
      </div>

      <h3 className="text-lg font-semibold text-[var(--foreground)]">
        Connect Columns to Criteria
      </h3>
      <p className="mt-2 max-w-md mx-auto text-sm text-gray-500">
        The match agent will automatically link your CSV data columns to
        acceptance criteria using specification metadata and AI semantic matching.
      </p>

      {/* Error display */}
      {result?.error && (
        <div className="mt-4 mx-auto max-w-md rounded-xl border border-red-200 bg-red-50/50 px-4 py-3 text-sm text-red-700">
          {result.error}
        </div>
      )}

      {/* Result: no matches found */}
      {result?.summary && result.summary.matches.length === 0 && (
        <div className="mt-4 mx-auto max-w-md rounded-xl border border-yellow-200 bg-yellow-50/50 px-4 py-3 text-sm text-yellow-700">
          No matches found. Try adding manual links below.
        </div>
      )}

      <button
        type="button"
        onClick={handleMatch}
        disabled={isPending}
        className="mt-6 inline-flex items-center gap-2.5 rounded-xl bg-[var(--accent)] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-200/50 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-blue-200/60 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <>
            {spinnerIcon}
            Matching...
          </>
        ) : (
          <>
            {linkIcon(18, 2)}
            Match Columns to Criteria
          </>
        )}
      </button>
    </div>
  );
}
