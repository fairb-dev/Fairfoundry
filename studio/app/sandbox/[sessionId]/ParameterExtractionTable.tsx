"use client";

import { useMemo, useState } from "react";

export interface ExtractionColumnRow {
  name: string;
  role: string;
  dataType: string;
  statsText: string;
  statsTitle: string | null;
  confidenceText: string;
  confidenceValue: number;
}

type SortKey = "name" | "role" | "dataType" | "confidenceValue";
type SortState = {
  key: SortKey;
  direction: "asc" | "desc";
};

const roleOrder = [
  "All",
  "UNIT_ID",
  "CONDITION",
  "MEASUREMENT",
  "TIMESTAMP",
  "EQUIPMENT",
  "OPERATOR",
  "METADATA",
  "IGNORE",
];

function compareRows(
  a: ExtractionColumnRow,
  b: ExtractionColumnRow,
  sort: SortState
): number {
  const dir = sort.direction === "asc" ? 1 : -1;
  if (sort.key === "confidenceValue") {
    return (a.confidenceValue - b.confidenceValue) * dir;
  }
  return String(a[sort.key]).localeCompare(String(b[sort.key])) * dir;
}

export function ParameterExtractionTable({
  rows,
}: {
  rows: ExtractionColumnRow[];
}) {
  const [roleFilter, setRoleFilter] = useState("All");
  const [sort, setSort] = useState<SortState>({
    key: "name",
    direction: "asc",
  });

  const roles = useMemo(() => {
    const present = new Set(rows.map((row) => row.role));
    return roleOrder.filter((role) => role === "All" || present.has(role));
  }, [rows]);

  const visibleRows = useMemo(() => {
    return rows
      .filter((row) => roleFilter === "All" || row.role === roleFilter)
      .sort((a, b) => compareRows(a, b, sort));
  }, [roleFilter, rows, sort]);

  function toggleSort(key: SortKey) {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  }

  function sortMark(key: SortKey) {
    if (sort.key !== key) return "";
    return sort.direction === "asc" ? " ↑" : " ↓";
  }

  function ariaSort(key: SortKey): "ascending" | "descending" | "none" {
    if (sort.key !== key) return "none";
    return sort.direction === "asc" ? "ascending" : "descending";
  }

  return (
    <>
      <div className="sandbox-table-controls" aria-label="Filter extraction rows by role">
        {roles.map((role) => {
          const count =
            role === "All" ? rows.length : rows.filter((row) => row.role === role).length;
          return (
            <button
              key={role}
              type="button"
              className={`sandbox-filter-button ${roleFilter === role ? "active" : ""}`}
              onClick={() => setRoleFilter(role)}
              aria-pressed={roleFilter === role}
            >
              {role} <span>{count}</span>
            </button>
          );
        })}
      </div>
      <div className="sandbox-table-wrap">
        <table className="sandbox-table" aria-label="Parameter extraction table">
          <thead>
            <tr>
              <th aria-sort={ariaSort("name")}>
                <button type="button" className="sandbox-th-button" onClick={() => toggleSort("name")}>
                  Source column{sortMark("name")}
                </button>
              </th>
              <th aria-sort={ariaSort("role")}>
                <button type="button" className="sandbox-th-button" onClick={() => toggleSort("role")}>
                  Role{sortMark("role")}
                </button>
              </th>
              <th aria-sort={ariaSort("dataType")}>
                <button type="button" className="sandbox-th-button" onClick={() => toggleSort("dataType")}>
                  Type{sortMark("dataType")}
                </button>
              </th>
              <th>Stats / samples</th>
              <th
                aria-sort={ariaSort("confidenceValue")}
                title="Confidence uses column names, data type, uniqueness, and sample-value distribution."
              >
                <button
                  type="button"
                  className="sandbox-th-button"
                  onClick={() => toggleSort("confidenceValue")}
                >
                  Confidence{sortMark("confidenceValue")}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {visibleRows.map((column) => (
              <tr key={column.name}>
                <td className="sandbox-mono" data-label="Source column">{column.name}</td>
                <td data-label="Role">
                  <span className="sandbox-chip neutral" aria-label={`Role: ${column.role}`}>
                    {column.role}
                  </span>
                </td>
                <td data-label="Type">{column.dataType}</td>
                <td data-label="Stats / samples">
                  <span title={column.statsTitle ?? undefined}>{column.statsText}</span>
                </td>
                <td className="sandbox-mono" data-label="Confidence">{column.confidenceText}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
