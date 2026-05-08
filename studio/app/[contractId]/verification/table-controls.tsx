"use client";

import { useState, useMemo, useCallback } from "react";
import { FailCell } from "./fail-cell";

/* ─── Types mirroring server data ──────────────────────────────────────── */

interface LinkedColumnInfo {
  columnName: string;
  criteriaType: string;
  lowerLimit: number | null;
  upperLimit: number | null;
  unit: string | null;
  sourceRef: string | null;
  parameterName: string;
}

interface CellResult {
  value: number;
  rawValue: string;
  pass: boolean;
  margin: number | null;
}

interface UnitRow {
  unitId: string;
  rowIndex: number;
  overallPass: boolean;
  cells: Record<string, CellResult>;
  rawRow: string[];
}

export interface TableControlsProps {
  unitRows: UnitRow[];
  orderedHeaders: string[];
  unitIdHeader: string;
  headerIndexMap: Record<string, number>;
  linkedInfo: Record<string, LinkedColumnInfo>;
  linkedColumnNames: string[];
}

type SortDirection = "asc" | "desc";
type FilterMode = "all" | "pass" | "fail";

/* ─── Component ────────────────────────────────────────────────────────── */

export function TableControls({
  unitRows,
  orderedHeaders,
  unitIdHeader,
  headerIndexMap,
  linkedInfo,
  linkedColumnNames,
}: TableControlsProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [hoveredCol, setHoveredCol] = useState<string | null>(null);

  const linkedSet = useMemo(() => new Set(linkedColumnNames), [linkedColumnNames]);

  /* ── Sort handler ─────────────────────────────────────────────────────── */

  const handleSort = useCallback(
    (header: string) => {
      if (sortCol === header) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      } else {
        setSortCol(header);
        setSortDir("asc");
      }
    },
    [sortCol],
  );

  /* ── Derived data ─────────────────────────────────────────────────────── */

  const processed = useMemo(() => {
    let rows = unitRows;

    // Filter by search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => r.unitId.toLowerCase().includes(q));
    }

    // Filter by pass/fail
    if (filter === "pass") {
      rows = rows.filter((r) => r.overallPass);
    } else if (filter === "fail") {
      rows = rows.filter((r) => !r.overallPass);
    }

    // Sort
    if (sortCol) {
      const colIdx = headerIndexMap[sortCol];
      rows = [...rows].sort((a, b) => {
        const aVal = a.rawRow[colIdx] ?? "";
        const bVal = b.rawRow[colIdx] ?? "";
        const aNum = parseFloat(aVal);
        const bNum = parseFloat(bVal);
        const bothNumeric = !isNaN(aNum) && !isNaN(bNum);

        let cmp: number;
        if (bothNumeric) {
          cmp = aNum - bNum;
        } else {
          cmp = aVal.localeCompare(bVal);
        }

        return sortDir === "asc" ? cmp : -cmp;
      });
    }

    return rows;
  }, [unitRows, search, filter, sortCol, sortDir, headerIndexMap]);

  /* ── Status line ──────────────────────────────────────────────────────── */

  const statusText = useMemo(() => {
    if (processed.length === unitRows.length) return null;

    const label =
      filter === "pass"
        ? "passing only"
        : filter === "fail"
          ? "failures only"
          : "matching search";
    return `Showing ${processed.length} of ${unitRows.length} (${label})`;
  }, [processed.length, unitRows.length, filter]);

  /* ── Sort arrow helper ────────────────────────────────────────────────── */

  function sortArrow(header: string) {
    if (sortCol !== header) return null;
    return (
      <span
        className="inline-block ml-1 text-xs"
        style={{ color: "var(--accent)" }}
      >
        {sortDir === "asc" ? "\u25B2" : "\u25BC"}
      </span>
    );
  }

  /* ── Render ──────────────────────────────────────────────────────────── */

  return (
    <div>
      {/* ── Controls bar ──────────────────────────────────────────────── */}
      <div
        className="mb-3 flex flex-wrap items-center gap-3"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {/* Search */}
        <div className="relative flex-1" style={{ minWidth: 200, maxWidth: 360 }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: "#9ca3af" }}
          >
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <label htmlFor="unit-search" className="sr-only">
            Search by unit ID
          </label>
          <input
            id="unit-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by unit ID..."
            className="w-full rounded-lg border border-[var(--border)] bg-white py-2 pl-9 pr-3 text-sm outline-none transition-colors focus:border-[var(--accent)]"
            style={{ fontFamily: "var(--font-sans)" }}
          />
        </div>

        {/* Filter buttons */}
        <div className="flex rounded-lg border border-[var(--border)] overflow-hidden" role="group" aria-label="Filter by result">
          {(
            [
              { key: "all", label: "All" },
              { key: "pass", label: "Pass only" },
              { key: "fail", label: "Fail only" },
            ] as const
          ).map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className="px-3.5 py-1.5 text-xs font-semibold transition-colors border-0 cursor-pointer"
              style={{
                background: filter === key ? "var(--foreground)" : "white",
                color: filter === key ? "white" : "#6b7280",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Status line */}
        {statusText && (
          <div className="text-xs text-gray-400 font-medium whitespace-nowrap">
            {statusText}
          </div>
        )}
      </div>

      {/* ── Table ─────────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-[var(--border)] shadow-sm">
        <table className="verification-table">
          <thead>
            <tr>
              {orderedHeaders.map((header) => {
                const info = linkedInfo[header];
                const isUnitId = header === unitIdHeader;
                const isHovered = hoveredCol === header;
                const sortable = linkedSet.has(header) || isUnitId;

                const thStyle: React.CSSProperties = {
                  cursor: sortable ? "pointer" : undefined,
                  userSelect: sortable ? "none" : undefined,
                  background: isHovered ? "#eef2f7" : undefined,
                  transition: "background 0.15s",
                };

                if (info) {
                  return (
                    <th
                      key={header}
                      onClick={() => sortable && handleSort(header)}
                      onMouseEnter={() => setHoveredCol(header)}
                      onMouseLeave={() => setHoveredCol(null)}
                      style={thStyle}
                    >
                      <div className="col-header-name">
                        {header}
                        {sortArrow(header)}
                      </div>
                      <div className="col-header-limit">
                        {formatLimitLocal(
                          info.criteriaType,
                          info.lowerLimit,
                          info.upperLimit,
                          info.unit,
                        )}
                      </div>
                      {info.sourceRef && (
                        <div className="col-header-ref">
                          {"\u00A7"}
                          {info.sourceRef.replace(/^Section\s*/i, "")}
                        </div>
                      )}
                    </th>
                  );
                }

                return (
                  <th
                    key={header}
                    onClick={() => sortable && handleSort(header)}
                    onMouseEnter={() => setHoveredCol(header)}
                    onMouseLeave={() => setHoveredCol(null)}
                    style={thStyle}
                  >
                    <div className="col-header-name">
                      {header}
                      {sortable && sortArrow(header)}
                    </div>
                    {isUnitId && (
                      <div className="mt-0.5">
                        <span className="role-badge bg-green-50 text-green-700">
                          Unit ID
                        </span>
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {processed.length === 0 && (
              <tr>
                <td
                  colSpan={orderedHeaders.length}
                  className="text-center text-gray-400 py-12"
                  style={{ fontFamily: "var(--font-sans)" }}
                >
                  No units match the current filters.
                </td>
              </tr>
            )}
            {processed.map((unit) => (
              <tr
                key={unit.rowIndex}
                data-fail={unit.overallPass ? undefined : "true"}
                style={{
                  backgroundColor: unit.overallPass
                    ? undefined
                    : "var(--fail-bg-subtle)",
                }}
              >
                {orderedHeaders.map((header) => {
                  const colIdx = headerIndexMap[header];
                  const rawValue = unit.rawRow[colIdx] ?? "";
                  const isUnitId = header === unitIdHeader;
                  const cellResult = unit.cells[header];
                  const isHovered = hoveredCol === header;

                  const cellHighlight: React.CSSProperties = isHovered
                    ? { backgroundColor: "rgba(47, 111, 237, 0.04)" }
                    : {};

                  if (isUnitId) {
                    return (
                      <td
                        key={header}
                        className="font-mono text-sm font-medium"
                        style={isHovered ? {} : undefined}
                      >
                        {rawValue}
                      </td>
                    );
                  }

                  if (cellResult) {
                    const colInfo = linkedInfo[header];
                    if (!cellResult.pass && colInfo) {
                      return (
                        <td key={header} style={cellHighlight}>
                          <div className="flex items-center">
                            <span className="flex-1" />
                            <FailCell
                              rawValue={rawValue}
                              measuredValue={cellResult.value}
                              criteriaType={colInfo.criteriaType}
                              lowerLimit={colInfo.lowerLimit}
                              upperLimit={colInfo.upperLimit}
                              unit={colInfo.unit}
                              margin={cellResult.margin}
                              sourceRef={colInfo.sourceRef}
                              parameterName={colInfo.parameterName}
                            />
                          </div>
                        </td>
                      );
                    }

                    return (
                      <td key={header} style={cellHighlight}>
                        <div className="flex items-center">
                          <span
                            className="text-xs"
                            style={{ color: "var(--pass)" }}
                          >
                            {"\u2713"}
                          </span>
                          <span className="flex-1" />
                          <span style={{ color: "var(--pass)" }}>{rawValue}</span>
                        </div>
                      </td>
                    );
                  }

                  return (
                    <td key={header} className="text-gray-500" style={cellHighlight}>
                      {rawValue}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── Local helper (avoids importing server module) ─────────────────────── */

function formatLimitLocal(
  criteriaType: string,
  lowerLimit: number | null,
  upperLimit: number | null,
  unit: string | null,
): string {
  const u = unit ? ` ${unit}` : "";
  switch (criteriaType) {
    case "NUMERIC_GTE":
      return `\u2265 ${lowerLimit}${u}`;
    case "NUMERIC_LTE":
      return `\u2264 ${upperLimit}${u}`;
    case "NUMERIC_RANGE":
      return `${lowerLimit} ~ ${upperLimit}${u}`;
    default:
      return unit ?? "";
  }
}
