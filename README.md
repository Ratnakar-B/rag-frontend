# Ragwise Web App (Frontend)

## What this project does

Ragwise is a document-grounded Q&A app. This frontend is a React and TypeScript single-page application that provides the public landing page, sign-in and account creation pages, and the private document workspace.

## How it works

The browser sends credentialed requests to the backend API. Users can create an account or sign in, upload PDF/DOCX/TXT documents, see document processing status, and ask questions. The backend extracts and chunks uploaded text, stores Gemini embeddings in MongoDB Atlas, retrieves relevant passages using Atlas Vector Search, and uses Gemini to generate answers. Authentication is managed by the backend with HttpOnly cookies; Gemini and database credentials must never be placed in frontend environment variables.

## Requirements

- Node.js 20 or newer
- The backend API running; see [`server/README.md`](../server/README.md)

## Configure and run

From a terminal in this `client` directory:

```powershell
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The app uses `http://localhost:4000` as its API by default. Start the backend separately and configure its `CLIENT_ORIGIN` to match the frontend origin if you use a different port or host.

## Environment variables

No frontend `.env` file is required for the default local setup. The API URL is inferred from the current page hostname and port `4000`. To override it, copy `.env.example` to `.env` and set:

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_URL` | The current page's hostname on port `4000` | Full base URL of the backend API, for example `http://localhost:4000`. |

For example:

```powershell
Copy-Item .env.example .env
```

Vite exposes `VITE_*` values to browser code, so do not put API keys, JWT secrets, database credentials, or other private values in this file.

## Checks and production build

Run these commands from the `client` directory:

```powershell
npm run typecheck
npm run build
```

The production frontend files are generated in `client/dist`.
