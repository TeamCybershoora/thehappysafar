import { ensureAdminDocument } from "./adminStore";

let initPromise: Promise<void> | null = null;

export function primeAdminAccount() {
  if (!initPromise) {
    initPromise = ensureAdminDocument()
      .then(() => undefined)
      .catch((error) => {
        console.error("[admin:init] failed to seed admin document", error);
        initPromise = null;
      });
  }
  return initPromise;
}

// Fire immediately on module load (server-side only).
if (typeof window === "undefined") {
  primeAdminAccount();
}
