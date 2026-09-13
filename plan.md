# Project Plan — Resume Analyzer (MVP)

Intentionally small in scope: the goal is a real, working, end-to-end slice rather than a fully
featured product on day one. Once this MVP is solid, later rounds can expand it (multiple resume
formats, richer scoring, account history, PM-specific competency scoring, etc.).

## Tech stack

- **Frontend:** React + Vite, plain CSS (no component library needed at this size).
- **Backend:** Node.js + Express, single service.
- **Storage:** None required for the MVP — resumes are analyzed in-memory per request, nothing
  persisted. (A database can be added later if history/accounts become in scope.)
- **Resume parsing:** `pdf-parse` for PDF text extraction (plain-text resumes accepted as-is).

## High-level architecture

A single-page frontend lets a user paste or upload a resume and paste a job description. It POSTs
both to a backend `/analyze` endpoint. The backend extracts resume text (if a PDF was uploaded),
runs a keyword-overlap comparison against the job description, and returns a match score plus
both the matched and missing keywords. The frontend renders the score and both keyword lists.

## Major features / epics

1. **Resume input & text extraction** — upload a PDF or paste plain text; backend normalizes both
   into plain text for analysis.
   - Accepted input: `.pdf` (max 5MB) or pasted plain text (max 20,000 characters).
   - A corrupt or scanned/image-only PDF (no extractable text) returns a 422 with a clear error
     ("couldn't read text from this PDF — try pasting the text instead") rather than a silent
     empty analysis.
2. **Keyword match & scoring** — extract meaningful keywords from the job description, compare
   against the resume text, and compute a percentage match score.
   - Extraction: lowercase, tokenize on non-word characters, strip a standard English stopword
     list, then take the top 25 remaining words from the job description by frequency as the
     "meaningful keywords" set.
   - Scoring: `matchScore = (matchedKeywords.length / totalKeywords.length) * 100`, rounded to the
     nearest whole percent. `matchedKeywords` = keywords present (case-insensitive, substring
     match) anywhere in the resume text.
   - Keyword extraction is implemented as its own pluggable module (`extractKeywords(text)`) so a
     future round can swap in a domain-specific dictionary (e.g. project-management/analyst
     competencies — budget tracking, stakeholder management, PMP/CAPM/Agile certifications) as a
     planned differentiator, without reworking the scoring logic itself.
   - Edge cases: an empty/whitespace-only job description returns a 400 ("job description is
     required"); a resume with zero keyword overlap still returns a valid response with
     `matchScore: 0` and the full keyword list as "missing" — not treated as an error.
3. **Results display** — show the match score and both matched and missing keywords.
   - Score rendered as both a percentage number and a simple progress bar.
   - Two lists below it: "Keywords found" and "Keywords missing" — showing what's already covered,
     not just what's absent, so the results are actionable either way.

## Open questions / assumptions

- No user accounts or saved history in this round — every analysis is a one-off, stateless request.
- Assuming resumes and job descriptions are in English for the MVP.
- The domain-specific (e.g. PM-competency) keyword dictionary mentioned above is explicitly
  deferred to a later round — this round only needs `extractKeywords` to be swappable, not the
  dictionary itself built.
