# Recorded instruction review — 16 October 2026

The original `assets/content/presenter-guide.json` and recordings precede the owner-confirmed instructions dated 2026-10-16. Audio and its matching transcript remain unchanged; the interface explicitly distinguishes older recordings from current instructions.

Confirmed differences in the original English and Polish transcripts:

| Recorded chapter | Difference from the updated instruction | Current reader topic |
| --- | --- | --- |
| reader-personal-tag | Does not state the 05:50–06:00 personal-tag window | start |
| reader-break-end | Does not include scanning the activity again after a break | rows |
| reader-break | Does not include scanning the activity again after a break | rows |
| reader-work-end | Does not include the activity scan before ending work outside rows | outside |
| reader-restart-buttons | Says to restart only when frozen; the updated instruction also covers connection, charging and white-screen problems | restart |
| reader-restart-menu | Does not include waiting for connection, replacing the reader and reporting a continued problem | restart |

For these six stable chapter IDs in every supported language:

- Display a localized notice above the transcript and in the full transcript list.
- Link directly to the correct updated reader topic and retain the active language.
- Pause when reaching the chapter automatically; clear earlier playback intent so error retries cannot start an outdated chapter automatically.
- Keep deliberate playback available with a localized “Play earlier recording” label.
- Skip speculative next-audio prefetch for marked chapters. No new requests or generated audio.

Unchanged chapters retain their playback behavior. All original audio, source transcripts, photos, teaching data, contacts and official logo are preserved. No workplace facts were inferred or changed.

## Verification

111 local Node tests pass, including nine language-link/notice cases and simulated automatic chapter transitions. The existing CI also runs the complete original media/presenter/information/language audits against the full repository. Changed app and HTML entry points use `20261016-recording1`; the instruction module remains `20261016-language1`, unchanged media cache keys remain intact.

These checks use source inspection, Node VM execution, CI and HTTP comparison. No browser/mobile visual verification or native-speaker certification is claimed. Updated audio itself remains an explicit follow-up requiring approved recordings; this change labels and pauses the superseded fragments instead of pretending the recordings were updated.

Rollback: revert this PR together with its HTML/worker version changes. No external data or operational actions are involved.
