// Runs after `vite build` — writes dist/version (served at /version once deployed) with the real
// commit that produced this build, so the platform can confirm a deploy is actually live. Uses
// Vercel's own env var when deployed there, falling back to `git rev-parse HEAD` locally.
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const commit = process.env.VERCEL_GIT_COMMIT_SHA || execSync("git rev-parse HEAD").toString().trim();

writeFileSync("dist/version", JSON.stringify({ commit }));
