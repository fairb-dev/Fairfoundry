import { prisma } from "@/lib/prisma";
import { formatLimit } from "@/lib/verification-engine";
import { CriteriaEmpty } from "./criteria-empty";
import { CriterionCard } from "./criteria-card";
import { ManualCriterionForm } from "./manual-form";

export default async function CriteriaPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;

  const criteria = await prisma.acceptanceCriterion.findMany({
    where: { contractId },
    orderBy: { createdAt: "asc" },
  });

  // ── No criteria yet: show upload / manual entry ──
  if (criteria.length === 0) {
    return <CriteriaEmpty contractId={contractId} />;
  }

  // ── Criteria exist: show cards + add form ──
  return (
    <div>
      <div className="mb-5 text-sm text-gray-500">
        {criteria.length} {criteria.length === 1 ? "criterion" : "criteria"}{" "}
        defined
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {criteria.map((c) => {
          const limitStr = formatLimit(
            c.criteriaType,
            c.lowerLimit,
            c.upperLimit,
            c.unit
          );

          return (
            <CriterionCard
              key={c.id}
              id={c.id}
              contractId={contractId}
              parameterName={c.parameterName}
              limitStr={limitStr}
              source={c.source}
              sourceRef={c.sourceRef}
              aiConfidence={c.aiConfidence}
            />
          );
        })}
      </div>

      {/* Manual add form below the grid */}
      <div className="mt-8">
        <ManualCriterionForm contractId={contractId} />
      </div>
    </div>
  );
}
