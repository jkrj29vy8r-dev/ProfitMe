# Vibe Workflow — local install notes

This folder is a vendored copy of [SamurAIGPT/Vibe-Workflow](https://github.com/SamurAIGPT/Vibe-Workflow)
(MIT), a node-based AI workflow builder. It is a **standalone application that
sits alongside ProfitMe** — it is not wired into the landing page or the design
system, and nothing in `references/` applies to it.

Upstream docs are in [`README.md`](README.md). This file only records what is
specific to running it from inside this repo.

## Install

```bash
cd vibe-workflow

# JS: client + workflow-builder library, linked via npm workspaces
npm install

# Python backend
cd server
python3 -m venv venv
./venv/bin/pip install -r requirements.txt
```

## Configure

Both env files are copied from their examples and are gitignored:

```bash
cp .env.example .env             # used by docker compose
cp server/.env.example server/.env   # used by uvicorn
```

Generation nodes call [MuAPI](https://muapi.ai) and stay non-functional until
`MU_API_KEY` is a real key. The UI, the node canvas and the health endpoints all
work without one.

## Run

```bash
# Backend — http://localhost:8000  (docs at /docs)
cd server && ./venv/bin/uvicorn app.main:app --reload --port 8000

# Frontend — http://localhost:3000
npm run dev:app
```

The client rewrites `/api/*` to the backend, so hitting
`http://localhost:3000/api/health` should return the server's health payload.

`npm run dev:app` works on Linux/macOS even though the underlying `dev` script
uses Windows `set NODE_OPTIONS=...` syntax — that prefix is simply a no-op here,
so the heap-size bump it intends does not apply.

## Local change to upstream

`client/next.config.mjs` pins `turbopack.root` to this directory. Next.js infers
the workspace root from the nearest lockfiles, and ProfitMe's own
`package-lock.json` one level up otherwise wins — which would make `output:
'standalone'` trace the wrong file set. Drop this if the folder is ever moved
out of the repo.
