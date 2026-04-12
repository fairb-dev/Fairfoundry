# Fairbuild Contract Builder Studio — Autoresearch Program

## Loop Structure

This program follows an openclaw-style iteration loop:

```
RESEARCH → PLAN → DESIGN → IMPLEMENT → REVIEW → ASSESS → REPEAT
```

Each iteration produces a measurable artifact. The loop continues until the studio meets the quality bar: a factory manager and OEM quality engineer can upload a CSV, define acceptance criteria, and see pass/fail results in under 5 minutes with zero training.

## Iteration Protocol

### 1. RESEARCH (what exists, what's needed)
- Study best-in-class UX patterns (AI studios, data tools, enterprise dashboards)
- Review virtual world data (45 CSVs, 45 ERS JSONs, 125 scenarios)
- Identify the specific user action being built this iteration
- Output: research notes appended to `docs/research/ux-inspiration/`

### 2. PLAN (what to build)
- Define the exact scope of this iteration (one feature, one page, one flow)
- Identify files to create/modify
- Define the acceptance test: what does "done" look like?
- Output: iteration plan in `studio/iterations/iteration-{N}.md`

### 3. DESIGN (how it looks and feels)
- Steve Jobs scrutiny: is this the simplest possible way to do this?
- Can a factory manager use this without training?
- Does it feel premium, not like a developer tool?
- Progressive disclosure: what's visible by default vs on click?
- Output: design decisions documented in iteration plan

### 4. IMPLEMENT (write the code)
- Build the feature
- Use seed data from virtual world for testing
- Follow OpenClaw patterns (server actions, Prisma, AI SDK)
- Output: working code, passing build

### 5. REVIEW (does it work?)
- Visual review via browser screenshots
- Test with 3 different CSV+ERS pairs (camera, steel, pharma)
- Check: does a non-technical person understand what they're seeing?
- Output: screenshots + review notes

### 6. ASSESS (is it good enough?)
- Grade on: clarity, speed, elegance, correctness
- Compare to inspiration (Stripe dashboard, Linear, Airtable)
- Identify what's wrong, what's missing, what's excessive
- Output: assessment with specific issues to fix

### 7. REPEAT
- If assessment finds issues → fix in next iteration
- If assessment passes → move to next feature
- Never ship something that doesn't meet the quality bar

## Iteration Sequence

| Iteration | Feature | Acceptance Test |
|---|---|---|
| 1 | Project scaffold + database + seed data | `npm run dev` serves a page, seed data loads |
| 2 | Contract dashboard — list contracts, create new | Can create a contract and see it in the list |
| 3 | CSV upload — render as interactive table | Upload camera_module_mtf_test.csv, see all columns and rows |
| 4 | Column role detection — AI suggests roles | AI correctly identifies MTF columns as MEASUREMENT |
| 5 | ERS upload — extract acceptance criteria | Upload camera_module_mtf_ers.json, see 8 criteria cards |
| 6 | Hypertext linking — match columns to criteria | AI suggests mtf_center → "MTF at center ≥ 0.35", user confirms |
| 7 | Verification — pass/fail per row per criterion | See green/red for each cell, summary stats |
| 8 | Polish — hypertext table is the centerpiece | The table IS the contract — both sides see it |
| 9 | Multi-scenario testing — all 3 seed contracts work | Camera, steel, tablet all verify correctly |
| 10 | Steve Jobs review — would he ship this? | Scrutinize every pixel, every interaction, every word |

## Quality Bar

Before any iteration is marked complete:
- [ ] A factory manager could use it without reading documentation
- [ ] It looks like a Stripe/Linear-quality product, not a prototype
- [ ] The data table renders correctly with 40+ rows
- [ ] Pass/fail is visually obvious (not just text — color, icons)
- [ ] Loading states exist for all async operations
- [ ] Error states exist for all failure modes
- [ ] The page works without JavaScript for core data display

## Measurement

After each iteration, record in `studio/iterations/results.tsv`:
```
iteration	date	feature	build_passes	visual_review	user_clarity	elegance	issues_found	time_spent
```
