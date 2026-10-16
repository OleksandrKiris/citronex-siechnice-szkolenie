# Reader instruction selection — 2026-10-16

Base main: `b1ba92c1f5c33bea9069fcf8fa4e821b781981da`; no open PRs;
both latest Pages workflows successful.

## Confirmed in the public desktop browser

On `reader.html?lang=ua`, choosing «Візки» displayed the carts instructions,
but left no topic in the URL and moved keyboard focus to BODY. Reloading then
returned to «Перед роботою», losing the chosen material.

## Fix

After a section selection, replace the current history entry with its real
`topic` ID, preserving language, other query parameters, hash and history state.
Restore focus to the newly rendered selected button without scrolling.
Existing validation handles unknown topics. If history access is denied, the
material and focus remain usable, and the existing language-change action
still carries the in-memory selection. Persistence across reload cannot be
guaranteed when the browser disallows URL updates.

No instructional text, translations, step order, source documents, photographs,
audio, contacts or external links changed. No network or operational actions
are introduced. Cache/script references advance to `20261016-reader-context1`;
unchanged media and CSS retain their versions.

## Verification

Added 12 scenarios to the existing navigation suite. The nine language cases
reproduced the original focus defect before the fix. Coverage exercises the
real renderer/handlers for all six current topics, reload, language changes,
query/hash/history state preservation, invalid topics and blocked history/storage.
All **162 Node tests** pass. JavaScript syntax, button/map audits and whitespace
checks pass. There is no package.json/npm test. Full project/media audits run
in the existing CI against the complete remote tree; the local snapshot omits
most media to avoid downloading them again. All unchanged remote blobs are
retained through the base tree.

Desktop browser QA is not a mobile-device or screen-reader test. Publication
and post-release browser/HTTP results are recorded in the PR.

## Rollback

Revert the PR through a reviewed commit and advance the cache version again.
No external data rollback is required.
