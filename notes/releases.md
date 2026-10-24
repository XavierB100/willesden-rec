# Releases

## 1.1.0 - owner-approved stock/photo release (24 October 2026)

The owner approved merging the reviewed design after reviewing it with his partner. The final change keeps the 2/3/4/5-column grids, six-row paging, two desktop rows of homepage arrivals, aligned 3:4 stock frames, complete portrait/landscape viewing, compact gold-bordered cards and controls, shared photo loading/retry and immediate stock search with separately applied sorting.

### Final demo and cleanup changes

- Restore What We Buy to one vertical list at the owner's request after the design review; the compact card grid still applies only to stock browsing.
- Replace the separate 252-listing preview catalogue with **14 admin-editable demo records** in the existing database, two per category. Keep the existing ten catalogue records unchanged.
- Retain half the source photos: 14 source sets / 28 portrait-and-landscape assets, with mostly portrait covers and multiple-image examples. Remove the other 14 sets / 28 unused assets.
- Add an explicit `is_demo` database field and **Demo listing** owner checkbox. Demo status persists through normal edits and controls the public label, enquiry availability, structured data and sitemap inclusion.
- Remove the obsolete preview-mode module, generated fixtures, duplicate storefront adapter, fixture flags and their old tests. All public/owner routes use the same data model and server reader.
- Rename remaining photo assets/metadata consistently for demos. Keep source records, the safe manual import and current editing/removal guidance in [demo-stock.md](demo-stock.md).
- Activate the former CI template as `.github/workflows/checks.yml`, with current pinned checkout/Node actions, lint/tests/build and the production-dependency audit. Remove the obsolete inactive template.
- Retire the obsolete GitHub Pages configuration pointing at the removed `/docs` export. Netlify remains the website host; GitHub Pages had no custom domain and its legacy build was failing.
- Update package and lockfile to 1.1.0. Keep `v1` as the 1.0.0 baseline; preserve the recovery backups and independent design proposal rather than merging unrelated work.

### Release verification

ESLint, 18 regression tests and the production build pass. Tests cover search/sort, pagination/resizing, validation and the reduced demo set/boolean. Final preview/production deployment IDs, owner edit round trips, catalogue preservation and hosted acceptance are recorded in [PR #1](https://github.com/XavierB100/willesden-rec/pull/1).

Apply the backwards-compatible managed-demo migration before deploying the code. Import demos only after the new application is live, so the old application never displays them without their demo safeguards. Existing content is backed up before release. Keep indexing off and the business domain unchanged; real-stock replacement and the domain launch remain a separate decision.

## 1.0.0 - approved baseline

The `v1` tag at `bdce119` preserves the approved baseline. [Change history](change-history.md) and [delivery notes](delivery.md) retain the original UX, owner-management, hosting and domain preparation evidence.
