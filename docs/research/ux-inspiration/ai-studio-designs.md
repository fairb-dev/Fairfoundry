# AI Studio & Developer Tool UX Research
## Design Patterns for the Fairbuild Contract Builder Studio

*Research conducted April 2026*

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Google AI Studio](#google-ai-studio)
3. [Anthropic Console / Claude Workbench](#anthropic-console--claude-workbench)
4. [OpenAI Playground / Platform](#openai-playground--platform)
5. [Vercel v0](#vercel-v0)
6. [Retool](#retool)
7. [Airtable / Notion Databases](#airtable--notion-databases)
8. [Stripe Dashboard](#stripe-dashboard)
9. [Figma](#figma)
10. [Linear](#linear)
11. [dbt Cloud](#dbt-cloud)
12. [CSV Upload & Data Import UX Patterns](#csv-upload--data-import-ux-patterns)
13. [Manufacturing Quality Dashboards](#manufacturing-quality-dashboards)
14. [Synthesis: What to Steal vs. What to Avoid](#synthesis-what-to-steal-vs-what-to-avoid)
15. [Fairbuild Contract Builder Studio: Recommended Design](#fairbuild-contract-builder-studio-recommended-design)

---

## Executive Summary

After analyzing 10 major products and researching CSV import patterns and manufacturing dashboards, the clearest signal is this: **the best tools make complex workflows feel like filling out a smart form, not configuring a system**. The Fairbuild Contract Builder Studio should feel closer to Stripe's payment detail page (clean, confident, decisive) and Notion's database views (flexible but not overwhelming) than to any AI playground (too developer-focused) or Retool (too builder-focused).

### The Three Personas and What They Need

| Persona | Mental Model | Needs | Hates |
|---------|-------------|-------|-------|
| Factory Manager | "I upload my data and see if we passed" | Drag-and-drop upload, instant pass/fail, no jargon | Configuration screens, developer terminology, anything requiring training |
| OEM Quality Engineer | "I define the rules and check compliance" | Column mapping, threshold configuration, detailed drill-down | Inflexible schemas, no export, inability to customize rules |
| Executive | "I need the answer in 3 seconds" | Dashboard cards, trend lines, red/green status | Scrolling, pagination, anything that requires clicking more than twice |

### Top 5 Design Principles (Derived from Research)

1. **Progressive disclosure everywhere** -- Simple by default, detailed on demand (Figma's "Minimize UI", Linear's hover-to-peek, Notion's toggleable properties)
2. **Data-first, configuration-second** -- Show the uploaded data immediately, then let users refine (v0's instant preview, Google AI Studio's streaming output)
3. **Living document, not settings page** -- The contract should read like a document with inline status indicators, not a form with 40 fields (Stripe's payment detail page, Linear's issue detail)
4. **Upload should feel like magic** -- The CSV import flow must be: drop file, auto-detect columns, show preview, highlight problems, one click to validate (best practices from Flatfile/CSVBox/OneSchema patterns)
5. **Stripe-grade visual confidence** -- Shimmer loading states, sparkline trends, color-coded status chips, generous whitespace (Stripe's dashboard card pattern)

---

## Google AI Studio

**URL**: https://aistudio.google.com

### Layout Structure

Google AI Studio uses a **three-panel layout** optimized for iterative AI development:

```
+------------------+---------------------------+------------------+
| LEFT SIDEBAR     | CENTER WORKSPACE          | RIGHT PANEL      |
| (Navigation)     | (Prompt + Output)         | (Settings)       |
|                  |                           |                  |
| - Chat           | +-- System Instructions --+| Model Selection  |
| - Realtime       | | (collapsible box)       || Temperature      |
| - Starter Apps   | +-------------------------+| Token Limit      |
| - Prompt Gallery | | Chat Input              || Safety Filters   |
|                  | | "Type something..."     ||                  |
|                  | +-------------------------+| --- Tools ---    |
|                  | | Output Pane             || Structured Output|
|                  | | (streaming responses)   || Function Calling |
|                  | | Token count display     || Code Execution   |
|                  | +-------------------------+| Grounding        |
|                  |                           |                  |
|                  | [Get Code] button top-right|                  |
+------------------+---------------------------+------------------+
```

### Data Input Patterns

- **System Instructions**: Collapsible box at the top of the workspace. Defines role/context. Feels like a "brief" rather than configuration.
- **Chat Input**: Simple "Type something..." text field. Clean, inviting, non-technical.
- **File Upload**: Bottom-right media menu supports files from Google Drive, image uploads, audio recording, YouTube videos, and live camera/screen sharing. The breadth of input types is impressive.
- **Structured Output Toggle**: In the right settings panel, toggling "Structured output" forces the model to produce JSON/XML. The response schema works "like a blueprint for model responses" -- you define the shape, and the output conforms.

### Results Display

- Responses stream in conversationally with regenerate options
- Token count tracking is visible but unobtrusive
- "Get code" button at top-right exports to Python/Node.js/etc. for API integration
- Every message between user and model is included in the prompt context

### Progressive Disclosure

- System Instructions box is **collapsible** -- most users ignore it, power users expand it
- Advanced tools (structured output, function calling, code execution, grounding) are toggles hidden in the right panel
- Safety filters are adjustable but defaulted to reasonable levels
- The Prompt Gallery provides starting templates so users never face a blank page

### What Feels Premium

- Clean sans-serif typography with generous whitespace
- Neutral backgrounds with accent colors only for interactive elements
- Real-time streaming creates a sense of responsiveness
- The "Get code" button bridges prototyping and production seamlessly

### What a Manufacturing Executive Would Love/Hate

- **Love**: The simplicity of "type and get a response" -- zero learning curve for the chat mode
- **Love**: File upload supporting multiple formats -- they could imagine uploading a CSV
- **Hate**: The right panel with Temperature/Top-K/Top-P sliders is meaningless jargon
- **Hate**: No visual representation of data structure -- everything is text-in, text-out
- **Steal**: The collapsible System Instructions pattern for contract "rules" definition
- **Steal**: The structured output toggle concept -- "turn on strict validation" as a simple switch

---

## Anthropic Console / Claude Workbench

**URL**: https://console.anthropic.com (redirects to https://platform.claude.com)

### Layout Structure

The Anthropic Console is a developer-focused workspace with clear separation between creation and evaluation:

```
+------------------+---------------------------+------------------+
| LEFT SIDEBAR     | CENTER WORKSPACE          | RIGHT PANEL      |
| (Navigation)     | (Prompt Development)      | (Configuration)  |
|                  |                           |                  |
| - Workbench      | +-- System Prompt --------+| Model Selection  |
| - Evaluations    | | (expandable text area)  || Temperature      |
| - API Keys       | +-------------------------+| Max Tokens       |
| - Settings       | | User Message            ||                  |
| - Billing        | | {{VARIABLE_NAME}}       || --- Tools ---    |
|                  | | (with variable slots)   || Function defs    |
|                  | +-------------------------+|                  |
|                  | | Assistant Response      ||                  |
|                  | | (streaming output)      ||                  |
|                  | +-------------------------+|                  |
|                  |                           |                  |
|                  | [Generate] [Improve] btns |                  |
+------------------+---------------------------+------------------+
```

### Data Input Patterns

- **System Prompt**: Dedicated expandable text area at the top -- this is where "rules" live
- **User Messages**: Support `{{VARIABLE_NAME}}` placeholders for dynamic content, making prompts reusable
- **Assistant Prefill**: You can pre-fill the assistant's response to guide output format -- a powerful pattern for ensuring structured responses
- **Examples Section**: Instead of pasting examples inline (messy), you add them in a dedicated section with input/output pairs

### Key Tools and Features

- **Prompt Generator**: Describe a task in plain language, and it generates a structured, production-ready prompt using XML tags for section delineation and chain-of-thought reasoning
- **Prompt Improver**: Takes existing prompts and adds reasoning sections, restructures for clarity, adds pre-fill responses, and introduces error handling
- **Evaluations**: Upload real-world test cases or generate AI test cases. Compare prompts side-by-side. Rate outputs on a 5-point scale. An optional "ideal output" column benchmarks performance.
- **Tool Use Configuration**: Define function schemas that the model can call -- structured JSON definitions for external integrations

### Results Display

- Streaming output in the assistant response area
- Previous versions shown alongside current results for iterative comparison
- Evaluation results in tabular format with side-by-side prompt comparison

### Progressive Disclosure

- The Workbench starts with just a system prompt and user message -- the minimum viable interaction
- Variable slots (`{{VARIABLE}}`) appear only when you type the syntax
- Tool definitions are hidden behind an "Add tool" action
- Evaluations are a separate tab, not cluttering the main workspace

### What Feels Premium

- The platform uses a clean Next.js architecture with Framer Motion animations
- Theme system with `data-theme="claude"` supporting light/dark modes
- Workspace concept allows team collaboration with shared prompts and evaluations
- The "Generate a Prompt" feature feels like having an expert assistant

### What a Manufacturing Executive Would Love/Hate

- **Love**: The evaluation feature -- "upload test data, see pass/fail" is close to the contract verification mental model
- **Love**: Variables (`{{LOT_NUMBER}}`, `{{TEMPERATURE}}`) could map to production data fields
- **Hate**: Everything is text-based -- no visual data representation, no tables, no charts
- **Hate**: "System prompt" and "assistant prefill" are developer jargon
- **Steal**: The evaluation pattern -- upload test cases, compare against criteria, rate outputs
- **Steal**: The variable system -- define a contract template with `{{MEASUREMENT}}` slots that get filled from CSV data
- **Steal**: The "Generate" concept -- describe what you want to verify in plain language, and the system generates the verification rules

---

## OpenAI Playground / Platform

**URL**: https://platform.openai.com/playground

### Layout Structure

The OpenAI Playground uses a three-section layout that recently underwent a controversial redesign:

```
+------------------+---------------------------+------------------+
| LEFT PANEL       | CENTER WORKSPACE          | RIGHT PANEL      |
| (System Message) | (Chat / Complete)         | (Model Controls) |
|                  |                           |                  |
| SYSTEM area:     | +-- Conversation ---------+| Model Dropdown   |
| "You are a       | | User: ...               || Temperature      |
| helpful          | | Assistant: ...           || Max Tokens       |
| assistant"       | | (streaming responses)   || Top P            |
|                  | +-------------------------+| Freq. Penalty    |
| [Cannot be       |                           | Pres. Penalty    |
|  collapsed]      | [View Code] button        | Response Format  |
|                  |                           |                  |
+------------------+---------------------------+------------------+
     MODE SELECTOR: [Assistants] [Chat] [Complete]  (top-left)
```

### Critical UX Lessons (What Went Wrong)

The 2025 UI update drew significant community backlash and provides a valuable case study in **what NOT to do**:

1. **Configuration panel expanded to ~50% of screen space** -- the chat window became cramped, code samples wrapped and lost readability
2. **Assistant message input was removed** -- users could no longer simulate flexible conversations
3. **Independent message addition was eliminated** -- messages auto-submitted, breaking testing workflows
4. **Quick clear button vanished** -- no one-click reset for fresh experiments
5. **Left sidebar cannot be minimized** -- further constraining the response area
6. **Return key behavior changed** -- pressing Enter now submits instead of creating new lines (Shift+Enter required)
7. **Edit/delete buttons only appear on hover** -- discoverable actions became hidden

**Key Lesson for Fairbuild**: Configuration panels must be collapsible. The main content (data, results) must always have priority screen real estate. Never take away features users rely on.

### Data Input Patterns

- **Three Modes**: Assistants (tools + file search), Chat (conversational), Complete (single-prompt)
- **System Message**: Dedicated left-panel area for defining behavior -- "You are a helpful assistant" can be customized
- **Model Selection**: Dropdown with GPT-4o-mini through GPT-4 variants with context length indicators (16K, 32K, 128K)
- **Presets**: Saveable and shareable configurations of model + system message + tools

### Results Display

- Streaming chat-style responses in the center panel
- "View Code" button exports to Python/Node.js/JSON -- bridges playground to production
- Token usage tracking

### What a Manufacturing Executive Would Love/Hate

- **Love**: The "Presets" concept -- save a verification configuration and reuse it across products
- **Hate**: The cramped chat window after the redesign -- data needs room to breathe
- **Hate**: Hover-only edit/delete buttons -- actions should be visible, not hidden
- **Steal**: The "View Code" export pattern -- export a contract as a shareable specification
- **Avoid**: The configuration-panel-dominates-content mistake -- the uploaded data and results must always be the star

---

## Vercel v0

**URL**: https://v0.dev (now https://v0.app)

### Layout Structure

v0 follows a **prompt-then-preview** workflow: "Prompt. Build. Publish."

```
+----------------------------------------------------------+
| HEADER: [Templates] [Resources] [Enterprise] [Pricing]   |
+----------------------------------------------------------+
| +-- PROMPT INPUT ------------------------------------+   |
| | Describe what you want...                          |   |
| | [Upload mockup/screenshot]                         |   |
| +----------------------------------------------------+   |
|                                                          |
| +-- PREVIEW CANVAS ----------------------------------+   |
| |                                                    |   |
| |  Live rendered React/Tailwind component            |   |
| |  [Preview] [Code] tabs top-right                   |   |
| |                                                    |   |
| +----------------------------------------------------+   |
|                                                          |
| +-- ITERATION SIDEBAR (appears after generation) ----+   |
| | Previous versions / variants                       |   |
| | Design Mode toggle                                 |   |
| | Click-to-select-and-edit visual controls           |   |
| +----------------------------------------------------+   |
+----------------------------------------------------------+
```

### Key Interaction Patterns

- **Prompt-first**: Users describe what they want in natural language -- no configuration required
- **Instant Preview**: v0 generates a live-rendered React component with Tailwind CSS and shadcn/ui
- **Code/Preview Split**: Toggle between seeing the rendered UI and the underlying code via tabs
- **Design Mode**: Click on any element visually, adjust properties directly (colors, spacing, typography) -- faster for quick visual changes
- **Iteration Loop**: Refine by describing changes in natural language; v0 updates the component in real-time
- **Template Starting Points**: Browse apps, games, landing pages, components, dashboards as starting templates

### Progressive Disclosure

- Start with just a text prompt -- no configuration needed
- Preview tab shows the result before you see any code
- Design Mode adds visual editing capabilities only when toggled on
- Code export and CLI installation are secondary actions

### What Feels Premium

- The instant visual feedback loop -- type a description, see a rendered UI immediately
- shadcn/ui components give outputs a polished, professional appearance
- The "prompt, iterate, publish" flow feels effortless
- Design systems integration allows custom brand consistency

### What a Manufacturing Executive Would Love/Hate

- **Love**: The "describe what you want, see it instantly" paradigm -- imagine: "Create a quality report for PCB assembly batch #4521"
- **Love**: Visual preview before committing -- see the contract before finalizing
- **Hate**: Still fundamentally a code generation tool -- the output is React components, not a living document
- **Steal**: The prompt-first entry point -- the first thing users see should be "Describe your quality requirements" or "Upload your production data"
- **Steal**: The instant preview concept -- show a formatted, visual representation of the contract immediately after data upload
- **Steal**: The iteration loop -- "This threshold should be 95%, not 90%" as a natural-language refinement

---

## Retool

**URL**: https://retool.com

### Layout Structure

Retool is a drag-and-drop internal tool builder with a canvas-based editor:

```
+------------------+---------------------------+------------------+
| LEFT PANEL       | CENTER CANVAS             | RIGHT PANEL      |
| (Component       | (Drag-drop workspace)     | (Properties      |
|  Palette)        |                           |  Inspector)      |
|                  | +-- Layout Area ----------+|                  |
| - Table          | |                         || Component Props  |
| - Form           | | [Table Component]       || Data Source      |
| - Chart          | | [Form Component]        || Validation Rules |
| - Button         | | [Chart Component]       || Event Handlers   |
| - Container      | |                         || Styling          |
| - Text           | +-------------------------+|                  |
| - Modal          |                           |                  |
| - ...50+ comps   | +-- Query Editor ---------+|                  |
|                  | | SQL / API / JS          ||                  |
|                  | +-------------------------+|                  |
+------------------+---------------------------+------------------+
```

### Table Component (Most Relevant to Fairbuild)

The Table is Retool's most-used component and offers patterns directly applicable to quality data:

- **Inline Editing**: Choose which columns users can edit; set validation rules per column to maintain data integrity
- **Column Types**: Text fields, numeric values, dropdowns (single/multi-select), checkboxes, toggles, date pickers, file uploads, rating inputs
- **Validation Pipeline**: JavaScript query validates data before database operations -- validation, conditional execution, persistence
- **Save Action**: Configurable trigger that persists changes to the database on edit
- **Add Row**: Toolbar button enables adding new records directly
- **Data Filtering**: Limit displayed data to only relevant records using queries

### Layout Patterns Relevant to Fairbuild

1. **Side Panel Focus** (most common): Table on the left, detail container on the right. Select a row to populate the adjacent panel with charts, timelines, nested data. This is the pattern for "select a batch, see its quality details."

2. **Full-Width Table**: Entire screen width for spreadsheet-style comparison. Best for limited columns and simple row actions. Works for "all batches at a glance."

3. **Wizard Components**: Multi-step flows with cascading logic. Best for guided processes like "Upload CSV > Map Columns > Set Thresholds > Review > Deploy Contract."

4. **Modals for High-Risk Actions**: Pre-fill values, require confirmation, protect against accidental changes. Use for "Approve Contract" or "Reject Batch."

5. **Tabbed Containers**: Different views for different roles -- "Overview" for executives, "Detailed View" for engineers, "Audit Trail" for compliance.

### Best Practices (from Retool community)

- Think of data in terms of **primary, secondary, tertiary** hierarchy -- not everything deserves equal visual weight
- Use status indicators (color chips) for quick trend overview of rows
- **Avoid horizontal scrolling** -- if the table is too wide, use a side panel for overflow data
- **Hide empty components** -- don't show empty charts or panels when there's no data
- **Limit inline editing** -- inline editing with horizontal scroll and many clicks creates bad UX

### What a Manufacturing Executive Would Love/Hate

- **Love**: The table component with inline editing -- feels like a smarter Excel
- **Love**: Side panel pattern -- click a batch, see all the details without leaving the page
- **Love**: Status indicators and color coding -- instant visual pass/fail
- **Hate**: The drag-and-drop builder is for developers building tools, not end users using them
- **Hate**: The query editor at the bottom requires SQL knowledge
- **Steal**: The table + side panel pattern for batch inspection
- **Steal**: Column-level validation rules and data type enforcement
- **Steal**: The wizard pattern for the initial contract setup flow
- **Avoid**: Exposing any builder/configuration complexity to end users

---

## Airtable / Notion Databases

### Airtable Interface Designer

**URL**: https://airtable.com

Airtable's Interface Designer is the crucial **UX layer over the raw database** -- it smooths over complexity so an executive can interact with a visual dashboard without ever seeing the raw grid.

#### Layout Types

| Layout | Best For | Description |
|--------|----------|-------------|
| **Table** | Full data with grid view | Rows + columns with adjustable height, grouping, field visibility, color |
| **List** | Simple record browsing | Clean list with primary field prominent |
| **Gallery** | Visual items (photos, designs) | Card grid with cover images |
| **Kanban** | Status-based workflows | Drag-and-drop columns by status (Pass/Fail/Pending) |
| **Calendar** | Date-based records | Traditional calendar with date-plotted items |
| **Timeline** | Gantt-style planning | Duration-based horizontal bars |
| **Form** | Data collection | Structured input form that creates records |
| **Dashboard** | Executive overview | Charts, summaries, KPIs |
| **Record Detail** | Single-record deep dive | All fields for one record with rich formatting |
| **Record Review** | Approval workflows | One-at-a-time review with approve/reject actions |

#### Configuration Properties

Each interface element has 4 configuration buckets:
1. **Data**: Which table/view to pull from
2. **Filters**: Which records to show
3. **Appearance**: How it looks (card size, colors, visible fields)
4. **User Actions**: What users can do (edit, add, delete)

#### Progressive Disclosure

- The Interface Designer is a separate layer from the Base (raw data)
- Non-technical users only interact with the Interface -- they never see formulas, linked records, or automations
- Properties can be shown or hidden per view -- show "Pass/Fail" to executives, show "Measurement Values" to engineers
- Grouping collapses related records under headers

#### What to Steal for Fairbuild

- **The interface-over-database concept** -- the contract is the interface, the raw data stays hidden
- **Kanban for quality status** -- columns for Pass/Fail/Pending Review/Rework
- **Record Review layout** -- one-at-a-time batch review with approve/reject
- **Form view for data input** -- structured, guided data entry that creates records
- **Dashboard view for executives** -- KPI cards + charts with zero configuration

### Notion Database Views

**URL**: https://notion.com

Notion's database views demonstrate how the same data can be presented in radically different ways depending on the user's needs.

#### View Types with Quality Data Applications

| View | Quality Data Application | Key Feature |
|------|--------------------------|-------------|
| **Table** | Raw measurement data with all columns | Familiar spreadsheet feel, toggle property visibility |
| **Board** | Batch status tracking (Pass/Fail/Pending) | Drag cards between status columns |
| **Timeline** | Production schedule with quality checkpoints | Gantt-style with start/end dates |
| **Calendar** | Inspection due dates | Date-plotted items |
| **Gallery** | Visual inspection photos | Card grid with images |
| **List** | Simple batch listing | Minimalist, clean |
| **Form** | Quality data input | Structured collection |
| **Chart** | Trend analysis (defect rates over time) | Built-in visualization |

#### Property Types Relevant to Manufacturing

- **Number**: Measurements, tolerances, counts
- **Select**: Pass/Fail/Conditional
- **Multi-select**: Defect types, test categories
- **Date**: Inspection dates, production dates
- **Checkbox**: Compliance checklist items
- **Formula**: Calculated fields (yield rate = pass count / total)
- **Relation**: Link batches to products, products to contracts
- **Rollup**: Aggregate linked data (average defect rate across batches)

#### What to Steal for Fairbuild

- **Multiple views of the same data** -- engineers see the table, executives see the dashboard, the factory floor sees the kanban board
- **Property types with built-in validation** -- numbers have min/max, selects have predefined options, dates have calendars
- **Filters, sorts, groups per view** -- each user customizes their view without affecting others
- **The form-to-table pipeline** -- input data via a guided form, see it appear in the table instantly

---

## Stripe Dashboard

**URL**: https://dashboard.stripe.com

### Layout Structure

Stripe's dashboard is the gold standard for presenting financial/transactional data with confidence and clarity:

```
+----------------------------------------------------------+
| HEADER: Logo | Search | Notifications | Account          |
+----------------------------------------------------------+
| LEFT SIDEBAR  | MAIN CONTENT                              |
| (Navigation)  |                                           |
|               | +-- Summary Cards ----------------------+ |
| - Home        | | Revenue  | Charges | Payouts | Disputes| |
| - Payments    | | $X,XXX   | X,XXX   | $X,XXX  | XX     | |
| - Balances    | | +2.3%    | +1.1%   | +0.8%   | -5%    | |
| - Customers   | | [spark]  | [spark] | [spark] | [spark]| |
| - Products    | +------------------------------------------+ |
| - Reports     |                                           |
| - ...         | +-- Activity Feed ----------------------+ |
|               | | Recent payments, refunds, disputes     | |
|               | | Each item: amount, customer, status,   | |
|               | | timestamp                              | |
|               | +------------------------------------------+ |
+----------------------------------------------------------+
```

### Summary Card Pattern

Each card at the top contains exactly 3 elements:
1. **The number** (large, bold) -- the most important information
2. **The trend** (small, colored arrow + percentage) -- context for the number
3. **The sparkline** (tiny inline chart) -- visual trend without taking space

This pattern communicates health at a glance without requiring any interaction.

### Payment Detail Page Pattern

```
+----------------------------------------------------------+
| BREADCRUMB: Payments > py_1234567890                      |
+----------------------------------------------------------+
| +-- Status Banner -----------------------------------+   |
| | [Green Badge] Succeeded    $49.99 USD              |   |
| +----------------------------------------------------+   |
|                                                          |
| +-- Timeline (left) ----+  +-- Details (right) -----+   |
| | Apr 10, 2:14 PM       |  | Payment ID: py_123...  |   |
| | Payment created       |  | Amount: $49.99         |   |
| |                       |  | Fee: $1.75             |   |
| | Apr 10, 2:14 PM       |  | Net: $48.24            |   |
| | Payment succeeded     |  | Customer: john@...     |   |
| |                       |  | Description: ...       |   |
| | [vertical line]       |  | Metadata:              |   |
| |                       |  |   key: value            |   |
| +-----------------------+  +-------------------------+   |
```

### Key Design Patterns

1. **Content-shaped loading placeholders** (shimmer animation): Instead of spinners, Stripe shows content-shaped gray blocks that pulse. This reduces perceived load time by 20-30% compared to spinners. The user sees the *shape* of the data before the data arrives.

2. **Status badges with color coding**: Green (succeeded), Yellow (pending), Red (failed), Gray (canceled). Immediately communicable without reading text.

3. **Timeline/Activity Feed**: Chronological event log on payment detail pages. Each event has a timestamp, action description, and sometimes a link to related resources. This creates an audit trail.

4. **Card-based mobile design**: On the iPhone app, cards slide open with spring animation, background cards shift forward creating layered depth. This teaches interactivity through motion.

5. **100ms tap delay**: A deliberate delay before opening a card gives visual confirmation of the tap target and allows data to pre-load. Prevents disorienting UI flashing.

6. **Contextual actions**: Compact animation-based action menus instead of intrusive native menus. Works elegantly for 2-3 actions per card.

7. **"Dilute to essential"**: The iPhone app was designed as a companion tool with exactly two use cases: morning revenue review and quick customer lookup. This constraint-driven design produced a better experience than trying to replicate the full web dashboard.

### Visual Design Language

- Neutral color palette with bold accent colors only for status and actions
- Generous whitespace creating breathing room between data sections
- Consistent typography hierarchy -- large numbers for KPIs, medium for labels, small for metadata
- Horizontal dividers and section headers create scannable structure

### What a Manufacturing Executive Would Love

- **The summary cards** -- "Show me pass rate, defect count, rework cost, and compliance status in 4 cards at the top"
- **The shimmer loading** -- no spinning wheels, just smooth content appearance
- **The timeline** -- "Show me exactly what happened to this batch: uploaded, validated, 3 failures found, corrected, re-validated, passed"
- **Status badges** -- instant Pass (green) / Fail (red) / Pending (yellow) without reading
- **The constraint-driven mobile design** -- a phone app that shows only what matters

### What to Steal for Fairbuild

- **Summary card pattern with number + trend + sparkline** for contract dashboard
- **Shimmer loading states** everywhere -- never show a spinner
- **Timeline/activity feed** for batch and contract history
- **Status badges** for pass/fail/pending across all views
- **The "dilute to essential" philosophy** for the factory floor view
- **Content-shaped placeholders** during data processing

---

## Figma

**URL**: https://figma.com

### Layout Structure (UI3 Redesign)

Figma's UI3 redesign is a masterclass in giving the canvas center stage while keeping tools accessible:

```
+----------------------------------------------------------+
|                                                          |
| +-- LEFT PANEL ----+  +-- CANVAS ----+  +-- RIGHT ----+ |
| | Layers           |  |              |  | Properties   | |
| | Pages            |  |              |  | (contextual) | |
| | Components       |  |   [Your      |  |              | |
| | Assets           |  |    work      |  | Layout       | |
| |                  |  |    here]     |  | Color        | |
| |                  |  |              |  | Typography   | |
| |                  |  |              |  | Effects      | |
| +------------------+  +--------------+  | Prototype    | |
|                                         +--------------+ |
|                                                          |
| +-- BOTTOM TOOLBAR ----------------------------------+   |
| | Design tools | Shapes | Text | Pen | AI Actions   |   |
| +----------------------------------------------------+   |
+----------------------------------------------------------+
```

### Key Design Decisions

1. **Toolbar moved to bottom**: Freed up canvas space at the top. Design tools, shapes, text, pen, and new AI actions are now at the bottom edge. This is counterintuitive but effective -- it gives the work maximum vertical space.

2. **Properties panel is contextual**: Select nothing and the panel is minimal. Select an object and the panel expands with relevant properties. This is **progressive disclosure at its finest** -- the complexity matches the selection.

3. **Minimize UI feature**: Collapses all side panels for distraction-free work. When you select something on the canvas with UI minimized, the properties panel temporarily opens, then closes when you deselect. This "breathe in, breathe out" pattern is elegant.

4. **Panel resizing**: The properties panel can be resized, which is valuable when working with components that have long property names. This flexibility accommodates different workflows.

5. **Property labels toggle**: New in UI3, you can turn on property labels to make it clearer what each property does. This is progressive disclosure for learning -- beginners turn on labels, experts turn them off.

6. **Dev Mode integration**: Accessible directly from the toolbar, making it easy to switch between design and development modes. The inspect tab shows layout, color, typography, text strings, component properties, styles, and variables.

### Properties Panel Organization

Properties are grouped by category:
- **Layout**: Width, height, position, constraints, auto layout
- **Color**: Fill, stroke, opacity
- **Typography**: Font, size, weight, line height
- **Effects**: Shadows, blur
- **Prototype**: Interactions, transitions

When Auto Layout is enabled, layout properties transform to show alignment, padding, gap, and direction controls. This **contextual transformation** prevents showing irrelevant options.

### What to Steal for Fairbuild

- **Contextual properties panel** -- select a contract rule, see its configuration. Select nothing, see the overview. Never show all configuration at once.
- **Minimize UI pattern** -- a "focus mode" that hides everything except the contract document and pass/fail results
- **Property labels toggle** -- help beginners understand what each threshold means, let experts hide the labels
- **Bottom toolbar concept** -- primary actions (Upload, Validate, Approve) could live at the bottom, keeping the data and results at top
- **Panel resizing** -- let users adjust how much space the contract rules panel takes vs. the data view

---

## Linear

**URL**: https://linear.app

### Layout Structure

Linear uses an **inverted L-shaped navigation** pattern:

```
+----------------------------------------------------------+
| +-- SIDEBAR ------+  +-- MAIN CONTENT ----------------+ |
| |                  |  | +-- HEADER: Filters, Display --+| |
| | [Workspace]      |  | | [Filter] [Group] [Sort]     || |
| |                  |  | +------------------------------+| |
| | My Issues        |  |                                 | |
| | Inbox            |  | +-- LIST VIEW -----------------+| |
| | Triage           |  | | Issue 1  [Status] [Priority] || |
| |                  |  | | Issue 2  [Status] [Priority] || |
| | Projects         |  | | Issue 3  [Status] [Priority] || |
| | Views            |  | |                              || |
| | Teams            |  | | [Hover: Space to peek]       || |
| |                  |  | +------------------------------+| |
| |                  |  |                                 | |
| +------------------+  +---------------------------------+ |
+----------------------------------------------------------+
```

### What Makes Linear Special

1. **Speed as a feature**: Everything is keyboard-accessible. `C` creates an issue, `Cmd+K` opens command menu, `x` selects, `Space` peeks at details, `Esc` goes back. The interface is optimized for power users who never touch the mouse.

2. **Multiple interaction paths**: Every action can be performed via button, keyboard shortcut, context menu, or command palette. This accommodates beginners (buttons) through experts (shortcuts) seamlessly.

3. **Contextual shortcut discovery**: When you hover over an element for a few seconds, a tooltip shows the keyboard shortcut. This teaches without interrupting.

4. **8px spacing scale**: Consistent 8px, 16px, 32px, 64px spacing creates visual harmony. Every component feels like it belongs because the spacing is mathematically consistent.

5. **LCH color space**: Linear uses LCH (Lightness, Chroma, Hue) instead of HSL because LCH is "perceptually uniform" -- colors with identical lightness values actually appear equally light regardless of hue. This creates more harmonious themes.

6. **Three-variable theme system**: Instead of defining 98 individual color variables per theme, Linear uses just base color, accent color, and contrast. This enables automatic high-contrast accessibility themes.

7. **Inter Display for headings, Inter for body**: Adding expression to headings while maintaining readability in body text. The type scale is carefully crafted.

8. **Reduced chrome philosophy**: Moving away from saturated primary colors toward neutral, timeless tones. Less blue, more gray. The content (issues, projects) takes center stage, not the UI around it.

9. **Multiple view types**: List, Board, Timeline, Split, Fullscreen -- each with integrated headers for filters and display options.

### The Redesign Process

The entire UI3 redesign was completed in approximately 6 weeks:
- Hundreds of screens explored daily during concept phase
- Two designers worked in parallel on separate components
- Daily designer-engineer afternoon coding sessions
- Internal dogfooding via feature flags before public release
- Stress tests focused on: environment (macOS/Windows/browser), appearance (light/dark/custom themes), hierarchy (different view types)

### What a Manufacturing Executive Would Love/Hate

- **Love**: The speed -- everything responds instantly, no waiting
- **Love**: The clean aesthetic -- sophisticated without being sterile
- **Love**: Peek-on-hover -- glance at batch details without leaving the list
- **Hate**: The keyboard-first philosophy assumes technical users
- **Hate**: The minimal chrome means fewer visual anchors for navigation
- **Steal**: The 8px spacing system for visual harmony
- **Steal**: The command palette (`Cmd+K`) for quick navigation
- **Steal**: The hover-to-peek pattern for batch/contract details
- **Steal**: The reduced-chrome, content-first philosophy
- **Steal**: Multiple interaction paths (click, shortcut, command palette, context menu)
- **Steal**: The LCH color system for generating accessible, harmonious themes

---

## dbt Cloud

**URL**: https://cloud.getdbt.com

### Layout Structure (Studio IDE)

dbt Cloud's IDE is the most complex tool in this analysis, but relevant because it handles the "code + results + lineage" pattern that maps to "rules + data + dependencies":

```
+----------------------------------------------------------+
| COMMAND PALETTE (Cmd+P): Go to File, Run Commands, Search|
+----------------------------------------------------------+
| +-- LEFT PANEL -----+  +-- CENTER EDITOR -----+         |
| |                    |  |                       |         |
| | Git Repository     |  | [Tab 1] [Tab 2] ...  |         |
| | Branch: main       |  |                       |         |
| |                    |  | SELECT *              |         |
| | [Docs] button      |  | FROM orders           |         |
| |                    |  | WHERE status = 'pass' |         |
| | Version Control    |  |                       |         |
| | > Changes (M, A, D)|  | [Minimap] (right)     |         |
| |                    |  |                       |         |
| | File Explorer      |  +-- CONSOLE TABS ------+         |
| | > models/          |  | [Results] [Compiled]  |         |
| | > tests/           |  | [Quality] [Lineage]   |         |
| | > seeds/           |  | [Problems] [Commands] |         |
| |                    |  |                       |         |
| +--------------------+  | Tabular results with  |         |
|                         | 500-row default limit  |         |
|                         +-----------------------+         |
+----------------------------------------------------------+
| STATUS BAR: Warehouse connection | dbt version | Errors  |
+----------------------------------------------------------+
```

### Console Tabs (Bottom Panel)

This tabbed bottom panel is the most interesting pattern for Fairbuild:

| Tab | Content | Fairbuild Equivalent |
|-----|---------|---------------------|
| **Results** | Tabular preview of SQL output (500-row default) | Data preview after CSV upload |
| **Compiled Code** | Generated SQL after variable resolution | Generated verification rules |
| **Code Quality** | Linter findings (SQLFluff) | Data quality warnings |
| **Lineage** | DAG showing model dependencies (2+model+2 nodes) | Contract dependency chain |
| **Problems** | Issues preventing proper execution | Validation errors |
| **Commands** | Recently executed commands with results | Verification run history |
| **Markdown Preview** | Rendered documentation | Contract document preview |
| **CSV Preview** | Seed file data in table format with live updates | **Direct match** -- uploaded CSV preview |

### Key Interaction Patterns

1. **Preview Button**: Runs SQL in the active editor regardless of save state -- users see results before committing. This maps to "preview validation results before deploying the contract."

2. **Build Button**: Quick access to build, test, and run with dependency options. Maps to "run all verifications for this contract."

3. **Lint Button**: Checks syntax and style issues. Maps to "check data quality before verification."

4. **dbt Copilot**: AI assistant that generates documentation, tests, and semantic models. Maps to "AI-generated verification rules from uploaded data."

5. **Invocation History Drawer**: Lists previous runs with command, branch, status, elapsed time. Each run expandable to show node-level results filterable by Pass/Warn/Error/Skip/Queued. **This is exactly the pattern for verification run history.**

6. **Lineage/DAG tab**: Visualizes dependencies between models. Double-click a node to open the file. Maps to "show me which contracts depend on this data source."

### What to Steal for Fairbuild

- **The tabbed bottom panel** -- Results, Quality, Lineage, History as tabs under the main content
- **Preview before commit** -- let users preview pass/fail results before deploying the contract
- **Invocation History with node-level status** -- show each verification step's Pass/Warn/Error/Skip status
- **CSV Preview tab** -- direct match for uploaded production data
- **The file change indicators** (M for modified, A for added, D for deleted) -- show contract change status
- **Lineage DAG** -- visualize relationships between contracts, data sources, and products

---

## CSV Upload & Data Import UX Patterns

### The Five-Stage Pipeline

The best CSV import experiences follow this flow:

```
[1. PRE-IMPORT] --> [2. UPLOAD] --> [3. MAPPING] --> [4. VALIDATION] --> [5. CONFIRMATION]
```

### Stage 1: Pre-Import (Set Expectations)

- Show allowed file types, size limits, and required columns (under 100 words)
- Provide a **downloadable template CSV** with sample data showing expected values
- For manufacturing: clearly state required fields (lot numbers, test results, timestamps) and acceptable formats
- **Fairbuild must do this**: Before the user uploads, show them exactly what columns they need

### Stage 2: Upload (Multiple Input Methods)

- **Drag-and-drop** with dashed border visual affordance (users recognize this instantly)
- **Click-to-browse** as fallback
- **Direct paste** for small datasets
- Show filename, size, and first few rows as immediate preview
- Progress bar with row count for large files
- **Critical**: People notice immediately when they uploaded the wrong file -- the preview catches this

### Stage 3: Column Mapping (The Make-or-Break Step)

```
+-- YOUR CSV COLUMNS -------+  +-- CONTRACT FIELDS --------+
|                            |  |                            |
| [Temperature (sample: 45)] |->| [Temperature Reading]      |
| [Lot_ID (sample: A-4521)] |->| [Lot Number]               |
| [Status (sample: PASS)]   |->| [Quality Status]           |
| [Date (sample: 2026-04)]  |->| [Inspection Date]          |
|                            |  |                            |
| Confidence: [HIGH] [MED]  |  | [LOW] [MANUAL]             |
+----------------------------+  +----------------------------+
```

- **Auto-match** columns by name similarity (e.g., "Lot_ID" -> "Lot Number")
- Show **sample values** next to each column so users can verify the match visually
- Show **confidence indicators** (green = high confidence auto-match, yellow = low confidence, red = manual mapping required)
- Allow **manual override** for every match
- Handle variations: "Lot ID" vs "Batch Number" vs "lot_id" should all match

### Stage 4: Validation (Where Magic Happens)

This is where Fairbuild can differentiate. Best practices:

- **Color coding**: Green (valid), orange (warning), red (error) per row
- **Inline editing**: Fix problems directly in the validation view -- never force re-upload
- **Error filtering**: Toggle to show only problematic rows
- **Specific, actionable messages**: "Row 23: Temperature 450C exceeds maximum 400C" -- not "Invalid data"
- **Never reject the entire file** for one bad row -- partial import with error summary
- For quality data: highlight out-of-range measurements, missing certifications, timestamp inconsistencies

### Stage 5: Confirmation (The Moment of Truth)

- Summary: "247 rows ready to import, 3 warnings, 0 errors"
- Clear "Import" button with preview of what will happen
- Post-import: immediate redirect to the data view with the new data highlighted

### What Makes Import Feel Magical vs. Frustrating

| Magical | Frustrating |
|---------|-------------|
| Drop file, see data in 2 seconds | Upload, wait, get a generic error |
| Auto-detect column types and mapping | Manually specify every column |
| Fix errors inline without re-uploading | "Please correct and re-upload" |
| Template download with sample data | "Refer to documentation for format" |
| Specific error: "Row 5, Temperature: 999 exceeds max 400" | "Validation failed" |
| Partial import with error report | All-or-nothing rejection |
| Progress bar with row count | Spinning wheel with no progress |

---

## Manufacturing Quality Dashboards

### Essential Metrics (from industry research)

| Metric | Visualization | Description |
|--------|--------------|-------------|
| **First Pass Yield (FPY)** | Large number + trend | % of products passing without rework |
| **Defect Rate** | Line graph over time | Defects per unit over 30-day window |
| **OEE Score** | Speedometer gauge | Overall Equipment Effectiveness |
| **Scrap Rate** | Bar chart (30-day comparison) | Wasted material percentage |
| **Rework Cost** | Dollar amount + trend | Cost of fixing defective items |
| **Compliance Status** | Green/Yellow/Red badge | Are we meeting contractual requirements? |

### Dashboard Design Trends for Manufacturing (2025-2026)

1. **Minimalist data visualization**: Focused visuals that tell one story at a time replace complex, crowded charts
2. **Widget-based layout**: Drag-and-drop dashboard cards that users can rearrange to fit their priorities
3. **Real-time data updates**: Live data feeds with alerts for downtime or quality issues
4. **Drill-down capabilities**: Click from plant -> line -> shift -> machine level
5. **Role-based views**: Operators see equipment status, supervisors see shift metrics, executives see P&L impact

### What to Steal for Fairbuild

- **FPY as the hero metric** -- the first number users see when they open a contract
- **Speedometer gauges for OEE** -- visual, intuitive, requires no data literacy
- **30-day trend bars** -- context for whether things are improving or declining
- **Drill-down from summary to detail** -- click the FPY number to see which batches failed
- **Role-based views** -- factory manager sees different data than the OEM quality engineer

---

## Synthesis: What to Steal vs. What to Avoid

### Patterns to Steal

| Pattern | Source | Application in Fairbuild |
|---------|--------|-------------------------|
| Summary cards (number + trend + sparkline) | Stripe | Contract dashboard header |
| Shimmer loading states | Stripe | Every data loading moment |
| Timeline/activity feed | Stripe | Batch and contract history |
| Status badges (color-coded) | Stripe, Linear | Pass/Fail/Pending everywhere |
| Collapsible System Instructions | Google AI Studio | Contract rules definition area |
| Structured output toggle | Google AI Studio | "Strict validation mode" switch |
| Evaluation with test cases | Anthropic Console | Contract test suite |
| Variable templates | Anthropic Console | Contract templates with `{{MEASUREMENT}}` slots |
| Prompt-first entry point | v0 | "Describe your quality requirements" |
| Instant preview | v0 | Show formatted contract immediately |
| Table + side panel layout | Retool | Batch list + detail view |
| Wizard for guided setup | Retool | Contract creation flow |
| Column validation rules | Retool | Data type enforcement |
| Multiple views of same data | Airtable, Notion | Engineer table vs. executive dashboard |
| Kanban for status workflows | Airtable, Notion | Pass/Fail/Pending board |
| Record review layout | Airtable | One-at-a-time batch approval |
| Form view for data entry | Airtable, Notion | Guided quality data input |
| Property types with validation | Notion | Number ranges, select options, checkboxes |
| Contextual properties panel | Figma | Select a rule to configure it |
| Minimize UI / focus mode | Figma | Hide everything except contract + results |
| Bottom toolbar for actions | Figma | Upload, Validate, Approve at the bottom |
| Panel resizing | Figma | Adjust data view vs. rules panel width |
| 8px spacing grid | Linear | Visual harmony throughout |
| Hover-to-peek | Linear | Glance at batch details from the list |
| Command palette | Linear | Quick navigation (`Cmd+K`) |
| Reduced chrome, content-first | Linear | The data is the interface |
| Tabbed bottom panel | dbt Cloud | Results, Quality, Lineage, History |
| Preview before commit | dbt Cloud | Preview pass/fail before deploying contract |
| Invocation history with status | dbt Cloud | Verification run history |
| CSV Preview tab | dbt Cloud | Uploaded data preview |
| 5-stage CSV import pipeline | Import UX research | Upload, Map, Validate, Confirm |
| Auto-column-mapping with confidence | Import UX research | Smart column detection |
| Inline error correction | Import UX research | Fix data without re-uploading |
| FPY as hero metric | Manufacturing dashboards | First Pass Yield front and center |

### Patterns to Avoid

| Anti-Pattern | Source | Why It Fails for Fairbuild |
|--------------|--------|---------------------------|
| Configuration panel > 30% screen width | OpenAI Playground | Data and results must be the star, not settings |
| Hover-only edit/delete buttons | OpenAI Playground | Actions should be visible, especially for non-technical users |
| Enter-to-submit (no newline) | OpenAI Playground | Unexpected behavior frustrates users |
| Non-collapsible panels | OpenAI Playground | Users must be able to reclaim screen space |
| Developer jargon (temperature, top-p) | All AI studios | "Confidence threshold" not "temperature" |
| Text-only output | AI studios | Manufacturing data needs tables, charts, badges |
| Drag-and-drop builder exposed to end users | Retool | End users use the tool, they don't build it |
| SQL/query editor visible to non-developers | dbt Cloud, Retool | Hide the implementation, show the results |
| Horizontal scrolling tables | Retool community | Use side panels for overflow data |
| All-or-nothing CSV rejection | Import UX research | One bad row should not reject 10,000 good ones |
| Generic error messages | Import UX research | "Validation failed" is useless -- say what and where |
| Spinner-only loading | General | Use content-shaped shimmer placeholders instead |
| Feature-flag-gated basic functionality | General | Core features must be available without upgrades |

---

## Fairbuild Contract Builder Studio: Recommended Design

### Overall Layout

Based on all research, the recommended layout is a **three-zone adaptive design** that changes based on workflow stage:

#### Stage 1: Upload & Configure (Wizard Mode)

```
+----------------------------------------------------------+
| FAIRBUILD STUDIO     [Contract: PCB Assembly QA v2.1]    |
+----------------------------------------------------------+
|                                                          |
|  STEP [1] Upload  >  [2] Map  >  [3] Rules  >  [4] Go  |
|                                                          |
|  +-- MAIN AREA (80% width) -------------------------+   |
|  |                                                    |   |
|  |  +-- DROP ZONE (large, inviting) ---------------+ |   |
|  |  |                                               | |   |
|  |  |     Drop your CSV here                        | |   |
|  |  |     or click to browse                        | |   |
|  |  |                                               | |   |
|  |  |  Accepted: .csv, .xlsx, .json                 | |   |
|  |  |  [Download template]                          | |   |
|  |  +-----------------------------------------------+ |   |
|  |                                                    |   |
|  +----------------------------------------------------+   |
|                                                          |
+----------------------------------------------------------+
```

#### Stage 2: Data View & Contract (Working Mode)

```
+----------------------------------------------------------+
| FAIRBUILD STUDIO     [Contract: PCB Assembly QA v2.1]    |
+----------------------------------------------------------+
| +-- SIDEBAR (collapsible) --+  +-- MAIN CONTENT ------+ |
| |                            |  |                       | |
| | CONTRACT                   |  | +-- DATA TABLE -----+ | |
| | > Summary                  |  | | Lot | Temp | Pass  | | |
| | > Rules (5)                |  | | A01 | 45.2 | [OK]  | | |
| | > Thresholds               |  | | A02 | 47.1 | [OK]  | | |
| |                            |  | | A03 | 52.8 | [!!]  | | |
| | DATA                       |  | | A04 | 44.9 | [OK]  | | |
| | > Uploaded Files (2)       |  | +-------------------+ | |
| | > Column Mapping           |  |                       | |
| |                            |  | +-- TABS -----------+ | |
| | HISTORY                    |  | | [Results] [Quality] | |
| | > Run #3 (Pass)           |  | | [Timeline] [Export] | |
| | > Run #2 (Fail)           |  | |                     | |
| | > Run #1 (Pass)           |  | | 247/250 passed      | |
| |                            |  | | 3 warnings          | |
| +----------------------------+  | +-------------------+ | |
|                                 +-----------------------+ |
+----------------------------------------------------------+
| [Upload New Data]  [Run Verification]  [Approve Contract]|
+----------------------------------------------------------+
```

#### Stage 3: Dashboard (Executive Mode)

```
+----------------------------------------------------------+
| FAIRBUILD STUDIO     [All Contracts]                     |
+----------------------------------------------------------+
|                                                          |
| +-- SUMMARY CARDS (Stripe-style) --------------------+  |
| | First Pass    | Active       | Pending    | Failed  |  |
| | Yield         | Contracts    | Review     | Today   |  |
| | 97.3%         | 12           | 3          | 1       |  |
| | +0.8% [spark] |              | [!]        | [!!]    |  |
| +----------------------------------------------------+  |
|                                                          |
| +-- CONTRACT LIST (Linear-style) --------------------+  |
| | PCB Assembly QA v2.1    [PASS]  Updated 2h ago     |  |
| | Enclosure Tolerance v1  [PASS]  Updated 1d ago     |  |
| | Battery Safety v3.0     [WARN]  Updated 3d ago     |  |
| | Motor Torque Spec v1.2  [FAIL]  Updated 5m ago  [!]|  |
| +----------------------------------------------------+  |
|                                                          |
| +-- ACTIVITY FEED (Stripe-style) --------------------+  |
| | 2:14 PM  Batch A-4521 passed verification          |  |
| | 1:45 PM  New data uploaded for Motor Torque Spec   |  |
| | 11:30 AM Contract Battery Safety v3.0 updated      |  |
| | 9:00 AM  Daily verification run completed (11/12)  |  |
| +----------------------------------------------------+  |
+----------------------------------------------------------+
```

### Key Design Decisions

1. **Three modes, one interface**: Upload Mode (wizard), Working Mode (table + panels), Dashboard Mode (executive overview). Users flow naturally between them.

2. **The contract is a living document**: Not a settings page with 40 fields. It reads top-to-bottom with inline status indicators, embedded data previews, and contextual actions.

3. **Bottom toolbar for primary actions**: Upload, Validate, Approve live at the bottom edge (Figma pattern). This keeps the data and results at the top where eyes naturally go.

4. **Collapsible sidebar**: Contains contract structure, uploaded files, and run history. Can be collapsed to give the data table full width (Figma's Minimize UI pattern).

5. **Tabbed bottom panel**: Results, Quality, Timeline, Export tabs under the main data table (dbt Cloud pattern). Each tab serves a different analytical need.

6. **Smart CSV import**: 5-stage pipeline with auto-column-mapping, confidence indicators, inline error correction, and downloadable templates. This is the "magic moment."

7. **Shimmer loading everywhere**: Never show a spinner. Use content-shaped placeholders that pulse (Stripe pattern).

8. **Status badges as primary communication**: Green/Yellow/Red badges for Pass/Warn/Fail. No ambiguity, no text required.

9. **Hover-to-peek for batch details**: Hover over a row in the table to see a preview popup with key metrics (Linear pattern). Click to open full detail.

10. **Command palette** (`Cmd+K`): For power users (quality engineers) who want to jump to a specific contract, batch, or run.

### Visual Design Language

- **Spacing**: 8px grid system (Linear) -- all margins, padding, gaps are multiples of 8
- **Typography**: Inter Display for headings (expressive), Inter for body (readable). Consider a monospace font (JetBrains Mono) for measurement values.
- **Colors**: LCH color space for perceptually uniform themes. Neutral base (Stripe-like grays) with semantic colors: Green (#22C55E pass), Red (#EF4444 fail), Amber (#F59E0B warning), Blue (#3B82F6 info)
- **Loading**: Content-shaped shimmer placeholders, never spinners
- **Badges**: Rounded pill shapes with color background and white text
- **Cards**: Subtle shadow (0 1px 3px rgba(0,0,0,0.1)), white background, 12px border-radius
- **Dark mode**: Support from day one using CSS custom properties and the LCH color system

### What Makes It Feel Premium (Not Developer Tool)

1. **No jargon**: "Confidence threshold" not "temperature". "Verification rules" not "schema". "Data columns" not "fields".
2. **No raw JSON or code visible** to end users -- the system generates code behind the scenes
3. **Generous whitespace**: Following Stripe, not cramming data
4. **Smooth animations**: Framer Motion for panel transitions, list reordering, status changes
5. **Real typography hierarchy**: Not everything the same size. Hero numbers (48px), section headers (24px), body (16px), metadata (14px)
6. **Sound design consideration**: A subtle success chime when verification passes (optional, toggle-able)
7. **Empty states are designed**: When there's no data, show an illustration and a clear call to action -- not a blank page
8. **The timeline tells a story**: Not just "verification ran at 2:14 PM" but "Batch A-4521: 250 items tested, 247 passed, 3 exceeded temperature threshold by 2.8C, overall First Pass Yield 98.8%"

### The "Upload CSV, See Pass/Fail" Flow (The Magic Moment)

This is the core experience. It must feel like magic:

```
[1] User drops CSV file onto the page
    --> File appears with name, size, row count (instant)
    --> First 5 rows appear as a preview table (< 1 second)

[2] Auto-column mapping runs
    --> Columns auto-match to contract fields with confidence badges
    --> Sample values shown next to each match for verification
    --> User clicks "Looks good" or adjusts one mapping

[3] "Run Verification" button pulses gently
    --> User clicks it
    --> Shimmer loading replaces the data table
    --> Results stream in: each row gets a green check or red X
    --> Summary appears at top: "247/250 passed (98.8%)"

[4] Failed rows are highlighted in the table
    --> Click a failed row to see: "Temperature 52.8C exceeds threshold 50.0C"
    --> Inline "Waive" or "Flag for Review" actions

[5] Overall verdict appears as a large badge:
    --> [PASSED] with confetti animation (subtle)
    --> or [FAILED] with clear explanation of what went wrong

Total time from file drop to verdict: < 10 seconds for 250 rows
```

This flow borrows from: v0's instant preview, Stripe's shimmer loading, Anthropic's evaluation pattern, dbt Cloud's results tab, and manufacturing dashboard best practices.

---

## Appendix: Research Sources

### Google AI Studio
- Google AI Studio Quickstart: https://ai.google.dev/gemini-api/docs/ai-studio-quickstart
- Google AI Studio File Upload Guide: https://www.datastudios.org/post/google-ai-studio-file-upload-and-reading-formats-limits-structured-output-and-long-context-wor
- Google AI Studio Beginner Guide: https://www.superbcrew.com/how-to-use-google-ai-studio-step-by-step-guide-for-beginners/

### Anthropic Console
- Practical Review: https://nickgarnett.substack.com/p/the-anthropic-console-a-practical
- Prompt Improver Announcement: https://www.anthropic.com/news/prompt-improver
- TechCrunch Coverage: https://techcrunch.com/2024/07/09/anthropics-claude-adds-a-prompt-playground-to-quickly-improve-your-ai-apps/

### OpenAI Playground
- Setup Guide: https://learnprompting.org/docs/intermediate/openai_playground
- UI Update Feedback: https://community.openai.com/t/playground-ui-update-ux-downgrade-and-missing-features/1140960
- Prompts Playground Announcement: https://community.openai.com/t/the-chat-playground-is-now-the-prompts-playground/1142740

### Vercel v0
- Official Blog - Maximizing Outputs: https://vercel.com/blog/maximizing-outputs-with-v0-from-ui-generation-to-code-creation
- Design Systems Docs: https://v0.app/docs/design-systems
- How to Prompt v0: https://vercel.com/blog/how-to-prompt-v0

### Retool
- Edit Table Guide: https://retoolers.io/blog-posts/retool-edit-table-effortless-inline-editing
- Dashboard Layout Patterns: https://blog.boldtech.dev/ui-sessions-exploring-different-admin-dashboard-uis-in-retool/
- Table UX Best Practices: https://community.retool.com/t/guide-table-component-ux-ui-best-practices-ui-tips-for-data-dashboards/42038

### Airtable
- Interface Designer Guide: https://support.airtable.com/docs/getting-started-with-airtable-interface-designer
- Layout Types: https://support.airtable.com/docs/adding-layouts-to-interfaces
- Record Detail Layout: https://support.airtable.com/docs/airtable-interface-layout-record-detail

### Notion
- Database View Guide: https://www.notion.com/help/guides/when-to-use-each-type-of-database-view
- Database Properties: https://www.notionapps.com/blog/notion-database-properties-explained
- Intro to Databases: https://www.notion.com/help/intro-to-databases

### Stripe
- Design Patterns: https://docs.stripe.com/stripe-apps/patterns
- iPhone Dashboard Design: https://medium.com/swlh/exploring-the-product-design-of-the-stripe-dashboard-for-iphone-e54e14f3d87e
- App Design Guidelines: https://docs.stripe.com/stripe-apps/design

### Figma
- UI3 Redesign Blog: https://www.figma.com/blog/our-approach-to-designing-ui3/
- Behind the Redesign: https://www.figma.com/blog/behind-our-redesign-ui3/
- Navigating UI3: https://help.figma.com/hc/en-us/articles/23954856027159-Navigating-UI3-Figma-s-new-UI
- Properties Panel: https://help.figma.com/hc/en-us/articles/360039832014-Design-prototype-and-explore-layer-properties-in-the-right-sidebar

### Linear
- UI Redesign Blog: https://linear.app/now/how-we-redesigned-the-linear-ui
- Design Analysis: https://telablog.com/the-elegant-design-of-linear-app/
- Linear Design Trend: https://blog.logrocket.com/ux-design/linear-design/

### dbt Cloud
- IDE User Interface Docs: https://docs.getdbt.com/docs/cloud/studio-ide/ide-user-interface
- New IDE Announcement: https://www.getdbt.com/blog/new-improved-cloud-ide
- Data Lineage Guide: https://www.getdbt.com/blog/getting-started-with-data-lineage

### CSV Import UX
- Data Import UX Guide: https://www.importcsv.com/blog/data-import-ux
- Bulk Import UX Patterns: https://smart-interface-design-patterns.com/articles/bulk-ux/
- CSV Uploader Best Practices: https://www.oneschema.co/blog/building-a-csv-uploader
- File Upload UI Patterns: https://blog.csvbox.io/file-upload-patterns/

### Manufacturing Dashboards
- Quality Dashboard Examples: https://ajelix.com/dashboards/quality-dashboard-examples/
- Manufacturing Dashboard KPIs: https://www.boldbi.com/blog/manufacturing-dashboard-examples/
- SaaS Dashboard Trends 2025: https://uitop.design/blog/design/top-dashboard-design-trends/
