// store/atoms.js — Recoil atoms (global state pieces)
//
// Recoil works like useState but globally accessible from any component.
// Each atom has a unique key and a default value.

import { atom } from "recoil";

/**
 * Stores the currently logged-in user object (or null if not logged in).
 * Shape: { _id, name, email, role, xp, badges, skillMetrics, enrolledCourses }
 */
export const userAtom = atom({
  key: "userAtom",
  default: null,
});

/**
 * The JWT token string (stored in memory + localStorage for persistence).
 */
export const tokenAtom = atom({
  key: "tokenAtom",
  default: localStorage.getItem("skillforge_token") || null,
});

/**
 * Stream Chat token for the logged-in user.
 */
export const streamTokenAtom = atom({
  key: "streamTokenAtom",
  default: localStorage.getItem("skillforge_stream_token") || null,
});

/**
 * List of all courses (used on the browse page).
 */
export const coursesAtom = atom({
  key: "coursesAtom",
  default: [],
});

/**
 * Global loading state (shows a spinner overlay).
 */
export const loadingAtom = atom({
  key: "loadingAtom",
  default: false,
});

/**
 * Global notification toast { type: "success"|"error", message: "" }
 */
export const toastAtom = atom({
  key: "toastAtom",
  default: null,
});
