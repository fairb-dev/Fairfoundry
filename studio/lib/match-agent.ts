import { generateText, Output } from "ai";
import { google, GENERATION_MODEL_ID } from "./google-ai";
import { z } from "zod";

/**
 * Match Agent
 *
 * Two-strategy system for linking CSV data columns to acceptance criteria:
 *
 * Strategy A — Deterministic: criteria with conditionRules.maps_to_column
 * that exactly match a LogColumn.originalName get linked automatically.
 *
 * Strategy B — AI Semantic: unmatched columns and criteria are sent to
 * Gemini for semantic matching based on names and sample values.
 */

// ── Types ──

export interface ColumnInfo {
  id: string;
  originalName: string;
  columnIndex: number;
  role: string;
  sampleValues: string[];
}

export interface CriterionInfo {
  id: string;
  parameterName: string;
  criteriaType: string;
  lowerLimit: number | null;
  upperLimit: number | null;
  unit: string | null;
  sourceRef: string | null;
  mapsToColumn: string | null; // from conditionRules JSON
}

export interface MatchResult {
  columnId: string;
  columnName: string;
  criterionId: string;
  criterionName: string;
  aiSuggested: boolean;
  confidence: number;
  reasoning: string;
}

export interface MatchSummary {
  matches: MatchResult[];
  exactCount: number;
  aiCount: number;
}

// ── AI response schema ──

const AIMatchSchema = z.object({
  matches: z.array(
    z.object({
      columnName: z.string(),
      criterionParameterName: z.string(),
      confidence: z.number(),
      reasoning: z.string(),
    })
  ),
});

// ── Strategy A: Deterministic maps_to_column matching ──

function findExactMatches(
  columns: ColumnInfo[],
  criteria: CriterionInfo[]
): MatchResult[] {
  const matches: MatchResult[] = [];
  const columnByName = new Map(columns.map((c) => [c.originalName, c]));

  for (const criterion of criteria) {
    if (!criterion.mapsToColumn) continue;
    const column = columnByName.get(criterion.mapsToColumn);
    if (!column) continue;

    matches.push({
      columnId: column.id,
      columnName: column.originalName,
      criterionId: criterion.id,
      criterionName: criterion.parameterName,
      aiSuggested: false,
      confidence: 1.0,
      reasoning: `Exact match: maps_to_column "${criterion.mapsToColumn}"`,
    });
  }

  return matches;
}

// ── Strategy B: AI semantic matching ──

async function findAIMatches(
  unmatchedColumns: ColumnInfo[],
  unmatchedCriteria: CriterionInfo[]
): Promise<MatchResult[]> {
  if (unmatchedColumns.length === 0 || unmatchedCriteria.length === 0) {
    return [];
  }

  const columnDescriptions = unmatchedColumns
    .map((c) => {
      const samples = c.sampleValues.slice(0, 3).join(", ");
      return `- "${c.originalName}" (role: ${c.role}, samples: ${samples})`;
    })
    .join("\n");

  const criteriaDescriptions = unmatchedCriteria
    .map((c) => {
      const limit =
        c.criteriaType === "NUMERIC_GTE"
          ? `>= ${c.lowerLimit}`
          : c.criteriaType === "NUMERIC_LTE"
            ? `<= ${c.upperLimit}`
            : c.criteriaType === "NUMERIC_RANGE"
              ? `${c.lowerLimit} to ${c.upperLimit}`
              : "custom";
      return `- "${c.parameterName}" (${limit} ${c.unit ?? ""})`;
    })
    .join("\n");

  const result = await generateText({
    model: google(GENERATION_MODEL_ID),
    output: Output.object({ schema: AIMatchSchema }),
    prompt: `You are an expert in manufacturing quality data analysis.

Your task is to match CSV data columns to acceptance criteria from an engineering specification.

A match means the column contains the measurement data that should be checked against the criterion's limits.

## Unmatched Columns (from CSV data file):
${columnDescriptions}

## Unmatched Criteria (from engineering specification):
${criteriaDescriptions}

## Instructions:
- Match each column to the criterion it most likely measures
- Only include matches you are confident about (confidence >= 0.6)
- A column should match at most one criterion
- A criterion should match at most one column
- Consider column names, sample values, units, and parameter names
- If no good match exists, do not force one

Return your matches.`,
  });

  if (!result.output) {
    return [];
  }

  const matches: MatchResult[] = [];
  const columnByName = new Map(unmatchedColumns.map((c) => [c.originalName, c]));
  const criterionByName = new Map(
    unmatchedCriteria.map((c) => [c.parameterName, c])
  );

  for (const m of result.output.matches) {
    const column = columnByName.get(m.columnName);
    const criterion = criterionByName.get(m.criterionParameterName);
    if (!column || !criterion) continue;
    if (m.confidence < 0.6) continue;

    matches.push({
      columnId: column.id,
      columnName: column.originalName,
      criterionId: criterion.id,
      criterionName: criterion.parameterName,
      aiSuggested: true,
      confidence: m.confidence,
      reasoning: m.reasoning,
    });
  }

  return matches;
}

// ── Main entry point ──

export async function runMatchAgent(
  columns: ColumnInfo[],
  criteria: CriterionInfo[]
): Promise<MatchSummary> {
  // Strategy A: exact matches via maps_to_column
  const exactMatches = findExactMatches(columns, criteria);

  // Collect IDs that are already matched
  const matchedColumnIds = new Set(exactMatches.map((m) => m.columnId));
  const matchedCriterionIds = new Set(exactMatches.map((m) => m.criterionId));

  // Filter to unmatched items for Strategy B
  const unmatchedColumns = columns.filter(
    (c) => !matchedColumnIds.has(c.id) && c.role === "MEASUREMENT"
  );
  const unmatchedCriteria = criteria.filter(
    (c) => !matchedCriterionIds.has(c.id)
  );

  // Strategy B: AI semantic matching
  const aiMatches = await findAIMatches(unmatchedColumns, unmatchedCriteria);

  return {
    matches: [...exactMatches, ...aiMatches],
    exactCount: exactMatches.length,
    aiCount: aiMatches.length,
  };
}
