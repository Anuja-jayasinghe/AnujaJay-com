# Security, accessibility and developer-feel changes

Branch: `chore/security-a11y-devfeel` (off `origin/master`, not merged).
Every ID below is one commit. To remove one: `git revert <hash>`.
Reverts of items that touch the same file (noted below) can need a trivial
manual conflict fix.

Plain-language copy changes (the old "U" group) were deliberately **not** done.

## Security

| ID | Commit | What | Notes on removing |
|---|---|---|---|
| S1 | `c7c2765` | `npm audit fix`: Next 16.3.4 → 16.4.3, sharp, source-map-js, zod. Production audit: 3 vulnerabilities → 0. | Revert only if the new Next breaks something; you'd be shipping known RCE/SSRF advisories. |
| S2 | `7ecfe36` | CSP, X-Frame-Options, Permissions-Policy, COOP. Header-based CSP (no nonces) so the page stays static. Not applied to the PDF itself (Chrome's viewer inherits it and renders blank). `img-src` allows `cdn.jsdelivr.net` (devicon SVGs load directly) and `opengraph.githubassets.com`. | Delete the header entries in `next.config.ts`. |
| S3 | `73c4d3f` | GitHub section shows a generic message on error; real error is logged server-side. | Touches `GitHubTimelineServer.tsx` (also S5). |
| S4 | `6c8af4a` | devicon pinned to `v2.18.0` instead of `@latest`. | Touches `Skills.tsx`. |
| S5 | `75f7ca2` | GraphQL variables instead of string interpolation; timeline years computed from today (2024 → current year). | Touches `github-contributions.ts`, `GitHubTimelineServer.tsx`, `Skills.tsx`. |
| S6 | `85b923c` | Contact form: Web3Forms honeypot (`botcheck`), clear error if the access key is missing. | `Contact.tsx` (also A2, A3, A5, R1a). |
| S7 | `25af2f8` | CI runs `npm audit --omit=dev --audit-level=high`. | `.github/workflows/ci.yml`. |
| S8 | `1f76108` | JSON-LD escapes `<` (per the Next.js JSON-LD guide). | `layout.tsx`. |

**You still need to do:** lock the Web3Forms access key to `anujajay.com` in the Web3Forms dashboard.
Remaining audit findings are dev-only (vitest/tinypool); fixing them means a breaking vitest 3 → 5 bump.

## Accessibility and compatibility

| ID | Commit | What |
|---|---|---|
| A1 | `3b2ff84` | Fullscreen menu: dialog role, `aria-modal`, focus trap, Escape, focus restore, `dvh` sizing, scroll lock restored. |
| A2 | `d9f902b` | Accessible names for icon-only links (navbar, contact socials, logo). |
| A3 | `143c60c` | Heading order fixed (h1 first, Contact has a real h2); skip-to-content link. Visuals unchanged. |
| A4 | `656a9bc` | `prefers-reduced-motion`: decorative animation off (not the spinner), marquee becomes a static grid, framer-motion `reducedMotion="user"`, marquee duplicate rows `aria-hidden`. |
| A5 | `91a64c8` + A5b | Text size and semantics only: 10-11px minimum for meaningful text, decorative chrome `aria-hidden`, form error `role=alert`. The original subtle greys are kept (A5b restored them), so the faint greys still fall below WCAG AA contrast by design. |
| A6 | `cfbae48` | Frosted navbar backdrop after scrolling so the logo/menu stop overlapping text. Unchanged at top of page. |
| A7 | `03b6dd7` | PNG manifest icons (192/512), maskable entry, `themeColor`, no portrait lock. |
| A8 | `aa54df0` | README no longer claims a dark theme. |

## Real data instead of invented text (reverted)

Both items were reverted on request: live values go stale between releases,
and the original static decoration is preferred. The original footer and the
original "Initiate Broadcast" status panel are back.

| ID | Commit | Reverted by |
|---|---|---|
| R1a | `af3baa2` | "Revert R1a" (contact status block) |
| R1b | `1ade9bd` | "Revert R1b" (footer) |

## Easter eggs and extras

| ID | Commit | What | How to find it |
|---|---|---|---|
| E1 | `51cd4b1` | Console banner | Open DevTools |
| E2 | `f765248` | Fake-login terminal | ↑ ↑ ↓ ↓ ← → ← → B A |
| E3 | `3378a2a` | Replay the signature intro | Click the logo 5 times within 2 s |
| E4 | `be4eab1` | `/humans.txt`, `/.well-known/security.txt` | Visit the URLs. **security.txt expires 2027-10-29; renew it.** |
| E5 | `5b943dc` | Terminal-style 404 page | Visit any missing URL |
| E6 | `034c901` | Quick-jump command palette | Ctrl/Cmd+K or `/` (tip shown in the desktop menu) |

E1, E2 and E6 each add one line to `layout.tsx`; E3 and E6 touch `Navbar.tsx`.

## Not done, and why

- **E7 dark theme:** every component hardcodes light Tailwind colours, so a real dark theme is a full redesign pass.
- **E8 typed commands in Terminal One, and desktop Terminal One typing under reduced motion:** `TerminalOne.tsx` (and the splash files) are changed by two unmerged local commits on `fix/splash-intro-polish` (`ddab51c`, `e3f9b68`). Do these after that branch lands.
- **Plain-language UX (U1–U6):** skipped on request.

## Worth checking on the Vercel preview

1. `/dir/Anuja_CV.pdf` renders the framed PDF (could not be confirmed visually in automated testing).
2. Skills icons (the devicon rows) all show.
3. Contact form still sends a real message (the CSP allows `api.web3forms.com`).
4. Vercel Analytics / Speed Insights still report (same-origin scripts).
5. Wording of E2 (secret terminal), E4 (`humans.txt`, `security.txt`), and the console banner, since these speak as you.
