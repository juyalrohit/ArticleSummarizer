import Link from "next/link";
import {
  ArrowRight,
  Zap,
  Search,
  Brain,
  Shield,
  Database,
  Layers,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ArticleGrid } from "@/components/article/article-grid";
import { articles } from "@/lib/data";

const features = [
  {
    icon: Layers,
    title: "Article Management",
    description: "Write, edit, and organize your articles in a beautiful, distraction-free editor inspired by Notion.",
    color: "from-purple-500/20 to-violet-500/20",
    iconColor: "text-purple-400",
  },
  {
    icon: Brain,
    title: "AI-Powered Summaries",
    description: "Generate intelligent summaries for any article in seconds using advanced language models.",
    color: "from-blue-500/20 to-cyan-500/20",
    iconColor: "text-blue-400",
  },
  {
    icon: Search,
    title: "Semantic Search",
    description: "Find exactly what you're looking for with full-text search powered by Elasticsearch.",
    color: "from-green-500/20 to-emerald-500/20",
    iconColor: "text-green-400",
  },
  {
    icon: Database,
    title: "Redis Caching",
    description: "Lightning-fast response times with intelligent caching of summaries and search results.",
    color: "from-orange-500/20 to-red-500/20",
    iconColor: "text-orange-400",
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Granular permissions for admins and users. Manage content securely at scale.",
    color: "from-pink-500/20 to-rose-500/20",
    iconColor: "text-pink-400",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Collaborate and see changes in real-time with WebSocket-powered live updates.",
    color: "from-yellow-500/20 to-amber-500/20",
    iconColor: "text-yellow-400",
  },
];

const stats = [
  { value: "50K+", label: "Articles Published" },
  { value: "12K+", label: "Active Writers" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "< 200ms", label: "Search Latency" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto text-center">
          {/* Pill label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium mb-8">
            <Zap size={13} />
            Powered by AI · Built for writers
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Write, Search &{" "}
            <span className="gradient-text">Summarize Articles</span>{" "}
            with AI
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            The modern platform where ideas take shape. Create compelling articles, discover insights, and let AI distill complex content into clear summaries — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/dashboard">
              <button className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold text-base hover:from-purple-500 hover:to-blue-500 transition-all duration-300 shadow-xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5">
                Start Writing Free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link href="/explore">
              <button className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-border bg-secondary/50 text-foreground font-semibold text-base hover:bg-secondary hover:border-purple-500/40 transition-all duration-300">
                <Search size={16} />
                Explore Articles
              </button>
            </Link>
          </div>

          {/* Dashboard Mockup */}
          <div className="relative max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10 pointer-events-none rounded-3xl" style={{ top: "70%" }} />
            <div className="relative rounded-3xl border border-border bg-card overflow-hidden shadow-2xl shadow-black/50 glow-purple">
              {/* Mock browser bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/50">
                <div className="flex gap-1.5">
                  {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                    <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex-1 bg-background/50 rounded-md px-3 py-1 text-xs text-muted-foreground max-w-xs mx-auto">
                  articula.io/dashboard
                </div>
              </div>
              {/* Mock dashboard content */}
              <div className="grid grid-cols-12 h-80">
                {/* Sidebar */}
                <div className="col-span-2 bg-secondary/30 border-r border-border p-3 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className={`h-7 rounded-lg ${i === 0 ? "bg-purple-500/30" : "bg-secondary/50"}`} />
                  ))}
                </div>
                {/* Main content */}
                <div className="col-span-10 p-5 space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { c: "purple", v: "47", l: "Articles" },
                      { c: "blue", v: "32", l: "Summaries" },
                      { c: "green", v: "184K", l: "Views" },
                      { c: "orange", v: "9.4K", l: "Searches" },
                    ].map(({ c, v, l }) => (
                      <div key={l} className={`bg-${c}-500/10 border border-${c}-500/20 rounded-xl p-3`}>
                        <p className="text-lg font-bold">{v}</p>
                        <p className="text-xs text-muted-foreground">{l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20" />
                        <div className="flex-1 space-y-1.5">
                          <div className="h-3 bg-secondary rounded-md w-3/4" />
                          <div className="h-2.5 bg-secondary/60 rounded-md w-1/2" />
                        </div>
                        <div className="h-5 w-16 rounded-full bg-green-500/20" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 border-y border-border bg-secondary/20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-bold gradient-text mb-1">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-4">
              <Star size={13} />
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Everything you need to{" "}
              <span className="gradient-text">write and discover</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              A comprehensive platform built for modern writers, researchers, and content teams.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description, color, iconColor }) => (
              <div
                key={title}
                className={`group p-6 rounded-2xl border border-border bg-gradient-to-br ${color} hover:border-border/80 hover:shadow-lg transition-all duration-300`}
              >
                <div className={`w-10 h-10 rounded-xl bg-background/40 flex items-center justify-center mb-4 ${iconColor}`}>
                  <Icon size={20} />
                </div>
                <h3 className="font-semibold mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Articles */}
      <section className="py-24 px-4 sm:px-6 bg-secondary/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-medium text-purple-400 mb-2">Latest on Articula</p>
              <h2 className="text-3xl sm:text-4xl font-bold">Featured Articles</h2>
            </div>
            <Link href="/explore" className="hidden sm:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <ArticleGrid articles={articles.slice(0, 6)} />
          <div className="flex justify-center mt-10">
            <Link href="/explore">
              <button className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-border hover:border-purple-500/40 hover:bg-purple-500/5 text-sm font-medium transition-all duration-200">
                Explore all articles <ArrowRight size={14} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative p-12 rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-blue-500/10 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            <h2 className="text-4xl font-bold mb-4">
              Ready to start writing?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of writers who use Articula to create, discover, and share knowledge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signup">
                <button className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-500 hover:to-blue-500 transition-all shadow-xl shadow-purple-500/30">
                  Create free account
                  <ArrowRight size={16} />
                </button>
              </Link>
              <Link href="/explore">
                <button className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-border hover:bg-secondary text-sm font-semibold transition-all">
                  Browse articles
                </button>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-2 mt-6 text-sm text-muted-foreground">
              <CheckCircle2 size={14} className="text-green-400" />
              Free forever · No credit card required
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
