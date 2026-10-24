export default function Loading() {
  return (
    <div
      className="site-container section-space"
      role="status"
      aria-label="Loading page"
    >
      <div className="h-3 w-36 bg-vintage-charcoal/10 mb-6" />
      <div className="h-12 w-2/3 bg-vintage-charcoal/10 mb-12" />
      <div className="product-grid">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="aspect-[3/4] bg-vintage-charcoal/5" />
        ))}
      </div>
      <span className="sr-only">Loading the collection…</span>
    </div>
  );
}
