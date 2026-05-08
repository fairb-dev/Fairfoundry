import { generateText, Output } from "ai";
import { google, GENERATION_MODEL_ID } from "./google-ai";
import { z } from "zod";

const ColumnAnalysis = z.object({
  columns: z.array(
    z.object({
      columnIndex: z.number(),
      columnName: z.string(),
      suggestedRole: z.enum([
        "UNIT_ID",
        "TIMESTAMP",
        "MEASUREMENT",
        "CONDITION",
        "EQUIPMENT",
        "OPERATOR",
        "METADATA",
        "IGNORE",
      ]),
      confidence: z.number(),
      reasoning: z.string(),
    })
  ),
});

export type ColumnAnalysisResult = z.infer<typeof ColumnAnalysis>;

/**
 * Analyzes CSV column headers and sample data to suggest roles for each column.
 * Uses Gemini to classify columns as measurements, identifiers, timestamps, etc.
 */
export async function analyzeColumns(
  headers: string[],
  sampleRows: string[][]
): Promise<ColumnAnalysisResult> {
  const sampleTable = [headers, ...sampleRows.slice(0, 5)]
    .map((row) => row.join(" | "))
    .join("\n");

  const result = await generateText({
    model: google(GENERATION_MODEL_ID),
    output: Output.object({ schema: ColumnAnalysis }),
    prompt: `You are an expert in manufacturing quality control data. Analyze these CSV columns from a factory production log and classify each column's role.

Column headers and first ${Math.min(sampleRows.length, 5)} rows of data:

${sampleTable}

For each column, determine the most likely role:
- UNIT_ID: Unique identifier for each produced unit (serial number, batch ID, etc.)
- TIMESTAMP: Date, time, or datetime values
- MEASUREMENT: Numeric test/measurement values (voltage, weight, dimension, etc.)
- CONDITION: Environmental or process conditions (temperature, humidity, pressure settings)
- EQUIPMENT: Machine or equipment identifiers
- OPERATOR: Worker or operator identifiers
- METADATA: General metadata that doesn't fit other categories
- IGNORE: Columns that should be ignored (row numbers, empty columns, internal IDs)

Classify every column. Be precise with confidence scores (0.0 to 1.0).`,
  });

  if (!result.output) {
    throw new Error("AI analysis did not return a valid result.");
  }

  return result.output;
}
