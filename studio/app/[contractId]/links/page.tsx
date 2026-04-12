import { prisma } from "@/lib/prisma";
import { formatLimit } from "@/lib/verification-engine";

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

  if (links.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center text-gray-500">
        No column-criteria links defined yet.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5 text-sm text-gray-500">
        {links.length} {links.length === 1 ? "link" : "links"} between data columns and acceptance criteria
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
            <div key={link.id} className="link-card">
              {/* Column side */}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Data Column
                </div>
                <div className="font-mono text-sm font-semibold text-[var(--foreground)]">
                  {link.column.originalName}
                </div>
                <div className="mt-0.5 text-xs text-gray-400">
                  Index {link.column.columnIndex} &middot;{" "}
                  <span className="role-badge bg-blue-50 text-blue-700">
                    {link.column.role}
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div className="flex flex-col items-center gap-0.5 px-2">
                <svg
                  width="32"
                  height="16"
                  viewBox="0 0 32 16"
                  fill="none"
                  className="text-[var(--accent)]"
                >
                  <path
                    d="M0 8H28M28 8L22 2M28 8L22 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {link.aiSuggested && (
                  <span className="role-badge bg-violet-50 text-violet-700">
                    AI matched
                  </span>
                )}
              </div>

              {/* Criterion side */}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                  Acceptance Criterion
                </div>
                <div className="text-sm font-semibold text-[var(--foreground)]">
                  {link.criterion.parameterName}
                </div>
                <div className="mt-0.5 font-mono text-xs text-[var(--accent)]">
                  {limitStr}
                </div>
                {link.criterion.sourceRef && (
                  <div className="mt-0.5 text-xs text-gray-400">
                    {link.criterion.sourceRef}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
