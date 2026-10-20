# The Quiet Current — Roxy Landing

## Authority and scope
Abel explicitly authorized a complete creative rebuild: “kayanya kehapus. Kamu buat aja ulang bebas pakai astra”. The original source/repository is lost. Treat this as a new local project, not a restoration of unverifiable old code. Implementer: gpt-6-astra via openai-codex; no silent fallback. Parent owns final verification. No deployment, remote repository creation, service changes, model/config changes, or credentials access.

## Design
An intimate, editorial digital atelier for Roxy, Abel's AI mentor persona, not a SaaS template or a false official anime website. Concept: The Quiet Current. Midnight water background, restrained cyan, aged gold, warm ivory journal section, large serif display typography, disciplined asymmetry, generous but purposeful whitespace, hand-made water/rune motif. Avoid stock card grids, neon/glass overload, fake metrics, fabricated quotes, and fake online status. Original copy should communicate patient mentorship, engineering, research, and learning through failure. Clearly disclose AI persona/fan-made character inspiration. No audio/autoplay.

Hero artwork: ONLY assets/roxy-official.png, visually verified canonical Roxy (blue braids and black witch hat), 338×655 transparent PNG. Preserve aspect ratio, all head/hat/feet, no CSS masking/cropping, render crisply at realistic size. Source: https://mushokutensei.jp/wp-content/themes/mushoku_re/img/character/img_character02.png, source page https://mushokutensei.jp/character/. Third-party copyrighted artwork, credited, not relicensed as our code. Decorative SVG/rings should complement rather than dominate her.

## Architecture
Static semantic HTML + tokenized CSS + small ES modules. No runtime frameworks or third-party JS, no backend, tracking, remote fonts, or secrets. Content is usable without JavaScript; language and motion controls enhance it. Relative asset URLs support arbitrary subpaths and file browsing. LocalStorage preference failures must never break content. Self-host all assets. Use accessible system serif/sans/mono font stacks unless truly local licensed fonts are supplied.

## Behavior and acceptance
- Default Indonesian, complete Indonesian/English switch including metadata, aria labels and visible copy; document lang tracks choice and choice persists safely.
- One H1, correctly ordered headings, landmarks, skip link, descriptive links, strong visible focus, readable contrast, touch targets >=44px where interactive.
- Hero, about/ethos, a purposeful interactive grimoire (three concrete disciplines with working tabs or native disclosure), journal/process and real links/footer. No inert CTA or invented destinations; use local section anchors and https://github.com/aichrisz when needed.
- Optional restrained water animation with explicit motion toggle. Honor prefers-reduced-motion, pause on hidden page, no idle rAF loop with motion off; content never depends on animation or observer reveal.
- Responsive from 320 through 1440px; no overflow, overlapping type, clipped artwork, inaccessible mobile navigation, or sticky header hiding anchor targets.
- Test normal, reduced-motion, no-JS, storage-disabled, keyboard, real image loading, language reload, tabs/links and all viewport widths.
- No console errors or failed requests on a healthy local server. Axe WCAG 2A/AA + 2.1AA zero violations at mobile/desktop in both languages.
- Production payload goal <250KB uncompressed; no build required for source usage. Build creates a safe static dist folder without copying private docs, tests, node_modules, or symlinks.

## Tooling
Node built-ins for build/server if needed. Dev-only exact pins: @playwright/test 1.64.1 and axe-core 4.14.0, install with --ignore-scripts. Existing Chromium /root/.hermes/tools/chromium-1208/chrome-linux/chrome (linux arm64). A portable env override for executable is permitted; document it, never hardcode as a universal requirement. npm scripts: build, test, check (syntax/static). Record executed TDD red/green commands and real results, never invented output. Parent reruns independently.
