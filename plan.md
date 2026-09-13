# Project Plan — PM Resume Analyzer (MVP)

A small, focused tool: score a resume against a job description, with a differentiator built in
from round 1 — project-management-specific competency detection, not just generic keyword match.

**On "shorter":** scope is intentionally unchanged from round 2 (three small features, no
database, stateless) — this MVP was already minimally scoped, so "shorter" here means a leaner
plan.md, not cutting a feature. Nothing is being cut.

## Tech stack

- **Frontend:** React + Vite.
- **Backend:** Node.js + Express, single service, no database (stateless per request).
- **Parsing:** `pdf-parse` for PDF text; plain-text paste also accepted.

## Architecture

Frontend POSTs resume + job description to `/analyze`. Backend extracts resume text, runs generic
keyword-overlap scoring against the JD, and separately flags PM-specific signals in the resume.
Frontend renders the generic score plus a separate "PM signals found" panel — the two are shown
side by side, not blended into one number, so a strong PM-signal match is visible even on a resume
that scores lower against a JD that doesn't use PM-specific language.

## Features (three, same scope as round 2 plus the differentiator)

1. **Resume input & extraction** — `.pdf` (5MB max) or pasted text (20k chars max). Unreadable/
   scanned PDF → 422 with a clear message. Empty JD → 400. Pasted text that's whitespace/gibberish
   with no real words is handled the same as a zero-overlap PDF result — a valid 0% match, not an
   error.
2. **Generic keyword scoring** — tokenize + stopword-strip the JD, take the top min(25, available)
   words by frequency (so a short JD with fewer than 25 real words just uses what it has, not an
   error or padding), substring-match (case-insensitive) against resume text, score =
   `matched / total * 100`. Accepted MVP tradeoff: substring matching means e.g. "manage" matches
   inside "management" — noted, not fixed this round; word-boundary matching is a later-round
   improvement if it turns out to matter in practice.
3. **PM-competency detection (the differentiator)** — a fixed, small dictionary (plain array in a
   `pmKeywords.ts` config file: certifications — PMP, CAPM, Agile, Scrum; tools — Jira, MS Project,
   Asana; competencies — budget tracking, stakeholder management, risk management). Matched against
   the resume with the same substring-matching policy as feature 2, for consistency. Shown as its
   own list, separate from the JD score (not blended into it) — a resume can score low on generic
   JD-overlap but still show strong PM signals, and that distinction is the point.

## Open questions / assumptions

- English-only for the MVP.
- No accounts/history — stateless, one-off analysis per request.
- The PM dictionary is intentionally small and fixed this round (in `pmKeywords.ts`); expanding it
  or moving it to a real config/admin-editable source is a natural next round, not a blocker here.
