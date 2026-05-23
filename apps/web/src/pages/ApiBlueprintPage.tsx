export function ApiBlueprintPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-border bg-surface p-6 shadow-premium">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">Backend blueprint</p>
        <h1 className="mt-2 font-display text-4xl font-black tracking-tight">Express MVC, MongoDB, and payment seams for real growth.</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">This page exists to show architecture intent: routed controllers, schemas, middleware, payment verification, and localized order fields without exposing the app as a generic template.</p>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <Panel title="Routes" items={["GET /api/products", "GET /api/products/:slug", "POST /api/orders", "POST /api/payments/webhook/chapa"]} />
        <Panel title="Models" items={["User", "Product", "Order", "PaymentAttempt"]} />
        <Panel title="Services" items={["Pricing", "Webhook verification", "Order creation", "Fulfillment status"]} />
      </section>
    </div>
  );
}

function Panel({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-[2rem] border border-border bg-surface p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">{title}</p>
      <ul className="mt-4 space-y-3 text-sm text-muted">
        {items.map((item) => (
          <li key={item} className="rounded-2xl border border-border bg-background px-4 py-3 text-foreground/80">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}