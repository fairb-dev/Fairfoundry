import type { VerificationResult, LinkedColumn } from "@/lib/verification-engine";

interface Insight {
  type: "warning" | "info" | "success";
  title: string;
  detail: string;
}

export function generateInsights(
  result: VerificationResult,
  linkedColumns: LinkedColumn[],
  headers: string[],
  rows: string[][],
): Insight[] {
  const insights: Insight[] = [];

  // High failure rate criteria
  for (const summary of result.criterionSummaries) {
    const col = linkedColumns.find((lc) => lc.columnName === summary.columnName);
    if (!col) continue;
    const failCount = summary.totalFailed;
    const failRate = (failCount / result.totalUnits) * 100;
    if (failRate > 10) {
      insights.push({
        type: "warning",
        title: `${col.parameterName} has a ${failRate.toFixed(1)}% failure rate`,
        detail: `${failCount} of ${result.totalUnits} units failed this criterion. Consider reviewing the acceptance limit or investigating the process.`,
      });
    }
  }

  // Values clustering near limits
  for (const col of linkedColumns) {
    if (col.columnIndex < 0 || col.columnIndex >= headers.length) continue;
    const values = rows
      .map((row) => parseFloat(row[col.columnIndex]))
      .filter((v) => !isNaN(v));

    if (values.length === 0) continue;

    if (col.lowerLimit != null) {
      const nearLimit = values.filter(
        (v) => v >= col.lowerLimit! && v < col.lowerLimit! * 1.05
      );
      if (nearLimit.length > values.length * 0.2) {
        insights.push({
          type: "info",
          title: `${col.parameterName} values cluster near the lower limit`,
          detail: `${nearLimit.length} of ${values.length} values (${((nearLimit.length / values.length) * 100).toFixed(0)}%) are within 5% of the ${col.lowerLimit} limit. This may indicate process drift.`,
        });
      }
    }

    if (col.upperLimit != null) {
      const nearLimit = values.filter(
        (v) => v <= col.upperLimit! && v > col.upperLimit! * 0.95
      );
      if (nearLimit.length > values.length * 0.2) {
        insights.push({
          type: "info",
          title: `${col.parameterName} values cluster near the upper limit`,
          detail: `${nearLimit.length} of ${values.length} values (${((nearLimit.length / values.length) * 100).toFixed(0)}%) are within 5% of the ${col.upperLimit} limit. This may indicate process drift.`,
        });
      }
    }
  }

  // Station-specific failure analysis
  const stationCol = headers.findIndex(
    (h) => h.toLowerCase().includes("station") || h.toLowerCase().includes("equipment")
  );
  if (stationCol >= 0) {
    const stationResults: Record<string, { total: number; failed: number }> = {};
    for (const unit of result.unitResults) {
      const rowIndex = rows.findIndex(
        (r) => r[0] === unit.unitId || r[1] === unit.unitId
      );
      if (rowIndex < 0) continue;
      const station = rows[rowIndex][stationCol] || "unknown";
      if (!stationResults[station]) stationResults[station] = { total: 0, failed: 0 };
      stationResults[station].total++;
      if (!unit.overallPass) stationResults[station].failed++;
    }

    const stations = Object.entries(stationResults).filter(([, s]) => s.total >= 3);
    if (stations.length >= 2) {
      const avgFailRate =
        stations.reduce((sum, [, s]) => sum + s.failed / s.total, 0) / stations.length;
      for (const [name, s] of stations) {
        const failRate = s.failed / s.total;
        if (failRate > avgFailRate * 1.5 && s.failed > 1) {
          insights.push({
            type: "warning",
            title: `Station ${name} has elevated failure rate`,
            detail: `${((failRate * 100).toFixed(1))}% failure rate (${s.failed}/${s.total} units) vs ${((avgFailRate * 100).toFixed(1))}% average across all stations.`,
          });
        }
      }
    }
  }

  // Overall success
  if (result.passRate >= 95 && insights.length === 0) {
    insights.push({
      type: "success",
      title: "All criteria within comfortable margins",
      detail: `${result.passRate.toFixed(1)}% pass rate with no criteria near limits. Process appears stable.`,
    });
  }

  return insights;
}

export function InsightsPanel({ insights }: { insights: Insight[] }) {
  if (insights.length === 0) return null;

  return (
    <div className="mt-8">
      <h3
        style={{
          fontSize: "0.85rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--foreground)",
          marginBottom: "0.75rem",
        }}
      >
        Insights
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {insights.map((insight, i) => (
          <div
            key={i}
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "8px",
              border: "1px solid",
              borderColor:
                insight.type === "warning"
                  ? "#fde68a"
                  : insight.type === "success"
                    ? "#bbf7d0"
                    : "#bfdbfe",
              backgroundColor:
                insight.type === "warning"
                  ? "#fffbeb"
                  : insight.type === "success"
                    ? "#f0fdf4"
                    : "#eff6ff",
            }}
          >
            <div
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color:
                  insight.type === "warning"
                    ? "#92400e"
                    : insight.type === "success"
                      ? "#166534"
                      : "#1e40af",
                marginBottom: "0.15rem",
              }}
            >
              {insight.type === "warning" ? "⚠ " : insight.type === "success" ? "✓ " : "ℹ "}
              {insight.title}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: 1.5 }}>
              {insight.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
