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

The current interface does not load the previous presenter videos. It assembles a
lightweight cartoon puppet from the transparent files in `assets/avatar/cartoon`.
The head, blink, mouth, torso and both arms animate independently in CSS. JavaScript
also changes the illustrated prop for every chapter (map, box, tomato, reader,
tablet, safety, documents, phone and completion). The player shows the current
sentence over the character and highlights the same sentence in the transcript.
