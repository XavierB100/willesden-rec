# Willesden Reclamation

Version **1.1.0** — responsive stock browsing, photo viewing and admin-managed demos. The `v1` Git tag preserves the approved 1.0.0 baseline. See [release notes](notes/releases.md).

Maintained by **XavierB100 (xavier blake)**. Next.js and React website with Supabase inventory, owner-only management, photo uploads, and WhatsApp enquiries. Hosted on Netlify.

The deliverable base is prepared for **https://www.willesdenreclamation.co.uk**. The Netlify review site and PR previews are publicly shareable, with search indexing disabled. The catalogue still contains example/test stock. See [delivery and domain handover](notes/delivery.md), [hosting](notes/hosting.md), and the [existing URL inventory](notes/existing-urls.csv).

## Development

Use Node.js 22.13 or later in the 22 LTS line and `npm ci`. Copy `.env.example` to `.env.local`, fill its values privately, then run `npm run dev`.

```bash
npm ci
npm run dev
npm run check
npm start
```

`npm run check` runs ESLint, regression tests, and the production build. GitHub Actions runs the same checks and a production-dependency audit on pull requests and pushes to main, using the pinned actions in `.github/workflows/checks.yml`. `npm run verify:site` checks a running local production server; see the verification instructions below.

## Configuration

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project API origin |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public publishable key; compatibility variable name retained |
| `SUPABASE_SERVICE_ROLE_KEY` | Privileged server credential; never expose in client code |
| `ADMIN_EMAIL` | The one authorized owner login |
| `NEXT_PUBLIC_SITE_URL` | Origin used in WhatsApp listing links; use the staging origin until launch, then `https://www.willesdenreclamation.co.uk` |
| `SITE_INDEXABLE` | Defaults to false. Set true only for approved production; deploy-preview contexts always remain noindex |

Set Netlify variables for both builds and functions. Production and deploy-preview may share the current staging database; do not use real inventory for experimental changes. Never commit credentials.

SEO canonicals, social metadata, structured data, and sitemap URLs use the final www domain. The indexability switch is separate from the enquiry-link origin. A missing/failed catalogue database produces an error state, never example products. Missing listings return 404. Public business details retain the checked-in defaults if settings cannot load; admin settings reads fail explicitly so defaults cannot accidentally overwrite the database.

## Catalogue and demo stock

The public site, category pages and owner workspace use the same Supabase catalogue. Fourteen new demo listings retain half of the review photo sets: two per category, with ten portrait and four landscape covers. They are ordinary editable stock records with an explicit Demo listing setting; there is no separate preview-only catalogue or fixture flag.

Demo cards are labelled, demo product pages have no buying action or Product/Offer structured data, and demos are omitted from the sitemap. Keep indexing disabled and replace all demo/test stock before the domain launch. See [demo stock, sources and removal](notes/demo-stock.md).

Stock search filters titles, categories, descriptions and dimensions as you type. Apply commits the selected sort order; Enter and Clear search retain the applied sort. Search/category/order stay in the URL. Stock pages paginate after six rows at 2/3/4/5 columns. Latest Arrivals shows five cards on phones and two complete rows at wider sizes when enough stock exists.

The [complete change history](notes/change-history.md) records the original app, v1, the earlier review and final release. [Account migration](notes/account-migration.md) records GitHub recovery and hosting continuity.

## Owner management

Open `/admin` and sign in as the configured Supabase Auth owner. Public signups are disabled.

- Use the section links to reach Current Products, Add Product, or Site Details. Search inventory by title, category, or status, combine categories in the multi-select, or jump straight to a matching product. The compact list shows roughly five items and scrolls independently; Show all expands it.
- Add a title, category, description, dimensions, and price. Blank price means POA; decimal prices use up to two places.
- Check **Demo listing** for demonstration stock. This label and its disabled enquiry state survive ordinary edits; uncheck it only when the listing represents real stock. Search for “demo” in Current Products to find these records.
- Upload up to 20 JPEG, PNG, WebP, AVIF, or GIF images. Phone photos are reduced to a maximum 2000 px edge before upload when needed. Originals may be up to 20 MB; final files must be 4 MB or smaller. GIFs must already meet the 4 MB limit. HEIC is not supported: export JPEG first.
- Use Up/Down to choose photo order; the first photo appears on catalogue cards. Publish Item saves the product.
- Edit loads and focuses the product form. Keep a published slug unchanged to preserve its URL. Change Status to Sold and save to retain the listing while disabling its enquiry button.
- Delete requires confirmation and removes the listing. Photos are retained in Storage to avoid deleting files shared by another listing; review orphaned files during maintenance.
- Site Details controls contact details, opening hours, the footer, and the navigation WhatsApp destination. Use Google Maps Share → Embed a map and paste the iframe or its HTTPS URL.
- Opening hours use one `Label: Hours` pair per line. Save Site Details separately from product edits.

Edits are not saved until submitted. Switching products or leaving via site links prompts when a draft is unsaved; browser refresh/close uses the browser's warning. Keep a separate backup of live inventory and photos.

## Database setup

For a new environment, run every SQL migration in filename order, including the production-access and managed-demo migrations. The first migration includes demo stock: replace/review it before launch. Create the owner Auth user and configure `ADMIN_EMAIL`. RLS and explicit grants allow public reads only; all writes pass through owner-checked server routes. Storage is public-read, with server-only uploads.

`src/lib/catalogue.ts` contains browser-safe types/helpers. `src/lib/data.ts` is server-only. Input validation is shared by create/update routes. Public product reads are live; a saved change is visible on the next page load without a rebuild.

## Hosting

`netlify.toml` builds with `npm run build`, publishes `.next`, and uses the Next.js adapter. This app requires server functions. The obsolete `docs/` static export and unused Vercel telemetry were removed; neither is part of deployment.

Netlify production and deploy previews are public for review at the owner’s request. Keep `SITE_INDEXABLE=false` until the content, domain, and operational checks in [notes/delivery.md](notes/delivery.md) are approved. Connecting the domain does not require moving its registration or changing the business's email provider.

## Verification

With `npm run build` and `npm start` running, `npm run verify:site` performs read-only HTTP/SEO/access checks. To exercise disposable product mutations locally, supply `.env.local`, `VERIFY_MUTATIONS=true`, and `VERIFY_ADMIN_PASSWORD` privately in the process environment. The script refuses mutation mode on a non-local host and cleans up its test product and image in `finally`. Never put the password in a command history or notes.

`test-results/` holds local verification evidence and is ignored by Git. Browser checks cover responsive layouts, owner workflows, keyboard navigation, image resizing, and WCAG automated rules. Automated results do not replace real-device and assistive-technology acceptance testing.
