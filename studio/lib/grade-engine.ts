import type { QualityGate } from "./gate-suggester";

export type GradeLabel = "Grade A" | "Grade B" | "Rework" | "Review" | "Reject";

export interface GateCellResult {
  gateId: string;
  parameter: string;
  severity: QualityGate["severity"];
  rawValue: string;
  numericValue: number | null;
  pass: boolean;
  margin: number | null;
  nearLimit: boolean;
  reason: string;
}

export interface GradedUnitResult {
  unitId: string;
  rowIndex: number;
  grade: GradeLabel;
  overallPass: boolean;
  failedGateIds: string[];
  reviewFlags: string[];
  cells: GateCellResult[];
}

export interface GradeSummary {
  distribution: Record<GradeLabel, number>;
  units: GradedUnitResult[];
}

const GRADE_ORDER: GradeLabel[] = [
  "Grade A",
  "Grade B",
  "Rework",
  "Review",
  "Reject",
];

function evaluateNumericGate(rawValue: string, gate: QualityGate): GateCellResult {
  const value = Number.parseFloat(rawValue);
  if (!Number.isFinite(value)) {
    return {
      gateId: gate.criterionId,
      parameter: gate.parameter,
      severity: gate.severity,
      rawValue,
      numericValue: null,
      pass: false,
      margin: null,
      nearLimit: false,
      reason: "missing or non-numeric evidence",
    };
  }

  let pass = true;
  let margin: number | null = null;

  switch (gate.criteriaType) {
    case "NUMERIC_GTE":
      pass = gate.lowerLimit !== null && value >= gate.lowerLimit;
      margin = gate.lowerLimit !== null ? value - gate.lowerLimit : null;
      break;
    case "NUMERIC_LTE":
      pass = gate.upperLimit !== null && value <= gate.upperLimit;
      margin = gate.upperLimit !== null ? gate.upperLimit - value : null;
      break;
    case "NUMERIC_RANGE":
      if (gate.lowerLimit === null || gate.upperLimit === null) {
        pass = false;
        margin = null;
      } else {
        pass = value >= gate.lowerLimit && value <= gate.upperLimit;
        margin = pass
          ? Math.min(value - gate.lowerLimit, gate.upperLimit - value)
          : value < gate.lowerLimit
            ? value - gate.lowerLimit
            : gate.upperLimit - value;
      }
      break;
    default:
      pass = true;
      margin = null;
  }

  const limitSpan =
    gate.lowerLimit !== null && gate.upperLimit !== null
      ? Math.abs(gate.upperLimit - gate.lowerLimit)
      : Math.abs(gate.lowerLimit ?? gate.upperLimit ?? 1);
  const nearLimit =
    pass && margin !== null && limitSpan > 0 && margin / limitSpan <= 0.08;

  return {
    gateId: gate.criterionId,
    parameter: gate.parameter,
    severity: gate.severity,
    rawValue,
    numericValue: value,
    pass,
    margin,
    nearLimit,
    reason: pass ? (nearLimit ? "accepted near limit" : "accepted") : "outside limit",
  };
}

function decideGrade(cells: GateCellResult[], reviewFlags: string[]): GradeLabel {
  const failedCritical = cells.some((c) => !c.pass && c.severity === "critical");
  if (failedCritical) return "Reject";

  if (reviewFlags.length > 0) return "Review";

  const failedMajor = cells.some((c) => !c.pass && c.severity === "major");
  const failedMinor = cells.some((c) => !c.pass && c.severity === "minor");
  if (failedMajor || failedMinor) return "Rework";

  const nearCriticalOrMajor = cells.some(
    (c) => c.nearLimit && (c.severity === "critical" || c.severity === "major")
  );
  if (nearCriticalOrMajor) return "Grade B";

  return "Grade A";
}

export function gradeRows(
  rows: string[][],
  gates: QualityGate[],
  unitIdColumnIndex: number
): GradeSummary {
  const distribution = Object.fromEntries(
    GRADE_ORDER.map((label) => [label, 0])
  ) as Record<GradeLabel, number>;

  const activeGates = gates.filter((gate) => gate.matchedColumnIndex !== null);

  const units = rows.map((row, rowIndex) => {
    const unitId = row[unitIdColumnIndex] || `Row ${rowIndex + 1}`;
    const reviewFlags: string[] = [];

    for (const gate of gates) {
      if (gate.matchStatus === "missing") {
        reviewFlags.push(`${gate.criterionId} has no matched evidence column`);
      } else if (gate.matchStatus === "fuzzy") {
        reviewFlags.push(`${gate.criterionId} uses fuzzy column match`);
      }
    }

    const cells = activeGates.map((gate) =>
      evaluateNumericGate(row[gate.matchedColumnIndex ?? -1] ?? "", gate)
    );

    const grade = decideGrade(cells, reviewFlags);
    distribution[grade]++;

    return {
      unitId,
      rowIndex,
      grade,
      overallPass: grade === "Grade A" || grade === "Grade B",
      failedGateIds: cells.filter((c) => !c.pass).map((c) => c.gateId),
      reviewFlags,
      cells,
    };
  });

  return { distribution, units };
}
