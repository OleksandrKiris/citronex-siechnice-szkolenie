# Real presenter videos

The start-page presenter automatically prefers a real MP4 video over the static
portrait when a matching file exists. Videos are muted in the browser because
the chapter audio is played from `assets/audio/guide`.

File layout:

```text
assets/avatar/<language>/<chapter-number>-<chapter-id>.mp4
```

Example for the Russian version:

```text
assets/avatar/ru/01-welcome.mp4
assets/avatar/ru/02-arrival.mp4
assets/avatar/ru/03-warehouse.mp4
assets/avatar/ru/04-greenhouse.mp4
assets/avatar/ru/05-reader.mp4
assets/avatar/ru/06-tablet.mp4
assets/avatar/ru/07-safety.mp4
assets/avatar/ru/08-documents.mp4
assets/avatar/ru/09-help.mp4
assets/avatar/ru/10-finish.mp4
```

Each video must use the corresponding MP3 from `assets/audio/guide/<language>`
as its lip-sync source and have the same duration. Recommended export: H.264,
AAC optional, 720p or 1080p, `yuv420p`, fast-start enabled. A 9:16 or 4:5 shot
with face, torso and hands visible works best.

If a chapter-specific lip-sync video is missing, the interface uses
`presenter-gesture-loop-v1.mp4`. This is a silent, natural-looking loop assembled
from several real presenter poses: open-palm explanation, two-handed explanation,
an important-point gesture and a thumbs-up. It starts and stops together with the
spoken chapter. A chapter-specific MP4 still takes priority when it is added.
