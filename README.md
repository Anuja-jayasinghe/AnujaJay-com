# Anuja Jayasinghe's Portfolio

My personal portfolio site — [anujajay.com](https://anujajay.com). Built with Next.js 16, TypeScript, and Tailwind CSS.

This is a personal asset, not a template for others to clone and run — this README documents how the site is built and what's notable about it, for future reference.

## ✨ Highlights

- **Data-driven, not hardcoded** - Projects (`src/data/projects.json`) and certificates (`src/data/certificates.json`) are stored as structured data and rendered by components, so adding a project or cert doesn't touch layout code.
- **Live GitHub contribution graph** - `src/lib/github-contributions.ts` queries the GitHub GraphQL API for real contribution data server-side, cached for an hour, and rendered as an interactive timeline (`GitHubTimelineServer.tsx` → `GitHubTimeline.tsx`).
- **`/cv` and `/resume` shortcuts** - Both permanently redirect straight to the CV PDF, via Next.js's built-in `redirects()` config (`next.config.ts`), so anyone can jump to my resume without hunting for a link.
- **Splash screen + smooth animations** - The vector signature draws with CSS, then Framer Motion reveals the portfolio.
- **Fully responsive** - Mobile-friendly navbar, layout, and sections.
- **Dark-themed design** - Modern, professional dark UI end to end.
- **Vercel Analytics & Speed Insights** built in for real usage/performance data.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Data:** GitHub GraphQL API (contributions), local JSON (projects, certificates)
- **Hosting/Analytics:** Vercel, Vercel Analytics, Speed Insights

## 📁 Project Structure

```
My-Portfolio/
├── public/
│   ├── Anuja_CV.pdf        # Resume, served at /cv and /resume
│   └── projects/           # Project images and assets
├── src/
│   ├── app/
│   │   ├── dir/             # Resume viewer route
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── layout/          # Navbar, Footer, SplashScreen
│   │   ├── sections/        # Hero, About, Portfolio, Skills, Contact, GitHubTimeline
│   │   └── ui/               # Shared UI primitives
│   ├── data/
│   │   ├── projects.json     # Project content
│   │   └── certificates.json # Certificate content
│   └── lib/
│       └── github-contributions.ts  # Server-side GitHub GraphQL fetch
└── docs/notes/               # Source content notes, design requirements
```

## 📦 Featured Projects

- **PayLedger** - Financial tracking system with bill management and automated email summaries
- **SolarEdge Analytics** - Real-time solar energy monitoring dashboard with OCR integration
- **ComponentOps** - Motion-enhanced React UI components library
- **CheckMS** - Professional check portfolio manager for LKR transactions

Full project data lives in [`src/data/projects.json`](src/data/projects.json).

## 🔗 Notable Routes

- `/cv` and `/resume` → permanent redirect to the CV PDF

## 📧 Contact

- **Email:** anujajayasinhe@gmail.com
- **GitHub:** [@Anuja-jayasinghe](https://github.com/Anuja-jayasinghe)
- **LinkedIn:** [anuja-jayasinghe](https://linkedin.com/in/anuja-jayasinghe)

## Contributors

- [Anuja Jayasinghe](https://github.com/Anuja-jayasinghe) — owner and developer.
- [Codex](https://github.com/codex) — AI coding collaborator on the responsive layout ([#56](https://github.com/Anuja-jayasinghe/AnujaJay-com/pull/56)) and splash screen ([#50](https://github.com/Anuja-jayasinghe/AnujaJay-com/issues/50)).

---

Built with ❤️ by Anuja Jayasinghe
