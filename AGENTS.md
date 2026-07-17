# Forty5Park Agent Notes

## Project Summary

Forty5Park is currently a React app scaffolded with Vite. The first implemented screen is the Figma-derived market dashboard with a dark geolocalization map background and a left-side market control panel.

The intended product includes a building geolocalization component that lives in the background of the interface, plus a sidepanel used to control the contents of that map.

## Design References

- Dashboard Figma node: `https://www.figma.com/design/ti7TCH6aLLutT4OIAvSQec/portfolio-sourcefile?node-id=103-2119&t=T3bW2CZUynALhJ5s-11`
- Sidepanel Figma node: `https://www.figma.com/design/ti7TCH6aLLutT4OIAvSQec/portfolio-sourcefile?node-id=106-588&t=T3bW2CZUynALhJ5s-11`
- Figma implementation-grade inspection is now available through the Figma design-context tool for the dashboard and sidepanel nodes.

## Figma Implementation Notes

- Dashboard node `103:2119` is named `dashboard-market` and is `1440 x 900`.
- The background map frame is `1440 x 900`; the map image itself is positioned at `x: -147`, `y: -42`, `w: 1734`, `h: 942`.
- Sidepanel node `106:588` is named `markets-screen`, positioned at `x: 16`, `y: 16`, with size `320 x 868`.
- Collapsed sidepanel node `116:584` is named `header-bar`, with size `200 x 48`.
- Sidepanel background is `neutral/1000 - dark-main` (`#1d1d1d`) with `neutral/650 - card-border` (`#363636`) and `8px` radius.
- The map/dashboard background uses `neutral/1100 - dark-bg` (`#131313`).
- Primary brand/accent color is `brand/main` (`#7f56d9`).
- Card background is `neutral/800 - card-bg` (`#292929`).
- Text colors include white (`#ffffff`), `neutral/300` (`#999999`), and `neutral/200` (`#bfbfbf`).
- Typography uses Inter via the design token `font/body`.
- Main text styles observed: `14px/1.7` regular, `12px/1.7` regular, `12px/1.4` regular, `12px/1.7` bold, and `10px/1.7` regular.
- Spacing tokens observed: `spacing-md = 8`, `spacing-xs = 4`.
- Sidepanel layout: `48px` top header, `44px` primary tabs, `40px` secondary tabs, then a scrollable market list.
- Market cards are `288px x 61px`, with `16px 12px` internal padding, `4px` radius, card border `#363636`, and card fill `#292929`.
- Do not add Tailwind. Figma returned React/Tailwind-like reference code, but this project currently uses plain React plus CSS files.

## Current Stack

- React 19
- Vite 8
- MapLibre GL for the interactive map background
- `@fontsource/inter` for deterministic local Inter font loading
- Storybook 10 with the React/Vite framework, accessibility, docs, and Vitest browser-test addons
- Oxlint
- Plain CSS modules by file import, using `src/App.css` and `src/index.css`

## Useful Commands

- `npm run dev` starts the local Vite dev server.
- `npm run build` creates a production build in `dist/`.
- `npm run lint` runs Oxlint.
- `npm run preview` serves the production build locally.
- `npm run storybook` starts the component workbench on port 6006.
- `npm run build-storybook` builds the static component workbench.
- `npx vitest --project storybook run` runs the browser-based Storybook checks.

## Project Structure

- `src/main.jsx` mounts the React app.
- `src/App.jsx` contains the dashboard and sidepanel component structure.
- `src/App.css` contains component-level styles for the dashboard and sidepanel.
- `src/index.css` contains global CSS variables and base document styles.
- `src/*.stories.jsx` contains isolated Storybook stories for the selected controls, cards, and panel states.
- `src/assets/map-dark.png` is the local Figma map image asset used as the dashboard background.
- `src/assets/brand-icon.svg` is the local Figma brand icon asset used in the sidepanel header.
- `public/` contains static assets from the Vite scaffold.
- `dist/` is generated build output and should not be edited by hand.

## Working Notes

