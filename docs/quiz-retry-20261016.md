# Retry incorrect questions — Siechnice

Owner: task 5. Issue: https://github.com/OleksandrKiris/citronex-siechnice-szkolenie/issues/16
Base: `31ce4ab72866659bea7b0adbdf6efa0cc8e5b31e` (PR15 already merged).
Status: implemented and unit-tested, **draft pending exact-version browser acceptance**.

## User scenario

Finish the existing 30-question test, read the existing explanations/source links,
and choose “Retry incorrect questions”. Correct answers remain; only incorrect
answers are cleared, and Next/Back visit those questions. The result is recalculated
using the unchanged answer keys. Another retry includes only remaining mistakes.
Perfect results offer no retry. “Start again” still clears the whole attempt.

The new control is localized in all nine supported UI languages. Georgian follows
the existing explicit English fallback. No learning instructions, answer keys,
source links, contacts, message links, photos or audio are changed.

## Local progress and offline limits

The existing anonymous local v1 attempt gains an optional `retryIndices` array.
Old valid saves retain their answers; invalid queue metadata is ignored without
rewriting the saved record on read. It is validated for ordered unique in-range
indices, membership of the current question, and correct answers outside the queue.
Seven-day expiry, question signature and site isolation are unchanged. Storage
denial leaves retry usable in memory, but reload persistence cannot be promised.
No candidate data, new backend, network requests or hidden submissions are added.

First use still needs a successful online load and the existing service worker's
cache. Thereafter the test logic is local; this change does not make external links,
contacts or result delivery available offline. Service workers do not work on
`file://`. A reviewer with a full checkout can serve it via an approved local HTTP
preview and open `/test.html?lang=en`. No server dependency is introduced.

## Versions and load

UI script references in all 15 production entries and SW cache:
`20261016-quiz-retry1`. Existing media URLs/cache reuse are unchanged; no additional
precache entries. JS: 373141 -> 375232 bytes (+2091; gzip delta +570 bytes).
No new runtime files, dependencies or requests. These are source measurements,
not a browser network trace.

## Checks performed

- All 90 retained text files matched the fresh GitHub main blob hashes before edits;
  remaining remote media are preserved using the complete base Git tree.
- No package.json exists, so no npm test command is defined.
- `node --test tools/primserv-navigation.test.mjs tools/instruction-update.test.mjs tools/quiz-progress.test.mjs`: **176 passed** (14 additional tests).
- All retained JS files pass `node --check`; full diff and `git diff --check` reviewed.
- Local button/link, map and information audits pass.
- Local project/presenter/language audits were attempted but cannot pass on this
  intentionally partial text checkout: binary images/audio are absent. No mass
  media download was performed. Full-repository CI must pass on the exact PR head.
- Regression cases: nine languages, answer preservation, previous/next within retry,
  focus, language change/reload, remaining mistakes, unanswered retry, perfect score,
  all-wrong attempt, denied storage, legacy saves, malformed queues and ka fallback.
  VM/network-denied tests are **not** a real browser-offline test.

## Browser blocker and remaining acceptance

On 16 October 2026 the allowed cloud browser opened the current public EN quiz;
that verifies only the existing deployed page, not this changed version.
Local Browser extension could not connect to the originating context. The supported
managed preview for the new local copy failed before serving:
`bwrap: Can't mount proc on /newroot/proc: Operation not permitted`.
`sites-preview status` then reported stopped. No alternative server, permission
change, sandbox bypass or deployment was used to evade the failure.

Before release, open **the exact tested PR head** in an approved working preview:
1. EN/UA test -> incorrect answers -> retry -> correct retained answers -> new result.
2. Keyboard operation/focus; 320px viewport and visible long labels; ka -> EN fallback.
3. Reload, language change, material link -> browser Back -> resume queue.
4. Complete first cache load, actually disable network and repeat/reload; inspect safe
   cache update and persisted answers. Test blocked/corrupted storage in a permitted
   browser test environment, without changing production users' storage.
Record version, URL, browser, viewport, evidence and limits. Do not mark ready or
merge until these checks and exact-head CI pass. Next pass should only recheck
preview availability if there is evidence of recovery, then finish this same PR.

## Rollback

Release owner only: a separate tested revert PR with another cache/UI version bump.
No reset/force-push, DB changes or deletion of saved attempts. Old code ignores the
optional retry queue but keeps compatible answers; no storage migration is required.
