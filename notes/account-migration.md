# GitHub account migration — 24 October 2026

This is the migration handover before design approval. The owner subsequently approved [release 1.1.0](releases.md); its final demo catalogue differs from the earlier preview described below.

## Repository recovery

The owner requested migration from the inaccessible/suspended itslizzyy GitHub account to **XavierB100 (xavier blake)**. The source repository returned 404 with the working XavierB100 account, and the saved itslizzyy CLI authentication was invalid. A GitHub repository transfer was unavailable, so recovery used the complete local Git history.

The destination is the existing public repository **https://github.com/XavierB100/willesden-rec**. Its previous `main` was preserved before restoring the approved baseline:

| Reference | Commit | Purpose |
| --- | --- | --- |
| `backup/xavier-pre-migration-2026-10-24` | `86339c302fc58cbede1970acfca9a6a4fad486e6` | Previous XavierB100 repository main, preserved on GitHub |
| `main`, annotated tag `v1` | `bdce119b9a92455d57a68e8183342d969a03b107` | Approved live application, unchanged |
| `codex/responsive-product-photos` before migration documentation | `6ffc7d0964c07d7846d98823faf3df7233f2427d` | Original image/search/layout review |
| `codex/heritage-site-refactor` | `509b65e47f7b72aca56fd4e6c2779f6d7378c78f` | Separate local design proposal, preserved as a branch only |

The old destination main was backed up remotely before the main ref was replaced using an exact expected-SHA lease. Existing commits and their authors were preserved. A verified complete-history Git bundle is stored privately at `~/.local/share/willesden-rec/recovery-2026-10-24/repository.bundle`, containing all local branches/tags and the old destination main. It contains application Git history, not live database/photo backups or credentials.

Local `origin` now points to XavierB100. The old remote remains named `suspended-origin` for reference. New commits use the XavierB100 identity. The local independent refactor checkout was retained.

## Review continuity

The original image review, itslizzyy PR #2, was recreated as **[XavierB100 PR #1](https://github.com/XavierB100/willesden-rec/pull/1)** against `main`. It remains open and unmerged. The existing local feature commits, sample assets and [complete change history](change-history.md) are retained. Migration documentation adds no application behaviour changes.

Original GitHub PR numbers, reviews, comments, check history and annotations are not Git objects and were not automatically migrated. Historical references remain explicitly identified in the delivery record; the recovered PR description supplies the current links and verification. The original T3 discussion remains in its existing thread.

## Hosting continuity

- Keep the existing Netlify project `adorable-sunshine-a6e527`, site ID `fd0cbb78-dfd3-49f2-a2fa-58963f547dc7`, in its existing team/account.
- Reauthorize GitHub as XavierB100 and link that same Netlify project to `XavierB100/willesden-rec`, production branch `main`.
- Main site: https://adorable-sunshine-a6e527.netlify.app/ — approved v1.
- Restored PR preview: https://deploy-preview-1--adorable-sunshine-a6e527.netlify.app/ — image review, unmerged. Its number follows the new repository PR number. The previous `deploy-preview-2` URL is historical and does not track new pushes in this repository.
- Keep existing environment variables, Supabase project, database, Auth users and uploaded images. The pre-migration live stock page used `ltkxelclbiverctddsmf.supabase.co`, matching the current local public project URL. No Supabase project transfer, schema/data mutation, credential rotation or website-owner login change is part of this migration.
- Keep search indexing disabled and the current sharing settings. The GitHub migration does not approve the pending design, a custom-domain/DNS change or business launch.
- Preview-only sample stock remains behind the existing deploy-preview gate and is never written into Supabase or published on production.

## Verification

Repository recovery verified the exact remote v1/main and review commit references and checked the backup bundle. Final Netlify deployment IDs, resolved commits, hosted route checks and preview acceptance are recorded in the recovered PR description after reconnection.

This migration retains the existing services; their account recovery access remains separate from GitHub authentication.
