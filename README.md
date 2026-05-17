# Willesden Reclamation

Production-ready Next.js site for Willesden Reclamation, backed by Supabase inventory, admin login, product image uploads, WhatsApp enquiries, and Vercel hosting.

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
3. Add a test product with title, category, description, price, dimensions, status, and at least one image.
4. Check `http://localhost:3000/stock` and the product detail page.
5. Edit the product, mark it sold, and confirm the public stock and detail pages update.
6. Delete the test product when finished if it was only for QA.

The seeded products intentionally use local placeholder images until real stock photos are uploaded.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_initial_schema.sql` in the SQL editor or through the Supabase CLI.
3. Create an auth user for the owner in Supabase Auth.
4. Set `ADMIN_EMAIL` to that owner email.
5. Copy the project URL, anon key, and service role key into `.env.local` and Vercel environment variables.

Required variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAIL=
```

The `product-images` storage bucket is public-read. Product writes, settings updates, and uploads go through protected Next.js route handlers that verify the logged-in Supabase user email matches `ADMIN_EMAIL`.

If the service role key is ever committed, screenshotted publicly, or pasted into a public place, rotate it in Supabase before deploying.

## Deployment

Deploy to Vercel as a standard Next.js app. This project intentionally does not use `output: "export"` because the admin dashboard, uploads, and server-side Supabase writes require server routes.

After deployment, point `willesdenreclamation.co.uk` at the Vercel project from the domain registrar/DNS provider.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run start
```
