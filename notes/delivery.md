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
7. After content and public launch approval, set `SITE_INDEXABLE=true` **in production only**, redeploy, and remove Netlify private access. Preview builds remain noindex even if the variable is inherited. Do not enable indexing while the sample stock is present.
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

Final checks and preview link are recorded below when verification completes. Raw local reports are in ignored `test-results/`.

References: [Netlify external DNS](https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/), [Next.js metadata](https://nextjs.org/docs/app/api-reference/functions/generate-metadata), [Google canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [existing site's sitemap](https://www.willesdenreclamation.co.uk/wp-sitemap.xml).
