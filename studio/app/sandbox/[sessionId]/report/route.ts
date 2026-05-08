import { getSample, readSampleCsv, readSampleErs } from "@/lib/sample-catalog";
import { simulateSandbox } from "@/lib/sandbox-simulator";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const sample = getSample(sessionId);
  if (!sample) {
    return new Response("Not found", { status: 404 });
  }

  const [csvText, ers] = await Promise.all([
    readSampleCsv(sample),
    readSampleErs(sample),
  ]);
  const simulation = simulateSandbox(sample, csvText, ers);
  const distribution = simulation.gradeSummary.distribution;
  const acceptedUnits = distribution["Grade A"] + distribution["Grade B"];
  const heldUnits = distribution.Rework + distribution.Review + distribution.Reject;

  const payload = {
    report_id: `FB-SBX-${sample.ersId}-${sessionId}`,
    generated_at: new Date().toISOString(),
    sample: sample.title,
    ers_revision: `${ers.ers_id} ${ers.revision}`,
    rows: simulation.profile.rowCount,
    columns: simulation.profile.columnCount,
    readiness_score: simulation.readinessScore,
    evidence_completeness: simulation.evidenceCompleteness,
    accepted_units: acceptedUnits,
    held_units: heldUnits,
    grade_distribution: distribution,
    held_unit_matrix: simulation.gradeSummary.units.filter(
      (unit) => unit.grade !== "Grade A" && unit.grade !== "Grade B"
    ),
    all_units: simulation.gradeSummary.units,
    custody_boundary: simulation.settlementPreview.custodyBoundary,
    review_window: simulation.settlementPreview.reviewWindow,
    intervention_path: simulation.settlementPreview.interventionPath,
    settlement_instruction: simulation.settlementPreview.settlementInstruction,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="FB-SBX-${sample.ersId}-${sessionId}-report.json"`,
    },
  });
}
