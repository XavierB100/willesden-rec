import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import { createClient } from "@supabase/supabase-js";
import demos from "../src/lib/demo-stock.json";

// Dry-run by default. Existing rows are never overwritten, including owner edits.
if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const apply = process.argv.includes("--apply");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function main() {
  console.log(
    `${apply ? "Create" : "Dry run:"} ${demos.length} admin-editable demo listings, two per category.`,
  );
  if (!apply) {
    for (const demo of demos) console.log(`${demo.category}: ${demo.title}`);
    console.log("Run with --apply only when adding the approved demo stock.");
    return;
  }
  if (
    !url ||
    !key ||
    new URL(url).hostname !== "ltkxelclbiverctddsmf.supabase.co"
  ) {
    throw new Error(
      "Configure the intended Willesden project before importing demos.",
    );
  }
  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: existing, error: readError } = await client
    .from("products")
    .select("id, legacy_id, slug, is_demo");
  if (readError)
    throw new Error(
      "Could not read demo status. Apply the managed_demo_listings migration first.",
    );
  const bucket = client.storage.from("product-images");
  let created = 0;
  for (const demo of demos) {
    const legacyId = `demo:${demo.key}`;
    const slug = `demo-${demo.key}`;
    if (existing.some((product) => product.legacy_id === legacyId)) {
      console.log(`Preserved existing listing: ${demo.key}`);
      continue;
    }
    if (existing.some((product) => product.slug === slug)) {
      throw new Error(
        `An unrelated listing already uses ${slug}; no row was overwritten.`,
      );
    }
    const images: Record<string, string> = {};
    for (const orientation of ["portrait", "landscape"] as const) {
      const bytes = readFileSync(`public${demo[orientation]}`);
      const path = `demo-stock/${basename(demo[orientation])}`;
      const { error } = await bucket.upload(path, bytes, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });
      if (error) {
        const { data: stored, error: downloadError } =
          await bucket.download(path);
        if (downloadError || !stored)
          throw new Error(`Could not upload ${path}.`);
        const storedHash = createHash("sha256")
          .update(Buffer.from(await stored.arrayBuffer()))
          .digest("hex");
        if (storedHash !== createHash("sha256").update(bytes).digest("hex")) {
          throw new Error(
            `A different photo already exists at ${path}; no file was overwritten.`,
          );
        }
      }
      images[orientation] = bucket.getPublicUrl(path).data.publicUrl;
    }
    const { error: insertError } = await client.from("products").insert({
      legacy_id: legacyId,
      slug,
      title: demo.title,
      category: demo.category,
      description: demo.description,
      price: demo.price,
      status: "available",
      is_demo: true,
      image_urls:
        demo.cover === "landscape"
          ? [images.landscape, images.portrait]
          : [images.portrait, images.landscape],
    });
    if (insertError)
      throw new Error(
        `Could not create ${demo.key}. Import can be retried without overwriting existing rows.`,
      );
    created += 1;
    console.log(`Created ${demo.key}`);
  }
  console.log(
    `Created ${created}; existing catalogue entries and owner edits were preserved.`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : "Demo import failed.");
  process.exitCode = 1;
});
