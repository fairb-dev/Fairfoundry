import Link from "next/link";
import { prisma } from "@/lib/prisma";

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
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <p className="mb-2 text-sm font-semibold tracking-wider uppercase text-[var(--accent)]">
          Fairbuild Studio
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
              Contracts
            </h1>
            <p className="mt-3 text-lg text-gray-500">
              Quality verification contracts between OEMs and factories.
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
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-12 text-center text-gray-500">
          No contracts yet. Create one to get started.
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
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}
                  >
                    {contract.status}
                  </span>
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
  );
}
