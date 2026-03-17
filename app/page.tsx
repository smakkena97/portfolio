import Link from "next/link";

export default function LandingPage() {
  return (
    <main style={{ background: "var(--background)", color: "var(--foreground)" }}>
      {/* Nav */}
      <nav className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <span className="text-xl font-bold" style={{ color: "var(--accent)" }}>Portfol.io</span>
        <Link
          href="/auth/signin"
          className="px-4 py-2 rounded-lg text-sm font-semibold"
          style={{ background: "var(--accent)", color: "#0a0a0a" }}
        >
          Get started
        </Link>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <h1 className="text-5xl font-bold mb-6 leading-tight">
          Your portfolio,{" "}
          <span style={{ color: "var(--accent)" }}>built in minutes</span>
        </h1>
        <p className="text-xl leading-relaxed mb-10" style={{ color: "var(--muted)" }}>
          Upload your resume and Portfol.io uses AI to instantly generate a beautiful,
          always-up-to-date portfolio — complete with your GitHub projects pulled in automatically.
          No coding required.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "var(--accent)", color: "#0a0a0a" }}
        >
          Create your portfolio free →
        </Link>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Sign up", desc: "Create an account with GitHub, Google, or your email in seconds." },
            { step: "2", title: "Upload your resume", desc: "Drop in your PDF or Word doc. Claude AI reads it and extracts your info automatically." },
            { step: "3", title: "Share your link", desc: "Get a public URL like portfol.io/yourname. Your GitHub projects stay in sync automatically." },
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-xl border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
              <div className="text-3xl font-bold mb-3" style={{ color: "var(--accent)" }}>{item.step}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Example portfolio preview */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-center mb-10">What your portfolio looks like</h2>
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
          {/* Fake browser chrome */}
          <div className="px-4 py-3 flex items-center gap-2" style={{ background: "#1a1a2e", borderBottom: "1px solid var(--border)" }}>
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <div className="ml-3 px-4 py-1 rounded text-xs flex-1 max-w-xs" style={{ background: "var(--background)", color: "var(--muted)" }}>
              portfol.io/alexchen
            </div>
          </div>
          {/* Example portfolio content */}
          <div className="p-8" style={{ background: "var(--background)" }}>
            <div className="flex items-start gap-5 mb-6">
              <div className="w-16 h-16 rounded-full shrink-0 flex items-center justify-center text-2xl font-bold" style={{ background: "var(--accent)", color: "#0a0a0a" }}>
                A
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--accent)" }}>Hi, my name is</p>
                <h3 className="text-3xl font-bold mb-1">Alex Chen</h3>
                <p className="text-xl" style={{ color: "var(--muted)" }}>Full Stack Engineer</p>
              </div>
            </div>
            <p className="text-sm mb-6 max-w-xl" style={{ color: "var(--muted)" }}>
              I build scalable web apps and love open source. Previously at Stripe, now building cool things.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              {["TypeScript", "React", "Node.js", "Python", "PostgreSQL", "AWS"].map((s) => (
                <span key={s} className="px-3 py-1 rounded-full text-xs border" style={{ borderColor: "var(--accent)", color: "var(--accent)" }}>{s}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: "open-saas", desc: "Open source SaaS starter kit", lang: "TypeScript", color: "#3178c6", stars: 342 },
                { name: "fastapi-boilerplate", desc: "Production-ready FastAPI template", lang: "Python", color: "#3572A5", stars: 89 },
              ].map((repo) => (
                <div key={repo.name} className="p-4 rounded-lg border" style={{ background: "var(--card)", borderColor: "var(--border)" }}>
                  <p className="font-medium text-sm mb-1" style={{ color: "var(--accent)" }}>{repo.name}</p>
                  <p className="text-xs mb-2" style={{ color: "var(--muted)" }}>{repo.desc}</p>
                  <div className="flex items-center gap-3 text-xs" style={{ color: "var(--muted)" }}>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full inline-block" style={{ background: repo.color }} />
                      {repo.lang}
                    </span>
                    <span>★ {repo.stars}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to stand out?</h2>
        <p className="mb-8" style={{ color: "var(--muted)" }}>
          Join developers who use Portfol.io to land their next job.
        </p>
        <Link
          href="/auth/signin"
          className="inline-block px-8 py-4 rounded-xl text-lg font-semibold hover:opacity-90 transition-opacity"
          style={{ background: "var(--accent)", color: "#0a0a0a" }}
        >
          Get started for free →
        </Link>
      </section>

      <footer className="border-t py-8 text-center text-sm" style={{ borderColor: "var(--border)", color: "var(--muted)" }}>
        © 2025 Portfol.io · Built with Next.js &amp; Claude AI
      </footer>
    </main>
  );
}
