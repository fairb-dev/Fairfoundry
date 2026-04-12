import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

const STATUS_DESCRIPTIONS: Record<string, string> = {
  DRAFT: "This contract is being drafted. Criteria and data mappings are not yet finalized.",
  REVIEW: "Both parties are reviewing the contract terms and verification setup.",
  SANDBOX: "The contract is in sandbox mode. Both parties can test data submissions and verify results.",
  PRODUCTION: "Live production mode. Data submissions are verified and settlements are processed automatically.",
  PAUSED: "This contract has been temporarily paused.",
  CLOSED: "This contract has been closed and is no longer accepting submissions.",
};

export default async function ContractOverview({
  params,
}: {
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;

  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      parties: {
        include: { company: true },
      },
      criteria: true,
      logMappings: {
        include: {
          contract: true,
        },
      },
    },
  });

  if (!contract) {
    notFound();
  }

  // Count linked columns
  const linkCount = await prisma.columnCriteriaLink.count({
    where: { contractId },
  });

  // Get log format columns count
  const logMapping = await prisma.logMapping.findFirst({
    where: { contractId },
  });

  let columnCount = 0;
  if (logMapping) {
    columnCount = await prisma.logColumn.count({
      where: { logFormatId: logMapping.logFormatId },
    });
  }

  const oem = contract.parties.find((p) => p.role === "OEM");
  const factory = contract.parties.find((p) => p.role === "FACTORY");

  return (
    <div>
      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="stat-card">
          <div className="stat-value">{contract.criteria.length}</div>
          <div className="stat-label">Acceptance Criteria</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{columnCount}</div>
          <div className="stat-label">Data Columns</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{linkCount}</div>
          <div className="stat-label">Linked Pairs</div>
        </div>
        <div className="stat-card">
          <div className="stat-value text-[var(--accent)]">
            {contract.status === "SANDBOX" ? (
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                className="inline"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M8 12L11 15L16 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              contract.status
            )}
          </div>
          <div className="stat-label">Contract Status</div>
        </div>
      </div>

      {/* Status Description */}
      <div className="mt-6 rounded-xl bg-[var(--muted)] border border-[var(--border)] p-5">
        <p className="text-sm text-gray-600 leading-relaxed">
          {STATUS_DESCRIPTIONS[contract.status] ?? ""}
        </p>
      </div>

      {/* Parties */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {oem && (
          <div className="rounded-xl border border-[var(--border)] p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              OEM
            </div>
            <div className="text-lg font-semibold text-[var(--foreground)]">
              {oem.company.name}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Defines acceptance criteria and reviews submissions
            </div>
          </div>
        )}
        {factory && (
          <div className="rounded-xl border border-[var(--border)] p-5">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Factory
            </div>
            <div className="text-lg font-semibold text-[var(--foreground)]">
              {factory.company.name}
            </div>
            <div className="mt-1 text-sm text-gray-500">
              Submits production test data for verification
            </div>
          </div>
        )}
      </div>

      {/* Quick Action */}
      <div className="mt-8">
        <Link
          href={`/${contractId}/verification`}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white no-underline shadow-sm transition-all hover:opacity-90"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M13.333 4L6 11.333L2.667 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Run Verification
        </Link>
      </div>
    </div>
  );
}
