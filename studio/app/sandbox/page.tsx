import type { Metadata } from "next";
import Link from "next/link";
import { SAMPLE_CATALOG } from "@/lib/sample-catalog";
import { startSampleSandbox } from "./actions";

export const metadata: Metadata = {
  title: "Sandbox",
  description:
    "Run a 20-minute Fairbuild sandbox with sample manufacturing logs, parameter extraction, quality gates, grading, and settlement-instruction preview.",
};

export default function SandboxHomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--muted)]">
      <main id="main-content" className="mx-auto max-w-6xl px-6 py-10 flex-1 w-full">
        <div className="mb-8 flex items-center gap-3">
          <Link
            href="/"
            className="text-base font-bold tracking-tight text-[var(--foreground)] no-underline hover:opacity-80"
          >
            Fairbuild
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-gray-500">Sandbox</span>
        </div>

        <section className="rounded-xl border border-[var(--border)] bg-white p-8 shadow-sm">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-semibold uppercase text-[var(--accent)]">
              20-minute sandbox
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">
              Test a contract manufacturing workflow with one production log.
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Start with a sample log and see the path Fairbuild is designed to
              automate: native file intake, parameter extraction, quality gates,
              product grading, evidence review, the 48-hour customer review
              window, and settlement-instruction preview.
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4">
            {SAMPLE_CATALOG.map((sample) => (
              <form
                key={sample.slug}
                action={startSampleSandbox}
                className="rounded-xl border border-[var(--border)] bg-white p-6 shadow-sm"
              >
                <input type="hidden" name="slug" value={sample.slug} />
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                        {sample.industry}
                      </span>
                      <span className="rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                        {sample.estimatedMinutes} min path
                      </span>
                    </div>
                    <h2 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
                      {sample.title}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                      {sample.tagline}
                    </p>
                    <div className="mt-4 grid gap-2 text-sm text-gray-600">
                      <div>
                        <span className="font-semibold text-gray-900">OEM:</span>{" "}
                        {sample.oem}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">Factory:</span>{" "}
                        {sample.factory}
                      </div>
                    </div>
                    <ul className="mt-4 grid gap-2 pl-0 text-sm text-gray-600">
                      {sample.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="submit"
                    className="rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                  >
                    Run sandbox
                  </button>
                </div>
              </form>
            ))}
          </div>

          <aside className="rounded-xl border border-dashed border-[#b9b9f9] bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase text-[var(--accent)]">
              Native upload
            </p>
            <h2 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
              CSV and JSON upload path
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              The sample sandbox runs without login. Customer-file evaluation adds
              retention controls, AI-processing disclosure, and a delete action
              before native logs are accepted.
            </p>
            <div className="mt-5 rounded-lg bg-[var(--muted)] p-4 text-xs leading-5 text-gray-600">
              No production custody, escrow, or payment service is provided in
              sandbox mode. Settlement output is an instruction preview.
            </div>
            <button
              type="button"
              disabled
              className="mt-5 w-full rounded-lg border border-[var(--border)] bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-400"
            >
              Upload path pending controls
            </button>
          </aside>
        </section>
      </main>
      <footer className="studio-footer">&copy; 2026 Fairbuild. All rights reserved.</footer>
    </div>
  );
}
