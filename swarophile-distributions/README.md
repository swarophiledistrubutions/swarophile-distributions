# Swarophile Distributions

A Next.js export of the Swarophile Distributions marketing site + client portal
(artist dashboard, Team Access admin panel, ownership certificates).

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com/new and import the repo.
3. Vercel will auto-detect Next.js — no extra configuration is required for
   the site to build and go live.

That's it for the marketing site. Read the next section before you rely on
the client portal (login, Team Access, client data) for real users.

---

## Important: what is and isn't "real" in this export

This project was prototyped inside a sandboxed, single-file preview
environment with no backend. To make it a runnable Next.js project, some
things had to be adapted — and a couple of them are **not production-ready
as-is**. Please read this before putting real client data into it.

### 1. Data storage is currently browser-only (`lib/storage.js`)

The original prototype used a shared, server-side key-value store so that,
for example, a Team Access user could see every artist's data regardless of
which device created it. That kind of shared server storage doesn't exist
outside of the original preview environment, so `lib/storage.js` now uses
the browser's `localStorage` instead.

**What this means concretely:** each visitor's browser has its own,
separate copy of the client list. If you create a client account on your
laptop, it will not show up if you open the site on your phone, and a real
artist signing up on their own device will not appear in your Team Access
view on yours. The demo will look and behave correctly for one person
testing in one browser, but it will not function as a real shared system
for multiple real users until this is connected to an actual database.

**To fix this properly:** replace the internals of `lib/storage.js` (get /
set / delete / list) with calls to a real database — for example:
- [Supabase](https://supabase.com) (Postgres + auth, generous free tier, pairs well with Vercel)
- [Firebase](https://firebase.google.com) (Firestore)
- Your own Postgres/MySQL behind a few Next.js API routes in `app/api/`

Because every place in the app calls `storage.get(...)` / `storage.set(...)`
through this one file, swapping the internals here is a contained change —
nothing in `components/SwarophileApp.js` needs to know or care where the
data actually lives.

### 2. Passwords: real hashing, but no real session/auth system

Artist and Team Access passwords are hashed with real SHA-256 (via the
browser's Web Crypto API) before being stored — this is genuine hashing,
not obfuscation, so a stored hash can't practically be reversed back into
the original password.

What this does **not** give you: server-side session management, rate
limiting on login attempts, or protection against someone opening browser
dev tools and reading the app's in-memory data directly. All of the
"login" logic currently runs entirely in the browser. For real production
authentication, use a real auth provider (NextAuth.js / Auth.js, Clerk,
Supabase Auth, etc.) backed by server-side session verification.

### 3. The Team Access password (`Ns9356` by default, see `components/SwarophileApp.js`)

This is a plain string constant in client-side JavaScript, which means
anyone who opens browser dev tools can read it. It works as a casual
speed bump, not real access control. **Change this constant before
deploying anywhere semi-public, and don't reuse a real password here** —
treat it as already public.

### 4. Google Sign-In is a labeled demo, not real OAuth

The "Continue with Google (Demo)" button on the artist sign-up screen
fills in placeholder values — it does not talk to Google. Real Google
Sign-In requires a Google Cloud OAuth Client ID registered to a domain you
control, plus server-side verification of the returned token. Once this
project is deployed to its own domain, wiring up
[Google Identity Services](https://developers.google.com/identity/gsi/web)
or an auth provider that supports Google as a provider (e.g. NextAuth.js)
is the way to make this real.

### 5. Certificate QR codes

The QR code on each ownership certificate is generated via a free public
API (`api.qrserver.com`) and encodes the certificate's details as plain
text — it is a "scan to view details" QR, not a "scan to verify against
our live database" QR, because there is no server here to verify against.
If you want real verification, you'd add a page like
`/verify/[certificateId]` backed by your database, and point the QR at
that URL instead.

### 6. File uploads

There is no file upload/storage wired up in this export (audio, artwork).
Adding real uploads needs a storage service like AWS S3, Cloudflare R2, or
Vercel Blob, plus an API route to handle the upload securely server-side.

---

## Project structure

```
app/
  layout.js        — root HTML shell, page metadata
  page.js           — loads the app client-side only (ssr: false), since
                      the app relies on browser-only APIs (Web Crypto,
                      Tone.js audio, localStorage)
  globals.css        — minimal global reset (most styling is injected by
                       the component itself via <style> tags, matching how
                       it was originally built)
components/
  SwarophileApp.js  — the entire site: marketing pages, artist portal,
                       Team Access, certificate generator. One large file
                       by design, carried over from the original build.
lib/
  storage.js         — the localStorage-based data layer described above.
public/
  swarophile-logo.png
  ns-productions-logo.png
```

## Before you launch for real

- [ ] Replace `lib/storage.js` internals with a real database
- [ ] Add real authentication (NextAuth.js, Clerk, or similar)
- [ ] Change the Team Access password and move it out of client-side code
- [ ] Wire up real Google Sign-In (if you want it) once on your own domain
- [ ] Add real file upload storage for audio/artwork
- [ ] Add a real payment flow if you're moving off the Google Form
- [ ] Have the Terms/Privacy/Refund policy text reviewed by an actual lawyer
      before relying on it
