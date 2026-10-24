# Refactor the heritage storefront and owner workspace

The owner workflow previously combined inventory, editing and business settings in one long page, while public pages repeated layouts and category browsing. This proposal creates a focused owner workspace and a consistent, responsive storefront while keeping the established serif typography and cream, green and brass palette.

The storefront adds a catalogue-led homepage, shared category/search layouts, clearer visit and selling pages, clickable product photos and improved missing-page handling. The owner workspace adds inventory/status/category filters, pagination, a live listing preview, photo upload progress and cover ordering, structured opening hours, sticky save controls and draft retention across sections and failed saves.

Server authorization, validation, database schema, enquiry destinations and legacy redirects are retained. No domain or production changes are included. This branch carries forward the photo/search improvements from PR #2 as an independent proposal against `main`; that earlier PR remains unchanged.

Validation: ESLint, formatting, TypeScript/production build, 18 regression tests, 8 Playwright tests and 36 final read-only HTTP checks pass. The real local API mutation verifier passed 56 checks with disposable records and cleanup. Browser coverage includes 320–1440 px layouts, automated WCAG A/AA checks, save failures, CRUD state, photos, hours, search, menu and gallery keyboard behavior. The three public browser tests also pass with the full sample catalogue.

See [the refactor handover](notes/refactor.md) for architecture, owner guidance, design references and verification scope. Hosted preview verification will follow once this PR can be published. Review samples remain fictional and do not enter the live inventory.
