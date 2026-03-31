# Modern HR Annexure Portal

A React + Vite web app for HR teams to create, review, and manage salary annexures with a polished dashboard-style interface.

## What This Project Includes

- Dashboard with high-level metrics and recent annexure activity
- Employee Directory with:
  - search
  - department/status filtering
  - sorting
  - multi-select for batch actions
- Annexure Builder with:
  - editable employee and compensation fields
  - policy-based min/max validation
  - undo/redo history
  - per-field internal notes
  - live compensation summary
- Preview screen with document-style layout and approval flow
- PDF export for single annexure (`jspdf` + `jspdf-autotable`)
- Bulk Wizard to generate multiple annexure PDFs from selected employees
- History, Analytics, and Settings screens (currently mock/static data)

## Tech Stack

- React 19
- TypeScript
- Vite 6
- Tailwind CSS v4 (via `@tailwindcss/vite`)
- Lucide React icons
- jsPDF + jspdf-autotable for PDF generation

## Project Structure

```text
src/
  App.tsx                 # Main view routing/state orchestration
  main.tsx                # React entrypoint
  index.css               # Theme tokens and global styles
  components/
    Sidebar.tsx
    Topbar.tsx
  screens/
    Dashboard.tsx
    Directory.tsx
    Builder.tsx
    Preview.tsx
    History.tsx
    BulkWizard.tsx
    Analytics.tsx
    Settings.tsx
```

## Getting Started

### Prerequisites

- Node.js 18+ (Node.js 20+ recommended)
- npm

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

The app runs on `http://localhost:3000`.

## Available Scripts

- `npm run dev` - Start Vite dev server on port 3000 (`--host 0.0.0.0`)
- `npm run build` - Build production assets into `dist/`
- `npm run preview` - Preview production build locally
- `npm run lint` - Type-check with TypeScript (`tsc --noEmit`)
- `npm run clean` - Remove `dist/` (`rm -rf dist`)

Note: `npm run clean` uses a Unix-style command. On Windows PowerShell, equivalent cleanup is:

```powershell
Remove-Item -Recurse -Force dist
```

## Data and Backend Notes

- Current screens use in-file mock/sample data.
- PDF generation is fully client-side.
- No active API integration is used by the UI right now.
- `vite.config.ts` defines `process.env.GEMINI_API_KEY`, but the current `src/` code does not consume it.

## Build Notes

- Alias `@/*` is configured in `tsconfig.json` and Vite.
- HMR behavior is controlled by `DISABLE_HMR` in `vite.config.ts`.

## Future Improvements

- Add persistent data layer (API + DB)
- Replace `any` types with strict domain models
- Add unit/component tests
- Add role-based access and audit persistence
- Externalize static labels and hardcoded constants
