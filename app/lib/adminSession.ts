"use client";

const STORAGE_KEY = "ths_admin_session";
const EXPIRY_MS = 5 * 24 * 60 * 60 * 1000; // 5 days

export type StoredSession = {
  expiresAt: number;
  adminName?: string;
  adminEmail?: string;
};

const getNow = () => Date.now();

export const readSession = (): StoredSession | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    return null;
  }
};

export const isAdminSessionActive = () => {
  const session = readSession();
  if (!session) return false;
  return session.expiresAt > getNow();
};

export const persistAdminSession = (admin?: { name?: string; email?: string }) => {
  if (typeof window === "undefined") return;
  const expiresAt = getNow() + EXPIRY_MS;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      expiresAt,
      adminName: admin?.name,
      adminEmail: admin?.email,
    })
  );
};

export const clearAdminSession = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
};

export const getActiveAdmin = () => {
  const session = readSession();
  if (!session) return null;
  if (session.expiresAt <= getNow()) {
    clearAdminSession();
    return null;
  }
  const { adminName, adminEmail } = session;
  if (!adminName && !adminEmail) return null;
  return { name: adminName, email: adminEmail };
};
