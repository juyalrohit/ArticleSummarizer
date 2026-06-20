export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: Author;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  tags: string[];
  status: "published" | "draft";
  views: number;
  summary?: string;
}

export const authors: Author[] = [
  {
    id: "1",
    name: "Aria Chen",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=AriaC",
    role: "Senior Engineer",
    bio: "Full-stack engineer obsessed with performance and developer experience.",
  },
  {
    id: "2",
    name: "Marcus Webb",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusW",
    role: "AI Researcher",
    bio: "Building the future of machine learning, one model at a time.",
  },
  {
    id: "3",
    name: "Priya Nair",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaN",
    role: "Cloud Architect",
    bio: "Designing distributed systems that scale to millions.",
  },
  {
    id: "4",
    name: "Jordan Blake",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JordanB",
    role: "Security Engineer",
    bio: "Making the internet a safer place, one audit at a time.",
  },
  {
    id: "5",
    name: "Sofia Reyes",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SofiaR",
    role: "Product Engineer",
    bio: "At the intersection of design and engineering.",
  },
];

export const articles: Article[] = [
  {
    id: "1",
    title: "The Architecture of Modern Large Language Models",
    excerpt:
      "A deep dive into transformer architectures, attention mechanisms, and how models like GPT-4 and Claude achieve emergent capabilities at scale.",
    content: `
## Introduction

Large Language Models (LLMs) have fundamentally transformed how we think about artificial intelligence. At their core, these systems rely on the transformer architecture, first introduced in the seminal paper "Attention Is All You Need" by Vaswani et al. in 2017.

## Transformer Architecture

The transformer architecture replaced recurrent neural networks (RNNs) with a mechanism called **self-attention**, which allows the model to weigh the importance of different words in a sentence regardless of their position.

### Self-Attention Mechanism

The self-attention mechanism computes three vectors for each token in the input sequence:
- **Query (Q)**: What the token is looking for
- **Key (K)**: What the token offers
- **Value (V)**: What information the token contains

The attention score between two tokens is computed as the dot product of their Query and Key vectors, scaled by the square root of the dimension size.

## Scaling Laws

One of the most fascinating discoveries in recent years is the existence of **neural scaling laws**. Research from OpenAI demonstrated that model performance scales predictably with:

1. The number of parameters
2. The amount of training data
3. The compute budget

This predictability has allowed researchers to plan training runs more efficiently and anticipate model capabilities before training completes.

## Emergent Capabilities

Perhaps the most surprising aspect of large language models is the emergence of capabilities not explicitly trained for. As models scale, they suddenly gain abilities like:

- **Few-shot learning**: Performing new tasks from just a few examples
- **Chain-of-thought reasoning**: Breaking complex problems into steps
- **Code generation**: Writing functional programs from natural language descriptions

## The Future

The next frontier involves multimodal models that can process text, images, audio, and video simultaneously. Models like GPT-4V and Gemini Ultra represent early steps in this direction, but we're still far from systems that can reason about the physical world as effortlessly as humans.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&auto=format&fit=crop&q=60",
    author: authors[1],
    publishedAt: "2024-01-15",
    updatedAt: "2024-01-20",
    readTime: 8,
    tags: ["AI", "Machine Learning", "LLMs", "Architecture"],
    status: "published",
    views: 12400,
    summary:
      "This article explores the transformer architecture powering modern LLMs, covering self-attention mechanisms, scaling laws, and emergent capabilities. Key insight: model performance scales predictably with parameters, data, and compute, leading to unexpected emergent abilities like few-shot learning and chain-of-thought reasoning.",
  },
  {
    id: "2",
    title: "Building Resilient Microservices with Kubernetes and Istio",
    excerpt:
      "How to design fault-tolerant microservice architectures using service meshes, circuit breakers, and intelligent traffic management.",
    content: `
## Why Service Meshes Matter

As organizations adopt microservices, they face a new class of operational challenges. How do you manage communication between hundreds of services? How do you ensure security without modifying application code? Service meshes like Istio solve these problems at the infrastructure layer.

## Istio Architecture

Istio works by injecting a **sidecar proxy** (Envoy) alongside each service. All network traffic passes through this proxy, enabling:

- **Traffic management**: Canary deployments, A/B testing, traffic shifting
- **Security**: mTLS encryption between all services
- **Observability**: Distributed tracing, metrics, and logs

## Circuit Breaking

Circuit breaking prevents cascading failures. When a service starts failing, the circuit breaker "trips" and subsequent requests fail fast instead of waiting for timeouts.

\`\`\`yaml
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: payment-service
spec:
  trafficPolicy:
    outlierDetection:
      consecutive5xxErrors: 5
      interval: 30s
      baseEjectionTime: 30s
\`\`\`

## Progressive Delivery

Istio enables sophisticated deployment strategies. A canary deployment can gradually shift traffic to a new version:

- 90% of traffic → v1 (stable)
- 10% of traffic → v2 (canary)

Monitor error rates and latency before promoting the canary to full traffic.

## Observability with Kiali

Kiali provides a visual dashboard for your service mesh, showing:
- Service topology graphs
- Traffic flow animations
- Health indicators
- Configuration validation
    `,
    coverImage:
      "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=60",
    author: authors[2],
    publishedAt: "2024-01-18",
    updatedAt: "2024-01-25",
    readTime: 10,
    tags: ["Kubernetes", "Microservices", "DevOps", "Istio"],
    status: "published",
    views: 8900,
    summary:
      "Covers Istio service mesh for Kubernetes, explaining sidecar proxy injection, circuit breaking to prevent cascading failures, and progressive delivery strategies. The key takeaway is that service meshes handle cross-cutting concerns like security and observability without changing application code.",
  },
  {
    id: "3",
    title: "React Server Components: The Complete Mental Model",
    excerpt:
      "Understanding the paradigm shift that React Server Components introduce, and how to architect applications that leverage both server and client rendering effectively.",
    content: `
## The Problem RSC Solves

For years, React developers have faced a fundamental tension: server-side rendering gives us fast initial loads, but client-side hydration adds overhead. Server Components offer a third path.

## Two Worlds, One Tree

With React Server Components, your component tree can contain:

- **Server Components**: Render on the server, never hydrate. Can directly access databases, file systems, and secrets.
- **Client Components**: The traditional React components you know. Handle interactivity.

The key insight: **Server Components can render Client Components, but not vice versa.**

## Data Fetching Simplified

Forget useEffect for data fetching. Server Components can be async:

\`\`\`tsx
async function ArticleList() {
  const articles = await db.articles.findMany();
  
  return (
    <div>
      {articles.map(article => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}
\`\`\`

No loading states, no error boundaries (well, fewer), no client-side waterfalls.

## The Serialization Boundary

When a Server Component renders a Client Component, it passes props across a serialization boundary. This means props must be serializable: strings, numbers, arrays, plain objects. No functions, no class instances.

## Streaming and Suspense

RSC works beautifully with React Suspense. Server Components can stream their output progressively, showing skeletons while content loads.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60",
    author: authors[0],
    publishedAt: "2024-01-22",
    updatedAt: "2024-01-28",
    readTime: 7,
    tags: ["React", "Next.js", "Frontend", "Performance"],
    status: "published",
    views: 15200,
    summary:
      "React Server Components allow components to render on the server without client-side hydration, enabling direct database access and eliminating waterfall requests. Props crossing the server-client boundary must be serializable, and RSC integrates with Suspense for progressive streaming.",
  },
  {
    id: "4",
    title: "Zero Trust Security: Designing Defense in Depth",
    excerpt:
      "How zero trust architecture eliminates implicit trust, enforces least-privilege access, and creates security boundaries that adapt to modern cloud environments.",
    content: `
## The Death of the Perimeter

Traditional security models assumed everything inside the corporate network was trusted. This model crumbled as organizations moved to cloud infrastructure and remote work became normalized.

**Zero Trust assumes breach**: treat every request as if it originates from an untrusted network.

## Core Principles

### 1. Verify Explicitly
Authenticate and authorize every request based on all available data points:
- Identity (user, service account)
- Location and device
- Service or workload
- Data classification and anomalies

### 2. Use Least Privilege Access
Grant only the minimum permissions required. Use Just-In-Time (JIT) access for elevated permissions. Segment access by project, team, and data sensitivity.

### 3. Assume Breach
Design with the assumption that attackers are already inside. Minimize blast radius by microsegmenting networks. Encrypt all data in transit and at rest.

## Implementing Identity-Centric Security

Modern zero trust starts with strong identity:

- **FIDO2/WebAuthn**: Phishing-resistant authentication
- **Certificate-based mTLS**: Service-to-service authentication
- **Short-lived credentials**: Rotate secrets frequently

## SASE Architecture

Secure Access Service Edge (SASE) converges zero trust with SD-WAN, delivering security capabilities at the edge rather than the data center.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=800&auto=format&fit=crop&q=60",
    author: authors[3],
    publishedAt: "2024-01-25",
    updatedAt: "2024-02-01",
    readTime: 9,
    tags: ["Security", "Zero Trust", "Cloud", "Architecture"],
    status: "published",
    views: 7300,
    summary:
      "Zero trust security eliminates implicit network trust by requiring explicit verification of every request based on identity, device, and context. The three core principles are: verify explicitly using all available signals, use least-privilege access with JIT elevation, and design assuming breach has already occurred.",
  },
  {
    id: "5",
    title: "PostgreSQL Performance Tuning at Scale",
    excerpt:
      "Advanced techniques for query optimization, indexing strategies, connection pooling, and read replica architectures for high-traffic PostgreSQL deployments.",
    content: `
## Understanding the Query Planner

PostgreSQL's query planner uses statistics about your data to choose optimal execution plans. Understanding this process is fundamental to performance tuning.

Run \`EXPLAIN ANALYZE\` on slow queries to see exactly what Postgres is doing:

\`\`\`sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM articles 
WHERE author_id = 42 
  AND published_at > NOW() - INTERVAL '30 days'
ORDER BY views DESC
LIMIT 20;
\`\`\`

## Index Strategies

### Partial Indexes
Create indexes only on rows matching a condition:

\`\`\`sql
CREATE INDEX idx_articles_published 
ON articles (published_at DESC, views DESC)
WHERE status = 'published';
\`\`\`

### Covering Indexes
Include frequently-accessed columns to avoid heap lookups:

\`\`\`sql
CREATE INDEX idx_articles_author_covering
ON articles (author_id) 
INCLUDE (title, excerpt, published_at);
\`\`\`

## Connection Pooling with PgBouncer

At scale, connection overhead becomes significant. PgBouncer sits between your application and Postgres, maintaining a pool of persistent connections.

Transaction-mode pooling allows thousands of clients to share a small connection pool.

## Vertical vs. Horizontal Scaling

Once you've exhausted single-node optimizations:
- **Read replicas**: Offload read traffic using streaming replication
- **Partitioning**: Divide large tables by date or hash
- **Citus**: Horizontally shard Postgres across multiple nodes
    `,
    coverImage:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60",
    author: authors[2],
    publishedAt: "2024-02-01",
    updatedAt: "2024-02-08",
    readTime: 11,
    tags: ["PostgreSQL", "Database", "Performance", "Backend"],
    status: "published",
    views: 9800,
    summary:
      "PostgreSQL performance at scale requires understanding the query planner, using partial and covering indexes, and employing connection pooling via PgBouncer. For horizontal scaling, read replicas handle read load while Citus enables true sharding across nodes.",
  },
  {
    id: "6",
    title: "TypeScript 5.0: What's New and Why It Matters",
    excerpt:
      "Exploring decorators, const type parameters, and the resolution customization points that make TypeScript 5.0 a landmark release.",
    content: `
## Decorators Are Finally Here

After years in proposal stages, TypeScript 5.0 ships with support for ECMAScript decorators — a standardized way to annotate and modify classes, methods, and properties.

\`\`\`typescript
function logged(target: Function, context: ClassMethodDecoratorContext) {
  return function (...args: unknown[]) {
    console.log(\`Calling \${String(context.name)}\`);
    return target.apply(this, args);
  };
}

class UserService {
  @logged
  async createUser(email: string) {
    // ...
  }
}
\`\`\`

## Const Type Parameters

Generic functions can now infer literal types by default:

\`\`\`typescript
function identity<const T>(value: T): T {
  return value;
}

const result = identity({ name: "Aria", role: "admin" });
// result: { name: "Aria", role: "admin" } — not { name: string, role: string }
\`\`\`

## Resolution Customization Points

The \`--moduleResolution bundler\` flag models how modern bundlers resolve modules, supporting self-referencing packages and \`exports\` field in package.json without the strict constraints of \`node16\` mode.

## Breaking Changes Worth Noting

- TypeScript no longer supports Node.js 12 or below
- \`--target es3\` and \`--target es5\` are deprecated
- Some behavioral changes around enum declarations
    `,
    coverImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&auto=format&fit=crop&q=60",
    author: authors[0],
    publishedAt: "2024-02-05",
    updatedAt: "2024-02-10",
    readTime: 6,
    tags: ["TypeScript", "JavaScript", "Frontend", "Web Dev"],
    status: "published",
    views: 18700,
    summary:
      "TypeScript 5.0 standardizes ECMAScript decorators, adds const type parameters for accurate literal inference, and introduces bundler module resolution for modern build tools. Key breaking change: Node.js 12 and below are no longer supported.",
  },
  {
    id: "7",
    title: "Vector Databases Explained: Powering Semantic Search",
    excerpt:
      "How vector embeddings and approximate nearest-neighbor search enable semantic similarity, recommendation systems, and RAG pipelines.",
    content: `
## Beyond Keyword Search

Traditional databases store structured data and answer exact queries. But how do you find articles that are *semantically similar* to a given query, even if they share no keywords?

The answer: represent text as vectors in high-dimensional space, where similar concepts cluster together.

## How Embeddings Work

An embedding model (like OpenAI's text-embedding-3-small) transforms text into a vector of floating-point numbers. Similar texts produce vectors that are close together — measured by cosine similarity or Euclidean distance.

## Approximate Nearest Neighbor (ANN) Algorithms

Exact nearest-neighbor search is O(n) — too slow at scale. ANN algorithms trade a small accuracy penalty for massive speed gains:

- **HNSW** (Hierarchical Navigable Small World): Graph-based, excellent recall
- **IVF** (Inverted File Index): Clustering-based, memory efficient
- **ScaNN**: Google's production algorithm, used in YouTube recommendations

## Popular Vector Databases

| Database | Hosting | Standout Feature |
|----------|---------|-----------------|
| Pinecone | Managed | Zero ops, simple API |
| Weaviate | Self/Cloud | GraphQL API, modules |
| Qdrant | Self/Cloud | Rust-based, fast |
| pgvector | Postgres | No new infrastructure |

## RAG Architecture

Retrieval-Augmented Generation combines vector search with LLMs:
1. Embed the user's query
2. Find similar document chunks in the vector store
3. Inject retrieved context into the LLM prompt
4. Generate a grounded response
    `,
    coverImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
    author: authors[1],
    publishedAt: "2024-02-10",
    updatedAt: "2024-02-15",
    readTime: 8,
    tags: ["AI", "Search", "Vector DB", "Embeddings"],
    status: "published",
    views: 11200,
    summary:
      "Vector databases store text as high-dimensional embeddings, enabling semantic similarity search. ANN algorithms like HNSW provide fast approximate search. Combined with LLMs in RAG architecture, vector search grounds AI responses in retrieved context.",
  },
  {
    id: "8",
    title: "Designing API Rate Limiting That Doesn't Break Clients",
    excerpt:
      "Token bucket, sliding window, and leaky bucket algorithms — and how to communicate limits clearly so clients can build resilient integrations.",
    content: `
## Why Rate Limiting Is Hard to Get Right

Bad rate limiting breaks legitimate use cases and creates terrible developer experiences. Good rate limiting protects your infrastructure while being transparent and predictable.

## Algorithm Comparison

### Token Bucket
Users accumulate tokens over time. Each request consumes tokens. Allows bursting while enforcing average rate.

### Sliding Window Log
Track exact timestamps of requests. Most accurate but memory-intensive.

### Sliding Window Counter
Approximate sliding window using two fixed-window counters. Excellent accuracy-to-memory tradeoff.

## Response Headers That Matter

Always communicate rate limit status in response headers:

\`\`\`
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 847
X-RateLimit-Reset: 1707868800
Retry-After: 3600
\`\`\`

When limits are exceeded, return **429 Too Many Requests** with a \`Retry-After\` header.

## Graduated Limits

Consider tiered limits rather than binary allow/block:
- Anonymous: 100 requests/hour
- Free tier: 1,000 requests/hour
- Pro tier: 10,000 requests/hour
- Enterprise: Custom limits

## Redis Implementation

Redis is the de-facto choice for distributed rate limiting. Use the sliding window counter pattern with Lua scripts for atomic operations.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60",
    author: authors[4],
    publishedAt: "2024-02-14",
    updatedAt: "2024-02-20",
    readTime: 7,
    tags: ["API", "Backend", "Redis", "Architecture"],
    status: "published",
    views: 6800,
    summary:
      "Effective API rate limiting uses sliding window counter algorithms for accuracy and memory efficiency. Essential: respond with X-RateLimit headers and 429 status with Retry-After. Redis + Lua scripts enable atomic distributed rate limiting for multi-instance deployments.",
  },
  {
    id: "9",
    title: "WebAssembly in 2024: Beyond the Hype",
    excerpt:
      "Practical applications of WebAssembly for compute-intensive browser workloads, WASM runtimes on the server, and the Component Model's promise.",
    content: `
## WASM Is Not a JavaScript Replacement

The common misconception: WebAssembly will replace JavaScript. The reality: WASM excels at compute-intensive tasks where JavaScript struggles — image processing, audio codecs, physics simulations, cryptography.

## Real Production Use Cases

- **Figma**: Complex vector rendering in the browser
- **Google Earth**: Massive 3D dataset processing  
- **Zoom**: Video codec running in the browser tab
- **DuckDB WASM**: SQL analytics directly in the browser

## WASM on the Server

WASM runtimes like Wasmtime and WASMEdge enable a compelling server-side deployment model:

- **Sandboxed by default**: Stronger isolation than containers
- **Near-native performance**: Within 1.5x of native code
- **Polyglot**: Compile Rust, Go, C, Swift to the same format
- **Fast startup**: Milliseconds, not seconds like containers

## The Component Model

The WASM Component Model is the most exciting development. It enables:
- Language-agnostic interfaces (WIT format)
- Safe composition of WASM modules
- Shared nothing linking — true isolation

## Getting Started

If you're building something compute-intensive, reach for Rust + wasm-pack. For integrating existing C/C++ libraries, Emscripten is battle-tested.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&auto=format&fit=crop&q=60",
    author: authors[0],
    publishedAt: "2024-02-18",
    updatedAt: "2024-02-22",
    readTime: 8,
    tags: ["WebAssembly", "Performance", "Frontend", "Rust"],
    status: "published",
    views: 9400,
    summary:
      "WebAssembly excels at compute-intensive browser tasks and offers sandboxed server-side deployment via Wasmtime with near-native performance. The emerging Component Model enables language-agnostic module composition.",
  },
  {
    id: "10",
    title: "Event-Driven Architecture with Apache Kafka",
    excerpt:
      "Building scalable, loosely-coupled systems using event streaming — covering topics, partitions, consumer groups, and exactly-once semantics.",
    content: `
## Events as the Source of Truth

Event-driven architecture inverts the traditional request-response model. Instead of services calling each other directly, they publish events to a shared stream. Consumers process events independently, at their own pace.

## Kafka Fundamentals

**Topics** are ordered, immutable logs of events. Each event is appended to the end — never updated or deleted (until retention expires).

**Partitions** enable parallelism. A topic with 12 partitions can be consumed by up to 12 consumers simultaneously.

**Consumer Groups** allow multiple applications to independently read the same stream, each tracking their own offset.

## Designing Events

Events should be:
- **Immutable facts**: "order.placed", not "place.order"
- **Self-contained**: Include all relevant data, not just IDs
- **Versioned**: Schema evolution is inevitable

Use Apache Avro or Protobuf with a Schema Registry for type safety.

## Exactly-Once Semantics

Kafka supports exactly-once delivery through:
1. Idempotent producers (PID + sequence numbers)
2. Transactions spanning multiple partitions
3. Transactional reads at the consumer

This eliminates the duplicates and losses that plague at-least-once systems.

## Stream Processing with Kafka Streams

Transform and aggregate events in real-time using KStreams and KTables. Build stateful applications without external databases.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=60",
    author: authors[2],
    publishedAt: "2024-02-22",
    updatedAt: "2024-02-28",
    readTime: 9,
    tags: ["Kafka", "Event-Driven", "Backend", "Distributed Systems"],
    status: "published",
    views: 7600,
    summary:
      "Kafka's event streaming model uses immutable logs partitioned for parallel consumption. Exactly-once semantics rely on idempotent producers, transactions, and transactional reads. Design events as immutable facts with full payloads and version them with Avro/Protobuf.",
  },
  {
    id: "11",
    title: "CSS Architecture for Large-Scale Applications",
    excerpt:
      "How to avoid specificity wars, dead code accumulation, and styling inconsistencies using design tokens, utility-first CSS, and component isolation.",
    content: `
## The Scaling Problem

CSS was designed for documents, not applications. As projects grow, developers fight specificity wars, inherit dead styles, and struggle to predict the impact of changes.

## Design Tokens as the Foundation

Design tokens are the single source of truth for your visual language:

\`\`\`css
:root {
  --color-primary: #a855f7;
  --color-surface: #0d1117;
  --space-4: 1rem;
  --radius-md: 0.5rem;
  --font-size-body: 1rem;
}
\`\`\`

Components reference tokens, never raw values. When the design changes, update the token.

## Utility-First vs. Component Classes

Tailwind CSS has won the utility-first debate. The advantages compound at scale:
- No dead code (PurgeCSS removes unused classes)
- No naming decisions
- Predictable specificity (all utilities are single-class)
- Co-located styles and markup

## Container Queries for True Component Isolation

Media queries respond to the viewport, not the component's context. Container queries solve this:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { flex-direction: row; }
}
\`\`\`

## CSS Layers for Third-Party Integration

Use \`@layer\` to control specificity without !important:

\`\`\`css
@layer reset, base, components, utilities, overrides;
\`\`\`
    `,
    coverImage:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&auto=format&fit=crop&q=60",
    author: authors[4],
    publishedAt: "2024-02-26",
    updatedAt: "2024-03-03",
    readTime: 7,
    tags: ["CSS", "Frontend", "Design Systems", "Tailwind"],
    status: "published",
    views: 13100,
    summary:
      "Design tokens centralize visual values, utility-first CSS (Tailwind) eliminates dead code and specificity conflicts, container queries enable true component-level responsive design, and CSS @layer provides clean specificity management for third-party code integration.",
  },
  {
    id: "12",
    title: "Rust for Systems Programmers: Memory Safety Without GC",
    excerpt:
      "How Rust's ownership model, lifetimes, and borrow checker eliminate entire classes of bugs while delivering C++-level performance.",
    content: `
## The Problem with Manual Memory Management

C and C++ give programmers complete control over memory. They also give programmers complete responsibility for every use-after-free, buffer overflow, and data race. These bugs account for ~70% of CVEs in major browsers and operating systems.

## Ownership: The Core Mental Model

Every value in Rust has exactly one owner. When the owner goes out of scope, the value is freed — automatically, without garbage collection.

\`\`\`rust
fn process_data() {
    let data = vec![1, 2, 3];  // data owns the Vec
    let result = compute(&data);  // borrow data
    println!("{:?}", result);
    // data is freed here, automatically
}
\`\`\`

## Borrowing and Lifetimes

You can borrow a value (create a reference) without transferring ownership. The borrow checker ensures:
- No reference outlives the owned value
- No mutable reference while other references exist
- No data races (at compile time!)

## Zero-Cost Abstractions

Rust's iterators, closures, and generics compile to machine code as efficient as hand-written C. There's no runtime overhead for these abstractions — what you don't use, you don't pay for.

## The Ecosystem in 2024

- **Tokio**: Async runtime powering production web services
- **Axum**: Ergonomic web framework built on Tokio
- **Serde**: Zero-copy serialization
- **SQLx**: Async database driver with compile-time query checking
    `,
    coverImage:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
    author: authors[3],
    publishedAt: "2024-03-01",
    updatedAt: "2024-03-06",
    readTime: 10,
    tags: ["Rust", "Systems Programming", "Performance", "Memory Safety"],
    status: "published",
    views: 10900,
    summary:
      "Rust eliminates memory safety bugs through compile-time ownership rules and a borrow checker that prevents use-after-free, dangling references, and data races. Zero-cost abstractions deliver C++ performance. Key crates: Tokio for async, Axum for web, Serde for serialization.",
  },
  {
    id: "13",
    title: "Observability at Scale: Logs, Metrics, and Traces",
    excerpt:
      "Building a unified observability platform with OpenTelemetry, understanding the three pillars, and making on-call shifts survivable.",
    content: `
## The Three Pillars (and Their Limits)

The "three pillars of observability" — logs, metrics, and traces — has become industry orthodoxy. But siloed tooling for each pillar creates correlation gaps exactly when you need them most: during incidents.

## OpenTelemetry: The Unifying Standard

OpenTelemetry (OTel) provides vendor-neutral instrumentation for all three signal types:

\`\`\`typescript
import { NodeSDK } from '@opentelemetry/sdk-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
\`\`\`

Auto-instrumentation covers HTTP, gRPC, database clients, and more — zero code changes required.

## Structured Logging

Structured logs (JSON) are grep-able, queryable, and composable. Include:
- Trace ID (for correlation)
- Request ID
- User context (scrubbed)
- Durations as numbers

## SLOs and Error Budgets

Define Service Level Objectives based on user-facing metrics:
- Availability: 99.9% of requests succeed
- Latency: p99 < 500ms

Track error budget burn rate to get early warning before SLO violations.

## The "Tail Latency" Problem

p50 latency hides p99 problems. A request that involves 10 service calls will experience the worst latency of all 10. Profile your p99.9 and optimize the long tail.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=60",
    author: authors[2],
    publishedAt: "2024-03-05",
    updatedAt: "2024-03-10",
    readTime: 9,
    tags: ["Observability", "OpenTelemetry", "DevOps", "Monitoring"],
    status: "published",
    views: 8100,
    summary:
      "OpenTelemetry unifies logs, metrics, and traces with vendor-neutral instrumentation. Key practices: structured JSON logs with trace IDs, SLOs with error budget tracking, and profiling p99.9 latency to catch tail latency amplification in distributed service calls.",
  },
  {
    id: "14",
    title: "The Future of Edge Computing and CDN Intelligence",
    excerpt:
      "How edge runtimes are moving beyond static asset delivery to run application logic closer to users — and what this means for architecture.",
    content: `
## From Static to Dynamic at the Edge

CDNs were invented to serve static files from geographically distributed nodes. Today's edge runtimes — Cloudflare Workers, Vercel Edge Functions, Fastly Compute — run JavaScript and WASM within milliseconds of every user.

## The V8 Isolate Advantage

Edge functions use V8 isolates rather than containers. The benefits:
- **Sub-millisecond cold starts**: No container boot time
- **Density**: Run thousands of isolates per server
- **Security**: Isolates are sandboxed from each other

## What Lives at the Edge

Edge is excellent for:
- **A/B testing** without roundtrips to origin
- **Authentication** at the network layer
- **Personalization** based on geography, device
- **API aggregation** — fan out to multiple services, merge responses

Edge is poor for:
- Stateful operations (no persistent connections)
- Heavy computation (limited CPU budget)
- Operations needing full Node.js APIs

## The Durable Objects Pattern

Cloudflare Durable Objects give each edge function a tiny piece of stateful storage. This enables:
- Rate limiting at the edge
- Real-time collaboration (cursor positions, presence)
- Session management

## Edge-Native Databases

Turso (distributed SQLite), PlanetScale (MySQL at edge), and Cloudflare D1 bring databases to edge regions.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=60",
    author: authors[4],
    publishedAt: "2024-03-09",
    updatedAt: "2024-03-14",
    readTime: 7,
    tags: ["Edge Computing", "CDN", "Performance", "Architecture"],
    status: "published",
    views: 9200,
    summary:
      "Edge runtimes use V8 isolates for sub-millisecond cold starts, ideal for A/B testing, authentication, and API aggregation near users. Cloudflare Durable Objects add stateful storage for rate limiting and real-time features. Edge-native databases like Turso enable full data locality.",
  },
  {
    id: "15",
    title: "GraphQL vs REST in 2024: An Honest Comparison",
    excerpt:
      "Moving past tribalism to understand when each approach genuinely wins — and when neither is the right answer.",
    content: `
## The False Dichotomy

GraphQL vs REST is often presented as a binary choice. In practice, most large companies use both — sometimes in the same product.

## Where REST Still Wins

REST is the right choice when:
- **Simple CRUD**: Standard resource operations map naturally to HTTP methods
- **Cacheability**: REST leverages HTTP caching natively. GraphQL POST requests bypass CDN caches by default.
- **Team familiarity**: The ecosystem is massive and well-understood
- **File uploads**: REST handles multipart forms natively

## Where GraphQL Genuinely Shines

GraphQL excels when:
- **Mobile clients**: Fetch exactly the fields needed, nothing more
- **Rapid iteration**: Add fields without versioning
- **Complex graphs**: Traverse relationships in a single request
- **Multiple clients**: One endpoint serves different client shapes

## The Over-Fetching Problem

GraphQL was born from Facebook's mobile performance problems. Over-fetching — receiving more data than needed — wastes bandwidth and battery. GraphQL lets clients specify exactly what they need.

## tRPC: The TypeScript-First Alternative

For TypeScript-heavy stacks, tRPC provides end-to-end type safety without a schema language. If your frontend and backend are TypeScript, tRPC eliminates the serialization layer entirely.

## Practical Recommendation

Start with REST for internal APIs. Adopt GraphQL when you have multiple clients with different data requirements. Consider tRPC for monorepos.
    `,
    coverImage:
      "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=60",
    author: authors[1],
    publishedAt: "2024-03-13",
    updatedAt: "2024-03-18",
    readTime: 8,
    tags: ["GraphQL", "REST", "API Design", "Backend"],
    status: "published",
    views: 16800,
    summary:
      "REST wins for simple CRUD, HTTP caching, and broad ecosystem support. GraphQL excels for mobile (reduce over-fetching), multiple client shapes, and complex graph traversal. tRPC is the pragmatic choice for TypeScript monorepos. Recommendation: start with REST, adopt GraphQL when serving multiple client shapes.",
  },
];

export const dummyStats = {
  totalArticles: 47,
  totalSummaries: 32,
  totalViews: 184200,
  totalSearches: 9430,
};

export const categories = [
  "All",
  "AI",
  "Frontend",
  "Backend",
  "DevOps",
  "Security",
  "Database",
  "Architecture",
  "TypeScript",
  "Rust",
];
