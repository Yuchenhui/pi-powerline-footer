# Maintained Powerline fork

This fork of `nicobailon/pi-powerline-footer` starts from upstream `v0.19.1`,
commit `859dee671b633fb533b07ceba3e6c1ab1c43360a`, on the local `custom` branch.
The upstream README, package manifest, license information, history, and existing
tests are retained.

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

The intended Pi installation source is
`git:github.com/Yuchenhui/pi-powerline-footer@custom`. The parent performs the
actual installation; this migration does not deploy or change live Pi settings.
Updates deliberately merge upstream into `custom` and review the resulting
changes. Future footer code changes belong in this repository, not in
`npm/node_modules` or the old `pc-tweaks` whole-file overlays.

External loop-watch, You-should-know, smart-footer, and their shared canonical
privacy helper remain in `pc-tweaks` and were not imported here. The root
`jev-privacy.ts` above is the existing footer-local snapshot, not a transfer of
ownership of that external canonical helper.

## Verification boundary

Migration verification is limited to Git diff/whitespace inspection, byte hashes
of the four copied files, and static relative import paths. No regressions,
build, runtime loading, deployment, or cross-platform behavior were verified.
The two existing overlay tests (`auto-follow-up.test.ts` and
`auto-follow-up.diagnostics.test.ts`) were inspected but not migrated: they use
Vitest, while the upstream suite uses `node:test` and the retained manifest does
not declare Vitest. Runner integration is deferred rather than adding a
framework or changing tested behavior during migration.
