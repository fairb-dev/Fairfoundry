import { prisma } from "@/lib/prisma";
import { formatLimit } from "@/lib/verification-engine";
import { LinkCard } from "./link-card";
import { MatchButton } from "./match-button";
import { ManualLinkForm } from "./manual-link-form";

export default async function LinksPage({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;

  const links = await prisma.columnCriteriaLink.findMany({
    where: { contractId },
    include: {
      column: {
        include: {
          logFormat: true,
        },
      },
      criterion: true,
    },
    orderBy: { createdAt: "asc" },
  });

  // Check if we have the prerequisites for matching
  const logMappings = await prisma.logMapping.findMany({
    where: { contractId },
  });
  const criteriaCount = await prisma.acceptanceCriterion.count({
    where: { contractId },
  });
  const hasColumns = logMappings.length > 0;
  const hasCriteria = criteriaCount > 0;

  // Get measurement columns and unlinked criteria for the manual link form
  const linkedCriterionIds = new Set(links.map((l) => l.criterionId));

  // Fetch measurement columns from all log formats for this contract
  const logFormatIds = logMappings.map((m) => m.logFormatId);
  const logFormats = logFormatIds.length > 0
    ? await prisma.logFormat.findMany({
        where: { id: { in: logFormatIds } },
        include: {
          columns: {
            where: { role: "MEASUREMENT" },
            orderBy: { columnIndex: "asc" },
          },
        },
      })
    : [];
  const measurementColumns = logFormats.flatMap((lf) =>
    lf.columns.map((c) => ({
      id: c.id,
      originalName: c.originalName,
      columnIndex: c.columnIndex,
    }))
  );

  // Fetch unlinked criteria
  const allCriteria = await prisma.acceptanceCriterion.findMany({
    where: { contractId },
    orderBy: { createdAt: "asc" },
  });
  const unlinkedCriteria = allCriteria
    .filter((c) => !linkedCriterionIds.has(c.id))
    .map((c) => ({
      id: c.id,
      parameterName: c.parameterName,
      limitStr: formatLimit(c.criteriaType, c.lowerLimit, c.upperLimit, c.unit),
    }));

  // ── No links: show match button or prerequisites message ──
  if (links.length === 0) {
    if (!hasColumns || !hasCriteria) {
      return (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-auto mb-4 text-gray-300"
          >
            <path
              d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-gray-500">
            No column-criteria links yet.
          </p>
          <p className="mt-2 text-sm text-gray-400">
            {!hasColumns && !hasCriteria
              ? "Upload data columns and acceptance criteria first."
              : !hasColumns
                ? "Upload a CSV data file first."
                : "Define acceptance criteria first."}
          </p>
        </div>
      );
    }

    return (
      <div>
        <MatchButton contractId={contractId} />

        {/* Manual link form */}
        {measurementColumns.length > 0 && unlinkedCriteria.length > 0 && (
          <ManualLinkForm
            contractId={contractId}
            columns={measurementColumns}
            criteria={unlinkedCriteria}
          />
        )}
      </div>
    );
  }

  // ── Links exist: show cards + actions ──
  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {links.length} {links.length === 1 ? "link" : "links"} between data
          columns and acceptance criteria
        </div>
        {hasColumns && hasCriteria && (
          <MatchButton contractId={contractId} compact />
        )}
      </div>

      <div className="grid gap-3">
        {links.map((link) => {
          const limitStr = formatLimit(
            link.criterion.criteriaType,
            link.criterion.lowerLimit,
            link.criterion.upperLimit,
            link.criterion.unit
          );

          return (
            <LinkCard
              key={link.id}
              id={link.id}
              contractId={contractId}
              columnName={link.column.originalName}
              columnIndex={link.column.columnIndex}
              columnRole={link.column.role}
              parameterName={link.criterion.parameterName}
              limitStr={limitStr}
              sourceRef={link.criterion.sourceRef}
              aiSuggested={link.aiSuggested}
              aiConfidence={link.aiConfidence}
            />
          );
        })}
      </div>

      {/* Manual link form — show if there are unlinked criteria */}
      {measurementColumns.length > 0 && unlinkedCriteria.length > 0 && (
        <ManualLinkForm
          contractId={contractId}
          columns={measurementColumns}
          criteria={unlinkedCriteria}
        />
      )}
    </div>
  );
}
