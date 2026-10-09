# Maintained Powerline fork

This fork of `nicobailon/pi-powerline-footer` starts from upstream `v0.19.1`,
commit `859dee671b633fb533b07ceba3e6c1ab1c43360a`. The initial migration used
the local `custom` branch. The upstream README, package name, author attribution,
license information, history, dependencies, and existing tests are retained.

## Migrated customizations

The following files were copied byte-for-byte from
`pc-tweaks/pi/overlays/pi-powerline-footer/` into the package root:

- `index.ts`: third-and-later overflow rows using existing theme/segment patterns,
  plus integration of the maintained automatic follow-up router.
- `powerline-config.ts`: the deployed configuration implementation (already
  matches the upstream base after Git line-ending normalization).
- `auto-follow-up.ts`: conservative JEV routing, privacy gates, cancellation and
  deadline handling, and local metadata-only routing diagnostics.
- `jev-privacy.ts`: the footer's privacy/deadline helper snapshot.

This is a source migration, not a new notification fix or UI redesign. Legacy
`footer-speed` remains intentionally cleared by external smart-footer; this fork
migration does not restore it.

## Ownership and updates

The historical migration installed
`git:github.com/Yuchenhui/pi-powerline-footer@custom`; that branch-based source
is no longer the maintained release installation advice. Install the reviewed
release from `git:github.com/Yuchenhui/pi-powerline-footer@<full-release-commit-SHA>`
(replace the placeholder with the exact published commit, not a branch or tag).
The parent owns publication, Windows installation, and live Pi settings changes.
Upstream integration is manual and reviewed, not autonomous. Future footer code
changes belong in this repository, not in `npm/node_modules` or the old
`pc-tweaks` whole-file overlays.

### Own release policy

Long-term fork maintenance is on `main`; releases retain immutable tags and
exact-SHA installation pins rather than a floating `main` source.

The first maintained release is `pi-powerline-footer@0.19.1-yuchenhui.1`, based
exactly on pre-release fork commit `1623129abcea7d1ea7c260816395d6daf8b90a82`
and upstream `v0.19.1` (`859dee671b633fb533b07ceba3e6c1ab1c43360a`).
Versions follow `<upstream-version>-yuchenhui.N`: own corrections increment `N`;
a newly adopted upstream baseline starts again at `.1`. Each release uses an
annotated tag (first: `v0.19.1-yuchenhui.1`) and a GitHub Release with a reviewed
package artifact. There is no npm publishing, and the npm package name remains
`pi-powerline-footer`.

Installation is pinned to the exact reviewed release commit SHA. The initial
rollback source is
`git:github.com/Yuchenhui/pi-powerline-footer@1623129abcea7d1ea7c260816395d6daf8b90a82`.
Later releases record their previous reviewed SHA for rollback. Packing, isolated
offline loading, artifact review, tags, Releases, and installation are parent-owned;
this metadata step does not perform them.

External loop-watch, You-should-know, smart-footer, and their shared canonical
privacy helper remain in `pc-tweaks` and were not imported here. The root
`jev-privacy.ts` above is the existing footer-local snapshot, not a transfer of
ownership of that external canonical helper.

## Notification source repair

Notification classification now ignores terminal escape sequences without
changing displayed values or promoted-key suppression. Above-editor notification
rows use Pi's ANSI-aware wrapping instead of dropping long values, retaining
styles and explicit newlines with one-space indentation (omitted at width 1).
Nonpositive/sub-column and nonfinite widths render no rows. Graphemes wider than
the available content columns are clipped defensively; a two-column glyph cannot
be preserved in one content column. Wrapping follows Pi's word-wrap whitespace
semantics. No layout defaults, theme, routing, or migrated overflow logic changed.

Bounded cases were added to `tests/custom-items.test.ts` but were **not run**.
Verification of this repair is limited to static source/import review and
`git diff --check`; runtime/load and LSP checks remain with the parent, as do
publishing, reinstalling the pinned source, and live settings changes.

## Verification boundary

The `0.19.1-yuchenhui.1` metadata step changes only this document, manifest
version/repository/homepage/bugs metadata, and lockfile root/package versions.
Its verification is limited to static manifest/lockfile comparison, an
`npm pack --ignore-scripts --dry-run --json` content preview (not an artifact or
load test), package-content inspection for private/runtime configuration, and
`git diff --check`. No existing footer behavior is claimed tested. Existing
upstream tests, regressions, builds, model/native-client calls, and runtime
loading are not run by this metadata worker; isolated offline loading remains
with the parent.

Migration verification is limited to Git diff/whitespace inspection, byte hashes
of the four copied files, and static relative import paths. No regressions,
build, runtime loading, deployment, or cross-platform behavior were verified.
The two existing overlay tests (`auto-follow-up.test.ts` and
`auto-follow-up.diagnostics.test.ts`) were inspected but not migrated: they use
Vitest, while the upstream suite uses `node:test` and the retained manifest does
not declare Vitest. Runner integration is deferred rather than adding a
framework or changing tested behavior during migration.
