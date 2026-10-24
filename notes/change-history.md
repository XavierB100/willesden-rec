# Changes since the original version and review handover

This records the earlier PR #2 review. For the separate heritage storefront and admin refactor, see [the refactor handover](refactor.md).

Prepared for owner review on **24 October 2026**. Maintainer: **itslizzyy**.

## Versions being compared

| Version | Exact reference | State at this handover |
| --- | --- | --- |
| Original checked-in application | `24e5ef7bd8e5aac327628d6e0b4b8b3d3de940c8` (`Initial commit`, package version 0.1.0) | Starting point for the cumulative comparison |
| Approved v1 | `bdce119b9a92455d57a68e8183342d969a03b107`, annotated tag `v1`, package version 1.0.0 | Merged PR #1; current `main` baseline |
| Current review | `codex/responsive-product-photos`, [PR #2](https://github.com/itslizzyy/willesden-rec/pull/2) | Open and unmerged; review deployment only |

The original in this record is the first checked-in Next.js application. The separate legacy website's route inventory and domain plan are in [existing-urls.csv](existing-urls.csv) and [delivery.md](delivery.md).

The original application already included public/category stock pages, latest arrivals, category and price sorting, multiple product photos with arrow controls, a full-screen viewer, WhatsApp enquiries, owner-restricted management routes, product uploads, and editable site settings. The following sections record how those features changed and what was added.

Full file/line comparisons are available at [original → approved v1](https://github.com/itslizzyy/willesden-rec/compare/24e5ef7...v1), [approved v1 → this PR](https://github.com/itslizzyy/willesden-rec/compare/v1...codex/responsive-product-photos), and [original → current review](https://github.com/itslizzyy/willesden-rec/compare/24e5ef7...codex/responsive-product-photos). These comparisons include the configuration, documentation, asset, dependency and lockfile changes as well as the interface.

## Original → approved v1: hosting, reliability and management

| Area | Differences and improvements |
| --- | --- |
| Hosting | Added Netlify build configuration, Node 22 and the explicit Next.js server adapter. The initial source/static-file deployment was corrected to run the application with server functions. Linked production to `main` and enabled PR deploy previews. |
| Project ownership and data | Established the dedicated Willesden Reclamation Supabase project and its hosting configuration under itslizzyy. Migrated the existing catalogue, settings and photos, checked copied photo hashes, and made a local baseline backup. This setup did not confirm the sample/test inventory as real business stock. |
| Access controls | Retained owner-only API authorization and normalized owner-email comparison for case/whitespace. Added explicit public-read/server-write database grants and RLS setup, disabled public signups, and kept upload/write operations behind server owner checks. Credentials remain in ignored/private configuration and Keychain. |
| Data separation | Split browser-safe catalogue types/helpers from server-only database access. Removed duplicated validation, added request timeouts, queried a requested product by identifier instead of fetching the full catalogue, and deduplicated metadata/page reads. |
| Outages and missing items | Removed the original automatic example-product fallback on failed/missing database reads. Stock failures show a recoverable error, and missing/deleted products return 404. Public settings may retain checked-in defaults on an outage; owner settings reads fail explicitly so defaults cannot overwrite the saved settings. |
| Product/settings validation | Centralized field, category, slug, status, price, dimensions and image URL validation. Preserved pence and POA handling, rejected invalid/ambiguous inputs, limited photos to the configured project bucket and 20 images, and made duplicate/failed saves recoverable. |
| Owner editing reliability | Added shared request/error handling, prevention of concurrent actions, draft retention after failed requests, protection against session refresh overwriting edits, and unsaved-change prompts for form switching/navigation. Edit loads and focuses the correct form. |
| Inventory management | Added section shortcuts, inventory search, a category multi-select, filtered jump-to-product control, compact independently scrolling list and Show all expansion. Photo controls wrap on narrow screens, support ordering and retain the first-photo-as-cover convention. |
| Upload preparation | Added browser photo preparation: up to 20 MB input, maximum 2000 px edge, WebP conversion when supported and final 4 MB limit. Server checks actual image metadata, format and dimensions/pixel limits. GIFs retain their existing 4 MB limit. Supported types are JPEG/PNG/WebP/AVIF/GIF; HEIC still needs export to a supported type. |
| Gallery accessibility | Replaced the original visual full-screen overlay with a native modal dialog, including focus trapping/restoration, Escape and left/right keys, body scroll restoration and pressed thumbnail state. |
| Navigation and controls | Removed nested interactive link/button markup through `ButtonLink`, made details links consistently available, improved focus/labels/tap targets, added a skip link and reduced-motion support. Restored the mobile menu animation with Escape handling and condensed its layout. |
| Footer and public pages | Refined mobile footer spacing; arranged Explore links in two columns with a centred heading; made phone/email links actionable; retained the approved gold styling and logo hover/focus. Condensed mobile category controls and the selling page's two-column What We Buy list. Made WhatsApp labels stay inside their buttons on narrow screens. |
| SEO and domain preparation | Added consistent canonical www URLs, absolute titles, social metadata and safe LocalBusiness/Product JSON-LD. Product offers reflect actual price/status and POA does not invent a price. Added the indexability switch, admin/API noindex/private headers, live sitemap, legacy route redirects and the separate old-URL/domain handover plan. |
| Dependencies and cleanup | Updated Next.js 16.2.6 → 16.4.2, React 19.2.1 → 19.3.1 and Supabase JS to 2.118.0. Added image/validation/verification tooling, committed the lockfile, removed unused animation/Vercel telemetry dependencies, obsolete `docs/` static exports and the scratch colour-check script. Added the generated Next agent guidance. |
| Verification and handover | Added `npm run check`, regression tests and the HTTP/optional-local-mutation verifier. Recorded hosting, backups, domain/legacy routes and operational checks. Saved a GitHub Actions template in `notes/ci-checks.yml`; it is not claimed as an enabled workflow. Historical v1 audit and owner-workflow evidence is in [delivery.md](delivery.md). |

## Approved v1 → PR #2: stock browsing and visual changes

### Grid and homepage

- Stock/category grids change from one column on phones and 2/4 on wider layouts to **2 / 3 / 4 / 5 columns** at below 768 / 768 / 1024 / 1280 CSS px respectively.
- Catalogue/category pages now stop at **six rows per page**: 12, 18, 24 or 30 items. Previous/Next, page/item counts and boundary disabling are added. Filtering/sorting reset paging; resizing retains an anchor product within the recalculated page.
- Latest Arrivals previously fetched four items. The current mobile layout keeps **five** items in two columns. Wider layouts show **two rows**: 6 cards at 768 px, 8 at 1024 px, 10 at 1280 px and above, subject to available stock. Hidden extra cards do not create mobile rows.
- The mobile homepage View All Stock button moves closer to the cards, with a **24 px** gap. Wider screens retain their header stock link.

### Card appearance and photo handling

- Every card has an identical **3:4 photo frame**. Portrait photos fill that height; landscape photos retain their own proportions and sit centred with page-coloured cream above/below. Full photos are contained instead of cropped to fill the old 4:5 card frame.
- The placeholder is rebuilt as **1200×1600** to match the final portrait frame. Card edges, photo boxes, titles, prices and actions align across each row. Two title lines are reserved and content spacing is tighter.
- Gold card borders are permanent; hover adds the shadow. Details remain visible beside the price, with compact text-width **32 px visible boxes** and a **44 px tap area**.
- Visible card arrow circles shrink to **32 px** with **44 px tap areas**, reducing obstruction of the photo.
- A shared `ProductPhoto` component is used in cards, product galleries and full-screen viewing. It keeps the displayed photo until the requested replacement decodes, shows loading feedback, and offers retry for failed requests.
- Once the viewer is visible and its current image is ready, it preloads the two neighbouring optimized variants using the same responsive `srcset`/sizes. This reduces the wait on navigation while keeping requests bounded. Cold requests still depend on the connection/image service.
- Image sizes now match the actual grid/gallery widths. Deprecated image priority usage in the edited photo components is replaced with appropriate loading/fetch hints.
- Detail galleries and thumbnails preserve complete images. The full-screen dialog follows viewport height/width and reserves space for closing/navigation/count controls, including landscape phone layouts. The detail stage remains square; the stock-card stage is 3:4.

### Search and sorting

- Added **immediate, case-insensitive search** across title, category, description and dimensions. All typed words must match; whitespace and word order are handled. Empty searches restore the category's stock.
- Filtering happens locally over the catalogue already fetched by the server, so a new catalogue request is not needed for each letter. Category-link prefetch is disabled to avoid new filter-page requests as live query links change.
- The sort selector has a separate draft state. **Apply changes sorting only**. Typing, Enter in the search field, and Clear search retain the last applied order until Apply is pressed.
- Search text and the applied order stay in a shareable/reloadable URL. Category changes retain them. Clear search removes only the query and keeps category/applied sort. Browser history restoration synchronizes the controls.
- Search, Sort by and Apply share one row on phones and desktop. Sort is **84 px on phones / 128 px on wider screens**; the search field gets the remaining space. Options use compact Newest / Price ↑ / Price ↓ labels.

### Review stock and publishing state

- Added **252 fictional listings, 36 per category**, for testing full pages. **28 source photographs** have portrait 1200×1600 and landscape 1600×1200 WebP variants: 56 assets in total. Most covers are portrait; some are landscape. Some galleries show both crops of the same source image. Listings/photos are intentionally reused; each category includes a missing-photo example, and the set includes sold and POA states.
- Samples are checked-in preview data behind a build-time gate requiring both `CONTEXT=deploy-preview` and `REVIEW_SAMPLE_STOCK=true`. They do not enter Supabase or owner management. Production builds continue using the existing catalogue.
- Small Sample labels and the unavailable-to-purchase state remain. The global demo banner and on-page photo credits were removed at the owner's request. Descriptions are generic text per category. Source/license records remain in [review-stock.md](review-stock.md) and the photo manifest.
- Samples have no enquiry action or Product/Offer structured data and are excluded from the sitemap. This is an explicitly enabled review mode, separate from database outage handling.
- Netlify production and deploy previews were made public for owner-requested sharing. Search indexing stays disabled. Making the review URLs shareable did not merge PR #2, move the custom domain, or approve business launch.

## Validation and practical limits

- Latest local checks: ESLint, **18 regression tests**, TypeScript/production build and deploy-preview build passed. Tests cover search, sorting with POA, URL/filter preservation, six-row pagination/coverage/resizing, sample gating/counts and photo dimensions.
- **36 read-only site checks** verify routes, canonicals/noindex, missing-product 404 and anonymous owner-API rejection. The final deployed head, Netlify deploy ID and hosted acceptance result are recorded in the PR description.
- Homepage browser checks at 320/390/768/1024/1280/1440 px verify **5/5/6/8/10/10 visible cards**, two rows at wider sizes, and no horizontal overflow.
- Earlier PR browser checks cover all categories, aligned cards/footers, portrait/landscape switching, clear/Enter/Apply independence, zero catalogue requests on first-letter filtering, paging, thumbnail/full-screen navigation, keyboard/focus restoration and the raised homepage link. Photo fixtures checked EXIF orientation 6, delayed-image retention and failed-image retry.
- These are T3 Chromium checks with responsive CSS viewports. Physical iPhone/Safari acceptance remains for owner review. New PR #2 visual changes have not been represented as a fresh full accessibility audit or a field performance certification. Historical v1 audit results retain their original scope in [delivery.md](delivery.md).
- Pagination slices the already-fetched catalogue; it does not add database paging. Sample prices/descriptions/photos are for layout review and do not confirm business inventory.

## Review handover and production decision

- Review [PR #2](https://github.com/itslizzyy/willesden-rec/pull/2), the [homepage preview](https://deploy-preview-2--adorable-sunshine-a6e527.netlify.app/), and the [stock preview](https://deploy-preview-2--adorable-sunshine-a6e527.netlify.app/stock).
- Compare phone and desktop, including two desktop Latest Arrivals rows, portrait/landscape framing, live search, Apply/Enter/Clear and a full category's pagination.
- **Decision pending owner review on 24 October 2026.** Leave PR #2 open and unmerged. Further refinements or a production merge require that decision; no automatic merge or production/domain promotion is scheduled.
- The current `main` application stays at approved v1 during this review. The existing shared inventory/settings are not changed by the review fixtures. A later production build uses that existing catalogue, not the 252 preview fixtures.
- The separate business-launch items remain in [delivery.md](delivery.md): verify business content/stock, preserve or redirect legacy URLs, agree backups, approve any domain/DNS/Auth URL/indexing change, and verify the deployed owner/enquiry flows. Those actions are outside the current review handover.

To inspect the complete source changes locally:

```bash
git diff v1..codex/responsive-product-photos
git diff 24e5ef7..codex/responsive-product-photos
```
