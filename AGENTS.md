# Repository Guidelines

## Project Structure & Module Organization
This Vite-powered React + TypeScript portfolio bootstraps from `index.tsx`, which mounts `App.tsx`. Feature-driven UI lives under `components/`, shared content in `constants.ts`, and type definitions in `types.ts`. Static assets, favicons, and manifest files reside in `public/`. Built artifacts land in `dist/` and should never be edited directly. Configuration lives at the root (`vite.config.ts`, `firebase.json`, `tsconfig.json`); add new modules beside these only when they are cross-cutting.

## Build, Test, and Development Commands
- `npm install` installs dependencies defined in `package.json`.
- `npm run dev` starts the Vite dev server with hot reload on `http://localhost:5173`.
- `npm run build` produces an optimized bundle in `dist/`.
- `npm run preview` serves the latest build for smoke-testing before deploys.
- `npm run deploy` runs the Firebase Hosting deploy flow (requires `firebase` CLI auth); `npm run predeploy` builds automatically prior to deployment.

## Coding Style & Naming Conventions
Stick to two-space indentation and TypeScript’s strict typing. Define components as PascalCase functions (`ProjectCard`) and export them from their owning folder’s `index.ts`. Hooks, utilities, and context helpers stay camelCase (`useScrollSpy`). Keep imports relative; introduce barrel files only for shared exports. Align JSX class names with Tailwind-style utility strings already in use. Favor descriptive prop names and document complex props inline with interfaces.

## Testing Guidelines
Automated tests are not yet configured. When adding coverage, prefer Vitest with React Testing Library, co-locating specs as `<Component>.test.tsx` next to the implementation. Mock `ActiveSectionContext` for navigation-dependent views and verify blog routing with representative `BLOG_POSTS` fixtures. Document any new `npm run test` script in `package.json` and ensure it runs cleanly before opening a PR.

## Commit & Pull Request Guidelines
Recent history mixes exploratory commits; move toward Conventional Commit formatting (`feat(nav): add scroll spy indicator`). Keep summaries imperative and under 70 characters, expanding on motivation in the body when needed. PRs should outline intent, surface visual diffs or screenshots for UI updates, note local `npm run build` / `npm run preview` results, and link to any tracking issue. Request review before merging to `main`.

## Deployment & Configuration Notes
Firebase Hosting reads routes from `firebase.json`; update rewrites if you introduce new top-level paths. Never modify generated assets in `dist/`. Keep `metadata.json` synchronized with live content prior to deploying so the portfolio metadata stays current.
