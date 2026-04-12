import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatLimit } from "@/lib/verification-engine";

const TYPE_LABELS: Record<string, string> = {
  NUMERIC_GTE: "Greater than or equal",
  NUMERIC_LTE: "Less than or equal",
  NUMERIC_RANGE: "Within range",
  NUMERIC_TOLERANCE: "Within tolerance",
  CATEGORICAL: "Categorical match",
  IMAGE_CLASS: "Image classification",
  WAVEFORM_MASK: "Waveform mask",
  COMPOSITE: "Composite",
  STATISTICAL: "Statistical",
  CUSTOM: "Custom",
};

const SOURCE_STYLES: Record<string, { bg: string; text: string }> = {
  MANUAL: { bg: "bg-gray-100", text: "text-gray-600" },
  AI_EXTRACTED: { bg: "bg-violet-50", text: "text-violet-700" },
  TEMPLATE: { bg: "bg-cyan-50", text: "text-cyan-700" },
};

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

  if (criteria.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center text-gray-500">
        No acceptance criteria defined for this contract yet.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 text-sm text-gray-500">
        {criteria.length} {criteria.length === 1 ? "criterion" : "criteria"} defined
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {criteria.map((c) => {
          const limitStr = formatLimit(
            c.criteriaType,
            c.lowerLimit,
            c.upperLimit,
            c.unit
          );
          const sourceStyle = SOURCE_STYLES[c.source] ?? SOURCE_STYLES.MANUAL;
          const typeLabel = TYPE_LABELS[c.criteriaType] ?? c.criteriaType;

          return (
            <div key={c.id} className="criterion-card">
              {/* Parameter name */}
              <div className="text-sm font-semibold text-[var(--foreground)] leading-snug">
                {c.parameterName}
              </div>

              {/* Limit display */}
              <div className="mt-2 font-mono text-lg font-semibold text-[var(--accent)]">
                {limitStr}
              </div>

              {/* Meta info */}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="role-badge bg-blue-50 text-blue-700">
                  {typeLabel}
                </span>
                <span className={`role-badge ${sourceStyle.bg} ${sourceStyle.text}`}>
                  {c.source === "AI_EXTRACTED" ? "AI Extracted" : c.source}
                </span>
              </div>

              {/* Source reference */}
              {c.sourceRef && (
                <div className="mt-3 text-xs text-gray-400">
                  Source: {c.sourceRef}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
