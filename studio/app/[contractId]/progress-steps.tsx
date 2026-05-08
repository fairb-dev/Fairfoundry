/**
 * ProgressSteps -- horizontal step indicator for the contract setup flow.
 *
 * Shows where the user is in the 4-step workflow:
 *   1. Upload Data  2. Define Criteria  3. Link Columns  4. Verify
 *
 * Each step can be "done", "current", or "upcoming".
 */

const STEPS = [
  { number: 1, label: "Upload Data" },
  { number: 2, label: "Define Criteria" },
  { number: 3, label: "Link Columns" },
  { number: 4, label: "Verify" },
] as const;

type StepState = "done" | "current" | "upcoming";

export function ProgressSteps({
  hasData,
  hasCriteria,
  hasLinks,
  hasVerification,
}: {
  hasData: boolean;
  hasCriteria: boolean;
  hasLinks: boolean;
  hasVerification: boolean;
}) {
  const states: StepState[] = [
    hasData ? "done" : !hasCriteria && !hasLinks ? "current" : "done",
    hasCriteria ? "done" : hasData ? "current" : "upcoming",
    hasLinks ? "done" : hasData && hasCriteria ? "current" : "upcoming",
    hasVerification ? "done" : hasLinks ? "current" : "upcoming",
  ];

  // Refine: first incomplete step is current, everything before is done
  let foundCurrent = false;
  const refined: StepState[] = states.map((s, i) => {
    if (foundCurrent) return "upcoming";
    const done =
      i === 0 ? hasData : i === 1 ? hasCriteria : i === 2 ? hasLinks : hasVerification;
    if (!done) {
      foundCurrent = true;
      return "current";
    }
    return "done";
  });

  return (
    <div className="flex items-center gap-0" role="list" aria-label="Setup progress">
      {STEPS.map((step, i) => {
        const state = refined[i];
        return (
          <div key={step.number} className="flex items-center" role="listitem">
            {/* Step circle + label */}
            <div className="flex flex-col items-center" style={{ minWidth: 80 }}>
              <div
                className="flex items-center justify-center rounded-full text-xs font-bold"
                style={{
                  width: 28,
                  height: 28,
                  backgroundColor:
                    state === "done"
                      ? "var(--pass)"
                      : state === "current"
                        ? "var(--accent)"
                        : "#e5e7eb",
                  color: state === "upcoming" ? "#9ca3af" : "white",
                  transition: "background-color 0.2s",
                }}
                aria-label={`Step ${step.number}: ${step.label} - ${state}`}
              >
                {state === "done" ? (
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                      d="M4 8.5l3 3 5-5.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </div>
              <span
                className="mt-1.5 text-xs font-medium text-center"
                style={{
                  color:
                    state === "done"
                      ? "var(--pass-text)"
                      : state === "current"
                        ? "var(--accent)"
                        : "#9ca3af",
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                style={{
                  width: 40,
                  height: 2,
                  backgroundColor:
                    refined[i + 1] === "upcoming" ? "#e5e7eb" : "var(--pass)",
                  marginBottom: 20,
                  transition: "background-color 0.2s",
                }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
