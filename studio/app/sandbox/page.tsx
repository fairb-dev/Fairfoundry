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
    <div className="sandbox-dashboard sandbox-home-page">
      <main id="main-content" className="sandbox-home-main">
        <div className="sandbox-home-breadcrumb">
          <Link href="/" className="sandbox-wordmark">
            Fairbuild
          </Link>
          <span>/</span>
          <strong>Sandbox</strong>
        </div>

        <section className="sandbox-home-hero">
          <div>
            <p className="sandbox-label">20-minute sandbox</p>
            <h1>
              Test a contract manufacturing workflow with one production log.
            </h1>
            <p>
              Start with a sample log and see the path Fairbuild is designed to
              automate: native file intake, parameter extraction, quality gates,
              product grading, evidence review, the 48-hour customer review
              window, and settlement-instruction preview.
            </p>
          </div>
        </section>

        <section className="sandbox-home-layout">
          <div className="sandbox-home-samples">
            {SAMPLE_CATALOG.map((sample) => (
              <form
                key={sample.slug}
                action={startSampleSandbox}
                className="sandbox-sample-card"
              >
                <input type="hidden" name="slug" value={sample.slug} />
                <div className="sandbox-sample-card-body">
                  <div>
                    <div className="sandbox-chip-row">
                      <span className="sandbox-chip neutral">
                        {sample.industry}
                      </span>
                      <span className="sandbox-chip success">
                        {sample.estimatedMinutes} min path
                      </span>
                    </div>
                    <h2>
                      {sample.title}
                    </h2>
                    <p>
                      {sample.tagline}
                    </p>
                    <div className="sandbox-home-meta">
                      <div>
                        <span>OEM:</span>{" "}
                        {sample.oem}
                      </div>
                      <div>
                        <span>Factory:</span>{" "}
                        {sample.factory}
                      </div>
                    </div>
                    <ul className="sandbox-home-highlights">
                      {sample.highlights.map((highlight) => (
                        <li key={highlight}>
                          <span aria-hidden="true" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="submit"
                    className="sandbox-button primary"
                  >
                    Open sample
                  </button>
                </div>
              </form>
            ))}
          </div>

          <aside className="sandbox-upload-panel">
            <p className="sandbox-label">Native upload</p>
            <h2>
              CSV and JSON upload path
            </h2>
            <p>
              The sample sandbox runs without login. Customer-file evaluation adds
              retention controls, AI-processing disclosure, and a delete action
              before native logs are accepted.
            </p>
            <div className="sandbox-upload-note">
              No production custody, escrow, or payment service is provided in
              sandbox mode. Settlement output is an instruction preview.
            </div>
            <button
              type="button"
              disabled
              className="sandbox-button secondary"
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
