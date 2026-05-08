import { parseCSV, type ParsedCSV } from "./csv-parser";

export type ColumnDataType =
  | "numeric"
  | "integer"
  | "datetime"
  | "identifier"
  | "categorical"
  | "text"
  | "empty";

export type InferredRole =
  | "UNIT_ID"
  | "TIMESTAMP"
  | "MEASUREMENT"
  | "CONDITION"
  | "EQUIPMENT"
  | "OPERATOR"
  | "METADATA"
  | "IGNORE";

export interface ColumnProfile {
  index: number;
  name: string;
  dataType: ColumnDataType;
  nullCount: number;
  nullRate: number;
  uniqueCount: number;
  uniqueRate: number;
  sampleValues: string[];
  numericStats: {
    min: number;
    p50: number;
    max: number;
    mean: number;
  } | null;
  inferredRole: InferredRole;
  roleConfidence: number;
  formulaInjection: boolean;
}

export interface LogProfile {
  rowCount: number;
  columnCount: number;
  columns: ColumnProfile[];
  warnings: string[];
}

const TIMESTAMP_REGEX =
  /^\d{4}-\d{2}-\d{2}([ T]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/;

const NUMERIC_REGEX = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;
const INTEGER_REGEX = /^-?\d+$/;

const ID_NAME_HINTS = [
  "id",
  "serial",
  "serial_no",
  "board",
  "heat",
  "plate",
  "lot",
  "sample",
  "asset",
  "uuid",
];

const TIME_NAME_HINTS = ["time", "date", "timestamp"];

const OPERATOR_NAME_HINTS = ["operator", "operator_id", "tech", "inspector"];

const EQUIPMENT_NAME_HINTS = [
  "station",
  "line",
  "machine",
  "equipment",
  "tool",
  "mold",
  "fixture",
  "rig",
];

const METADATA_NAME_HINTS = [
  "result",
  "status",
  "fail_code",
  "disposition",
  "comment",
  "notes",
  "remark",
];

function nameContains(name: string, hints: string[]): boolean {
  const n = name.toLowerCase();
  return hints.some((h) => n === h || n.includes(h));
}

function nameLooksLikeIdentifier(name: string): boolean {
  const n = name.toLowerCase();
  if (n === "id" || n.endsWith("_id") || n.endsWith("-id") || n.endsWith(" id")) {
    return true;
  }
  return ID_NAME_HINTS.filter((hint) => hint !== "id").some(
    (hint) => n === hint || n.includes(hint)
  );
}

function detectFormulaInjection(value: string): boolean {
  if (value.length === 0) return false;
  if (value === "-") return false;
  const c = value[0];
  return c === "=" || c === "+" || c === "@" || (c === "-" && !NUMERIC_REGEX.test(value));
}

function classifyDataType(values: string[]): ColumnDataType {
  if (values.length === 0) return "empty";
  let allTimestamp = true;
  let allNumeric = true;
  let allInteger = true;
  for (const v of values) {
    if (!TIMESTAMP_REGEX.test(v)) allTimestamp = false;
    if (!NUMERIC_REGEX.test(v)) allNumeric = false;
    if (!INTEGER_REGEX.test(v)) allInteger = false;
    if (!allTimestamp && !allNumeric && !allInteger) break;
  }
  if (allTimestamp) return "datetime";
  if (allInteger) return "integer";
  if (allNumeric) return "numeric";
  return "text";
}

function numericStats(values: string[]) {
  const nums = values
    .map((v) => Number.parseFloat(v))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
  if (nums.length === 0) return null;
  const min = nums[0];
  const max = nums[nums.length - 1];
  const p50 = nums[Math.floor(nums.length / 2)];
  const mean = nums.reduce((s, n) => s + n, 0) / nums.length;
  return { min, p50, max, mean };
}

function inferRole(
  name: string,
  dataType: ColumnDataType,
  uniqueRate: number,
  uniqueCount: number,
  rowCount: number,
  isFirstColumn: boolean
): { role: InferredRole; confidence: number } {
  if (dataType === "datetime" || nameContains(name, TIME_NAME_HINTS)) {
    return { role: "TIMESTAMP", confidence: 0.95 };
  }
  if (nameContains(name, OPERATOR_NAME_HINTS)) {
    return { role: "OPERATOR", confidence: 0.9 };
  }
  if (nameContains(name, EQUIPMENT_NAME_HINTS)) {
    return { role: "EQUIPMENT", confidence: 0.85 };
  }
  if (nameContains(name, METADATA_NAME_HINTS)) {
    return { role: "METADATA", confidence: 0.8 };
  }
  if (nameLooksLikeIdentifier(name) || (isFirstColumn && uniqueRate > 0.9)) {
    return { role: "UNIT_ID", confidence: uniqueRate > 0.95 ? 0.95 : 0.75 };
  }
  if (dataType === "numeric" || dataType === "integer") {
    if (uniqueCount <= Math.max(8, rowCount * 0.1)) {
      return { role: "CONDITION", confidence: 0.6 };
    }
    return { role: "MEASUREMENT", confidence: 0.85 };
  }
  if (dataType === "text" && uniqueCount <= Math.max(6, rowCount * 0.2)) {
    return { role: "CONDITION", confidence: 0.55 };
  }
  return { role: "METADATA", confidence: 0.4 };
}

export function profileLog(parsed: ParsedCSV): LogProfile {
  const { headers, rows } = parsed;
  const rowCount = rows.length;
  const warnings: string[] = [];

  const columns: ColumnProfile[] = headers.map((rawName, index) => {
    const name = rawName.trim();
    const colValues = rows.map((row) => (row[index] ?? "").trim());
    const nonEmpty = colValues.filter((v) => v.length > 0 && v !== "-" && v !== "NA" && v !== "null");
    const nullCount = rowCount - nonEmpty.length;
    const nullRate = rowCount === 0 ? 0 : nullCount / rowCount;

    const unique = new Set(nonEmpty);
    const uniqueCount = unique.size;
    const uniqueRate = rowCount === 0 ? 0 : uniqueCount / rowCount;

    const dataType = classifyDataType(nonEmpty);
    const stats =
      dataType === "numeric" || dataType === "integer" ? numericStats(nonEmpty) : null;

    const sampleValues = Array.from(unique).slice(0, 5);
    const formulaInjection = colValues.some(detectFormulaInjection);
    if (formulaInjection) {
      warnings.push(`Column "${name}" contains a value starting with =, +, @ or - which could be misread as a spreadsheet formula.`);
    }

    const { role, confidence } = inferRole(
      name,
      dataType,
      uniqueRate,
      uniqueCount,
      rowCount,
      index === 0
    );

    return {
      index,
      name,
      dataType,
      nullCount,
      nullRate,
      uniqueCount,
      uniqueRate,
      sampleValues,
      numericStats: stats,
      inferredRole: role,
      roleConfidence: confidence,
      formulaInjection,
    };
  });

  const idColumns = columns.filter((c) => c.inferredRole === "UNIT_ID");
  if (idColumns.length === 0) {
    warnings.push("No unit identifier column detected; sandbox will use row index as fallback.");
  }
  const tsColumns = columns.filter((c) => c.inferredRole === "TIMESTAMP");
  if (tsColumns.length === 0) {
    warnings.push("No timestamp column detected; time-based traceability will rely on submission timestamp.");
  }

  return {
    rowCount,
    columnCount: headers.length,
    columns,
    warnings,
  };
}

export function profileCsvText(text: string): LogProfile {
  return profileLog(parseCSV(text));
}
