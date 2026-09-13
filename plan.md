# Project Plan — Resume Analyzer (MVP)

Intentionally small in scope: the goal is a real, working, end-to-end slice rather than a fully
featured product on day one. Once this MVP is solid, later rounds can expand it (multiple resume
formats, richer scoring, account history, etc.).

## Tech stack

- **Frontend:** React + Vite, plain CSS (no component library needed at this size).
- **Backend:** Node.js + Express, single service.
- **Storage:** None required for the MVP — resumes are analyzed in-memory per request, nothing
  persisted. (A database can be added later if history/accounts become in scope.)
- **Resume parsing:** `pdf-parse` for PDF text extraction (plain-text resumes accepted as-is).

## High-level architecture

A single-page frontend lets a user paste or upload a resume and paste a job description. It POSTs
both to a backend `/analyze` endpoint. The backend extracts resume text (if a PDF was uploaded),
runs a simple keyword-overlap comparison against the job description, and returns a match score
plus the list of job-description keywords missing from the resume. The frontend renders the score
and the missing-keyword list.

## Major features / epics

1. **Resume input & text extraction** — upload a PDF or paste plain text; backend normalizes both
   into plain text for analysis.
2. **Keyword match & scoring** — extract meaningful keywords from the job description, compare
   against the resume text, and compute a simple percentage match score.
3. **Results display** — show the match score and the specific missing keywords so the user knows
   what to add.

## Open questions / assumptions

- Keyword extraction for the MVP is a straightforward approach (e.g. frequency + stopword
  filtering), not a full NLP pipeline — good enough to demonstrate the real flow end to end.
- No user accounts or saved history in this round — every analysis is a one-off, stateless request.
- Assuming resumes are in English for the MVP.
