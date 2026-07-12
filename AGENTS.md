# Forty5Park Agent Notes

## Project Summary

Forty5Park is currently a fresh React app scaffolded with Vite. The product direction is still pending, so the app has a neutral starter shell instead of a feature-specific interface.

## Current Stack

- React 19
- Vite 8
- Oxlint
- Plain CSS modules by file import, using `src/App.css` and `src/index.css`

## Useful Commands

- `npm run dev` starts the local Vite dev server.
- `npm run build` creates a production build in `dist/`.
- `npm run lint` runs Oxlint.
- `npm run preview` serves the production build locally.

## Project Structure

- `src/main.jsx` mounts the React app.
- `src/App.jsx` contains the current starter screen.
- `src/App.css` contains component-level styles for the starter screen.
- `src/index.css` contains global CSS variables and base document styles.
- `public/` contains static assets from the Vite scaffold.
- `dist/` is generated build output and should not be edited by hand.

## Working Notes

- The initial scaffold was created in place in `/Users/analdogomez/Desktop/forty5park`.
- The default Vite demo UI was replaced with a clean starter shell for future product work.
- Lint and production build passed after setup.
- This folder was not a git repository at the time of initial setup.

## Agent Guidance

- Keep this file updated when major product decisions, architecture changes, dependencies, or workflows are introduced.
- Prefer small, focused edits until the product requirements are clearer.
- Follow existing React/Vite patterns unless there is a clear reason to add routing, state management, TypeScript, or a UI framework.
- Avoid editing `dist/` directly; regenerate it with `npm run build`.
- Verify meaningful changes with `npm run lint` and `npm run build` when practical.

## Decision Log

- 2026-07-12: Created a Vite React project as the baseline.
- 2026-07-12: Kept the UI intentionally generic pending further requirements.
- 2026-07-12: Added this `AGENTS.md` as the living project summary and agent handoff file.
