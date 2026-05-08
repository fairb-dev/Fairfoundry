/**
 * CSV Parser — parses a CSV string into structured data.
 * Supports double-quoted fields, escaped quotes ("") inside quotes,
 * and commas inside quoted fields.
 */

export interface ParsedCSV {
  headers: string[];
  rows: string[][];
}

function parseLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === ",") {
        out.push(cur.trim());
        cur = "";
      } else if (ch === '"' && cur.length === 0) {
        inQuotes = true;
      } else {
        cur += ch;
      }
    }
  }
  out.push(cur.trim());
  return out;
}

export function parseCSV(raw: string): ParsedCSV {
  const text = raw.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (text.length === 0) {
    return { headers: [], rows: [] };
  }
  const lines = text.split("\n").filter((l) => l.length > 0);
  if (lines.length === 0) {
    return { headers: [], rows: [] };
  }
  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}
