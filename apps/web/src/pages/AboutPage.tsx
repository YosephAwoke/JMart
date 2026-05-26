import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-border bg-surface p-8 shadow-premium">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">About JMart</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight">A premium Ethiopian ecommerce storefront built for browsing, trust, and conversion.</h1>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-muted">
          JMart is designed as a portfolio-ready commerce experience: fast product discovery, polished product detail pages, clean checkout flows, and a premium visual language that feels at home on mobile and desktop.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-premium">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">About me</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Yoseph Awoke</h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            I build polished web experiences with attention to product storytelling, usability, and visual detail. This storefront is structured to feel like a real modern store while staying practical for Ethiopian shoppers.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <InfoCard title="Email" value="yosephawoke8@gmail.com" />
            <InfoCard title="Phone" value="+251920409888" />
            <InfoCard title="GitHub" value="github.com/YosephAwoke" />
            <InfoCard title="Focus" value="Product-led ecommerce UI" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-premium">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">What this website does</p>
          <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
            <p>• Shows products with fast browsing, variant selection, and premium detail pages.</p>
            <p>• Supports light and dark mode, English and Amharic language preferences, favorites, profile editing, and checkout defaults.</p>
            <p>• Uses a clean ecommerce-style dashboard, better navigation, and a more realistic shopping flow.</p>
            <p>• Includes product storytelling, order history, contact-ready branding, and a design meant to feel credible for a portfolio or client demo.</p>
          </div>
          <div className="mt-6 rounded-3xl border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted">Contact</p>
            <p className="mt-2 text-sm leading-6 text-muted">
              For work, collaboration, or questions, reach out using the email or phone above, or open my GitHub profile to see more projects.
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a href="mailto:yosephawoke8@gmail.com" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow">Email me</a>
            <a href="https://github.com/YosephAwoke" target="_blank" rel="noreferrer" className="rounded-full border border-border bg-surfaceAlt px-5 py-3 text-sm font-semibold">GitHub</a>
            <Link to="/catalog" className="rounded-full border border-border bg-surfaceAlt px-5 py-3 text-sm font-semibold">Browse products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">{title}</p>
      <p className="mt-2 text-sm font-semibold">{value}</p>
    </div>
  );
}
