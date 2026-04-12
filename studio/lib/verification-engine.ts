/**
 * Verification Engine
 *
 * The heart of the hypertext qualification system.
 * Takes CSV data rows and linked column-criteria pairs,
 * evaluates pass/fail per unit per criterion, and returns
 * structured results for the verification table.
 */

export interface LinkedColumn {
  columnIndex: number;
  columnName: string;
  criterionId: string;
  parameterName: string;
  criteriaType: string;
  lowerLimit: number | null;
  upperLimit: number | null;
  unit: string | null;
  sourceRef: string | null;
}

export interface CellResult {
  value: number;
  rawValue: string;
  pass: boolean;
  margin: number | null; // how far above/below the limit
}

export interface UnitResult {
  unitId: string;
  rowIndex: number;
  overallPass: boolean;
  cells: Record<string, CellResult>; // keyed by columnName
}

export interface CriterionSummary {
  columnName: string;
  parameterName: string;
  totalChecked: number;
  totalPassed: number;
  totalFailed: number;
}

export interface VerificationResult {
  totalUnits: number;
  totalPassed: number;
  totalFailed: number;
  passRate: number;
  unitResults: UnitResult[];
  criterionSummaries: CriterionSummary[];
}

function evaluateCell(
  rawValue: string,
  criteriaType: string,
  lowerLimit: number | null,
  upperLimit: number | null
): CellResult {
  const value = parseFloat(rawValue);
  if (isNaN(value)) {
    return { value: 0, rawValue, pass: false, margin: null };
  }

  let pass = false;
  let margin: number | null = null;

  switch (criteriaType) {
    case "NUMERIC_GTE":
      pass = lowerLimit !== null && value >= lowerLimit;
      margin = lowerLimit !== null ? value - lowerLimit : null;
      break;

    case "NUMERIC_LTE":
      pass = upperLimit !== null && value <= upperLimit;
      margin = upperLimit !== null ? upperLimit - value : null;
      break;

    case "NUMERIC_RANGE":
      if (lowerLimit !== null && upperLimit !== null) {
        pass = value >= lowerLimit && value <= upperLimit;
        if (value < lowerLimit) {
          margin = value - lowerLimit; // negative = below range
        } else if (value > upperLimit) {
          margin = upperLimit - value; // negative = above range
        } else {
          // Within range: margin is distance to nearest limit
          margin = Math.min(value - lowerLimit, upperLimit - value);
        }
      }
      break;

    default:
      // For unsupported types, mark as pass by default
      pass = true;
      margin = null;
  }

  return { value, rawValue, pass, margin };
}

export function runVerification(
  headers: string[],
  rows: string[][],
  linkedColumns: LinkedColumn[],
  unitIdColumnIndex: number
): VerificationResult {
  const unitResults: UnitResult[] = [];
  const criterionCounters: Record<
    string,
    { passed: number; failed: number; total: number }
  > = {};

  // Initialize counters
  for (const lc of linkedColumns) {
    criterionCounters[lc.columnName] = { passed: 0, failed: 0, total: 0 };
  }

  let totalPassed = 0;
  let totalFailed = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const unitId = row[unitIdColumnIndex] ?? `Row ${i + 1}`;
    const cells: Record<string, CellResult> = {};
    let unitPass = true;

    for (const lc of linkedColumns) {
      const rawValue = row[lc.columnIndex] ?? "";
      const result = evaluateCell(
        rawValue,
        lc.criteriaType,
        lc.lowerLimit,
        lc.upperLimit
      );
      cells[lc.columnName] = result;
      criterionCounters[lc.columnName].total++;

      if (result.pass) {
        criterionCounters[lc.columnName].passed++;
      } else {
        criterionCounters[lc.columnName].failed++;
        unitPass = false;
      }
    }

    if (unitPass) {
      totalPassed++;
    } else {
      totalFailed++;
    }

    unitResults.push({
      unitId,
      rowIndex: i,
      overallPass: unitPass,
      cells,
    });
  }

  const criterionSummaries: CriterionSummary[] = linkedColumns.map((lc) => ({
    columnName: lc.columnName,
    parameterName: lc.parameterName,
    totalChecked: criterionCounters[lc.columnName].total,
    totalPassed: criterionCounters[lc.columnName].passed,
    totalFailed: criterionCounters[lc.columnName].failed,
  }));

  const totalUnits = rows.length;
  const passRate = totalUnits > 0 ? (totalPassed / totalUnits) * 100 : 0;

  return {
    totalUnits,
    totalPassed,
    totalFailed,
    passRate,
    unitResults,
    criterionSummaries,
  };
}

/**
 * Format a criterion's limit for display in the column header.
 * e.g., ">= 0.50 cy/px" or "<= 15.0 px" or "-2.0 ~ 2.0 arcmin"
 */
export function formatLimit(
  criteriaType: string,
  lowerLimit: number | null,
  upperLimit: number | null,
  unit: string | null
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
