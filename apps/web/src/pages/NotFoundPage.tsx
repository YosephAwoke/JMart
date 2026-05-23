import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center rounded-[2rem] border border-border bg-surface p-8 text-center shadow-premium">
      <div className="max-w-md space-y-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-accent">404</p>
        <h1 className="font-display text-4xl font-black tracking-tight">That page does not exist.</h1>
        <p className="text-sm leading-7 text-muted">Return to the premium storefront experience or jump into the catalog.</p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/" className="rounded-full bg-accent px-5 py-3 text-sm font-semibold text-white shadow-glow">Home</Link>
          <Link to="/catalog" className="rounded-full border border-border bg-surfaceAlt px-5 py-3 text-sm font-semibold">Catalog</Link>
        </div>
      </div>
    </div>
  );
}