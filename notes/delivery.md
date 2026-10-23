# Deliverable base and domain handover

Owner and maintainer: **itslizzyy**. Prepared 23 October 2026.

## Delivery scope

The existing public wording and overall design are preserved. This pass improves code separation, validation, admin reliability, responsive controls, keyboard access, image handling, dependency security, and technical SEO. It leaves future design/copy decisions to the business.

- Server-only database code separated from shared browser types/helpers; duplicate validation removed.
- Product lookups query only the requested identifier and deduplicate metadata/page reads. Missing products cannot return demo stock. Catalogue outages display a recoverable error state.
- Admin saves recover from network errors, retain drafts, prevent concurrent actions, and show focused status/error feedback. Session refresh does not overwrite form edits. Inventory search, section links, edit focus, and wrapping photo controls improve phone use.
- Phone photo preparation caps dimensions at 2000 px and uses WebP when supported. Server checks file type, actual image metadata, dimensions and size. Image optimization is limited to this project's product bucket.
- Navigation/buttons use valid interactive markup. Mobile menus support Escape, state announcements, and visible focus. The native photo dialog traps focus, closes on Escape, restores focus, and supports arrow keys. Reduced-motion preferences are respected. Low-contrast text corrected within the existing palette.
- Next.js 16.4.2 / React 19.3.1 / Supabase JS 2.118.0, lockfile updated. Removed unused animation and Vercel telemetry dependencies, old static exports, and an unused scratch script.
- Canonical www URLs, unique absolute titles, social metadata, safe LocalBusiness/Product JSON-LD, live sitemap, noindex staging/admin, and legacy category redirects. Product offers reflect price/status; POA items do not invent a numeric offer. No claims about reviews/ratings were added.

## Domain cutover — not yet performed

Target primary domain: **https://www.willesdenreclamation.co.uk**. The existing site remains live while this base is reviewed.

Read-only DNS check on 23 October 2026:

- Nameservers: `ns11.domaincontrol.com`, `ns12.domaincontrol.com`.
- `www` currently points to the apex; apex address observed: `92.205.144.8`.
- MX: `willesdenreclamation-co-uk.mail.protection.outlook.com` (Microsoft 365).

At the agreed launch:

1. Back up/export the old WordPress site, current DNS zone, and new Supabase inventory/photos. Confirm business details, stock, and images with the owner. Current staging still contains sample/test stock.
2. Resolve the [existing URL inventory](existing-urls.csv). The old sitemap contains **64 product URLs**, plus pages/categories. Keep matching URLs or add individual permanent redirects to their true replacements. Do not redirect every old product to the homepage or advertise unverified old stock as available. `/about`, `/vintage`, and old cart/account/checkout pages need an explicit retain/replace/retire decision.
3. Add `www.willesdenreclamation.co.uk` and `willesdenreclamation.co.uk` to this Netlify project; select **www** as primary. Use the DNS targets Netlify displays for this exact site. With external DNS, www normally uses a CNAME to the Netlify site; follow the current dashboard instructions for the apex. Keep the registrar and nameservers unless there is a separate reason to change them.
4. Preserve all mail-related MX/TXT/CNAME records, including SPF/DKIM/DMARC/autodiscover, and other unrelated subdomains. Change only the website records required by Netlify. Save the original records for rollback.
5. Confirm both hostnames resolve, Netlify issues a valid TLS certificate, and apex redirects to HTTPS www. Check for conflicting AAAA records and certificate-authority restrictions if TLS fails.
6. Set production `NEXT_PUBLIC_SITE_URL=https://www.willesdenreclamation.co.uk`. Set Supabase Auth site URL to that origin and allow the exact `https://www.willesdenreclamation.co.uk/admin` redirect. Retain only intentional staging/local redirects. Deploy-preview enquiry URLs may stay on staging.
7. After content and public launch approval, set `SITE_INDEXABLE=true` **in production only**, and redeploy. Netlify review URLs were made public for owner-approved sharing on 23 October; indexing remains disabled. Preview builds remain noindex even if the variable is inherited. Do not enable indexing while the sample stock is present.
8. Recheck canonical/OG/structured-data URLs, robots (allow public, disallow admin/API), sitemap, legacy redirects, admin login and CRUD, uploaded photos, WhatsApp links, phone/email links, and map. Check apex/www/HTTP redirect behaviour and verify the Netlify subdomain is not an independently indexable duplicate.
9. Verify the domain in Google Search Console, submit `https://www.willesdenreclamation.co.uk/sitemap.xml`, and review indexing/404s. Retain old redirects long term. Rankings and real-user Core Web Vitals require post-launch observation; technical checks cannot guarantee rankings.

Rollback: restore the saved website DNS records and keep the previous hosting active through the transition. DNS caches can delay rollback; avoid simultaneous changes to email or nameservers.

## Operational handover

