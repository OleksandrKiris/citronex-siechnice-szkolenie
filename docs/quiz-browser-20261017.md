# PR17 / issue16 — exact-head quiz retry acceptance

Continues the existing retry-incorrect-questions feature, no second product.
Runtime and all materials/audio remain unchanged, cache 20261016-quiz-retry1.
This CI-only addition has zero runtime bytes, dependencies or new user requests.

The existing PR workflow runs its full audits and 176 regressions, then pinned
Playwright 1.56.1 Chromium on the exact PR head with tested-base ancestry guard.
The runner's loopback server serves only existing text/JSON/CSS/JS, official
logo/icon resources. It does not serve media or fabricate replacements. Existing
worker media preloads receive 404. Therefore acceptance covers quiz/text shell,
not full media cache, all instructions or audio. No live deployment is performed.

Browser matrix: 1280x900 and 320x900, actual 30-question attempts with two errors,
keyboard Space/Enter and focus, preservation of 28 correct answers, Back/Next,
nine languages and ka-to-English explanation, reload during retry, 30/30 after
correction, source learning link and browser Back, one remaining error,
corrupt/denied localStorage, actual old-worker upgrade preserving legacy progress
and unrelated storage/cache. Fixtures are anonymous, no personal data is entered.
Send-result, contacts, calls, messaging, bookings and outside pages are never used.

Offline uses both Chromium offline mode and a stopped HTTP listener: service
worker network access cannot make an offline test falsely pass. The server is
closed after the suite. First successful loading and caching remain required;
never-opened devices and file:// service workers are not promised. External
contacts/sending and uncached media need a connection. 320px is not a phone test.

Artifacts: acceptance.json with exact head/base/browser/file SHA-256s and byte
sizes, screenshots, traces, request/cache counts. Inspect these before declaring
ready. A script/green unit suite alone is not browser acceptance. Exact head and
final CI/visual result are recorded in PR17; until then it remains draft.

Manual local launch: from a checkout, `python3 -m http.server 8080 --bind 127.0.0.1`,
then `http://127.0.0.1:8080/test.html?lang=en`; stop with Ctrl+C. This is not a public
preview. Last production base: 31ce4ab72866659bea7b0adbdf6efa0cc8e5b31e.
Only owner10 releases. Rollback: separate tested revert PR with fresh cache
version and fresh main/head guards, never delete saved progress or media.

## Cache-upgrade acceptance correction — 17 October 2026

Run 39015458906 passed both viewport scenarios, nine languages, keyboard,
reload/Back, offline replay and corrupt/denied storage, then timed out waiting
for the document's script URL to change before an explicit reload. The old
document's existing controllerchange handler suppresses repeat reloads for its
assetVersion in this session; it does not promise another automatic reload.

The corrected scenario waits for a different activated controller that matches
registration.active, verifies the exact new cached JS SHA-256, then explicitly
reloads as a returning user would. The old answers, unrelated key/cache and UA
language must still survive both that reload and the next offline reload with
the HTTP listener stopped. Upgrade screenshot/trace are now retained on failure.
No runtime, cache policy, translations, instructions or media were modified.
This is a test ordering correction, not a claim that an automatic update prompt
or immediate replacement of an already open document has been implemented.

The complete suite will run again on the new exact head. Read its final artifact
and inspect screenshots before changing this PR from draft. The previous bwrap
preview issue is historical; authorized CI Chromium is available.
