"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

/**
 * Update the contract status from DRAFT to SANDBOX.
 * Only allowed when the contract has links and has been verified.
 */
export async function updateContractStatusAction(
  contractId: string,
  newStatus: string
): Promise<{ error?: string }> {
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
  });

  if (!contract) {
    return { error: "Contract not found." };
  }

  // Validate state transitions
  const validTransitions: Record<string, string[]> = {
    DRAFT: ["SANDBOX"],
    SANDBOX: ["PRODUCTION", "DRAFT"],
    PRODUCTION: ["PAUSED", "CLOSED"],
    PAUSED: ["PRODUCTION", "CLOSED"],
    REVIEW: ["SANDBOX", "DRAFT"],
  };

  const allowed = validTransitions[contract.status] ?? [];
  if (!allowed.includes(newStatus)) {
    return {
      error: `Cannot transition from ${contract.status} to ${newStatus}.`,
    };
  }

  // For DRAFT -> SANDBOX, verify prerequisites
  if (contract.status === "DRAFT" && newStatus === "SANDBOX") {
    const linkCount = await prisma.columnCriteriaLink.count({
      where: { contractId },
    });
    if (linkCount === 0) {
      return { error: "Link columns to criteria before transitioning to Sandbox." };
    }
  }

  await prisma.contract.update({
    where: { id: contractId },
    data: { status: newStatus },
  });

  revalidatePath(`/${contractId}`);
  revalidatePath("/");
  return {};
}
