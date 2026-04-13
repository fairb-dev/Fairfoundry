"use client";

import { useState, useMemo } from "react";

/* ─── Types ────────────────────────────────────────────────────────────── */

interface LinkedColumnInfo {
  columnName: string;
  criteriaType: string;
  lowerLimit: number | null;
  upperLimit: number | null;
  unit: string | null;
  parameterName: string;
}

interface WhatIfProps {
  linkedColumns: LinkedColumnInfo[];
  /** All CSV row data — only the columns referenced by linkedColumns matter */
  csvRows: string[][];
  headerIndexMap: Record<string, number>;
}

/* ─── Component ────────────────────────────────────────────────────────── */

export function WhatIf({ linkedColumns, csvRows, headerIndexMap }: WhatIfProps) {
  const [selectedCol, setSelectedCol] = useState<string>(
    linkedColumns[0]?.columnName ?? "",
  );
  const [newLimit, setNewLimit] = useState<string>("");

  const col = useMemo(
    () => linkedColumns.find((c) => c.columnName === selectedCol),
    [linkedColumns, selectedCol],
  );

  /* When selection changes, pre-fill the input with the current limit */
  function handleSelectChange(colName: string) {
    setSelectedCol(colName);
    setNewLimit("");
  }

  /* ── Compute impact ──────────────────────────────────────────────────── */

  const impact = useMemo(() => {
    if (!col) return null;
    const limitVal = parseFloat(newLimit);
    if (isNaN(limitVal)) return null;

    const colIdx = headerIndexMap[col.columnName];
    if (colIdx === undefined) return null;

    const values = csvRows
      .map((row) => parseFloat(row[colIdx]))
      .filter((v) => !isNaN(v));

    if (values.length === 0) return null;

    // Current pass count
    let currentPass = 0;
    let newPass = 0;

    for (const v of values) {
      const curP = evaluatePass(v, col.criteriaType, col.lowerLimit, col.upperLimit);
      if (curP) currentPass++;

      // For the "what if", we adjust the relevant limit
      let adjLower = col.lowerLimit;
      let adjUpper = col.upperLimit;

      if (col.criteriaType === "NUMERIC_GTE") {
        adjLower = limitVal;
      } else if (col.criteriaType === "NUMERIC_LTE") {
        adjUpper = limitVal;
      } else if (col.criteriaType === "NUMERIC_RANGE") {
        // Determine which limit the user is adjusting based on proximity
        if (col.lowerLimit !== null && col.upperLimit !== null) {
          const distToLower = Math.abs(limitVal - col.lowerLimit);
          const distToUpper = Math.abs(limitVal - col.upperLimit);
          if (distToLower <= distToUpper) {
            adjLower = limitVal;
          } else {
            adjUpper = limitVal;
          }
        }
      }

      const newP = evaluatePass(v, col.criteriaType, adjLower, adjUpper);
      if (newP) newPass++;
    }

    const delta = newPass - currentPass;
    return { currentPass, newPass, delta, total: values.length };
  }, [col, newLimit, csvRows, headerIndexMap]);

  if (linkedColumns.length === 0) return null;

  /* ── Current limit display ───────────────────────────────────────────── */

  const currentLimitDisplay = col
    ? formatCurrentLimit(col)
    : "";

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div className="mt-8 rounded-xl border border-[var(--border)] bg-white p-6">
      <div className="flex items-center gap-2 mb-4">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          style={{ color: "var(--accent)" }}
        >
          <path
            d="M12 3v18M3 12h18M7.5 7.5l9 9M16.5 7.5l-9 9"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
        <h3
          style={{
            fontSize: "0.85rem",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--foreground)",
            margin: 0,
          }}
        >
          What If
        </h3>
        <span className="text-xs text-gray-400 ml-1">
          Explore how limit changes affect pass rates
        </span>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        {/* Criterion selector */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Criterion
          </label>
          <select
            value={selectedCol}
            onChange={(e) => handleSelectChange(e.target.value)}
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm outline-none focus:border-[var(--accent)] cursor-pointer"
            style={{ fontFamily: "var(--font-sans)", minWidth: 200 }}
          >
            {linkedColumns.map((lc) => (
              <option key={lc.columnName} value={lc.columnName}>
                {lc.parameterName}
              </option>
            ))}
          </select>
        </div>

        {/* Current limit */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Current limit
          </label>
          <div
            className="rounded-lg border border-[var(--border)] bg-[var(--muted)] px-3 py-2 text-sm font-mono"
            style={{ minWidth: 100 }}
          >
            {currentLimitDisplay}
          </div>
        </div>

        {/* New limit input */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            New limit value
          </label>
          <input
            type="number"
            step="any"
            value={newLimit}
            onChange={(e) => setNewLimit(e.target.value)}
            placeholder="Enter value..."
            className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-mono outline-none focus:border-[var(--accent)]"
            style={{ minWidth: 140 }}
          />
        </div>

        {/* Impact readout */}
        {impact && (
          <div
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{
              background:
                impact.delta > 0
                  ? "var(--pass-bg)"
                  : impact.delta < 0
                    ? "var(--fail-bg)"
                    : "var(--muted)",
              color:
                impact.delta > 0
                  ? "var(--pass-text)"
                  : impact.delta < 0
                    ? "var(--fail-text)"
                    : "var(--foreground)",
              border: "1px solid",
              borderColor:
                impact.delta > 0
                  ? "#bbf7d0"
                  : impact.delta < 0
                    ? "#fecaca"
                    : "var(--border)",
            }}
          >
            {impact.delta > 0 && (
              <span>
                <strong>+{impact.delta}</strong> more units would pass ({impact.newPass}/{impact.total})
              </span>
            )}
            {impact.delta < 0 && (
              <span>
                <strong>{impact.delta}</strong> fewer units would pass ({impact.newPass}/{impact.total})
              </span>
            )}
            {impact.delta === 0 && (
              <span>No change in pass count ({impact.currentPass}/{impact.total})</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────────── */

function evaluatePass(
  value: number,
  criteriaType: string,
  lowerLimit: number | null,
  upperLimit: number | null,
): boolean {
  switch (criteriaType) {
    case "NUMERIC_GTE":
      return lowerLimit !== null && value >= lowerLimit;
    case "NUMERIC_LTE":
      return upperLimit !== null && value <= upperLimit;
    case "NUMERIC_RANGE":
      return (
        lowerLimit !== null &&
        upperLimit !== null &&
        value >= lowerLimit &&
        value <= upperLimit
      );
    default:
      return true;
  }
}

function formatCurrentLimit(col: {
  criteriaType: string;
  lowerLimit: number | null;
  upperLimit: number | null;
  unit: string | null;
}): string {
  const u = col.unit ? ` ${col.unit}` : "";
  switch (col.criteriaType) {
    case "NUMERIC_GTE":
      return `\u2265 ${col.lowerLimit}${u}`;
    case "NUMERIC_LTE":
      return `\u2264 ${col.upperLimit}${u}`;
    case "NUMERIC_RANGE":
      return `${col.lowerLimit} ~ ${col.upperLimit}${u}`;
    default:
      return col.unit ?? "";
  }
}
