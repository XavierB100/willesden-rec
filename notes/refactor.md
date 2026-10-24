# Heritage storefront and owner workspace

Prepared 24 October 2026. Maintainer: **itslizzyy**. Branch: `codex/heritage-site-refactor`.

## Review status

This is a separate design proposal based on `6ffc7d0`, carrying forward the photo, search and pagination work from `codex/responsive-product-photos`. The original branch and PR #2 remain unchanged. The intended new PR targets `main`, so it can be reviewed as a complete alternative without first merging PR #2.

Remote publishing is blocked: the selected `itslizzyy` GitHub credential returns HTTP 403, **“Sorry. Your account was suspended.”** The other locally signed-in identity and the connected GitHub integration return 404 for this private repository. No new PR or hosted deploy preview has been created. The existing production deployment and custom domain have not been changed.

## Design references

Reviewed the current sites on 24 October 2026:

- [Willesden Reclamation](https://www.willesdenreclamation.co.uk/): retain its emphasis on fireplaces, period doors, seeing stock at the yard, and talking directly to the business. The legacy route map remains in [existing-urls.csv](existing-urls.csv).
- [LASSCO](https://www.lassco.co.uk/): clear routes into architectural categories, latest stock and selling to the business.
- [Retrouvius](https://www.retrouvius.com/): an editorial rhythm, prominent individual objects, visible prices, and the story of reuse.

These informed the structure, not copied branding, claims or imagery. Existing Playfair Display/Inter typography and cream, charcoal, moss, forest and brass colours remain. The preview photographs retain their existing source records in [review-stock.md](review-stock.md). No new third-party stock imagery was added.

## What changed

### Public experience

- A split homepage with a featured catalogue piece, category index, latest arrivals and a short introduction to visiting/selling. The feature uses an available product that has a photo; it is never a hard-coded fictional business photograph.
- Shared editorial headings, restrained borders, consistent spacing, and contrast-corrected accents. Full product photographs remain contained rather than cropped.
- Photo and title links make cards easier to open while leaving gallery arrows and retry controls independent.
- Category landing pages now use the same immediate search, separate Apply-sort action and six-row pagination as `/stock`. Public URLs and legacy redirects are retained.
- Horizontal category navigation on narrow screens, clearer visit information and a three-step selling flow. Enquiries still go to the configured WhatsApp destination; no checkout or invented booking flow.
- An isolated storefront layout, a catalogue loading state and more useful missing-page handling. Product routes deliberately have no parent loading boundary: their missing-item response must remain HTTP 404 rather than an already-streamed 200.

### Owner experience

- A dedicated sign-in screen and workspace with persistent section navigation, separate from public navigation/footer.
- Inventory summary filters for all/available/sold, text search, combined category filters, 12-item pagination and responsive inventory rows. Quick status changes are reversible; delete stays in the editor behind confirmation.
- A focused product editor with labelled details, guidance, live cover/title/price preview, availability, a stable saved-listing link and sticky save controls.
- Photo drop/upload with per-file progress, first-photo cover labelling, keyboard-operable reordering, Make cover and remove controls. Successful uploads survive a later file failure; edits are still only published when saved.
- Product and yard-details drafts survive switching workspace sections. New/edit selection and Cancel protect unsaved product changes. Sign-out, same-tab site links and browser refresh/close retain discard warnings.
- Saved edits stay open for further editing. Failures preserve drafts and appear as a visible, announced message. Initial data failures offer a retry.
- Contact/location editing and structured opening-hours rows replace the old colon-separated textarea. Times containing colons round-trip correctly. Settings remain an independent save.

## Architecture

| Location | Responsibility |
| --- | --- |
| `src/app/layout.tsx` | Fonts, metadata defaults and document/skip link |
| `src/app/(site)/layout.tsx` | Public navigation, LocalBusiness metadata, main landmark and footer |
| `src/app/(site)/storefront.css` | Public editorial layout, category index and catalogue surfaces |
| `src/app/admin/layout.tsx`, `admin.css` | Isolated owner landmark and responsive workspace styling |
| `src/app/globals.css` | Shared palette, typography, focus/reduced-motion rules, product grid and small primitives |
| `src/components/storefront/` | Page heading and reusable category page |
| `src/components/admin/AdminWorkspace.tsx` | Workspace composition and section switching |
| `src/components/admin/useAdminWorkspace.ts` | Auth lifecycle, drafts, pending-action guard, uploads and authorized API requests |
| `src/components/admin/Inventory.tsx` | Inventory display, category/status filters and paging |
| `src/components/admin/ProductEditor.tsx`, `PhotoManager.tsx` | Product form, preview, save controls and photos |
| `src/components/admin/SiteDetails.tsx`, `Field.tsx` | Settings form and accessible label/help associations |
| `src/lib/data.ts`, `src/lib/admin-auth.ts`, API routes | Existing server-only data access, verified owner authorization and write validation |

Public pages stay server components, with client components only where interaction is needed. The homepage fetches settings/products concurrently; request-level data caching and the single browser auth client are retained. The refactor adds no schema migration and no authorization bypass. The browser test login is intercepted entirely inside Playwright, never in shipped application code.

## Verification and review

Run:

```bash
npm ci
npm run check
npm run format:check
npm start -- --port 3100
# In another terminal:
VERIFY_URL=http://localhost:3100 npm run verify:site
npx playwright install chromium
npm run test:e2e
```

`npm run test:e2e` starts or reuses the built application on port 3100. With `VERIFY_URL`, it uses that already-running server instead. It runs the public UI against the configured catalogue. Owner tests intercept Auth and admin API requests with fictional fixtures to deterministically test failed saves, confirmations, CRUD state, photo ordering/upload, opening-hours serialization and responsive layouts. They do not write to Supabase. Axe checks use WCAG 2 A/AA and 2.1 AA tags. Traces/screenshots are retained on failure under ignored `test-results/browser/`; the HTML report is also ignored.

The separate `verify:site` mutation mode exercises the real API against the local production server, creates a uniquely named temporary product/image and cleans both in `finally`. Supply the owner password privately via `VERIFY_ADMIN_PASSWORD`, with `VERIFY_MUTATIONS=true`; do not put credentials in commands or documentation. Existing inventory and settings are not edited by this verification.

For a sample-filled local review:

```bash
CONTEXT=deploy-preview REVIEW_SAMPLE_STOCK=true npm run dev -- --port 3101
```

This enables the existing 252 fictional storefront listings, with Sample labels and no purchase enquiries. Admin continues to use the configured staging inventory. Samples are never a fallback for failed database reads and never enter Supabase.

Before accepting, review the home, catalogue, product, selling, contact and admin screens on phone and desktop. Physical iPhone/Safari and assistive-technology review remain outside the Chromium automated checks. Inventory, contact details, domain handover, backup policy and search-indexing approval retain the separate launch requirements in [delivery.md](delivery.md).

### Recorded results

- Final production `npm run check` passed: ESLint, 18 regression tests, TypeScript and Next.js production build.
- `npm run format:check` passed.
- All 8 Playwright tests passed against the production build. Public checks cover eight routes at 320/390/768/1440 CSS px; owner checks cover inventory, editor and settings at 320/390/768/1024/1440 px. No horizontal document overflow was found.
- Axe found no WCAG 2 A/AA or 2.1 AA violations on the eight tested public/login routes and three authenticated workspace views at desktop size. This is an automated scope, not a full accessibility certification.
- The real local-production API verification passed 56 checks, including disposable upload/create/update/sold/delete and cleanup. The final production read-only verification also passed all 36 checks.
- Real owner login and draft-only editing were checked in Chromium. No existing product or business settings were changed during UI review. Live API mutation tests used disposable records only.
- Local evidence is under ignored `test-results/refactor/`, `test-results/browser/`, and the verifier’s JSON output. Sample-filled public screenshots show fictional review stock; admin screenshots show staging/test inventory.

The three public browser tests also passed with the full 252-item fictional catalogue. The intended PR title/body are prepared in [refactor-pr.md](refactor-pr.md).
