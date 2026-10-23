# Sample catalogue for PR review

The sample catalogue has **252 fictional listings: 36 per category**. It is enabled only when the build has both `CONTEXT=deploy-preview` and `REVIEW_SAMPLE_STOCK=true`. Netlify config sets the flag for deploy previews. Production builds use the live catalogue even if the flag is accidentally present. The boolean is embedded during the build because Netlify toml/build metadata is not available to Functions at runtime.

The storefront adapter uses checked-in sample objects; it never writes them to Supabase, and owner management keeps using the existing database. Samples keep the small category/card label and unavailable-to-purchase state, with no global banner, on-page photo credits, WhatsApp enquiry action, or Product/Offer structured data. Descriptions are generic copy for each category. They are not added to the sitemap. To review the live catalogue in a deploy preview, set the preview flag to false and rebuild.

There are **28 source photographs**, four for each category. Each has 1200×1600 portrait and 1600×1200 landscape WebP versions (3:4 and 4:3, matching standard iPhone photo proportions). Three quarters of sample cover photos are portrait; some galleries show both crops of the same source photograph. These are layout fixtures, not additional camera angles or real inventory. Images and sample listings are intentionally reused to fill the pages. One listing per category has no photo to exercise the matching portrait placeholder. Every stock card uses the same 3:4 photo frame, with two lines reserved for its title so card edges, prices and buttons align across each row. Portrait photos fill the frame; landscape photos stay centred at their natural proportions, with page-coloured space above/below and the permanent gold card outline.

Full catalogue/category listings show at most six rows: 12 items in two columns, 18 in three, 24 in four, 30 in five. Previous/Next preserve the selected category and sort. Resizing retains the anchor item within the newly calculated page. The homepage keeps five Latest Arrivals on phones and shows up to two full rows at wider sizes: six at 768 px, eight at 1024 px, ten at 1280 px and above, subject to available stock. Pagination is applied to the catalogue already fetched by the existing server reader; this does not introduce database paging.

## Photo sources

Each selected photo page was checked on 23 October 2026 for the free Unsplash License before download. The [Unsplash License](https://unsplash.com/license) permits website use and modification. No Unsplash+ photos were selected. On-page photo credits are omitted at the owner’s request; photographer/source records remain below for maintenance. Source metadata is checked in at `src/lib/review-stock-photos.json`.

| Asset | Photographer | Original photo |
| --- | --- | --- |
| fireplaces-1 | Martina Jorden | [Source](https://unsplash.com/photos/a-fireplace-with-a-fire-in-it-in-a-living-room-FobTeHxegfg) |
| fireplaces-2 | Jon Tyson | [Source](https://unsplash.com/photos/fireplace-PmpLfhW0JMQ) |
| fireplaces-3 | Tim Mossholder | [Source](https://unsplash.com/photos/an-old-chair-sitting-in-front-of-a-fireplace-MW4UxqFhuw4) |
| fireplaces-4 | Ibrahim Ahmed | [Source](https://unsplash.com/photos/a-brick-fireplace-in-a-corner-of-a-room-tRxeC3yOg2s) |
| doors-1 | Ruben Hanssen | [Source](https://unsplash.com/photos/brown-wooden-door-on-gray-concrete-wall-EVnw-Y1Bxyg) |
| doors-2 | Anjali Mehta | [Source](https://unsplash.com/photos/blue-wooden-6-paneled-door-LfRxSi1o6hw) |
| doors-3 | isabel garger | [Source](https://unsplash.com/photos/green-wooden-door-y4U7i9_Kumk) |
| doors-4 | Julian Hochgesang | [Source](https://unsplash.com/photos/white-and-brown-wooden-door-with-padlock-wojsaQXvkP0) |
| windows-1 | Mari Madriz | [Source](https://unsplash.com/photos/red-wooden-window-frame-FRsmwVdIBOg) |
| windows-2 | Rob Wingate | [Source](https://unsplash.com/photos/brown-wooden-window-6iTJzT2sRBs) |
| windows-3 | Pawel Czerwinski | [Source](https://unsplash.com/photos/brown-wooden-open-window-T3XUccTgw7s) |
| windows-4 | Jonathan Phelps | [Source](https://unsplash.com/photos/historic-stone-wall-with-leaded-windows-and-green-vine-E7LlPs-AocY) |
| lighting-1 | Jez Timms | [Source](https://unsplash.com/photos/turned-on-desk-lamp-beside-pile-of-books-8muUTAmcWU4) |
| lighting-2 | Annie Spratt | [Source](https://unsplash.com/photos/silver-and-white-desk-lamp-CpF8oOfwuoY) |
| lighting-3 | Jelezniac Bianca | [Source](https://unsplash.com/photos/brown-table-lamp-turned-on-near-white-wall-2NZSL0OV4Ys) |
| lighting-4 | Taylor Friehl | [Source](https://unsplash.com/photos/green-oil-lamp-on-a-shelf-with-cameras-qO7Yp32GOe0) |
| garden-1 | T | [Source](https://unsplash.com/photos/stone-urn-with-fern-pattern-in-lush-garden-qWRo-T5Gy5k) |
| garden-2 | Vikram Singh | [Source](https://unsplash.com/photos/stone-urn-on-brick-path-in-garden-lXEh5z_pumU) |
| garden-3 | Filipp Romanovski | [Source](https://unsplash.com/photos/stone-garden-urn-with-pink-flowers-3LblUqErlKk) |
| garden-4 | Barney Goodman | [Source](https://unsplash.com/photos/stone-garden-parapet-with-decorative-urn-thjBqWihs-U) |
| furniture-1 | Kelly Miller | [Source](https://unsplash.com/photos/brown-wooden-chair-on-grass-covered-plain-BL6XQLZeXpg) |
| furniture-2 | insung yoon | [Source](https://unsplash.com/photos/a-wooden-chair-sitting-on-top-of-a-wooden-floor-RCWIK0fsETc) |
| furniture-3 | OWN FILTERS | [Source](https://unsplash.com/photos/white-and-brown-floral-armchair-IjTqniVFP1Y) |
| furniture-4 | Elena Kloppenburg | [Source](https://unsplash.com/photos/brown-wooden-chair-on-white-wall-3jNOb-CxDAo) |
| other-1 | Tolu Akinyemi 🇳🇬 | [Source](https://unsplash.com/photos/a-bunch-of-copper-cups-sitting-on-top-of-a-table-Wkqz14PlAMQ) |
| other-2 | Georg Eiermann | [Source](https://unsplash.com/photos/brass-and-silver-round-frame-7eLOfLfcngo) |
| other-3 | Gio L | [Source](https://unsplash.com/photos/antique-brass-lion-head-door-knocker-on-black-prhld6U2OvA) |
| other-4 | Alan Jiang | [Source](https://unsplash.com/photos/three-vintage-toggle-light-switches-on-a-wall-xMaXGXFl-SA) |
