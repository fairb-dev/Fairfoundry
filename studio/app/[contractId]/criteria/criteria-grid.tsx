"use client";

import { useState, useCallback } from "react";
import { CriterionCard } from "./criteria-card";

interface CriterionData {
  id: string;
  parameterName: string;
  criteriaType: string;
  lowerLimit: number | null;
  upperLimit: number | null;
  unit: string | null;
  source: string;
  sourceRef: string | null;
  aiConfidence: number | null;
  mapsToColumn: string | null;
}

export function CriteriaGrid({
  contractId,
  criteria: initialCriteria,
}: {
  contractId: string;
  criteria: CriterionData[];
}) {
  const [criteria, setCriteria] = useState(initialCriteria);

  const moveUp = useCallback((index: number) => {
    if (index <= 0) return;
    setCriteria((prev) => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  }, []);

  const moveDown = useCallback((index: number) => {
    setCriteria((prev) => {
      if (index >= prev.length - 1) return prev;
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {criteria.map((c, i) => (
        <CriterionCard
          key={c.id}
          id={c.id}
          contractId={contractId}
          parameterName={c.parameterName}
          criteriaType={c.criteriaType}
          lowerLimit={c.lowerLimit}
          upperLimit={c.upperLimit}
          unit={c.unit}
          source={c.source}
          sourceRef={c.sourceRef}
          aiConfidence={c.aiConfidence}
          mapsToColumn={c.mapsToColumn}
          sortIndex={i}
          totalCount={criteria.length}
          onMoveUp={() => moveUp(i)}
          onMoveDown={() => moveDown(i)}
        />
      ))}
    </div>
  );
}
