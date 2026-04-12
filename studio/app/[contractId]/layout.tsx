import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TabNav } from "./tab-nav";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-gray-100 text-gray-700",
  REVIEW: "bg-yellow-100 text-yellow-800",
  SANDBOX: "bg-blue-100 text-blue-800",
  PRODUCTION: "bg-green-100 text-green-800",
  PAUSED: "bg-orange-100 text-orange-800",
  CLOSED: "bg-red-100 text-red-700",
};

export default async function ContractLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ contractId: string }>;
}) {
  const { contractId } = await params;

  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    include: {
      parties: {
        include: { company: true },
      },
    },
  });

  if (!contract) {
    notFound();
  }

  const oem = contract.parties.find((p) => p.role === "OEM");
  const factory = contract.parties.find((p) => p.role === "FACTORY");
  const statusClass =
    STATUS_COLORS[contract.status] ?? "bg-gray-100 text-gray-700";

  return (
    <main className="mx-auto max-w-6xl px-8 py-12">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 no-underline hover:text-[var(--foreground)] mb-6"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="shrink-0"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        All Contracts
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">
              {contract.title}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 text-sm text-gray-500">
              {oem && (
                <span className="font-medium text-gray-700">
                  {oem.company.name}
                </span>
              )}
              {oem && factory && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  className="text-gray-400"
                >
                  <path
                    d="M6 4L10 8L6 12"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {factory && (
                <span className="font-medium text-gray-700">
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
      </header>

      {/* Tab Navigation */}
      <TabNav contractId={contractId} />

      {/* Tab Content */}
      <div className="pt-8">{children}</div>
    </main>
  );
}
