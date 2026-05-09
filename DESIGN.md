# Design

## Visual Theme

Fairbuild Studio uses a restrained enterprise product theme: warm document surfaces, quiet blue action color, and semantic quality colors for accepted, review, and rejected states. The interface should feel like a contract operations workstation, with enough density for technical evaluators and enough hierarchy for buyers.

## Color Tokens

Use OKLCH tokens for the sandbox dashboard. Do not introduce raw hex values inside sandbox components.

- `--dash-bg`: page background
- `--dash-card`: primary panel surface
- `--dash-surface`: secondary table/header surface
- `--dash-hover`: hover surface
- `--dash-border`: primary border
- `--dash-border-soft`: table dividers
- `--dash-text`: primary text
- `--dash-muted`: secondary text and small labels
- `--dash-accent`: primary action and selected state
- `--dash-green`, `--dash-amber`, `--dash-red`: semantic quality states
- `--dash-focus`: focus outline

## Typography

Use a native system UI stack for product surfaces. Keep body text at 14px or larger, table text at 13px or larger, and labels readable enough for scanning. Use weight, spacing, and restrained scale rather than decorative type.

## Layout

Desktop uses a persistent left rail and a single evidence canvas. Mobile collapses the rail below the report content and must never create document-level horizontal overflow. Data tables become stacked key/value records under 720px.

## Components

Buttons, links, filter pills, table sort controls, and sample navigation links must meet 44px minimum hit targets. Tables need semantic headers on desktop and `data-label` stacked cells on mobile. Focus rings use `--dash-focus`.

## Motion

Motion is minimal and state-based only. Use short ease-out transitions for color and border changes. Do not add decorative page-load animation.
