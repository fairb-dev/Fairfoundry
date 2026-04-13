import { prisma } from "@/lib/prisma";
import { CriteriaEmpty } from "./criteria-empty";
import { CriteriaGrid } from "./criteria-grid";
import { ManualCriterionForm } from "./manual-form";

export default async function CriteriaPage({
  params,
  searchParams,
}: {
  params: Promise<{ contractId: string }>;
  searchParams: Promise<{ sort?: string }>;
}) {
  const { contractId } = await params;
  const { sort } = await searchParams;

  const orderBy =
    sort === "name"
      ? { parameterName: "asc" as const }
      : { createdAt: "asc" as const };

  const criteria = await prisma.acceptanceCriterion.findMany({
    where: { contractId },
    orderBy,
  });

  // ── No criteria yet: show upload / manual entry ──
  if (criteria.length === 0) {
    return <CriteriaEmpty contractId={contractId} />;
  }

  // Extract mapsToColumn from conditionRules JSON
  const criteriaWithMapping = criteria.map((c) => {
    let mapsToColumn: string | null = null;
    if (c.conditionRules && typeof c.conditionRules === "object") {
      const rules = c.conditionRules as Record<string, unknown>;
      if (typeof rules.maps_to_column === "string") {
        mapsToColumn = rules.maps_to_column;
      }
    }
    return { ...c, mapsToColumn };
  });

  // ── Criteria exist: show cards + add form ──
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {criteria.length} {criteria.length === 1 ? "criterion" : "criteria"}{" "}
          defined
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>Sort:</span>
          <a
            href={`/${contractId}/criteria`}
            className={`px-2 py-1 rounded-md no-underline transition-colors ${
              sort !== "name"
                ? "bg-gray-100 text-gray-700 font-medium"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Date added
          </a>
          <a
            href={`/${contractId}/criteria?sort=name`}
            className={`px-2 py-1 rounded-md no-underline transition-colors ${
              sort === "name"
                ? "bg-gray-100 text-gray-700 font-medium"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Name
          </a>
        </div>
      </div>

      <CriteriaGrid contractId={contractId} criteria={criteriaWithMapping} />

      {/* Manual add form below the grid */}
      <div className="mt-8">
        <ManualCriterionForm contractId={contractId} />
      </div>
    </div>
  );
}
