# TaxCode: Project Documentation

## 1. Project Vision & Idea

**TaxCode** is a premier tax technology ecosystem designed for Nigeria's upcoming **2026 Tax Reform Act**. The platform's core mission is to provide a strategic and inclusive transition for individuals, businesses, and public institutions into Nigeria’s new tax landscape.

It aims to demystify tax compliance by combining AI-driven tools, comprehensive training, and real-time analytics, making tax management simpler, more transparent, and more efficient for everyone.

---

## 2. Core Features

The platform is built around four key pillars:

| Feature Pillar                        | Description                                                                                                    | Status      |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ----------- |
| **1. AI Tax Assistant**               | An intelligent chatbot trained on Nigerian tax law to provide instant, accurate answers to complex tax questions.  | ✅ Done     |
| **2. Interactive Tools**              | A suite of utilities to help users calculate liabilities, check compliance, and manage deadlines.                 |  Work In Progress |
| **3. Gamified Learning Modules (CMS)** | A content management system for creating and managing training modules on the new Tax Reform Act.              | ✅ Done     |
| **4. Real-Time Compliance Monitoring**  | An advanced analytics dashboard that provides a live overview of tax obligations and compliance performance.     | ✅ Done     |

---

## 3. What's Been Done (Current Status)

The foundational structure of the TaxCode platform has been successfully implemented.

#### ✅ **Homepage & Core Structure**
- A complete, responsive marketing homepage has been built to communicate the project's vision, features, training schedule, and fee structure.
- Secure user authentication (Login/Signup/Session Management) is fully integrated using **Firebase Authentication**.
- A modern, responsive dashboard layout serves as the central hub for all authenticated users.

#### ✅ **AI & Machine Learning**
- **AI Tax Assistant:**
    - The AI can answer questions about Nigerian tax law by leveraging a Firestore-based knowledge base.
    - **Text-to-Speech:** The assistant can speak its answers in multiple languages (English, Hausa, Yoruba, Igbo).
- **AI Tax Calculator:** A tool that uses an AI flow to estimate tax liability based on user inputs like income and dependents.

#### ✅ **Content & User Management**
- **Knowledge Base CMS:** A full CRUD (Create, Read, Update, Delete) interface in the dashboard allows admins to manage the articles that power the AI assistant.
- **Training Modules CMS:** Admins can create and manage training modules, including titles, dates, and topics.
- **Faculty Management:** A complete system for adding, editing, and removing expert profiles from the dashboard, which are then dynamically displayed on the homepage.

#### ✅ **Dashboard & Analytics**
- An **Advanced Analytics Dashboard** is live, showcasing key metrics like tax liability trends, compliance scores, and risk assessments with interactive charts.

---

## 4. What's Left (Future Roadmap)

While the core is robust, several high-impact features are planned to complete the ecosystem.

#### 🟡 **Expand Interactive Tools**
The "Interactive Tools" page is currently a placeholder for the following key utilities that need to be built:
- **Compliance Checker:** An automated tool to verify a user's or business's compliance status against new regulations.
- **Document Generator:** A feature to automate the creation of essential tax forms and documents.
- **Deadline Tracker:** A system to track important filing dates and send automated reminders.

#### 🟡 **Enhance Training Modules**
- The module creation CMS is done, but the modules themselves are not yet viewable in detail. A page is needed to display the full content of each training module.
- Implement "gamification" features like badges, leaderboards, and progress tracking to improve user engagement with the training content.

#### 🟡 **Build Community & User Interaction**
- **Community Forum:** The "Community Forum" link in the dashboard is a placeholder. A dedicated space for users to discuss tax issues and share knowledge is a key future goal.
- **User Profile/Settings Page:** A settings page for users to manage their profile, notification preferences, and other account details.

#### 🟡 **Refine AI Capabilities**
- The AI's knowledge is currently limited to the articles in the Firestore knowledge base. Future work could involve enabling it to process and learn from uploaded documents (like PDFs of tax code sections).

---

## 5. Authentication Setup (Firebase)

Follow these steps to enable OAuth sign-in (Google and GitHub) and server-side session cookies.

- **Client environment variables** (add to `.env.local`):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
```

- **Server environment variables** (add to deployment environment or `.env.local` if running locally):

```env
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

- **Enable providers in Firebase Console**:
    - Go to Firebase Console → Authentication → Sign-in method.
    - Enable **Google**.
    - Enable **GitHub** and register an OAuth App on GitHub; paste client ID/secret into Firebase.

- **Behavior in this repo**:
    - Client: `src/lib/firebase-client.ts` includes `signInWithGoogle()` and `signInWithGithub()` helpers that use popup sign-in, then call the server action `createSession(idToken)` to create a secure HTTP-only session cookie.
    - Server: `src/lib/firebase-server.ts` initializes `firebase-admin` using `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.
    - Session verification helper: `src/lib/session.ts` verifies session cookies on the server.
    - Protection: `middleware.ts` redirects unauthenticated users away from `/dashboard`, and `src/app/dashboard/layout.tsx` performs server-side verification and redirects to `/login` when the cookie is invalid.

---

## 7. Role-Based Access Control (RBAC)

The platform implements role-based access control to protect admin-only pages and features.

**User Roles:**
- `admin` — Full access to all dashboard pages, including faculty management, training modules, knowledge base, and user role management.
- `moderator` — Moderate content and manage some features (can be customized).
- `user` — Standard user; access only to public pages (Dashboard, Assistant, Calculator, Tools, Community Forum).

**Protected Pages:**
- `/dashboard/team` (Faculty & User Roles Management) — admin only
- `/dashboard/modules` (Training Modules CMS) — admin only
- `/dashboard/knowledge` (Knowledge Base CMS) — admin only
- `/dashboard/tools` (Interactive Tools) — admin only

**User Role Management:**
1. Go to **Dashboard → Faculty** tab, then click **User Roles** tab.
2. You'll see all registered users with their current roles.
3. Use the dropdown to change a user's role (User, Moderator, Admin).
4. Changes are saved immediately and affect the user's next session.

**How it works:**
- On first login (email, Google, or GitHub), a user record is created in Firestore with default role `user`.
- Admins can upgrade or downgrade user roles via the **User Roles** management page.
- Non-admin users who try to access admin pages are redirected to `/dashboard`.
- Sidebar menu items dynamically show/hide based on the logged-in user's role.

---

## 8. Initial Admin Setup

To create the initial admin user, run:

```bash
npx tsx scripts/setup-admin.ts
```

This will create:
- **Email:** `info@taxcode.com.ng`
- **Password:** `Lapinreform5%`
- **Role:** `admin`

The script requires `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY` to be set in `.env.local`.

---

## 9. Local testing

- Start the dev server:

```bash
pnpm install
pnpm dev
```

- Test flows manually:
    - Sign up with email/password (creates account and server session cookie).
    - Sign in with Google/GitHub (ensure providers are configured in Firebase and OAuth app on GitHub is registered).
    - Sign out via the Logout button (clears both client auth state and server session cookie).
    - Create a second test user and promote them to `admin` via the **User Roles** tab in the Faculty page.
    - Log in as the new admin and verify access to all admin pages.
    - Log in as a regular user and verify they cannot access admin pages.

If you'd like, I can also add automated tests for session verification and a short `AUTH.md` with screenshots.
