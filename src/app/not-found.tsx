import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="max-w-2xl mx-auto px-6 py-24 space-y-6"
    >
      <p className="eyebrow">Willesden Reclamation · 404</p>
      <h1 className="text-4xl font-serif">
        A wrong turn on the way to the yard.
      </h1>
      <p>We couldn’t find that page. Explore our current collection instead.</p>
      <ButtonLink href="/stock">Browse the stock</ButtonLink>
    </main>
  );
}
