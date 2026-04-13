import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { TabNav } from "./tab-nav";
import { KeyboardShortcuts } from "./keyboard-shortcuts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ contractId: string }>;
}): Promise<Metadata> {
  const { contractId } = await params;
  const contract = await prisma.contract.findUnique({
    where: { id: contractId },
    select: { title: true },
  });
  return {
    title: contract?.title ?? "Contract",
    description: contract
      ? `Quality verification contract: ${contract.title}`
      : "Contract details",
  };
}

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
    <div className="min-h-screen flex flex-col">
    <main id="main-content" className="mx-auto max-w-6xl px-8 py-12 flex-1 w-full">
      {/* Top bar: Logo + Breadcrumb */}
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/"
          className="text-base font-bold tracking-tight text-[var(--foreground)] no-underline hover:opacity-80 shrink-0"
        >
          Fairbuild
        </Link>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300 shrink-0">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <Link
          href="/"
          className="text-sm text-gray-400 no-underline hover:text-[var(--foreground)]"
        >
          Contracts
        </Link>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300 shrink-0">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-sm text-gray-600 truncate">{contract.title}</span>
      </div>

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

      {/* Keyboard Shortcuts (global listener) */}
      <KeyboardShortcuts contractId={contractId} />
    </main>
    <footer className="studio-footer">
      &copy; 2026 Fairbuild. All rights reserved.
    </footer>
    </div>
  );
}
