# Admin-managed demo stock

Owner approval: 24 October 2026. This replaces the large preview-only fixture set.

## Current catalogue

- Retain **14 of the original 28 source photo sets**, two in each category: 14 new editable listings, with 28 image files (portrait and landscape per listing).
- Covers are mostly vertical: ten portrait and four landscape. The two gallery images are different crops of the same source, not additional product angles.
- Preserve the existing ten catalogue rows and their five uploaded photos. The intended count after importing the new demos is **24 records**. Existing example/test rows are still unconfirmed stock and need review before launch.
- Public pages and owner management read the same Supabase products. Preview builds use this same data; the former 252 hardcoded listings and preview flags are gone.

## Editing demos

Use `/admin` as usual. Search Current Products for **demo**, then Edit. Title, category, price, description, status, dimensions, photo upload/order/removal and Delete all use the normal owner workflow.

The **Demo listing** checkbox stores an explicit `products.is_demo` boolean. It is independent of title, slug and availability, so ordinary edits do not accidentally remove demo status. New ordinary products default to false. Cards/admin rows show Demo, demo details disable buying enquiries and Product/Offer markup, and the sitemap excludes demos. No global catalogue banner is added.

Photos are copied to the existing public `product-images/demo-stock/` Storage folder so normal owner photo validation/editing works. The remaining source assets live in `public/demo-stock/`; `src/lib/demo-stock.json` records the 14 selections and source credits.

## Import and recovery

Apply all database migrations first, including `20261024183700_managed_demo_listings.sql`. It adds the boolean with a false default and does not change existing content or access policies.

```bash
npm run demos:seed             # show the planned rows; no writes
npm run demos:seed -- --apply  # import the approved set into the configured project
```

The import never overwrites an existing listing or owner edit. It identifies its imported rows by stable `legacy_id` values (`demo:<photo-key>`), verifies any already-uploaded file before reuse and can be retried after a partial failure. Demo visibility is controlled by the explicit boolean, not those identifiers or the title. Re-running after a deliberately deleted demo would recreate it, so do not import after the business-launch cleanup.

The pre-release backup is stored privately under `~/.local/share/willesden-rec/backups/2026-10-24-before-photo-release/`: ten product rows, one settings row and five hash-recorded photos. Credentials are not in this repository.

## Before changing to the business domain

1. In owner management, find and delete the demo listings, and review/remove the original example/test entries as well. Add and verify real stock.
2. Delete orphaned images in the demo Storage folder only after checking no retained product uses them; normal product deletion deliberately keeps shared photos safe.
3. Remove `public/demo-stock/`, the import script and selection manifest once no longer needed. Retain the source record/history if any photo remains in use.
4. Confirm there are no demonstration listings left, test owner uploads/enquiries, then complete the separate [domain/content/indexing handover](delivery.md).

Merging the visual release does not change the custom domain or enable indexing. The historical PDF and old change-history entries describe the larger pre-approval review set, not the final catalogue.

## Photo sources

The selected free Unsplash License pages were checked when sourced on 23 October 2026. Source records remain here without adding credits to the public cards. No Unsplash+ images were selected. See the [Unsplash License](https://unsplash.com/license).

| Photo set | Photographer | Original photo |
| --- | --- | --- |
| fireplaces-1 | Martina Jorden | [Source](https://unsplash.com/photos/a-fireplace-with-a-fire-in-it-in-a-living-room-FobTeHxegfg) |
| fireplaces-2 | Jon Tyson | [Source](https://unsplash.com/photos/fireplace-PmpLfhW0JMQ) |
| doors-1 | Ruben Hanssen | [Source](https://unsplash.com/photos/brown-wooden-door-on-gray-concrete-wall-EVnw-Y1Bxyg) |
| doors-2 | Anjali Mehta | [Source](https://unsplash.com/photos/blue-wooden-6-paneled-door-LfRxSi1o6hw) |
| windows-1 | Mari Madriz | [Source](https://unsplash.com/photos/red-wooden-window-frame-FRsmwVdIBOg) |
| windows-2 | Rob Wingate | [Source](https://unsplash.com/photos/brown-wooden-window-6iTJzT2sRBs) |
| lighting-1 | Jez Timms | [Source](https://unsplash.com/photos/turned-on-desk-lamp-beside-pile-of-books-8muUTAmcWU4) |
| lighting-2 | Annie Spratt | [Source](https://unsplash.com/photos/silver-and-white-desk-lamp-CpF8oOfwuoY) |
| garden-1 | T | [Source](https://unsplash.com/photos/stone-urn-with-fern-pattern-in-lush-garden-qWRo-T5Gy5k) |
| garden-2 | Vikram Singh | [Source](https://unsplash.com/photos/stone-urn-on-brick-path-in-garden-lXEh5z_pumU) |
| furniture-1 | Kelly Miller | [Source](https://unsplash.com/photos/brown-wooden-chair-on-grass-covered-plain-BL6XQLZeXpg) |
| furniture-2 | insung yoon | [Source](https://unsplash.com/photos/a-wooden-chair-sitting-on-top-of-a-wooden-floor-RCWIK0fsETc) |
| other-1 | Tolu Akinyemi 🇳🇬 | [Source](https://unsplash.com/photos/a-bunch-of-copper-cups-sitting-on-top-of-a-table-Wkqz14PlAMQ) |
| other-2 | Georg Eiermann | [Source](https://unsplash.com/photos/brass-and-silver-round-frame-7eLOfLfcngo) |
