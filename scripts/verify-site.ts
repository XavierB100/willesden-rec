/** Run against a local production server. Mutations require explicit opt-in and a test login. */
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
const base = process.env.VERIFY_URL || "http://localhost:3000";
const results: string[] = [];
function check(name: string, condition: unknown) {
  assert.ok(condition, name);
  results.push(name);
}
async function get(path: string, options?: RequestInit) {
  return fetch(`${base}${path}`, { redirect: "manual", ...options });
}

async function main() {
  for (const path of [
    "/",
    "/stock",
    "/fireplaces",
    "/doors",
    "/windows",
    "/selling",
    "/contact",
    "/admin",
  ]) {
    const response = await get(path);
    const html = await response.text();
    check(`${path}: responds`, response.status === 200);
    check(
      `${path}: no nested button/link`,
      !/<a\b[^>]*>\s*<button/i.test(html),
    );
    check(
      `${path}: private indexing`,
      /name="robots" content="noindex, nofollow"/.test(html),
    );
    if (path !== "/admin")
      check(
        `${path}: canonical`,
        html
          .match(/rel="canonical" href="([^"]+)"/)?.[1]
          ?.replace(/\/$/, "") ===
          `https://www.willesdenreclamation.co.uk${path === "/" ? "" : path}`,
      );
  }
  check(
    "staging robots blocks indexing",
    (await (await get("/robots.txt")).text()).includes("Disallow: /"),
  );
  const map = await (await get("/sitemap.xml")).text();
  check(
    "sitemap uses final www domain",
    map.includes("https://www.willesdenreclamation.co.uk/products/") &&
      !map.includes("netlify.app"),
  );
  check(
    "missing product is 404",
    (
      await get("/products/does-not-exist-ever", {
        headers: { "User-Agent": "Googlebot" },
      })
    ).status === 404,
  );
  for (const path of ["/api/admin/products", "/api/admin/settings"])
    check(`${path}: anonymous denied`, (await get(path)).status === 401);
  if (process.env.VERIFY_MUTATIONS !== "true") return;
  if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
    throw new Error(
      "Mutation verification is limited to the local production server.",
    );
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
  const service = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
  const login = await client.auth.signInWithPassword({
    email: process.env.ADMIN_EMAIL!,
    password: process.env.VERIFY_ADMIN_PASSWORD!,
  });
  if (login.error) throw new Error("Verification login failed");
  const token = login.data.session!.access_token;
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
  const before = await (await get("/api/admin/products", { headers })).json();
  let id: string | undefined, storagePath: string | undefined;
  try {
    const photo = await sharp({
      create: { width: 64, height: 64, channels: 3, background: "#2f4f4f" },
    })
      .png()
      .toBuffer();
    const form = new FormData();
    form.set(
      "file",
      new Blob([photo], { type: "image/png" }),
      "verification.png",
    );
    const upload = await get("/api/admin/uploads", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    check("valid upload accepted", upload.status === 200);
    const uploaded = await upload.json();
    storagePath = uploaded.path;
    check(
      "photo publicly readable",
      (await fetch(uploaded.url)).status === 200,
    );
    const fake = new FormData();
    fake.set(
      "file",
      new Blob(["<svg></svg>"], { type: "image/png" }),
      "fake.png",
    );
    check(
      "disguised image rejected",
      (
        await get("/api/admin/uploads", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fake,
        })
      ).status === 400,
    );
    const oversized = new FormData();
    oversized.set(
      "file",
      new Blob([new Uint8Array(4194305)], { type: "image/png" }),
      "large.png",
    );
    check(
      "oversized image rejected",
      (
        await get("/api/admin/uploads", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: oversized,
        })
      ).status === 413,
    );
    const payload = {
      title: "Verification temporary item",
      slug: `verification-${Date.now()}`,
      category: "Other",
      status: "available",
      price: 23.79,
      description: "Temporary verification entry",
      dimensions: "64cm",
      imageUrls: [uploaded.url],
    };
    const created = await get("/api/admin/products", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    check("product created", created.status === 201);
    const json = await created.json();
    id = json.product.id;
    check("decimal price preserved", json.product.price === 23.79);
    check(
      "duplicate slug rejected",
      (
        await get("/api/admin/products", {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        })
      ).status === 409,
    );
    check(
      "negative price rejected",
      (
        await get(`/api/admin/products/${id}`, {
          method: "PUT",
          headers,
          body: JSON.stringify({ ...payload, price: -1 }),
        })
      ).status === 400,
    );
    check(
      "malformed payload rejected",
      (
        await get("/api/admin/products", {
          method: "POST",
          headers,
          body: "null",
        })
      ).status === 400,
    );
    const page = await (await get(`/products/${payload.slug}`)).text();
    check(
      "public product rendered",
      page.includes("Temporary verification entry"),
    );
    check("product JSON-LD uses decimal offer", page.includes('"price":23.79'));
    const alias = await get(`/products/${id}`, {
      headers: { "User-Agent": "Googlebot" },
    });
    check(
      "ID redirects to canonical slug",
      alias.status === 308 &&
        alias.headers.get("location") === `/products/${payload.slug}`,
    );
    const updated = await get(`/api/admin/products/${id}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ ...payload, status: "sold", price: 12.34 }),
    });
    check("product update succeeds", updated.status === 200);
    const sold = await (await get(`/products/${payload.slug}`)).text();
    check(
      "sold state public",
      sold.includes("Item Sold") && sold.includes("https://schema.org/SoldOut"),
    );
    const settings = await (
      await get("/api/admin/settings", { headers })
    ).json();
    check(
      "settings round-trip succeeds",
      (
        await get("/api/admin/settings", {
          method: "PUT",
          headers,
          body: JSON.stringify(settings.settings),
        })
      ).status === 200,
    );
    check(
      "unsafe map rejected",
      (
        await get("/api/admin/settings", {
          method: "PUT",
          headers,
          body: JSON.stringify({
            ...settings.settings,
            mapEmbedUrl: "javascript:alert(1)",
          }),
        })
      ).status === 400,
    );
    const denied = await client
      .from("products")
      .update({ price: 0 })
      .eq("id", id);
    check("authenticated direct write denied", !!denied.error);
    const deleted = await get(`/api/admin/products/${id}`, {
      method: "DELETE",
      headers,
    });
    check("product removed", deleted.status === 200);
    id = undefined;
    check(
      "deleted listing stays absent",
      (
        await get(`/products/${payload.slug}`, {
          headers: { "User-Agent": "Googlebot" },
        })
      ).status === 404,
    );
  } finally {
    if (id) await service.from("products").delete().eq("id", id);
    if (storagePath)
      await service.storage.from("product-images").remove([storagePath]);
    await client.auth.signOut({ scope: "local" });
  }
  const after = await service.from("products").select("id");
  check(
    "original inventory retained",
    after.data?.length === before.products.length,
  );
}
main()
  .then(() => {
    mkdirSync("test-results", { recursive: true });
    writeFileSync(
      "test-results/integration.json",
      JSON.stringify(
        {
          date: new Date().toISOString(),
          base,
          passed: results.length,
          results,
        },
        null,
        2,
      ),
    );
    console.log(`${results.length} checks passed`);
  })
  .catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
