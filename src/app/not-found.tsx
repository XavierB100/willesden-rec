import { ButtonLink } from "@/components/ui/Button";
export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 space-y-6">
      <h1 className="text-3xl font-serif">Item Not Found</h1>
      <ButtonLink href="/stock">Back to Browse</ButtonLink>
    </div>
  );
}
