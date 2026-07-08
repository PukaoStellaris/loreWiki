import { useState } from "react";
import { AUTH_STORAGE_KEY } from "../lib/authConfig.js";

// Session-scoped auth shared by the gated lore pages.
export default function useSessionAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return sessionStorage.getItem(AUTH_STORAGE_KEY) === "true"; } catch { return false; }
  });

  const login = () => {
    setIsAuthenticated(true);
    try { sessionStorage.setItem(AUTH_STORAGE_KEY, "true"); } catch { /* private mode */ }
  };

  return { isAuthenticated, login };
}
