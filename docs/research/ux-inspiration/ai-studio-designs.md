# AI Studio Design Research

This public research note captures design patterns for the Fairbuild Contract Builder Studio without including transaction-specific examples.

## Design Direction

The strongest pattern for Fairbuild is a quiet enterprise workspace:

- A document-like contract surface rather than a settings-heavy form.
- Spreadsheet-native import with inline validation.
- Clear evidence lineage from source cell to accepted gate.
- Status badges for draft, needs review, accepted, exception, and finalized.
- An activity timeline for model edits, evidence uploads, review actions, and final outcomes.
- Progressive disclosure for advanced contract logic.

## Import Flow


1. Drop a file.
2. Auto-detect columns, units, and likely parameter names.
3. Show a compact preview with confidence indicators.
4. Highlight missing limits, suspicious values, duplicate parameters, and unit drift.
5. Let the user accept, edit, or reject each extracted field.
6. Produce an accepted parameter table with traceability back to the source file.

## Contract Builder Layout

The contract builder should use a three-pane structure:

| Pane | Purpose |
| --- | --- |
| Source | Imported CSV, JSON, report, or document excerpt with highlighted source spans. |
| Model | Extracted parameters, gates, grades, evidence requirements, and review rights. |
| Record | Activity timeline, reviewer notes, evidence status, and final outcome. |

## Interaction Patterns

- Inline edits should preserve the source reference.
- Every AI suggestion needs an explicit human confirmation.
- Validation messages should be local to the affected field.
- Batch actions should be reversible.
- Review state should be visible without forcing users into a separate workflow.
- Keyboard navigation should work across the parameter table.

## Visual Patterns

- Dense but calm tables.
- Small status badges rather than large alert blocks.
- 8px spacing rhythm.
- Clear section labels.
- No decorative card nesting.
- Minimal motion for state changes and row expansion.
- Timeline entries grouped by day and actor.

## Enterprise Quality Bar


- Traceability
- Reviewability
- Operational control
- Shared source of truth
- Low ambiguity
- Audit readiness
