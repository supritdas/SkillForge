// utils/peer.js — Helpers for peer match display

/** Normalize a student ref (populated doc or raw ObjectId string). */
export const getStudentId = (student) =>
  String(student?._id ?? student?.id ?? student ?? "");

/**
 * Return the matched peer (the other student) for the current user.
 */
export const getPeerFromMatch = (match, currentUserId) => {
  const myId = String(currentUserId ?? "");
  const students = match?.students ?? [];

  if (!students.length) return null;

  const peer = students.find((s) => getStudentId(s) !== myId);
  if (peer && (peer.name || peer.email)) return peer;

  // Fallback: first student that isn't the current user, or second slot
  if (students.length >= 2) {
    const other = students.find((s) => getStudentId(s) !== myId) ?? students[1];
    return typeof other === "object" ? other : null;
  }

  return null;
};
