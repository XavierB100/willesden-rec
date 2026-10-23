# Willesden Reclamation

Next.js site for Willesden Reclamation, maintained by itslizzyy, with Supabase inventory, admin login, product image uploads, WhatsApp enquiries, and Netlify hosting.

Current hosting details, verification results, and maintenance steps are in [notes/hosting.md](notes/hosting.md). The Netlify site is a private staging environment until business content and domain cutover are approved.

## Local Development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Fill `.env.local` with the Supabase project URL, anon key, service role key, and owner email. Never put real keys in `.env.example`; it is only a placeholder template.

Without Supabase environment variables the public site uses built-in demo stock so pages can still build and render. The admin dashboard requires Supabase variables.

## Local Admin Test

After Supabase is configured and `npm run dev` is running:

1. Open `http://localhost:3000/admin`.
2. Log in with the Supabase Auth user whose email matches `ADMIN_EMAIL`.
3. Add a test product with title, category, description, price, dimensions, status, and at least one image. Categories are Fireplaces, Doors, Windows, Lighting, Garden, Furniture, and Other.
4. Check `http://localhost:3000/stock` and the product detail page.
5. Test stock sorting by latest, price low-to-high, and price high-to-low.
6. Edit the product, mark it sold, and confirm the public stock and detail pages update.
7. Delete the test product when finished if it was only for QA.

The seeded products intentionally use local placeholder images until real stock photos are uploaded.

Prices support pounds and pence. Leave the price blank for POA, or enter values such as `23`, `23.50`, or `23.96`.

For the contact page map, use Google Maps `Share > Embed a map > Copy HTML`. The admin form accepts either the full iframe HTML or just the `src` URL. Google Maps short links such as `maps.app.goo.gl` are share links, not embeddable iframe URLs.

## Supabase Setup

1. Create a Supabase project.
2. Run the SQL files in `supabase/migrations/` in filename order, including the production access migration. The initial migration includes example stock that must be reviewed before a public launch.
3. Create an auth user for the owner in Supabase Auth.
4. Set `ADMIN_EMAIL` to that owner email.
5. Copy the project URL, anon key, and service role key into `.env.local` and Vercel environment variables.

If the project was created before decimal prices or the Windows/Other categories were added, also run `supabase/migrations/002_decimal_prices.sql` and `supabase/migrations/003_add_windows_other_categories.sql` in the Supabase SQL editor as needed. Fresh projects only need the latest full schema in `001_initial_schema.sql`.

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
NEXT_PUBLIC_SITE_URL=
```

The `product-images` storage bucket is public-read. Product writes, settings updates, and uploads go through protected Next.js route handlers that verify the logged-in Supabase user email matches `ADMIN_EMAIL`. Public database roles have SELECT access only. Uploads accept JPEG, PNG, WebP, AVIF, and GIF images up to 4 MB each.

`NEXT_PUBLIC_SITE_URL` is used in prefilled WhatsApp enquiry messages. Use `https://willesdenreclamation.co.uk` for production, or omit it locally to use the same production link in test messages.

If the service role key is ever committed, screenshotted publicly, or pasted into a public place, rotate it in Supabase before deploying.

## Deployment

Netlify reads `netlify.toml`: Node.js 22, build command `npm run build`, and publish directory `.next`. Its Next.js adapter provides the server routes. Set all five application variables in Netlify for production and deploy previews, with values available to both builds and functions. Keep the privileged Supabase key server-side and out of Git.

The application needs a full Next.js deployment because the admin dashboard, uploads, and server-side writes require server routes. The old `docs/` static export is an archived build and is not the Netlify publish directory.

Vercel Analytics and Speed Insights run only when `VERCEL=1`. They are not enabled on Netlify.

After the staging environment passes verification and a domain cutover is approved, connect `willesdenreclamation.co.uk` to the Netlify project from the domain registrar/DNS provider.

When the real domain is connected, update `NEXT_PUBLIC_SITE_URL` in Netlify and the Supabase Auth site/redirect URLs to the production address, then redeploy so WhatsApp enquiry messages include the final public URL.

The app ships with `robots.txt`, `sitemap.xml`, a web app manifest, LocalBusiness structured data, a noindex admin route, and WR favicon/app icons for search engines and mobile home-screen previews. After the domain switch, verify the site in Google Search Console and submit `https://willesdenreclamation.co.uk/sitemap.xml` to encourage Google to recrawl the new pages.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```
