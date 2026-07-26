/**
 * storage.js — replacement for the Claude-artifact `window.storage` API.
 *
 * IMPORTANT — READ THIS BEFORE DEPLOYING FOR REAL USERS:
 *
 * The original app (built inside Claude) used a `window.storage` API that
 * persists data on Anthropic's servers, shared across every visitor who
 * opens that artifact. That is NOT available outside of Claude, so this
 * file replaces it with `localStorage`, which is:
 *
 *   - Per-browser only. Data saved in Chrome on your laptop will not show
 *     up in Safari on your phone, or in anyone else's browser.
 *   - NOT actually "shared" between users, even though this shim keeps the
 *     same `shared` parameter for compatibility. There is no server here —
 *     everything lives in the visitor's own browser storage.
 *
 * Practically, this means once deployed to Vercel as-is:
 *   - Each artist's browser will have its OWN copy of the client list.
 *   - An admin will only see the clients that were created/edited in that
 *     same browser — not real clients signing up from their own devices.
 *
 * This is fine for local development, demos, and UI testing. It is NOT
 * fine for a real multi-user product. To make the "shared" data genuinely
 * shared across every real user, replace the body of get/set/deleteKey/list
 * below with calls to a real database (Supabase, Postgres via Prisma,
 * Firebase, etc.) through a Next.js API route (see app/api/ for where
 * those routes would live). The function signatures below are written so
 * that swap is a drop-in replacement — nothing calling `storage.get(...)`
 * elsewhere in the app needs to change.
 */

const PREFIX = 'swarophile:';

function keyFor(key, shared) {
  return `${PREFIX}${shared ? 'shared' : 'user'}:${key}`;
}

export const storage = {
  async get(key, shared = false) {
    try {
      const raw = localStorage.getItem(keyFor(key, shared));
      if (raw === null) return null;
      return { key, value: raw, shared };
    } catch (e) {
      return null;
    }
  },

  async set(key, value, shared = false) {
    try {
      localStorage.setItem(keyFor(key, shared), value);
      return { key, value, shared };
    } catch (e) {
      return null;
    }
  },

  async delete(key, shared = false) {
    try {
      localStorage.removeItem(keyFor(key, shared));
      return { key, deleted: true, shared };
    } catch (e) {
      return null;
    }
  },

  async list(prefix = '', shared = false) {
    try {
      const scoped = keyFor(prefix, shared);
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith(scoped)) keys.push(k.slice(`${PREFIX}${shared ? 'shared' : 'user'}:`.length));
      }
      return { keys, prefix, shared };
    } catch (e) {
      return null;
    }
  },
};
