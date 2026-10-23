"use client";
import { Button, ButtonLink } from "@/components/ui/Button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 space-y-6" role="alert">
      <h1 className="text-3xl font-serif">Stock is temporarily unavailable</h1>
      <p>Please try again, or contact the yard for current availability.</p>
      <div className="flex flex-wrap gap-4">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/contact" variant="outline">
          Contact
        </ButtonLink>
      </div>
    </div>
  );
}
