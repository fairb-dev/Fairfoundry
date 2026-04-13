import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Contracts",
  description:
    "Upload production data, define quality standards, and verify results with Fairbuild Contract Builder Studio.",
  openGraph: {
    title: "Fairbuild Contract Builder Studio",
    description:
      "Upload production data, define quality standards, verify results.",
    type: "website",
  },
};

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  REVIEW: "bg-yellow-100 text-yellow-800",
  SANDBOX: "bg-blue-100 text-blue-800",
  PRODUCTION: "bg-green-100 text-green-800",
  PAUSED: "bg-orange-100 text-orange-800",
  CLOSED: "bg-red-100 text-red-700",
};

export default async function Home() {
  const contracts = await prisma.contract.findMany({
    include: {
      parties: {
        include: {
          company: true,
        },
      },
      criteria: true,
      submissions: {
        orderBy: { submittedAt: "desc" },
        take: 1,
        select: {
          unitsTotal: true,
          unitsPassed: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen flex flex-col">
    <main id="main-content" className="mx-auto max-w-4xl px-6 py-16 flex-1 w-full">
      <header className="mb-12 hero-area">
        <Link
          href="/"
          className="inline-block mb-4 text-lg font-bold tracking-tight text-[var(--foreground)] no-underline hover:opacity-80"
        >
          Fairbuild
        </Link>
        <p className="mb-2 text-sm font-semibold tracking-wider uppercase text-[var(--accent)]">
          Contract Builder Studio
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
              Contracts
            </h1>
            <p className="mt-2 text-base text-gray-500">
              Upload production data, define quality standards, verify results.
            </p>
          </div>
          <Link
            href="/new"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-white no-underline shadow-sm transition-all hover:opacity-90 shrink-0"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 3v10M3 8h10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            New Contract
          </Link>
        </div>
      </header>

      {contracts.length === 0 ? (
        <div className="empty-state">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            className="empty-state-icon"
          >
            <path
              d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M12 11v6M9 14h6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <div className="empty-state-title">No Contracts Yet</div>
          <div className="empty-state-description">
            Create your first quality verification contract to get started.
          </div>
        </div>
      ) : (
        <div className="grid gap-5">
          {contracts.map((contract) => {
            const oem = contract.parties.find((p) => p.role === "OEM");
            const factory = contract.parties.find(
              (p) => p.role === "FACTORY"
            );
            const statusClass =
              STATUS_COLORS[contract.status] ?? "bg-gray-100 text-gray-700";

            const latestSubmission = contract.submissions[0];
            const passRate =
              latestSubmission && latestSubmission.unitsTotal > 0
                ? Math.round(
                    (latestSubmission.unitsPassed /
                      latestSubmission.unitsTotal) *
                      100
                  )
                : null;
            const passRateColor =
              passRate !== null
                ? passRate >= 95
                  ? "var(--pass)"
                  : passRate >= 80
                    ? "#ca8a04"
                    : "var(--fail)"
                : undefined;

            return (
              <Link
                key={contract.id}
                href={`/${contract.id}`}
                className="block rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm transition-shadow hover:shadow-md no-underline"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h2 className="text-lg font-semibold text-[var(--foreground)]">
                      {contract.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
                      {oem && (
                        <span>
                          <span className="font-medium text-gray-700">OEM:</span>{" "}
                          {oem.company.name}
                        </span>
                      )}
                      {factory && (
                        <span>
                          <span className="font-medium text-gray-700">
                            Factory:
                          </span>{" "}
                          {factory.company.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {passRate !== null && (
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold font-mono"
                        style={{
                          color: passRateColor,
                          backgroundColor:
                            passRate >= 95
                              ? "var(--pass-bg)"
                              : passRate >= 80
                                ? "#fef3c7"
                                : "var(--fail-bg)",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 14 14"
                          aria-hidden="true"
                        >
                          <circle
                            cx="7"
                            cy="7"
                            r="5"
                            fill="none"
                            stroke="#e5e7eb"
                            strokeWidth="2"
                          />
                          <circle
                            cx="7"
                            cy="7"
                            r="5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray={`${(passRate / 100) * 31.42} 31.42`}
                            strokeLinecap="round"
                            style={{
                              transform: "rotate(-90deg)",
                              transformOrigin: "center",
                            }}
                          />
                        </svg>
                        {passRate}%
                      </span>
                    )}
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                    >
                      {contract.status}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-4 border-t border-[var(--border)] pt-4 text-sm text-gray-500">
                  <span>
                    {contract.criteria.length}{" "}
                    {contract.criteria.length === 1
                      ? "criterion"
                      : "criteria"}
                  </span>
                  <span>
                    Created{" "}
                    {contract.createdAt.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
    <footer className="studio-footer">
      &copy; 2026 Fairbuild. All rights reserved.
    </footer>
    </div>
  );
}
