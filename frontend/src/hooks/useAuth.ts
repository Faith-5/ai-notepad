import { useState, useEffect, useCallback } from "react";
import type { User } from "@/types";

// Dummy user for demo
const DUMMY_USER: User = { id: "1", name: "Alex Johnson", email: "alex@example.com" };

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser(DUMMY_USER);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder: replace with api.login(email, password)
      await new Promise((r) => setTimeout(r, 800));
      if (!email || !password) throw new Error("Email and password required");
      localStorage.setItem("token", "demo-token");
      setUser(DUMMY_USER);
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 800));
      if (!name || !email || !password) throw new Error("All fields required");
      localStorage.setItem("token", "demo-token");
      setUser({ ...DUMMY_USER, name, email });
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
  }, []);

  return { user, loading, error, login, signup, logout, isAuthenticated: !!user };
}
