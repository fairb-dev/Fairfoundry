"use client";

import { useState } from "react";
import { ERSUpload } from "./ers-upload";
import { ManualCriterionForm } from "./manual-form";

export function CriteriaEmpty({ contractId }: { contractId: string }) {
  const [showManual, setShowManual] = useState(false);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Define Acceptance Criteria
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Upload a specification document to extract criteria automatically, or
          define them manually.
        </p>
      </div>

      {showManual ? (
        <div>
          <ManualCriterionForm contractId={contractId} />
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setShowManual(false)}
              className="text-sm text-gray-500 underline underline-offset-2 hover:text-[var(--foreground)] cursor-pointer"
            >
              Or upload a specification document
            </button>
          </div>
        </div>
      ) : (
        <ERSUpload
          contractId={contractId}
          onManualClick={() => setShowManual(true)}
        />
      )}
    </div>
  );
}
