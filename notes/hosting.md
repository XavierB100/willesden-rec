# Hosting and maintenance

Owner and maintainer: **itslizzyy**. Last updated: **23 October 2026**.

## Services

- GitHub: https://github.com/itslizzyy/willesden-rec — `main` is the deployment branch.
- Netlify team: `itslizzyy`.
- Netlify project: `adorable-sunshine-a6e527` (`fd0cbb78-dfd3-49f2-a2fa-58963f547dc7`).
- Staging site: https://adorable-sunshine-a6e527.netlify.app — private access while launch checks are pending.
- Supabase organization: `Willesden Reclamation` (`wwofwjlszfvsgirzgtjf`), Free plan.
- Supabase project: `willesden-rec` (`ltkxelclbiverctddsmf`), London / `eu-west-2`.
- Supabase dashboard: https://supabase.com/dashboard/project/ltkxelclbiverctddsmf.

## Configuration completed

- Added an explicit Next.js build command, `.next` publish directory, and Node.js 22 in `netlify.toml`. The first import published source/static files without a server build and returned a 404 at the homepage.
- Set the five application environment variables for Netlify production and deploy-preview contexts; local values are in ignored `.env.local`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` contains a modern publishable key; its existing variable name is retained for compatibility.
- The server uses the project's legacy service-role key because the new secret key returned `Invalid Compact JWS` from Storage during verification. Keep this server-side; retest modern secret-key support before the provider retires legacy keys. No keys belong in this document or Git.
- Copied 10 existing inventory rows, one settings row, and five photos into the dedicated project. Preserved product identifiers, prices, categories, statuses, and timestamps. Verified copied photos with SHA-256 comparisons.
- Enabled RLS and explicit public SELECT-only grants on catalogue/settings tables. Product changes and uploads require the owner account through the server API.
- Disabled public signups and anonymous Auth users. Configured the Netlify staging address as the Auth site URL, with exact staging/local admin redirects.
- Created the website owner login. Its email is the same as the itslizzyy service-account email, configured privately in `ADMIN_EMAIL`.
- Stored the generated website-admin password in macOS login Keychain as **Willesden Reclamation website admin**. Stored the database password as **Willesden Reclamation Supabase database**. Use Passwords/Keychain Access to view them after local authentication; do not paste them into Git or chat.
- Limited image uploads to JPEG, PNG, WebP, AVIF, and GIF, maximum 4 MB per image, in both the application and storage bucket.
- Scoped Vercel-only telemetry to Vercel deployments to avoid missing script requests on Netlify.
- Reconciled database migration history with the SQL files in this repository.

## Verification

Local lint/build passed during setup. Final hosted acceptance results are recorded below after deployment.

## Before public launch

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
- Existing server code can fall back to example catalogue data when the database is unavailable. Review that failure behavior before public launch so an outage cannot advertise example stock.
- Reset an admin password through Supabase Auth or the server-side Admin API; custom SMTP must be configured and tested before relying on password-reset email.

References: [Netlify Next.js](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/), [Supabase backups](https://supabase.com/docs/guides/platform/backups), [Supabase pricing](https://supabase.com/pricing).
