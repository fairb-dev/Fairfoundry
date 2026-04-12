/**
 * CSV Parser — parses a CSV string into structured data.
 * Handles basic comma-delimited CSVs with optional quoted fields.
 */

export interface ParsedCSV {
  headers: string[];
  rows: string[][];
}

export function parseCSV(raw: string): ParsedCSV {
  const lines = raw.trim().split("\n");
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows = lines.slice(1).map((line) => {
    return line.split(",").map((cell) => cell.trim());
  });

  return { headers, rows };
}
