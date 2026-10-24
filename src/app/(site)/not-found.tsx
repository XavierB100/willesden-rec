import { ButtonLink } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="site-container section-space">
      <p className="eyebrow">A little further afield</p>
      <h1 className="font-serif text-4xl md:text-6xl max-w-2xl">
        This piece has slipped out of view.
      </h1>
      <p className="max-w-lg my-6 text-vintage-charcoal/75">
        The listing may have been removed, or the address may have changed.
        There’s always something else to discover at the yard.
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/stock">
          Explore current stock <ArrowRight size={16} />
        </ButtonLink>
        <ButtonLink href="/contact" variant="outline">
          Ask the yard
        </ButtonLink>
      </div>
    </div>
  );
}
