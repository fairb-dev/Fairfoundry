"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { updateCriterionAction } from "./actions";

interface InlineEditProps {
  criterionId: string;
  contractId: string;
  field: "parameterName" | "lowerLimit" | "upperLimit" | "unit";
  value: string;
  displayClassName?: string;
  inputClassName?: string;
  mono?: boolean;
}

export function InlineEdit({
  criterionId,
  contractId,
  field,
  value,
  displayClassName = "",
  inputClassName = "",
  mono = false,
}: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  function commit() {
    const trimmed = currentValue.trim();
    if (trimmed === value) {
      setEditing(false);
      return;
    }

    startTransition(async () => {
      const updates: Record<string, string | number | null> = {};

      if (field === "lowerLimit" || field === "upperLimit") {
        const parsed = trimmed === "" ? null : parseFloat(trimmed);
        if (trimmed !== "" && isNaN(parsed as number)) {
          setCurrentValue(value);
          setEditing(false);
          return;
        }
        updates[field] = parsed;
      } else {
        updates[field] = trimmed || null;
      }

      await updateCriterionAction(criterionId, contractId, updates);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      commit();
    }
    if (e.key === "Escape") {
      setCurrentValue(value);
      setEditing(false);
    }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={field === "lowerLimit" || field === "upperLimit" ? "number" : "text"}
        step="any"
        value={currentValue}
        onChange={(e) => setCurrentValue(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        disabled={isPending}
        className={`inline-edit-input ${mono ? "font-mono" : ""} ${inputClassName}`}
      />
    );
  }

  return (
    <span className="inline-edit-wrapper">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={`inline-edit-display ${displayClassName}`}
        title="Click to edit"
      >
        {value || <span className="text-gray-300">--</span>}
      </button>
      {saved && (
        <span className="inline-edit-saved">Saved</span>
      )}
      {isPending && (
        <span className="inline-edit-saving">...</span>
      )}
    </span>
  );
}
