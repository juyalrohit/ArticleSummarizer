"use client";

import { useEffect, useMemo, useState } from "react";

type Article = {
  id: string;
  title: string;
  content: string;
  authorId?: string;
  summary?: string;
  updatedAt: string;
};

type SessionUser = {
  id: string;
  email: string;
  role: "Admin" | "User";
};

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [roleChoice, setRoleChoice] = useState<"Admin" | "User">("User");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState("");

  const loadArticles = async (search = "") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/articles?q=${encodeURIComponent(search)}`);
      return await response.json();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isActive = true;

    const loadSession = async () => {
      const response = await fetch("/api/auth/me");
      const data = await response.json();
      if (isActive) {
        setSessionUser(data.user ?? null);
      }
    };

    const load = async () => {
      await loadSession();
      const data = await loadArticles();
      if (isActive) {
        setArticles(data.articles ?? []);
      }
    };

    void load();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredArticles = useMemo(() => articles, [articles]);
  const groupedArticles = useMemo(() => {
    if (!sessionUser || sessionUser.role !== "Admin") return [];

    return filteredArticles.reduce<Record<string, Article[]>>((acc, article) => {
      const label = article.authorId ? `User ${article.authorId.slice(-4)}` : "Unknown author";
      acc[label] = [...(acc[label] ?? []), article];
      return acc;
    }, {});
  }, [filteredArticles, sessionUser]);

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role: authMode === "signup" ? roleChoice : undefined }),
    });
    const data = await response.json();
    if (!response.ok) {
      setAuthMessage(data.error ?? "Authentication failed.");
      return;
    }
    setSessionUser(data.user);
    setAuthMessage(`${authMode === "login" ? "Signed in" : "Account created"} successfully.`);
    setEmail("");
    setPassword("");
    await loadArticles();
    const fresh = await fetch("/api/auth/me");
    const me = await fresh.json();
    setSessionUser(me.user ?? null);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setSessionUser(null);
    setAuthMessage("Signed out.");
    setArticles([]);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `/api/articles/${editingId}` : "/api/articles";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      setTitle("");
      setContent("");
      setEditingId(null);
      const data = await loadArticles(query);
      setArticles(data.articles ?? []);
    }
  };

  const startEdit = (article: Article) => {
    setEditingId(article.id);
    setTitle(article.title);
    setContent(article.content);
  };

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setAuthMessage("You can only delete your own articles unless you are an admin.");
      return;
    }
    const data = await loadArticles(query);
    setArticles(data.articles ?? []);
  };

  const handleSummarize = async (id: string) => {
    const response = await fetch(`/api/articles/${id}/summarize`);
    if (!response.ok) {
      setAuthMessage("Summarization is available only after login.");
      return;
    }
    const data = await response.json();
    setArticles((prev) =>
      prev.map((article) => (article.id === id ? data.article : article)),
    );
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#0f172a_0%,#111827_45%,#1f2937_100%)] text-white">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-10 lg:px-8">
        <header className="rounded-3xl border border-white/10 bg-white/8 p-8 shadow-2xl shadow-black/20 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Platorform</p>
          <h1 className="mt-3 text-4xl font-semibold text-white md:text-5xl">Write, manage, search, and summarize articles in one place.</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            This starter platform models a primary article store, a search index path, and on-demand AI summaries cached for fast reuse.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-100">
            <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-2">CRUD-ready article workflow</span>
            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-4 py-2">Elastic-style full-text search</span>
            <span className="rounded-full border border-violet-400/40 bg-violet-400/10 px-4 py-2">Redis-style summary cache</span>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Authentication & roles</h2>
              <p className="mt-1 text-slate-300">Admin sees all articles; users manage only their own drafts.</p>
            </div>
            {sessionUser ? (
              <button type="button" onClick={handleLogout} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800">Logout</button>
            ) : null}
          </div>
          {sessionUser ? (
            <p className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/8 p-3 text-sm text-emerald-100">Signed in as <strong>{sessionUser.email}</strong> ({sessionUser.role}).</p>
          ) : (
            <form onSubmit={handleAuth} className="mt-4 space-y-3">
              <div className="flex gap-2">
                <button type="button" onClick={() => setAuthMode("login")} className={`rounded-full px-4 py-2 text-sm ${authMode === "login" ? "bg-cyan-400 text-slate-950" : "border border-slate-700 bg-slate-900 text-slate-100"}`}>Login</button>
                <button type="button" onClick={() => setAuthMode("signup")} className={`rounded-full px-4 py-2 text-sm ${authMode === "signup" ? "bg-cyan-400 text-slate-950" : "border border-slate-700 bg-slate-900 text-slate-100"}`}>Sign up</button>
              </div>
              <input value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" placeholder="Email" />
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white" placeholder="Password" />
              {authMode === "signup" ? (
                <select value={roleChoice} onChange={(event) => setRoleChoice(event.target.value as "Admin" | "User")} className="w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white">
                  <option value="User">User</option>
                  <option value="Admin">Admin</option>
                </select>
              ) : null}
              <button type="submit" className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-cyan-300">{authMode === "login" ? "Sign in" : "Create account"}</button>
            </form>
          )}
          {authMessage ? <p className="mt-3 text-sm text-cyan-100">{authMessage}</p> : null}
        </section>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold">Article workspace</h2>
                <p className="mt-1 text-slate-300">Create new content or update existing drafts in place.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setContent("");
                }}
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800"
              >
                New article
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <label className="block text-sm text-slate-200">
                Title
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none ring-0 transition focus:border-cyan-400"
                  placeholder="Article title"
                />
              </label>
              <label className="block text-sm text-slate-200">
                Content
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={6}
                  className="mt-1 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                  placeholder="Write your article here..."
                />
              </label>
              <button
                type="submit"
                className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
              >
                {editingId ? "Update article" : "Create article"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold">Fast search index</h2>
                <p className="mt-1 text-slate-300">Filter titles, bodies, and summaries from the article index.</p>
              </div>
              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-emerald-200">Search</span>
            </div>
            <input
              value={query}
              onChange={async (event) => {
                const nextValue = event.target.value;
                setQuery(nextValue);
                const data = await loadArticles(nextValue);
                setArticles(data.articles ?? []);
              }}
              className="mt-5 w-full rounded-2xl border border-slate-700 bg-slate-900 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
              placeholder="Search article index"
            />
            <p className="mt-3 text-xs text-slate-400">This uses the same query path the real Elasticsearch layer would use for full-text search.</p>
          </section>
        </div>

        {sessionUser?.role === "Admin" ? (
          <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20 backdrop-blur">
            <h2 className="text-2xl font-semibold">Admin overview</h2>
            <p className="mt-1 text-slate-300">Grouped view of all authored articles for quick oversight.</p>
            <div className="mt-5 space-y-4">
              {Object.entries(groupedArticles).map(([author, items]) => (
                <article key={author} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
                  <h3 className="text-lg font-semibold text-cyan-100">{author}</h3>
                  <ul className="mt-2 space-y-2 text-sm text-slate-200">
                    {items.map((item) => <li key={item.id} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">{item.title}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="flex items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold">Article list</h2>
              <p className="mt-1 text-slate-300">Read, update, delete, or summarize each article on demand.</p>
            </div>
            {loading ? <span className="text-sm text-cyan-200">Loading…</span> : null}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.length === 0 ? (
              <article className="rounded-3xl border border-dashed border-slate-700 bg-slate-900/70 p-5 text-slate-300">No articles yet. Create your first draft to populate the platform.</article>
            ) : (
              filteredArticles.map((article) => (
                <article key={article.id} className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg shadow-black/20">
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-200">Article</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">{article.title}</h3>
                  <p className="mt-3 text-sm text-slate-200">{article.content}</p>
                  <p className="mt-4 text-xs text-slate-400">Updated {new Date(article.updatedAt).toLocaleString()}</p>
                  {article.summary ? (
                    <div className="mt-4 rounded-2xl border border-violet-500/30 bg-violet-500/8 p-3 text-sm text-violet-100">{article.summary}</div>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(article)}
                      className="rounded-full border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-100 hover:bg-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleSummarize(article.id)}
                      className="rounded-full bg-violet-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-violet-300"
                    >
                      Summarize
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(article.id)}
                      className="rounded-full bg-rose-400 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-rose-300"
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

