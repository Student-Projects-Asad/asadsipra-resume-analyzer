const express = require("express");
const cors = require("cors");

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// The platform checks this after a merge to confirm a deploy is actually live — see
// conventions/github-conventions.md. Reads whichever env var the host sets at deploy time
// (Render's RENDER_GIT_COMMIT is the default target here), with a generic GIT_COMMIT fallback
// for other hosts.
app.get("/api/health", (req, res) => {
  const commit = process.env.RENDER_GIT_COMMIT || process.env.GIT_COMMIT;
  if (!commit) {
    res.status(503).json({ error: "GIT_COMMIT (or RENDER_GIT_COMMIT) is not set on this deployment" });
    return;
  }
  res.status(200).json({ commit });
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
