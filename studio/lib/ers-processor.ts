import { generateText, Output } from "ai";
import { google, GENERATION_MODEL_ID } from "./google-ai";
import { z } from "zod";

/**
 * Schema for a single extracted criterion from an ERS document.
 */
const ExtractedCriterion = z.object({
  parameter: z.string(),
  type: z.enum([
    "NUMERIC_GTE",
    "NUMERIC_LTE",
    "NUMERIC_RANGE",
    "NUMERIC_TOLERANCE",
  ]),
  lower_limit: z.number().nullable(),
  upper_limit: z.number().nullable(),
  unit: z.string().nullable(),
  section_ref: z.string().nullable(),
  maps_to_column: z.string().nullable(),
  confidence: z.number(),
});

const ExtractedCriteriaResult = z.object({
  criteria: z.array(ExtractedCriterion),
});

export type ExtractedCriterionData = z.infer<typeof ExtractedCriterion>;

/**
 * Parsed criterion ready for database insertion.
 */
export interface ParsedCriterion {
  parameterName: string;
  criteriaType: string;
  source: "AI_EXTRACTED" | "TEMPLATE";
  lowerLimit: number | null;
  upperLimit: number | null;
  unit: string | null;
  sourceRef: string | null;
  mapsToColumn: string | null;
  aiConfidence: number | null;
}

/**
 * Process a structured ERS JSON file.
 * Extracts the acceptance_criteria array directly.
 */
export function processERSJson(jsonContent: string): ParsedCriterion[] {
  const doc = JSON.parse(jsonContent);
  const criteria = doc.acceptance_criteria;

  if (!Array.isArray(criteria) || criteria.length === 0) {
    throw new Error("No acceptance_criteria array found in JSON.");
  }

  return criteria.map((c: Record<string, unknown>) => ({
    parameterName: String(c.parameter ?? c.parameter_name ?? ""),
    criteriaType: String(c.type ?? "NUMERIC_GTE"),
    source: "AI_EXTRACTED" as const,
    lowerLimit: typeof c.lower_limit === "number" ? c.lower_limit : null,
    upperLimit: typeof c.upper_limit === "number" ? c.upper_limit : null,
    unit: typeof c.unit === "string" ? c.unit : null,
    sourceRef: typeof c.section_ref === "string" ? c.section_ref : null,
    mapsToColumn: typeof c.maps_to_column === "string" ? c.maps_to_column : null,
    aiConfidence: null, // Structured JSON, no AI uncertainty
  }));
}

/**
 * Process a plain-text ERS document using Gemini to extract criteria.
 */
export async function processERSText(
  textContent: string
): Promise<ParsedCriterion[]> {
  const result = await generateText({
    model: google(GENERATION_MODEL_ID),
    output: Output.object({ schema: ExtractedCriteriaResult }),
    prompt: `You are an expert in manufacturing quality specifications and engineering requirements.

Analyze the following Engineering Requirements Specification (ERS) document and extract ALL acceptance criteria into structured data.

For each criterion:
- parameter: the name of the measured parameter (e.g. "MTF at Nyquist/2, center field")
- type: one of NUMERIC_GTE (>= lower limit), NUMERIC_LTE (<= upper limit), NUMERIC_RANGE (between limits), NUMERIC_TOLERANCE (nominal +/- tolerance)
- lower_limit: the minimum acceptable value (null if not applicable)
- upper_limit: the maximum acceptable value (null if not applicable)
- unit: the measurement unit (e.g. "cy/px", "%", "mm", "arcmin")
- section_ref: the section reference in the document (e.g. "Section 3.2.1")
- maps_to_column: a suggested column name for data mapping (snake_case, e.g. "mtf_nyq2_center")
- confidence: your confidence in this extraction (0.0 to 1.0)

Be thorough — extract every quantitative criterion you can find.

ERS Document:
${textContent}`,
  });

  if (!result.output) {
    throw new Error("AI extraction did not return valid criteria.");
  }

  return result.output.criteria.map((c) => ({
    parameterName: c.parameter,
    criteriaType: c.type,
    source: "AI_EXTRACTED" as const,
    lowerLimit: c.lower_limit,
    upperLimit: c.upper_limit,
    unit: c.unit,
    sourceRef: c.section_ref,
    mapsToColumn: c.maps_to_column,
    aiConfidence: c.confidence,
  }));
}
