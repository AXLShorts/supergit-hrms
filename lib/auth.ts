"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  // Mock auth actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      async login(email, password) {
        // Simulate network delay
        await new Promise((r) => setTimeout(r, 500));

        const validEmails = ["admin@example.com", "employee@example.com"];
        const isValidEmail = validEmails.includes(email.toLowerCase());
        const isValidPassword = password === "password";
        if (!isValidEmail || !isValidPassword) {
          throw new Error("Invalid credentials");
        }

        const role = email.toLowerCase().includes("admin")
          ? "admin"
          : "employee";
        const mockUser: User = {
          id: role === "admin" ? "1" : "2",
          email,
          name: role === "admin" ? "Admin User" : "Employee User",
          role,
        };
        const mockToken = `mock-token-${role}`;

        // Persist token for API client and cookie for middleware
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("auth-token", mockToken);
            // Set cookie for Next.js middleware checks
            const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
            document.cookie = `auth-token=${encodeURIComponent(
              mockToken
            )}; Path=/; Expires=${expires.toUTCString()}`;
          }
        } catch {}

        set({ user: mockUser, token: mockToken, isAuthenticated: true });
      },
      logout() {
        try {
          if (typeof window !== "undefined") {
            localStorage.removeItem("auth-token");
            // Expire the cookie
            document.cookie =
              "auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
        } catch {}
        set({ user: null, token: null, isAuthenticated: false });
      },
      setUser: (user) =>
        set((state) => ({
          user,
          isAuthenticated: true,
        })),
      setToken: (token) =>
        set((state) => ({
          token,
        })),
      clearAuth: () =>
        set(() => {
          try {
            if (typeof window !== "undefined") {
              localStorage.removeItem("auth-token");
              document.cookie =
                "auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
            }
          } catch {}
          return {
            user: null,
            token: null,
            isAuthenticated: false,
          };
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper function to check if user has specific role
export function hasRole(user: User | null, role: string): boolean {
  return user?.role === role;
}

// Helper function to check if user is admin
export function isAdmin(user: User | null): boolean {
  return hasRole(user, "admin");
}

// Helper function to check if user is employee
export function isEmployee(user: User | null): boolean {
  return hasRole(user, "employee");
}
