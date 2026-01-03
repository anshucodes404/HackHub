# HackHub — Hackathon Managing App

<div align="center">
  <h3>Beautiful, minimal dashboard for hackathon management</h3>

  <!-- Tech badges -->
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Lucide_react-111827?logo=react&logoColor=white" alt="lucide-react" />
    <img src="https://img.shields.io/badge/Cloudinary-063A7C?logo=cloudinary&logoColor=white" alt="Cloudinary" />
    <img src="https://img.shields.io/badge/Framer_Motion-0055FF?logo=framer&logoColor=white" alt="Framer Motion" />
  </p>

  <p>
    <em>A polished UI for organisers & participants — profiles, invites, teams, hosted & participated hackathons.</em>
  </p>
</div>

---

## ✨ Highlights

- Modern Next.js (App Router) + TypeScript codebase.
- Responsive UI built with Tailwind CSS and accessibility-minded components.
- Profile editing modal with optimistic UI and loader overlay (size stable while saving).
- Serverless API routes (Next.js) with Mongoose for MongoDB.
- Integrations: Cloudinary for uploads, lucide-react icons, Framer Motion for subtle animations.

---

## 🧭 Quick start

Prerequisites: Node.js (18+ recommended), npm.

1. Install
   ```bash
   npm install
   ```

2. Environment
   - Copy `.env.example` → `.env` and populate:
     - DATABASE_URI, NEXT_PUBLIC_CLOUDINARY, JWT_SECRET, etc. (project-specific)
   - Example (not included here): MONGO connection string, Cloudinary credentials, email config.

3. Run (dev)
   ```bash
   npm run dev
   ```

4. Build / start
   ```bash
   npm run build
   npm start
   ```

---

## 📦 Available scripts

- `npm run dev` — start dev server (Next.js)
- `npm run build` — production build
- `npm start` — start production server
- `npm run lint` — lint project

(See package.json for current script details.)

---

## 🗂 Project structure (top-level)

- `app/` — Next.js app router pages & API routes
- `components/` — UI components (Profile, UI primitives, Loader, Toast)
- `styles/` — global & theme CSS (Tailwind config)
- `api/` — Next API handlers (under `app/api`)
- `README.md`, `package.json`, `tsconfig.json`

---

## 🔧 Tech stack

- Next.js — fast SSR/SSG + App Router
- React — UI library
- TypeScript — static types
- Tailwind CSS — utility-first styling
- MongoDB + Mongoose — database
- lucide-react — icons
- Cloudinary — image uploads
- Framer Motion — animations
- Nodemailer — email (invites/notifications)

---

## ♻️ Contributing

- Fork repository, create feature branch, open PR.
- Keep changes focused; lint & type-check before PR.
- Add tests for new logic where applicable.

---

## 📝 Notes & Maintenance

- Ensure Tailwind is compiled (postcss config) when modifying styles.
- API routes expect authentication for protected endpoints — check `app/api/auth` for auth flow.
- Keep secrets out of repository; use environment variables.

---

## 📜 License

MIT — see LICENSE file.

---


