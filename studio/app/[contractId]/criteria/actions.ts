"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { processERSJson, processERSText } from "@/lib/ers-processor";
import { CriteriaType, CriteriaSource } from "@prisma/client";

/**
 * Upload and process an ERS file (JSON or text).
 * Returns the number of criteria extracted.
 */
export async function uploadERSAction(
  contractId: string,
  formData: FormData
): Promise<{ count: number; error?: string }> {
  const file = formData.get("ersFile") as File | null;
  if (!file || file.size === 0) {
    return { count: 0, error: "No file provided." };
  }

  const text = await file.text();
  const isJson =
    file.type === "application/json" || file.name.endsWith(".json");

  try {
    const parsed = isJson
      ? processERSJson(text)
      : await processERSText(text);

    if (parsed.length === 0) {
      return { count: 0, error: "No criteria found in this file." };
    }

    // Store each criterion — store mapsToColumn in conditionRules JSON
    // for use in Iteration 6 (column linking)
    for (const c of parsed) {
      await prisma.acceptanceCriterion.create({
        data: {
          contractId,
          parameterName: c.parameterName,
          criteriaType: c.criteriaType as CriteriaType,
          source: c.source as CriteriaSource,
          lowerLimit: c.lowerLimit,
          upperLimit: c.upperLimit,
          unit: c.unit,
          sourceRef: c.sourceRef,
          aiConfidence: c.aiConfidence,
          conditionRules: c.mapsToColumn
            ? { maps_to_column: c.mapsToColumn }
            : undefined,
        },
      });
    }

    revalidatePath(`/${contractId}/criteria`);
    return { count: parsed.length };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to process ERS file.";
    return { count: 0, error: message };
  }
}

/**
 * Create a single criterion manually.
 */
export async function createCriterionAction(
  contractId: string,
  formData: FormData
): Promise<{ error?: string }> {
  const parameterName = formData.get("parameterName") as string;
  const criteriaType = formData.get("criteriaType") as string;
  const lowerStr = formData.get("lowerLimit") as string;
  const upperStr = formData.get("upperLimit") as string;
  const unit = (formData.get("unit") as string) || null;
  const sourceRef = (formData.get("sourceRef") as string) || null;

  if (!parameterName?.trim()) {
    return { error: "Parameter name is required." };
  }

  if (!criteriaType) {
    return { error: "Criteria type is required." };
  }

  const lowerLimit = lowerStr ? parseFloat(lowerStr) : null;
  const upperLimit = upperStr ? parseFloat(upperStr) : null;

  // Validation based on type
  if (criteriaType === "NUMERIC_GTE" && lowerLimit === null) {
    return { error: "Lower limit is required for >= criteria." };
  }
  if (criteriaType === "NUMERIC_LTE" && upperLimit === null) {
    return { error: "Upper limit is required for <= criteria." };
  }
  if (
    criteriaType === "NUMERIC_RANGE" &&
    (lowerLimit === null || upperLimit === null)
  ) {
    return { error: "Both limits are required for range criteria." };
  }

  await prisma.acceptanceCriterion.create({
    data: {
      contractId,
      parameterName: parameterName.trim(),
      criteriaType: criteriaType as CriteriaType,
      source: "MANUAL",
      lowerLimit,
      upperLimit,
      unit,
      sourceRef,
    },
  });

  revalidatePath(`/${contractId}/criteria`);
  return {};
}

/**
 * Delete a single criterion.
 */
export async function deleteCriterionAction(
  criterionId: string,
  contractId: string
): Promise<void> {
  await prisma.acceptanceCriterion.delete({
    where: { id: criterionId },
  });

  revalidatePath(`/${contractId}/criteria`);
}
