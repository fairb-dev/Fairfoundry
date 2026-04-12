"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  runMatchAgent,
  type ColumnInfo,
  type CriterionInfo,
  type MatchSummary,
} from "@/lib/match-agent";

/**
 * Runs the match agent (deterministic + AI) and creates ColumnCriteriaLink records.
 * Returns a summary of what was matched.
 */
export async function triggerAutoMatchAction(
  contractId: string
): Promise<{ summary: MatchSummary | null; error?: string }> {
  try {
    // Get log mappings for this contract to find columns
    const logMappings = await prisma.logMapping.findMany({
      where: { contractId },
    });

    if (logMappings.length === 0) {
      return { summary: null, error: "No data columns found. Upload a CSV first." };
    }

    // Fetch LogFormats with columns for each mapping
    const logFormatIds = logMappings.map((m) => m.logFormatId);
    const logFormats = await prisma.logFormat.findMany({
      where: { id: { in: logFormatIds } },
      include: { columns: true },
    });

    // Get criteria for this contract
    const criteria = await prisma.acceptanceCriterion.findMany({
      where: { contractId },
    });

    if (criteria.length === 0) {
      return { summary: null, error: "No acceptance criteria found. Upload an ERS first." };
    }

    // Get existing links to avoid duplicates
    const existingLinks = await prisma.columnCriteriaLink.findMany({
      where: { contractId },
    });
    const existingPairs = new Set(
      existingLinks.map((l) => `${l.columnId}:${l.criterionId}`)
    );

    // Build column info with sample values from logFormat.sampleData
    const columns: ColumnInfo[] = [];
    for (const logFormat of logFormats) {
      const sampleData = logFormat.sampleData as Record<string, string>[] | null;
      for (const col of logFormat.columns) {
        const sampleValues: string[] = [];
        if (Array.isArray(sampleData)) {
          for (const row of sampleData.slice(0, 3)) {
            const val = row[col.originalName];
            if (val !== undefined && val !== null) {
              sampleValues.push(String(val));
            }
          }
        }
        columns.push({
          id: col.id,
          originalName: col.originalName,
          columnIndex: col.columnIndex,
          role: col.role,
          sampleValues,
        });
      }
    }

    // Build criterion info, extracting maps_to_column from conditionRules
    const criteriaInfo: CriterionInfo[] = criteria.map((c) => {
      const rules = c.conditionRules as Record<string, unknown> | null;
      const mapsToColumn =
        rules && typeof rules.maps_to_column === "string"
          ? rules.maps_to_column
          : null;

      return {
        id: c.id,
        parameterName: c.parameterName,
        criteriaType: c.criteriaType,
        lowerLimit: c.lowerLimit,
        upperLimit: c.upperLimit,
        unit: c.unit,
        sourceRef: c.sourceRef,
        mapsToColumn,
      };
    });

    // Run the match agent
    const summary = await runMatchAgent(columns, criteriaInfo);

    // Create links for new matches only
    let created = 0;
    for (const match of summary.matches) {
      const pairKey = `${match.columnId}:${match.criterionId}`;
      if (existingPairs.has(pairKey)) continue;

      await prisma.columnCriteriaLink.create({
        data: {
          columnId: match.columnId,
          criterionId: match.criterionId,
          contractId,
          aiSuggested: match.aiSuggested,
          aiConfidence: match.confidence,
        },
      });
      created++;
    }

    revalidatePath(`/${contractId}/links`);
    return { summary };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to run match agent.";
    return { summary: null, error: message };
  }
}

/**
 * Manually link a column to a criterion.
 */
export async function createManualLinkAction(
  contractId: string,
  columnId: string,
  criterionId: string
): Promise<{ error?: string }> {
  if (!columnId || !criterionId) {
    return { error: "Both column and criterion are required." };
  }

  // Check for existing link
  const existing = await prisma.columnCriteriaLink.findUnique({
    where: {
      columnId_criterionId: { columnId, criterionId },
    },
  });

  if (existing) {
    return { error: "This link already exists." };
  }

  await prisma.columnCriteriaLink.create({
    data: {
      columnId,
      criterionId,
      contractId,
      aiSuggested: false,
      aiConfidence: null,
      confirmedBy: "studio-user",
      confirmedAt: new Date(),
    },
  });

  revalidatePath(`/${contractId}/links`);
  return {};
}

/**
 * Delete a link.
 */
export async function deleteLinkAction(
  linkId: string,
  contractId: string
): Promise<void> {
  await prisma.columnCriteriaLink.delete({
    where: { id: linkId },
  });

  revalidatePath(`/${contractId}/links`);
}
