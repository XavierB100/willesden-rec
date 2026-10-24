# Hosting and maintenance

GitHub maintainer: **XavierB100 (xavier blake)**. Hosting remains in the existing **itslizzyy** Netlify team. Last updated: **24 October 2026**.

## Services

- GitHub: https://github.com/XavierB100/willesden-rec — `main` is the deployment branch. The `v1` tag preserves the approved baseline; see [current release notes](releases.md). The old itslizzyy repository is inaccessible; see [account migration](account-migration.md).
- Netlify team: `itslizzyy`.
- Netlify project: `adorable-sunshine-a6e527` (`fd0cbb78-dfd3-49f2-a2fa-58963f547dc7`).
- Staging site: https://adorable-sunshine-a6e527.netlify.app — publicly shareable for review; search indexing remains disabled.
- Supabase organization: `Willesden Reclamation` (`wwofwjlszfvsgirzgtjf`), Free plan.
- Supabase project: `willesden-rec` (`ltkxelclbiverctddsmf`), London / `eu-west-2`.
- Supabase dashboard: https://supabase.com/dashboard/project/ltkxelclbiverctddsmf.

## Configuration completed

- Added an explicit Next.js build command, `.next` publish directory, Node.js 22, and `@netlify/plugin-nextjs` in `netlify.toml`. The first import published source/static files without a server build and returned a 404 at the homepage. Explicit adapter activation was also needed to deploy the server function.
- Set the five application environment variables for Netlify production and deploy-preview contexts; local values are in ignored `.env.local`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` contains a modern publishable key; its existing variable name is retained for compatibility.
- The server uses the project's legacy service-role key because the new secret key returned `Invalid Compact JWS` from Storage during verification. Keep this server-side; retest modern secret-key support before the provider retires legacy keys. No keys belong in this document or Git.
- Copied 10 existing inventory rows, one settings row, and five photos into the dedicated project. Preserved product identifiers, prices, categories, statuses, and timestamps. Verified copied photos with SHA-256 comparisons.
- Enabled RLS and explicit public SELECT-only grants on catalogue/settings tables. Product changes and uploads require the owner account through the server API.
- Disabled public signups and anonymous Auth users. Configured the Netlify staging address as the Auth site URL, with exact staging/local admin redirects.
- Restored the previous website owner login in the dedicated Supabase project, using the owner-supplied email and password. The private `ADMIN_EMAIL` configuration matches this login in local, production, and deploy-preview environments. Service ownership remains itslizzyy.
- Stored the website-admin password in macOS login Keychain as **Willesden Reclamation website admin**. Stored the database password as **Willesden Reclamation Supabase database**. Use Passwords/Keychain Access to view them after local authentication; do not paste them into Git or chat.
- Limited image uploads to JPEG, PNG, WebP, AVIF, and GIF, maximum 4 MB per image, in both the application and storage bucket.
- Scoped Vercel-only telemetry to Vercel deployments to avoid missing script requests on Netlify.
- Reconciled database migration history with the SQL files in this repository.

## Verification

- `npm run lint` and `npm run build` passed.
- 35 local production checks passed, including database read/write permissions, image upload/rejection, stock create/edit/sold/delete, owner/non-owner access, all main routes, and absence of the privileged key in browser assets.
- 31 hosted checks passed against the private Netlify site on 23 October 2026 at approximately 14:02 BST. These covered the actual browser login, stock CRUD with decimal prices, photos, settings save, enquiry links, all public routes, anonymous 401s, and non-owner 403s.
- Accepted deployment: `6adb5a10f18c0853f0a55b4b`, application commit `05de6d23debe0b432ddde1893ab05a22bcd973f4`. Netlify deployed one Next.js server function and its redirects.
- Checked the stock catalogue at 1440 px and 375 px and the admin dashboard at 375 px: no horizontal overflow; catalogue images loaded. Vercel-only scripts were absent.
- Removed all setup-test products, photos, and temporary accounts. Final counts: 10 inventory rows, five photos, and one owner Auth user.
- Security/performance advisors: no performance findings; the only remaining security warning is leaked-password protection, which requires a paid plan. Public execution of the internal automatic-RLS function was revoked.
- Saved an independent local baseline backup containing inventory, settings, and original photo files under `~/.local/share/willesden-rec/backups/2026-10-23/`. Its manifest contains photo hashes. This is a local backup, not yet an automated/off-device backup policy.
- Documentation-only follow-up commits use `[skip netlify]` to avoid spending build credits; the accepted application deployment remains as listed above.

For the subsequent codebase polish and domain handover, see [delivery.md](delivery.md).

## Review sharing

At the owner’s request on 23 October 2026, Netlify project visibility was customized to **Public** for production and Deploy Previews. Verified the main site without a Netlify login: all 36 read-only site checks passed, including anonymous admin API rejection and noindex. This exposes the review URLs for sharing; it does not approve a domain cutover, enable search indexing, or confirm the example/test catalogue as real inventory. PR changes remain on their own deploy preview until merged.

## Before business launch

- Review all stock with the business. Existing inventory contains eight example catalogue entries and two products explicitly named as tests; migrated data is not confirmed real business stock.
- Confirm contact details, opening hours, map, prices, dimensions, and images.
- Verify the hosted owner login, stock create/edit/sold/delete flow, uploads, enquiries, and phone/desktop layouts.
- Approve the public launch and domain cutover. The custom domain/DNS has not been changed during staging setup.
- Update `NEXT_PUBLIC_SITE_URL` and Supabase Auth URLs to the final production address, then deploy again.
- Enable account MFA and save recovery codes privately. MFA enrollment requires the account owner's authenticator.

## Maintenance

- Export database data regularly and keep an independent copy of product photos. A Git backup contains the application, not the live inventory or uploaded images.
- Supabase Free may pause after low activity and includes 500 MB database space and 1 GB file storage. Netlify Free has a monthly credit allowance and pauses service when exhausted. Review dashboard usage and agree upgrades before enabling paid services.
- Supabase's leaked-password protection is a paid-plan feature. The owner password is randomly generated, public signup is disabled, and minimum password length is 12. This is not equivalent to enabling the paid feature.
- Review security/performance advisors after database changes. Recheck that public database roles cannot insert, update, delete, or upload.
- Test deployments before making them public, and use a separate staging database before experimenting against real inventory.
- The deliverable-base branch removes the example catalogue fallback; database failures display an error, and missing/deleted listings remain absent.
- Reset an admin password through Supabase Auth or the server-side Admin API; custom SMTP must be configured and tested before relying on password-reset email.

References: [Netlify Next.js](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [Supabase backups](https://supabase.com/docs/guides/platform/backups), [Supabase pricing](https://supabase.com/pricing).


## Managed demo release

Release 1.1.0 replaces the preview-only catalogue with ordinary admin-editable demo rows in this same project. Apply the managed-demo migration before code deployment and import the approved 14 records afterwards. See [demo-stock.md](demo-stock.md). Production/preview now use the same stock reader; there is no sample fixture flag.
