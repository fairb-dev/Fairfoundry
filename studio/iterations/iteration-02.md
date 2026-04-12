# Iteration 2: Contract Detail + CSV Table + Hypertext Verification

## Scope
Build the contract detail page with tabbed navigation, CSV data table rendering, ERS criteria display, column-criteria linking view, and the verification hypertext table — the centerpiece of the product.

## Acceptance Test
- Click a contract card → see contract detail with tabs
- Log tab: see the CSV data as an interactive table with column role badges
- ERS tab: see acceptance criteria as cards
- Link tab: see which columns are linked to which criteria
- Sandbox tab: see the hypertext table with pass/fail per cell (green ✓ / red ✗)
- Summary stats: total units, pass rate, failure distribution

## Design Decisions (Steve Jobs scrutiny)
- The hypertext table is THE product — it must be beautiful, not just functional
- Column headers show three lines: name, limit, source ref
- Pass/fail uses color AND icon (accessible to colorblind users)
- Failing cells are subtly highlighted, not screaming red
- Summary bar uses Stripe-style stat cards
- No configuration visible by default — data first
- Tab navigation inspired by Linear (clean, minimal, keyboard-navigable)

## Key UX Research Insights to Apply
- Data-first: show the table immediately, criteria overlay on top
- Progressive disclosure: click a failing cell to see detail popover
- Living document feel: the table reads like a report, not a settings page
- Stripe summary cards for stats (number + label + trend)
