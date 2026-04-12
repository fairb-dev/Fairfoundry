# Iteration 09 -- Final Ship Review

**Reviewer:** Steve Jobs  
**Date:** 2026-04-10  
**Verdict:** Read below.

---

## What's Good

The bones of this application are excellent. Specifically:

1. **The verification table is genuinely innovative.** Three-line column headers showing the column name, the acceptance limit, and the specification reference -- all in one glance. This is the kind of information density that makes professionals trust a tool. The sticky first column, the fail-cell popovers with gap calculations, the red row highlighting -- these are details that show someone understood the problem deeply.

2. **The design system is restrained and professional.** One accent color (blue) used only for interactive elements and data emphasis. IBM Plex Sans/Mono is the right typeface choice for an industrial quality tool -- it says "precision" without being cold. The CSS variables are clean, the color tokens for pass/fail are semantic and consistent.

3. **The AI integration is tasteful.** Column role suggestions, ERS document extraction, semantic matching -- these are presented as suggestions the user can accept or override, not as black boxes. The confidence badges give users a reason to trust or question the AI. This is the right relationship between human and machine.

4. **The loading skeletons are complete.** Every tab has a loading state that matches the shape of its real content. This prevents layout shift and communicates structure before data arrives.

5. **The empty states are well-designed.** Clear icons, concise copy, and an obvious next action. The empty-to-populated transition never leaves the user stranded.

6. **The form interactions are solid.** Drag-and-drop file upload with visual feedback, inline error display, pending states with spinners, optimistic transitions. The contract creation flow redirects immediately to the data tab -- exactly the right next step.

---

## What Was Fixed in This Pass

Seventeen issues found and fixed:

### Copy & Language Fixes
- **Homepage subtitle** -- Changed from jargon-heavy "Quality verification contracts between OEMs and factories" to action-oriented "Define quality standards, upload production data, and verify results."
- **New contract description** -- Changed from vague "Define who is involved" to specific "Name the contract and identify both parties. You will upload production data and define acceptance criteria in the next steps."
- **OEM helper text** -- Changed "brand" to "company" (precision matters).
- **DRAFT status description** -- Rewrote from passive "Criteria and data mappings are not yet finalized" to actionable "Upload production data, define acceptance criteria, then link them together."
- **SANDBOX status description** -- Added "before going live" for clarity.
- **PAUSED status description** -- Added "No new submissions are being accepted."
- **"Column Roles" heading** -- Renamed to "Column Classification" (less developer-facing).
- **Column role editor description** -- Changed from "Review AI-suggested roles" to "Review how each column was classified."
- **Data upload empty state** -- Changed from "The AI will analyze columns and suggest roles" to "Each column will be automatically classified as a measurement, identifier, or metadata."
- **"ERS document"** -- Changed all instances to "specification document" (factory managers don't know the acronym).
- **ERS file format help text** -- Changed from "JSON files are parsed directly. Text files are analyzed by AI" to "Supports .json and .txt specification files."
- **Match button description** -- Changed from "specification metadata and AI semantic matching" to "column names and AI analysis."
- **"Criteria Type" label** -- Renamed to "Limit Type" in the manual form.
- **Verification legend** -- Changed "Below acceptance criterion" to "Outside acceptance limits" (the old text was wrong for upper-limit failures).
- **Verification result label** -- Changed "pass" to "pass rate" for clarity.

### Structural & UX Fixes
- **Removed redundant back links** -- Both the new contract page and the contract detail layout had a breadcrumb AND a separate "All Contracts" back link. Removed the redundant back links; the breadcrumb is sufficient.
- **"Linked Pairs" stat label** -- Renamed to "Verified Checks" (user-facing language).
- **Column index display** -- Changed `#0` (0-indexed, developer-facing) to `Col 1` (1-indexed, human-readable) across column editor, link cards, and manual link form.
- **Smart "next action" button on overview** -- The "Run Verification" button was always shown, even when there were no links (leading to a dead end). Now it intelligently shows: "Upload Data" when no CSV exists, "Define Criteria" when no criteria exist, "Link Columns to Criteria" when both exist but aren't linked, and "Run Verification" only when links exist.
- **Verification page call-to-action** -- Added a "Ready to test in Sandbox?" prompt after verification results for DRAFT contracts, so the user isn't left at a dead end.
- **Footer consistency** -- Added the footer to the contract detail layout and the new contract page. Previously only the homepage had it.
- **Table header alignment** -- Changed `vertical-align: middle` to `vertical-align: bottom` in the verification table, so headers with different heights (1-line vs 3-line) align properly at the baseline.
- **CSV upload button HTML entity** -- Fixed `&amp;` literal rendering in JSX. Changed to `&` which renders correctly in JSX.

---

## What Would Need Another Iteration

1. **Mobile responsiveness** -- The verification table is inherently wide. On mobile, the horizontal scroll works, but the sticky first column shadow could use a more prominent visual cue. The tab nav scrolls horizontally which is fine, but could benefit from fade-out edge indicators.

2. **Success feedback on contract creation** -- The form redirects after success, but there's no toast or flash message confirming "Contract created." The redirect itself is the feedback, which is adequate but not delightful.

3. **Keyboard navigation** -- The fail-cell popovers open on click but don't trap focus or close on Escape. This is a polish item, not a blocker.

4. **Dark mode** -- The CSS variables are set up to support it, but no dark mode implementation exists. Not needed for v1 but the foundation is there.

5. **Accessibility audit** -- The aria-labels on delete buttons are good. But the tab nav could use `role="tablist"` and `role="tab"` attributes. The progress bar could use `role="progressbar"` with `aria-valuenow`.

---

## Would Steve Jobs Ship This?

**YES.**

Here's why: This tool solves a real problem -- factory quality verification -- and it solves it with clarity. A factory manager can sit down, create a contract, upload a production log, upload a specification, click "Match," and see a pass/fail table with per-cell drill-down detail. That flow requires zero training. Zero documentation. Zero phone calls to IT.

The design earns trust through precision: monospaced numbers, specification section references inline, gap calculations on failure cells. This isn't a toy. This is a tool that respects the intelligence of the person using it.

The issues I fixed in this pass were real -- developer jargon that leaked into the UI, dead-end flows, redundant navigation, an HTML entity rendering bug, and a verification legend that was factually wrong. These are exactly the kind of 5%-left issues that erode trust over time. They're fixed now.

The remaining items (mobile polish, keyboard nav, dark mode, ARIA attributes) are not ship-blockers. They're iteration-2 items.

Ship it.
