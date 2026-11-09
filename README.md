# EMPREZA 2026 — University Sports Championship Web App

Built with **Next.js 14**, **Tailwind CSS**, **Lucide Icons**, and **Firebase Firestore** (with automatic LocalStorage instant fallback so it works out-of-the-box with zero config!).

## Color Palette & Typography
- **Obsidian Black:** `#0C0C0C`
- **Amber Gold:** `#E7B736`
- **Sunset Orange:** `#FF6B00`
- **Pure White:** `#FFFFFF`
- **Display Typography:** Neue Plak inspired bold display styling (`Oswald` / `Syne` + `Inter`)

## How to Run Locally (Step-by-Step)

1. **Extract the ZIP file** and open the folder in **VS Code** or your terminal:
   ```bash
   cd empreza-2026-nextjs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Visit `http://localhost:3000`

5. **Admin Score Dashboard:**
   - Click the **"ADMIN SCORE"** button in the top-right navigation bar.
   - Enter the organizer PIN: `2026`
   - Update any team's points, add Gold Wins, or broadcast a live announcement!

## How to Deploy to Vercel (1-Minute Setup)
1. Push this folder to a GitHub repository, OR install Vercel CLI (`npm i -g vercel`) and run `vercel` inside the project directory.
2. (Optional) For multi-device cloud sync across all spectators' phones, create a free Firebase project, enable **Firestore Database**, and add your keys to `.env.local`:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

<!-- Ben10game#10 -->