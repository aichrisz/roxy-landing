# Quiet Current Implementation Plan

> For agentic workers: implement bounded vertical slices; parent independently verifies and accepts. User delegated creative choices and explicitly selected Astra.

**Goal:** Deliver a beautiful, usable bilingual Roxy landing page locally with reproducible tests and downloadable assets.

**Architecture:** Static semantic HTML remains the baseline. Small ES modules handle safe preferences, i18n, tabs, and optional motion. Tokenized CSS owns layout; dev-only Playwright and axe prove behavior.

**Tech stack:** HTML, CSS, browser ES modules, Node built-ins, @playwright/test 1.64.1, axe-core 4.14.0.

## Global constraints
All constraints in ../specs/2026-10-20-quiet-current.md apply. No public deployment or changes outside this project. Only canonical supplied Roxy asset. No credentials or production API. gpt-6-astra is the requested implementation lane. No fabricated evidence.

## Task 1 — End-to-end static page and responsive composition
Files: index.html, styles.css, assets/*.svg, package.json, package-lock.json, scripts/server.mjs, scripts/build.mjs, playwright.config.mjs, tests/landing.spec.mjs, README.md, .gitignore.
- [ ] Write one failing browser assertion for an accessible Roxy H1/hero before page implementation. Install exact dev-only pins with npm install --ignore-scripts; run the test and record expected missing page/content failure.
- [ ] Implement the full semantic Indonesian page with relative assets and no-JS navigation. Source artwork already exists. Add CSS design tokens and 320/390/768/1024/1440 compositions, intact image and journal section.
- [ ] Run tracer test and responsive screenshot assertions; fix genuine failures.

## Task 2 — Complete language and grimoire interaction
Files: app.js (or focused modules), tests/landing.spec.mjs, index.html, styles.css.
- [ ] Add and run a failing test for language switch updating lang, visible heading and surviving reload.
- [ ] Implement safe local preferences and complete translations; rerun green. Add failing tests for storage-denied resilience and meaningful grimoire tabs before implementing those features.
- [ ] Confirm keyboard activation, focus visibility, no inactive links, no untranslated controls, and no unsafe innerHTML input paths.

## Task 3 — Motion and quality gates
Files: motion.js if justified, tests/landing.spec.mjs, README.md, docs/tdd-evidence.md.
- [ ] Write and run a failing reduced-motion/explicit-motion-toggle test before motion code. Implement restrained animation with cancellation on motion off/visibility changes. Avoid animation when reduced motion is active.
- [ ] Add axe tests in both languages at desktop and mobile; no-JS/static anchors, image natural size, all viewport overflow, and console/network error checks.
- [ ] Run npm run check, npm test, npm run build, npm audit. Resolve findings rather than weakening assertions. Document all real command outcomes and genuine residual limitations.
- [ ] Produce desktop and mobile screenshots in test-results for parent inspection. Parent will perform fresh audit and independently rerun all checks before final commit/package.
