import { parseCSV } from "./csv-parser";
import { profileLog, type LogProfile } from "./log-profiler";
import { suggestGates, type GateSuggestionResult } from "./gate-suggester";
import { gradeRows, type GradeSummary } from "./grade-engine";
import type { ErsDocument, SampleCatalogEntry } from "./sample-catalog";

export interface SandboxSimulation {
  sample: SampleCatalogEntry;
  profile: LogProfile;
  gateSuggestions: GateSuggestionResult;
  gradeSummary: GradeSummary;
  unitIdColumnIndex: number;
  evidenceCompleteness: number;
  roleCoverage: {
    unitId: boolean;
    timestamp: boolean;
    equipment: boolean;
    operator: boolean;
    measurementCount: number;
  };
  reviewFlags: string[];
  readinessScore: number;
  settlementPreview: {
    partnerFundingState: string;
    custodyBoundary: string;
    reviewWindow: string;
    interventionPath: string;
    settlementInstruction: string;
  };
}

function findUnitIdColumn(profile: LogProfile): number {
  const unitId = profile.columns.find((c) => c.inferredRole === "UNIT_ID");
  return unitId?.index ?? 0;
}

function collectReviewFlags(
  profile: LogProfile,
  gateSuggestions: GateSuggestionResult,
  gradeSummary: GradeSummary
): string[] {
  const flags = [...profile.warnings];

  const lowConfidenceColumns = profile.columns.filter(
    (column) =>
      column.inferredRole !== "IGNORE" &&
      column.roleConfidence < 0.6 &&
      column.dataType !== "empty"
  );
  for (const column of lowConfidenceColumns) {
    flags.push(`${column.name} needs mapping review (${Math.round(column.roleConfidence * 100)}% confidence)`);
  }

  if (gateSuggestions.missingCount > 0) {
    flags.push(`${gateSuggestions.missingCount} gate${gateSuggestions.missingCount === 1 ? "" : "s"} need evidence mapping`);
  }
  if (gateSuggestions.fuzzyCount > 0) {
    flags.push(`${gateSuggestions.fuzzyCount} gate${gateSuggestions.fuzzyCount === 1 ? "" : "s"} use fuzzy column matching`);
  }

  const reviewUnits = gradeSummary.distribution.Review;
  if (reviewUnits > 0) {
    flags.push(`${reviewUnits} unit${reviewUnits === 1 ? "" : "s"} enter review before settlement instruction`);
  }

  return flags;
}

function computeReadiness(
  profile: LogProfile,
  gateSuggestions: GateSuggestionResult,
  gradeSummary: GradeSummary
): number {
  const roleScore =
    Number(profile.columns.some((c) => c.inferredRole === "UNIT_ID")) +
    Number(profile.columns.some((c) => c.inferredRole === "TIMESTAMP")) +
    Number(profile.columns.some((c) => c.inferredRole === "EQUIPMENT")) +
    Number(profile.columns.some((c) => c.inferredRole === "OPERATOR"));

  const mappingScore =
    gateSuggestions.gates.length === 0
      ? 0
      : gateSuggestions.matchedCount / gateSuggestions.gates.length;
  const gradeScore =
    gradeSummary.units.length === 0
      ? 0
      : 1 - gradeSummary.distribution.Review / gradeSummary.units.length;

  return Math.round((roleScore / 4) * 25 + mappingScore * 45 + gradeScore * 30);
}

export function simulateSandbox(
  sample: SampleCatalogEntry,
  csvText: string,
  ers: ErsDocument
): SandboxSimulation {
  const parsed = parseCSV(csvText);
  const profile = profileLog(parsed);
  const gateSuggestions = suggestGates(ers, profile);
  const unitIdColumnIndex = findUnitIdColumn(profile);
  const gradeSummary = gradeRows(
    parsed.rows,
    gateSuggestions.gates,
    unitIdColumnIndex
  );

  const evidenceCompleteness =
    gateSuggestions.gates.length === 0
      ? 0
      : Math.round((gateSuggestions.matchedCount / gateSuggestions.gates.length) * 100);

  const roleCoverage = {
    unitId: profile.columns.some((c) => c.inferredRole === "UNIT_ID"),
    timestamp: profile.columns.some((c) => c.inferredRole === "TIMESTAMP"),
    equipment: profile.columns.some((c) => c.inferredRole === "EQUIPMENT"),
    operator: profile.columns.some((c) => c.inferredRole === "OPERATOR"),
    measurementCount: profile.columns.filter((c) => c.inferredRole === "MEASUREMENT").length,
  };

  const reviewFlags = collectReviewFlags(profile, gateSuggestions, gradeSummary);
  const readinessScore = computeReadiness(profile, gateSuggestions, gradeSummary);

  return {
    sample,
    profile,
    gateSuggestions,
    gradeSummary,
    unitIdColumnIndex,
    evidenceCompleteness,
    roleCoverage,
    reviewFlags,
    readinessScore,
    settlementPreview: {
      partnerFundingState:
        "Sandbox only: partner-powered funding state is represented, with no production custody.",
      custodyBoundary:
        "Physical and funds custody remain with your existing logistics and payment providers. Fairbuild issues settlement instructions only; it does not hold goods or funds in sandbox mode.",
      reviewWindow:
        "Verified work enters a 48-hour customer review window before settlement instructions proceed.",
      interventionPath:
        "If the customer initiates review, Fairbuild can intervene and offer arbitration or reinspection.",
      settlementInstruction:
        "Accepted Grade A/B units produce a settlement instruction preview; Review, Rework, and Reject units hold until resolved.",
    },
  };
}
