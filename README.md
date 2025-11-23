<div align="center">
  <h1>FinSight — AI Bank Analyzer</h1>
  <p>A lightweight Vite + React app that analyzes bank transactions with AI-powered insights.</p>
</div>

**Quick, confident financial insights — without the clutter.**

**Features**

- **Auto insights:** AI-generated summaries and spending highlights.
- **Budget optimizer:** Smart suggestions to improve savings (`components/BudgetOptimizer.tsx`).
- **Interactive charts:** Category breakdowns and trends (`components/CategoryChart.tsx`).
- **Transaction explorer:** Sortable, searchable transaction table (`components/TransactionTable.tsx`).

**Try it — Quickstart**

- **Prerequisites:** Node.js 18+ and npm or pnpm.
- Install dependencies:

```bash
npm install
# or
pnpm install
```

- Provide your Gemini API key (used by `services/geminiService.ts`) in an environment file named `.env.local`:

```bash
# .env.local
GEMINI_API_KEY=your_key_here
```

- Run the dev server:

```bash
npm run dev
# or
pnpm dev
```

**Important scripts**

- `npm run dev` — Start the Vite dev server.
- `npm run build` — Build for production.
- `npm run preview` — Preview the production build locally.

**Project structure (high level)**

- `App.tsx` — Root app component.
- `index.tsx` / `index.html` — Vite entry.
- `components/` — UI pieces: `BudgetOptimizer.tsx`, `CategoryChart.tsx`, `InsightsSection.tsx`, `LoadingScreen.tsx`, `SummaryCards.tsx`, `TransactionTable.tsx`.
- `services/` — API integrations (`geminiService.ts`).
- `utils/analytics.ts` — Basic analytics helpers.
- `types.ts` / `constants.ts` — Shared types and constants.

**How it works (short)**

1. Transactions are loaded in the UI.
2. The app calls the AI service (via `services/geminiService.ts`) to generate categories, summaries, and optimization suggestions.
3. Components render interactive charts and recommendations for the user.

**Design goals**

- Minimal, focused UX for fast financial takeaways.
- Clear separation between UI (`components/`) and AI/service logic (`services/`).

**Contributing**

- Fixes and improvements welcome. Open a PR against `main` with a short description.

**License & Attribution**

- MIT-style — modify as needed for your project.

**Need help?**

- Ask in the repo or open an issue. Happy to help get this running locally.

---

_Made with a little AI and a lot of curiosity._


## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