- Account MFA still requires enrollment with the owner's authenticator; store recovery codes privately.
- Agree an automatic off-device database/photo backup schedule and test recovery. The existing local baseline is useful but is not that policy.
- Review Free-plan usage and inactivity pausing. Do not promise uninterrupted free hosting; choose upgrades only if the business needs them.
- Admin password is held in the Keychain service documented in [hosting.md](hosting.md). Configure/test SMTP before depending on password-reset emails.
- The working server credential is a legacy service-role key because Storage rejected the modern secret during setup. Retest modern-secret compatibility before provider retirement.
- `npm audit --omit=dev` is clear at delivery. Full audit reports five high entries from one development-only `braces → micromatch → fast-glob → Next ESLint` chain; npm proposes a breaking downgrade of the Next lint configuration, not a compatible fix. This code is not shipped to visitors. Track the upstream fix; do not apply `audit fix --force` blindly.
- Public settings retain defaults during a settings outage. Confirm those defaults before launch. Runtime catalogue errors never substitute demo items.

GitHub rejected the initial push of an active Actions workflow because the connected OAuth credential lacks `workflow` scope. The same workflow is saved as `notes/ci-checks.yml` for activation by an authorized owner. Local checks are implemented and run; hosted GitHub Actions is not claimed as enabled.

## Verification evidence

Review: [PR #1](https://github.com/itslizzyy/willesden-rec/pull/1) · [Netlify preview](https://deploy-preview-1--adorable-sunshine-a6e527.netlify.app).

Verified application commit: `ac177d5800bc948cf6be03290665ad84e8d088d9`; Netlify deploy `6adb81341ec098d76778399e`. Subsequent documentation-only commits may use `[skip netlify]`; the application is identical.

- ESLint, 7 regression tests, TypeScript, production build: pass.
- 56 local HTTP/integration checks: pass, including owner writes, anonymous denial, invalid/oversized images, decimal prices, duplicate slugs, sold state, deletion, settings, canonical tags and noindex.
- 45 layout checks across nine page types at 320/375/768/1024/1440 CSS pixels: no overflow, missing images, duplicate main headings, or nested link/buttons.
- 18 automated WCAG 2 A/AA and 2.1 AA scans at phone/desktop widths: no reported violations after contrast fixes. Hosted admin scan also clean.
- Actual browser login, product create/edit/delete, failed-save recovery, draft retention, edit focus, photo upload, mobile menu Escape, and gallery keyboard/modal/focus restoration: pass. Test photo reduced from 3000×2200 to 2000×1467 WebP before upload.
- 22 hosted checks: pass, including owner inventory, public access restriction, image upload/download, product mutation, all main routes, structured sold state and preview robots.
- Simulated database outage: listing/stock responses fail with an error state and no demo products. Deleted listing returns 404. Privileged server key absent from browser build assets.
- Temporary verification products/photos removed. Original ten products and five photos retained. The live domain still returns its existing site, and anonymous staging requests still return 401.
- Netlify deploy, header and redirect checks pass. Pages-changed check is skipped by Netlify. GitHub Actions is not enabled (permission limitation above).

Testing used the T3 Chromium browser with responsive CSS viewports; physical iOS/Android devices and Safari/Firefox were not independently tested. Desktop private-preview stock navigation measured LCP 2.35 s and CLS 0 in one unthrottled lab run; this includes Netlify's private-preview overhead and is not a field Core Web Vitals certification. Confirm real devices and post-launch performance after the domain cutover.

Raw local evidence: ignored `test-results/integration.json`, `browser.json`, `hosted.json`, and `audit-production.json`.

References: [Netlify external DNS](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/), [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [existing site's sitemap](https://www.willesdenreclamation.co.uk/wp-sitemap.xml).


## Preview annotation refinements

The review changes are included in PR #1:

- Compact, independently scrolling inventory list with an expanded view, category multi-select, and filtered product jump control.
- Restored mobile-menu opening/closing animation with reduced-motion support; mobile menu spacing reduced from 328 px to approximately 229 px.
- Footer Explore links arranged in two columns: Current Stock / Fireplaces / Doors, and Windows / Other / Sell to Us. Footer spacing condensed on phones.
- Smaller mobile catalogue category controls and a smaller two-column What We Buy list.
- WhatsApp CTA uses flexible alignment and a growing minimum height so its label stays inside the button at narrow widths.
- Original darker gold and semibold styling restored for Explore / Visit Us; product price restored to gold. Logo hover/focus turns gold.
- Footer phone and email are actionable `tel:` / `mailto:` links.

Validation: lint, seven regression tests, and production build pass. Browser checks confirm combined-category filtering, product jump and focus, independent list scrolling, expand/collapse, two-column layouts, CTA containment, and contact hrefs. Twenty-four responsive checks across the six affected page types at 320/375/768/1440 px pass. No product or business data was changed for these refinements.


Final review adjustments: Explore is centered above both footer link columns; stock sorting and Apply share one row on phones; Jump to product now uses the same native disclosure triangle as Categories, with room for its label and wrapped product names. The owner authorized merging PR #1 after verification.

The approved merged baseline is version **1.0.0**, identified by the annotated Git tag `v1` on the PR merge commit. Future design work starts from this baseline.

The previous website owner login was restored at the owner's request, retaining the existing Auth user ID. The supplied password passed direct Supabase login verification, the private `ADMIN_EMAIL` setting was updated for Netlify production/deploy-preview and local use, and Keychain was updated. No password is stored in Git or these notes.
