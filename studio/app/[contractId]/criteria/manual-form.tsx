"use client";

import { useState, useTransition } from "react";
import { createCriterionAction } from "./actions";

const CRITERIA_TYPES = [
  { value: "NUMERIC_GTE", label: "\u2265 Lower limit" },
  { value: "NUMERIC_LTE", label: "\u2264 Upper limit" },
  { value: "NUMERIC_RANGE", label: "Within range" },
];

export function ManualCriterionForm({
  contractId,
}: {
  contractId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [criteriaType, setCriteriaType] = useState("NUMERIC_GTE");
  const [error, setError] = useState<string | null>(null);

  const showLower = criteriaType === "NUMERIC_GTE" || criteriaType === "NUMERIC_RANGE";
  const showUpper = criteriaType === "NUMERIC_LTE" || criteriaType === "NUMERIC_RANGE";

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createCriterionAction(contractId, formData);
      if (result.error) {
        setError(result.error);
      }
    });
  }

  return (
    <form
      action={handleSubmit}
      className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
    >
      <h3 className="text-sm font-semibold text-[var(--foreground)] mb-4">
        Add Criterion
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Parameter Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Parameter Name
          </label>
          <input
            type="text"
            name="parameterName"
            placeholder="e.g. MTF at Nyquist/2, center field"
            required
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-gray-400 focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Criteria Type */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Limit Type
          </label>
          <select
            name="criteriaType"
            value={criteriaType}
            onChange={(e) => setCriteriaType(e.target.value)}
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none"
          >
            {CRITERIA_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Unit */}
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Unit
          </label>
          <input
            type="text"
            name="unit"
            placeholder="e.g. cy/px, %, mm"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-gray-400 focus:border-[var(--accent)] focus:outline-none"
          />
        </div>

        {/* Lower Limit */}
        {showLower && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Lower Limit
            </label>
            <input
              type="number"
              name="lowerLimit"
              step="any"
              placeholder="0.00"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono text-[var(--foreground)] placeholder:text-gray-400 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        )}

        {/* Upper Limit */}
        {showUpper && (
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Upper Limit
            </label>
            <input
              type="number"
              name="upperLimit"
              step="any"
              placeholder="0.00"
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono text-[var(--foreground)] placeholder:text-gray-400 focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
        )}

        {/* Source Reference */}
        <div className={showLower && showUpper ? "sm:col-span-2" : ""}>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Source Reference
            <span className="ml-1 font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="text"
            name="sourceRef"
            placeholder="e.g. Section 3.2.1"
            className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm text-[var(--foreground)] placeholder:text-gray-400 focus:border-[var(--accent)] focus:outline-none"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 text-sm text-red-600">{error}</div>
      )}

      {/* Submit */}
      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-[0.98] cursor-pointer disabled:opacity-50"
        >
          {isPending ? "Adding..." : "Add"}
        </button>
      </div>
    </form>
  );
}
