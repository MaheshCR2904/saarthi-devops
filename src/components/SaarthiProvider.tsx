"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
  lifeStage: string;
  age: number | null;
  interests: string[];
  skills: string[];
  goals: string[];
  education: string;
  stream: string;
  college: string;
  cgpa: number;
  currentRole: string;
  currentCompany: string;
  currentSalary: number;
  targetRole: string;
  location: string;
  careerScore: number;
  financeScore: number;
  skillsScore: number;
  wellbeingScore: number;
  overallLifeScore: number;
  currentStreak: number;
  longestStreak: number;
  monthlySavings: number;
  monthlyIncome: number;
}

interface SaarthiContextType {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const SaarthiContext = createContext<SaarthiContextType>({
  user: null,
  loading: true,
  setUser: () => {},
  refreshUser: async () => {},
});

export function useSaarthi() {
  return useContext(SaarthiContext);
}

const publicPaths = ["/", "/login", "/register", "/landing"];

const getAuthHeaders = (): HeadersInit => {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("saarthi_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function SaarthiProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me", {
          headers: getAuthHeaders(),
        });
        const data = res.ok ? await res.json() : null;
        if (!ignore) setUser(data?.user ?? null);
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadUser();
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!loading && !user && !publicPaths.includes(pathname || "")) {
      router.push("/login");
    }
  }, [loading, user, pathname, router]);

  return (
    <SaarthiContext.Provider value={{ user, loading, setUser, refreshUser }}>
      {children}
    </SaarthiContext.Provider>
  );
}
