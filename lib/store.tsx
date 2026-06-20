"use client";

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Article = {
  id: string;
  title: string;
  content: string;
  authorId?: string;
  summary?: string;
  updatedAt: string;
};

export type SessionUser = {
  id: string;
  name?: string;
  email: string;
  role?: string;
};

// ─── Real fetch wrapper ───────────────────────────────────────────────────────
// Calls your actual Next.js API routes. Credentials: "include" sends the
// session cookie that your /api/auth/* routes set on the response.

async function apiFetch(
  url: string,
  options?: RequestInit,
): Promise<{ ok: boolean; data: Record<string, unknown> }> {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string> | undefined),
    },
    ...options,
  });

  let data: Record<string, unknown> = {};
  try {
    data = await res.json();
  } catch {
    // Non-JSON body (e.g. 204 No Content) — leave data as {}
  }

  return { ok: res.ok, data };
}

// ─── Context ──────────────────────────────────────────────────────────────────

type ArticleStore = {
  // Auth
  sessionUser: SessionUser | null;
  authLoading: boolean;
  authMessage: string;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  clearAuthMessage: () => void;

  // Articles
  articles: Article[];
  articlesLoading: boolean;
  fetchArticles: (query?: string) => Promise<void>;
  createArticle: (title: string, content: string) => Promise<boolean>;
  updateArticle: (id: string, title: string, content: string) => Promise<boolean>;
  deleteArticle: (id: string) => Promise<{ ok: boolean; error?: string }>;
  summarizeArticle: (id: string) => Promise<{ ok: boolean; cached?: boolean; error?: string }>;

  // Admin helpers
  groupedByAuthor: Record<string, Article[]>;
};

const Ctx = createContext<ArticleStore | null>(null);

export function ArticulaProvider({ children }: { children: ReactNode }) {
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [articlesLoading, setArticlesLoading] = useState(false);

  // ── Fetch articles ──────────────────────────────────────────────────────────
  const fetchArticles = useCallback(async (query = "") => {
    setArticlesLoading(true);
    try {
      const { data } = await apiFetch(`/api/articles?q=${encodeURIComponent(query)}`);
      setArticles((data.articles as Article[]) ?? []);
    } finally {
      setArticlesLoading(false);
    }
  }, []);

  // ── Bootstrap session on mount ──────────────────────────────────────────────
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await apiFetch("/api/auth/me");
        if (!active) return;
        setSessionUser((data.user as SessionUser) ?? null);
        await fetchArticles();
      } finally {
        if (active) setAuthLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [fetchArticles]);

  // ── Auth actions ────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    const { ok, data } = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (!ok) {
      setAuthMessage((data.error as string) ?? "Login failed.");
      return false;
    }
    setSessionUser((data.user as SessionUser) ?? null);
    setAuthMessage("Signed in successfully.");
    await fetchArticles();
    return true;
  };

  const signup = async (name: string, email: string, password: string) => {
    const { ok, data } = await apiFetch("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    if (!ok) {
      setAuthMessage((data.error as string) ?? "Signup failed.");
      return false;
    }
    setSessionUser((data.user as SessionUser) ?? null);
    setAuthMessage("Account created successfully.");
    await fetchArticles();
    return true;
  };

  const logout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    setSessionUser(null);
    setArticles([]);
    setAuthMessage("Signed out.");
  };

  // ── Article actions ─────────────────────────────────────────────────────────
  const createArticle = async (title: string, content: string) => {
    const { ok } = await apiFetch("/api/articles", {
      method: "POST",
      body: JSON.stringify({ title, content }),
    });
    if (ok) await fetchArticles();
    return ok;
  };

  const updateArticle = async (id: string, title: string, content: string) => {
    const { ok } = await apiFetch(`/api/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
    });
    if (ok) await fetchArticles();
    return ok;
  };

  const deleteArticle = async (id: string) => {
    const { ok, data } = await apiFetch(`/api/articles/${id}`, { method: "DELETE" });
    if (ok) await fetchArticles();
    return { ok, error: data.error as string | undefined };
  };

  const summarizeArticle = async (id: string) => {
    const { ok, data } = await apiFetch(`/api/articles/${id}/summarize`);
    if (!ok) return { ok: false, error: data.error as string | undefined };
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? (data.article as Article) : a)),
    );
    return { ok: true, cached: data.cached as boolean | undefined };
  };

  // ── Admin: group articles by author ────────────────────────────────────────
  const groupedByAuthor: Record<string, Article[]> = {};
  if (sessionUser?.role === "Admin") {
    for (const article of articles) {
      const label = article.authorId
        ? `User …${article.authorId.slice(-4)}`
        : "Unknown";
      groupedByAuthor[label] = [...(groupedByAuthor[label] ?? []), article];
    }
  }

  return (
    <Ctx.Provider
      value={{
        sessionUser,
        authLoading,
        authMessage,
        login,
        signup,
        logout,
        clearAuthMessage: () => setAuthMessage(""),
        articles,
        articlesLoading,
        fetchArticles,
        createArticle,
        updateArticle,
        deleteArticle,
        summarizeArticle,
        groupedByAuthor,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useArticula() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useArticula must be used inside <ArticulaProvider>");
  return ctx;
}
