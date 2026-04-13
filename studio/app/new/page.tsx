import type { Metadata } from "next";
import Link from "next/link";
import { createContract } from "./actions";

export const metadata: Metadata = {
  title: "New Contract",
  description: "Create a new quality verification contract.",
};

export default function NewContractPage() {
  return (
    <div className="min-h-screen flex flex-col">
    <main id="main-content" className="mx-auto max-w-xl px-6 py-16 flex-1 w-full">
      {/* Breadcrumb */}
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
        <span className="text-sm text-gray-600">New</span>
      </div>

      <header className="mb-10">
        <p className="mb-2 text-sm font-semibold tracking-wider uppercase text-[var(--accent)]">
          New Contract
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Create a Quality Contract
        </h1>
        <p className="mt-3 text-base text-gray-500">
          Name the contract and identify both parties. You will upload production
          data and define acceptance criteria in the next steps.
        </p>
      </header>

      <form action={createContract} className="space-y-6">
        {/* Contract Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-semibold text-[var(--foreground)] mb-1.5"
          >
            Contract Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g., Camera Module EVT Testing Q2 2026"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-gray-400 outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
          />
        </div>

        {/* OEM Company */}
        <div>
          <label
            htmlFor="oemName"
            className="block text-sm font-semibold text-[var(--foreground)] mb-1.5"
          >
            OEM Company
          </label>
          <input
            id="oemName"
            name="oemName"
            type="text"
            required
            placeholder="e.g., Nikon Corporation"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-gray-400 outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            The company that defines quality standards.
          </p>
        </div>

        {/* Factory Company */}
        <div>
          <label
            htmlFor="factoryName"
            className="block text-sm font-semibold text-[var(--foreground)] mb-1.5"
          >
            Factory Company
          </label>
          <input
            id="factoryName"
            name="factoryName"
            type="text"
            required
            placeholder="e.g., Foxconn Shenzhen Plant 3"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-gray-400 outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            The manufacturer that submits production data.
          </p>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer"
          >
            Create Contract
          </button>
        </div>
      </form>
    </main>
    <footer className="studio-footer">
      &copy; 2026 Fairbuild. All rights reserved.
    </footer>
    </div>
  );
}
