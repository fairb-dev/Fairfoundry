import Link from "next/link";
import { createContract } from "./actions";

export default function NewContractPage() {
  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 no-underline hover:text-[var(--foreground)] mb-8"
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
        Back to Contracts
      </Link>

      <header className="mb-10">
        <p className="mb-2 text-sm font-semibold tracking-wider uppercase text-[var(--accent)]">
          New Contract
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Create a Quality Contract
        </h1>
        <p className="mt-3 text-base text-gray-500">
          Define who is involved. You will set up data mappings and acceptance
          criteria next.
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
            placeholder="e.g. Camera Module Quality Agreement"
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
            placeholder="e.g. Nikon Corporation"
            className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-2.5 text-sm text-[var(--foreground)] placeholder:text-gray-400 outline-none transition-colors focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20"
          />
          <p className="mt-1.5 text-xs text-gray-400">
            The brand that defines quality standards.
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
            placeholder="e.g. Foxconn Shenzhen Plant 3"
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
  );
}
