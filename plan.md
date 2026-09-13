# Project Plan — PM Resume Analyzer (MVP)

A small, focused tool: score a resume against a job description, with a differentiator built in
from round 1 — project-management-specific competency detection, not just generic keyword match.

## Tech stack

- **Frontend:** React + Vite.
- **Backend:** Node.js + Express, single service, no database (stateless per request).
- **Parsing:** `pdf-parse` for PDF text; plain-text paste also accepted.

## Architecture

Frontend POSTs resume + job description to `/analyze`. Backend extracts resume text, runs generic
keyword-overlap scoring against the JD, and separately flags PM-specific signals in the resume
(certifications, tools, competencies). Frontend renders both the generic score and the PM-specific
flags.

## Features (small, three total)

1. **Resume input & extraction** — `.pdf` (5MB max) or pasted text (20k chars max). Unreadable/
   scanned PDF → 422 with a clear message. Empty JD → 400.
2. **Generic keyword scoring** — tokenize + stopword-strip the JD, take top 25 by frequency,
   substring-match against resume text, score = `matched / total * 100`. Zero overlap is a valid
   0% result, not an error.
3. **PM-competency detection (the differentiator)** — a fixed, small keyword dictionary of PM
   signals (certifications: PMP, CAPM, Agile/Scrum; tools: Jira, MS Project, Asana; competencies:
   budget tracking, stakeholder management, risk management). Scanned against the resume
   independently of the JD-match score, and shown as a separate "PM signals found" list — this is
   what makes the tool worth using over a generic keyword-match clone, and it's built now, not
   deferred.

## Open questions / assumptions

- English-only for the MVP.
- No accounts/history — stateless, one-off analysis per request.
- The PM-competency dictionary is intentionally small and fixed for this round; expanding it is a
  natural next round, not a blocker to shipping this one.
