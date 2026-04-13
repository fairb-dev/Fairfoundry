"use client";

import { useState } from "react";

const PREVIEW_ROWS = 5;

export function DataPreviewSection({
  headers,
  rows,
}: {
  headers: string[];
  rows: string[][];
}) {
  const [expanded, setExpanded] = useState(false);
  const displayRows = expanded ? rows : rows.slice(0, PREVIEW_ROWS);
  const hasMore = rows.length > PREVIEW_ROWS;

  return (
    <div>
      <div className="overflow-x-auto rounded-lg border border-[var(--border)]">
        <table className="verification-table" style={{ fontSize: "0.8rem" }}>
          <thead>
            <tr>
              {headers.map((h) => (
                <th key={h} style={{ padding: "6px 10px", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    style={{ padding: "4px 10px", whiteSpace: "nowrap" }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm font-medium text-[var(--accent)] bg-transparent border-0 cursor-pointer hover:underline p-0"
        >
          {expanded
            ? "Show fewer rows"
            : `Show all ${rows.length} rows`}
        </button>
      )}
    </div>
  );
}