- The initial scaffold was created in place in `/Users/analdogomez/Desktop/forty5park`.
- The default Vite demo UI was replaced with a clean starter shell for future product work.
- Lint and production build passed after setup.
- This folder was not a git repository at the time of initial setup.
- The local repository was later pushed to `https://github.com/analdoagm-png/forty5park`.
- Figma design-context access is working for the dashboard and sidepanel nodes.
- The design shows a dark, map-first dashboard at `1440 x 900`, with the sidepanel docked on the left over a full-background map.
- The sidepanel uses a compact dark UI with top icon controls, primary tabs (`Markets`, `Library`, `Analysis`), secondary tabs (`MSA`, `Trends`, `Highlights`), filter chips (`All`, `Active`, `Restricted`), search/action controls, and a vertical list of market/property cards.
- The dashboard and sidepanel have been implemented in plain React/CSS without adding Tailwind.
- Visual QA at `1440 x 900` matched the Figma geometry: sidepanel at `16,16` with `320 x 868`, map image at `-147,-42` with `1734 x 942`.
- The static Figma map has been replaced by an interactive MapLibre GL map using a dark/grayscale CARTO raster basemap, constrained to a continental US viewport/bounds.
- `src/assets/map-dark.png` remains as a local fallback behind the live map layer.
- `public/us-states.geojson` stores local US state boundaries for vector overlays.
- The listed sidepanel states are highlighted on the map using Figma node `119:603` as the paint reference: `#7f56d9` fill at 50% opacity, `#7f56d9` outline at full opacity.
- Keep grayscale styling on the raster layer paint, not as a CSS filter on the MapLibre canvas, so vector overlays and markers can keep brand color.
- Market cards are wired to state vector bounds; selecting a card highlights it and fits the map viewport around that state's polygon.
- The sidepanel can collapse via the sidepanel icon. Expanded state uses the full panel; collapsed state preserves only the `200 x 48` header bar and fades/slides the body out with a subtle transition.
- A collapsed sidepanel temporarily expands to its content height when its expand icon is hovered, then collapses after the pointer leaves; clicking the icon pins the full viewport-height panel open.
- Expanded sidepanel height should track the viewport with bottom separation preserved (`16px` desktop, `12px` mobile), rather than staying capped to the original `868px` Figma frame height.
- Primary, secondary, and filter tabs are stateful with clean hover/press feedback and independent active states.
- The `Library` primary tab swaps the sidepanel content to the Figma library sections: `125:813` Portfolios, `125:921` Buy Boxes, and `125:984` Developments. The secondary library tabs update list labels, card counts, card titles, and stat rows.
- The Library list header search button has its own search state based on Figma node `132:601`; it swaps the list header for a 288px search field plus an empty-state panel, and does not affect the top header search icon.
- The sidepanel list search component is shared by Markets and Library. Its empty-state icon is exported inline from Figma node `135:516`, and the search field/empty panel use subtle opacity and transform animations.
- The `Analysis` primary tab swaps the sidepanel content to the Figma `125:764` analysis section with a start-session row, Sessions label, and four compact session cards.
- The Markets `Trends` tab follows Figma node `140:776`, with Current/Projected controls, ranked market-cluster cards, and search/sort actions.
- The Markets `Highlights` tab follows Figma node `140:819`, with the June 2025 summary, ranked Top Markets list, and linked market insights.
- Selecting a Portfolios card in Library opens the Figma `151:496` portfolio drawer. It is edge-aligned on the right (no viewport inset), slides in/out, and animates its overview KPI values on entry.
- State cards use subtle hover, keyboard focus, pressed, and selected states; selected cards keep a uniform 1px purple border while fitting the map to the state vector.
- Selecting a state card opens a right-side market detail panel based on Figma node `121:776`; its title uses the active state name instead of the source Miami MSA title.
- Leaving the Markets primary tab closes the market detail panel with a short rightward fade/slide transition, then clears the selected market state.
- The MapLibre attribution and built-in navigation controls are replaced by the custom Figma map controls from node `143:473`; the target button re-centers the active market and the horizontal buttons zoom out/in.
- Storybook stories cover the reusable controls, market/library/analysis/trend cards, and Market Detail/Highlights panels. The interactive map remains app-only because it needs a live MapLibre instance and state-boundary data.
- The market detail "View Listings" pill uses the inline SVG exported from Figma node `121:782`.
- When the detail panel is open, MapLibre `fitBounds` uses right-side padding so the selected state vector is centered between the left sidepanel and the right detail panel.
- Opening a portfolio collapses the left navigation and gives the edge-aligned portfolio drawer its own `720px` viewport column. The map resizes into the remaining space rather than sitting behind the drawer, recenters the continental US view, and filters the existing state polygon layers to that portfolio's market states. The portfolio overview caps at zoom `2.75`, and camera bounds extend slightly beyond the data bounds, so panel-aware padding keeps highlighted markets in the visible map area.
- Inter is loaded through `@fontsource/inter` Latin weights 400, 500, and 700 instead of relying on the font being installed on the user's machine.
- Visible UI text uses typography tokens from `src/index.css`, with `12px` as the readable floor for captions/body text while preserving the compact dashboard density.

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
- 2026-07-13: Recorded the dashboard and sidepanel Figma references.
- 2026-07-13: Retried Figma review. Browser access worked first, then editor access was granted and Figma design-context extraction succeeded.
- 2026-07-13: Implemented the Figma dashboard and sidepanel in React/CSS with local map and brand assets.
- 2026-07-13: Added MapLibre GL interactive map background, US bounds, dark CARTO tiles, and mock market marker/card interaction.
- 2026-07-13: Added collapsed sidepanel navigation state based on Figma node `116:584`, toggled from the sidepanel icon.
- 2026-07-13: Added interactive hover/click/active states to the sidepanel tab groups.
- 2026-07-13: Replaced mock property points with largest-city markers for the listed states and added highlighted state-boundary vector layers.
- 2026-07-13: Removed the count badge from market cards and tuned state highlights toward the Figma `119:603` vector style (`#7f56d9`, 50% fill, full-opacity stroke).
- 2026-07-13: Removed the MapLibre canvas-level grayscale CSS filter so state vectors render separately in brand color while the raster basemap remains grayscale through raster paint settings.
- 2026-07-13: Removed city dot markers from the map and changed sidepanel selection to center/fit the viewport on the selected state vector bounds.
- 2026-07-13: Added hover, focus, pressed, and selected feedback for state cards in the sidepanel navigation, then simplified active cards back to a uniform 1px border.
- 2026-07-13: Added the Figma market detail panel on the right side of the dashboard and adjusted selected-state map padding to center vectors between both panels.
- 2026-07-13: Replaced the placeholder "View Listings" icon with the exact Figma unit icon from node `121:782`.
- 2026-07-13: Added the Library sidepanel sections from Figma nodes `125:813`, `125:921`, and `125:984`, and introduced the `--neutral-500` token for card dividers.
- 2026-07-13: Added the Analysis sidepanel section from Figma node `125:764`, including the exact edit icon from node `128:656`.
- 2026-07-13: Added the Library list search state from Figma node `132:601`, scoped to the in-list search action only.
- 2026-07-14: Changed the expanded sidepanel to match viewport height while preserving the bottom gap.
- 2026-07-14: Replaced the Library search empty-state symbol with the exported Figma node `135:516` SVG and added subtle search-state transitions.
- 2026-07-14: Reused the same sidepanel search component for the Markets tab search button.
- 2026-07-14: Added deterministic Inter loading with `@fontsource/inter` and raised visible 10px UI text to tokenized 12px caption/body styles for WCAG readability resilience.
- 2026-07-14: Added Figma-derived Trends and Highlights content states to the Markets secondary navigation.
- 2026-07-14: Replaced the visible MapLibre control/attribution UI with Figma-derived custom map controls.
- 2026-07-16: Linked portfolio detail data to the map; each portfolio now highlights its listed market states with the existing vector fill and outline treatment.
- 2026-07-16: Changed the portfolio drawer from a map overlay to an adjacent desktop workspace column and collapse the navigation when a portfolio is opened.
- 2026-07-16: Added temporary, content-height sidepanel expansion on hover and persistent full-height expansion on click.
- 2026-07-16: Added Storybook 10 for React/Vite, component stories, static-asset support, and browser-based story verification.
- 2026-07-16: Made the market detail panel close on leaving Markets, with an animated exit rather than an abrupt unmount.
- 2026-07-16: Added the Figma-derived portfolio detail drawer, including clickable Library portfolios, animated KPIs, and edge-aligned panel motion.
