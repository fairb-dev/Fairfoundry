"use client";

import { useState, useRef, useEffect } from "react";

interface FailCellProps {
  rawValue: string;
  measuredValue: number;
  criteriaType: string;
  lowerLimit: number | null;
  upperLimit: number | null;
  unit: string | null;
  margin: number | null;
  sourceRef: string | null;
  parameterName: string;
}

export function FailCell({
  rawValue,
  measuredValue,
  criteriaType,
  lowerLimit,
  upperLimit,
  unit,
  margin,
  sourceRef,
  parameterName,
}: FailCellProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Build the acceptance limit string
  const u = unit ? ` ${unit}` : "";
  let limitStr = "";
  switch (criteriaType) {
    case "NUMERIC_GTE":
      limitStr = `\u2265 ${lowerLimit}${u}`;
      break;
    case "NUMERIC_LTE":
      limitStr = `\u2264 ${upperLimit}${u}`;
      break;
    case "NUMERIC_RANGE":
      limitStr = `${lowerLimit} ~ ${upperLimit}${u}`;
      break;
  }

  // Gap description
  const gap =
    margin !== null ? Math.abs(margin) : null;
  let gapStr = "";
  if (gap !== null) {
    if (criteriaType === "NUMERIC_GTE") {
      gapStr = `${gap.toFixed(3)}${u} below minimum`;
    } else if (criteriaType === "NUMERIC_LTE") {
      gapStr = `${gap.toFixed(3)}${u} above maximum`;
    } else if (criteriaType === "NUMERIC_RANGE") {
      if (lowerLimit !== null && measuredValue < lowerLimit) {
        gapStr = `${gap.toFixed(3)}${u} below range`;
      } else {
        gapStr = `${gap.toFixed(3)}${u} above range`;
      }
    }
  }

  return (
    <span ref={ref} className="fail-popover-trigger inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`View failure detail for ${parameterName}`}
        aria-expanded={open}
        className="inline-flex items-center gap-1 cursor-pointer bg-transparent border-0 p-0 m-0 font-inherit"
        style={{ color: "var(--fail)" }}
      >
        <span className="text-xs">{"\u2717"}</span>
        <span>{rawValue}</span>
      </button>

      {open && (
        <div className="fail-popover" onClick={(e) => e.stopPropagation()}>
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Failure Detail
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Parameter</span>
              <span className="font-medium text-[var(--foreground)] text-right">
                {parameterName}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Measured</span>
              <span
                className="font-mono font-semibold"
                style={{ color: "var(--fail)" }}
              >
                {measuredValue}{u}
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-gray-500">Limit</span>
              <span className="font-mono font-medium text-[var(--foreground)]">
                {limitStr}
              </span>
            </div>
            {gapStr && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Gap</span>
                <span
                  className="font-mono font-semibold"
                  style={{ color: "var(--fail)" }}
                >
                  {gapStr}
                </span>
              </div>
            )}
            {sourceRef && (
              <div className="mt-2 pt-2 border-t border-[var(--border)]">
                <div className="text-xs text-gray-400">
                  Source: {sourceRef}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
