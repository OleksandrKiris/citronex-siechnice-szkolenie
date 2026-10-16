# Contact selection and keyboard focus — 2026-10-16

Confirmed: changing a contact group replaced the focused button with fresh DOM,
leaving focus on the page body. Reloading or changing language restored the
default group instead of the selected one. The active styling had no equivalent
programmatic pressed state.

The existing group is now kept in the `group` URL parameter. Only IDs from the
location's real contact groups are accepted; unknown values use the existing
default. Switching language also carries the in-memory selection, even when
history/storage access is denied. Other query parameters, the city mode, hash,
and history state are preserved. Switching groups replaces the current history
entry rather than adding artificial Back steps. Focus returns to the replacement
button and each button exposes `aria-pressed`.

No names, phone numbers, contact actions, priority cards, translations or training
content changed. No messages or calls are made by the tests. No new storage or
network integration is introduced.

Twelve contact scenarios were added to the existing navigation suite; eleven
failed on the original implementation (the invalid-group safety check already
passed). Coverage uses actual rendering/handlers and all nine supported languages,
every real group, direct URLs, reload, mode/query/hash, focus and denied storage or
history. Full Node suite: 150 passed. JavaScript syntax, button/map audits and
diff whitespace checks passed. The complete project/media audits run in GitHub CI
because the local snapshot intentionally omits most media. npm test is absent.

The app script, HTML references and service-worker cache advance to
`20261016-contacts1`. Unchanged CSS, instructional data and media retain their
previous cache URLs. Remaining remote blobs must match the fresh base tree.

DOM mocks/HTTP checks do not constitute a rendered browser, phone or screen-reader
test. The browser connection was unavailable in the preceding check and visual
acceptance remains outstanding. Rollback: revert the PR and advance the cache
namespace again; no external data rollback is needed.
