"""Generate chapter-based male presenter recordings for every supported language."""

from __future__ import annotations

import argparse
import asyncio
import hashlib
import json
import re
import sys
from pathlib import Path

try:
    import edge_tts
except ModuleNotFoundError:  # Local reproducible dependency cache used in this workspace.
    dependency_cache = Path(__file__).resolve().parents[3] / "python-packages"
    if dependency_cache.is_dir():
        sys.path.insert(0, str(dependency_cache))
    import edge_tts


VOICE_JOBS = {
    "pl": "pl-PL-MarekNeural",
    "en": "en-GB-RyanNeural",
    "ua": "uk-UA-OstapNeural",
    "ru": "ru-RU-DmitryNeural",
    "az": "az-AZ-BabekNeural",
    "es": "es-ES-AlvaroNeural",
    "fil": "fil-PH-AngeloNeural",
    "id": "id-ID-ArdiNeural",
    "ne": "ne-NP-SagarNeural",
}

VOICE_PROFILES = {
    "pl": {"rate": "-10%", "pitch": "-2Hz", "volume": "+8%"},
    "en": {"rate": "-7%", "pitch": "-2Hz", "volume": "+7%"},
    "ua": {"rate": "-9%", "pitch": "-2Hz", "volume": "+8%"},
    "ru": {"rate": "-9%", "pitch": "-3Hz", "volume": "+8%"},
    "az": {"rate": "-7%", "pitch": "-2Hz", "volume": "+7%"},
    "es": {"rate": "-7%", "pitch": "-2Hz", "volume": "+7%"},
    "fil": {"rate": "-7%", "pitch": "-2Hz", "volume": "+7%"},
    "id": {"rate": "-7%", "pitch": "-2Hz", "volume": "+7%"},
    "ne": {"rate": "-9%", "pitch": "-2Hz", "volume": "+8%"},
}

SECTION_RANGE_SPEECH = {
    "pl": "od E jeden do E sześć",
    "en": "E one to E six",
    "ua": "від E один до E шість",
    "ru": "от E один до E шесть",
    "az": "E birdən E altıya qədər",
    "es": "de E uno a E seis",
    "fil": "E one hanggang E six",
    "id": "E satu sampai E enam",
    "ne": "E एकदेखि E छसम्म",
}


def speech_script(script: str, language: str) -> str:
    """Turn display copy into calmer narration without changing its meaning."""
    paragraphs = [re.sub(r"\s+", " ", part).strip() for part in re.split(r"\n\s*\n", script)]
    prepared = " … ".join(part for part in paragraphs if part)
    if language == "pl":
        # Polish TTS articulates the natural Polish form more clearly.
        prepared = re.sub(r"\bAleksandr\b", "Aleksander", prepared)
    elif language == "en":
        prepared = re.sub(r"\bAleksandr\b", "Alexander", prepared)
    elif language == "az":
        prepared = re.sub(r"reader", "rider", prepared, flags=re.IGNORECASE)
    elif language == "es":
        prepared = re.sub(r"\bAleksandr\b", "Aleksánder", prepared)
        prepared = re.sub(r"\breader\b", "ríder", prepared, flags=re.IGNORECASE)
    elif language == "fil":
        prepared = re.sub(r"\bAleksandr\b", "Alexander", prepared)
    elif language == "id":
        prepared = re.sub(r"\bAleksandr\b", "Aleksander", prepared)
    elif language == "ne":
        replacements = {
            "reader": "रिडर",
            "tag": "ट्याग",
            "restart": "रिस्टार्ट",
            "menu": "मेनु",
            "PIN": "पिन",
        }
        for source, replacement in replacements.items():
            prepared = re.sub(rf"\b{source}\b", replacement, prepared, flags=re.IGNORECASE)
    prepared = prepared.replace("E1-E6", SECTION_RANGE_SPEECH[language])
    return prepared


async def save_with_retry(script: str, voice: str, profile: dict[str, str], target: Path) -> None:
    error: Exception | None = None
    for attempt in range(1, 4):
        try:
            communicate = edge_tts.Communicate(
                script,
                voice,
                rate=profile["rate"],
                volume=profile["volume"],
                pitch=profile["pitch"],
            )
            await communicate.save(str(target))
            return
        except Exception as exc:  # pragma: no cover - network retry
            error = exc
            if attempt < 3:
                await asyncio.sleep(attempt * 1.5)
    raise RuntimeError(f"failed to generate {target.name}") from error


async def generate(
    guide_path: Path,
    output_dir: Path,
    force: bool,
    concurrency: int,
    section_ids: set[str],
    selected_languages: set[str],
) -> None:
    guide = json.loads(guide_path.read_text(encoding="utf-8"))
    languages = guide.get("languages", {})
    missing = sorted(set(VOICE_JOBS) - set(languages))
    if missing:
        raise ValueError(f"guide is missing languages: {', '.join(missing)}")

    output_dir.mkdir(parents=True, exist_ok=True)
    semaphore = asyncio.Semaphore(max(1, concurrency))
    jobs: list[tuple[str, str, str, dict[str, str], str, str, Path]] = []
    for language, voice in VOICE_JOBS.items():
        if selected_languages and language not in selected_languages:
            continue
        language_dir = output_dir / language
        language_dir.mkdir(parents=True, exist_ok=True)
        sections = languages[language].get("sections", [])
        for index, section in enumerate(sections, start=1):
            section_id = section.get("id", f"chapter-{index}")
            if section_ids and section_id not in section_ids:
                continue
            mp3_path = language_dir / f"{index:02d}-{section_id}.mp3"
            if mp3_path.exists() and not force:
                print(f"kept {language}/{mp3_path.name}", flush=True)
                continue
            jobs.append((language, section_id, voice, VOICE_PROFILES[language], section["text"], speech_script(section["text"], language), mp3_path))

    rendered_entries: dict[str, dict[str, object]] = {}

    async def render(job: tuple[str, str, str, dict[str, str], str, str, Path]) -> None:
        language, section_id, voice, profile, source_text, script, mp3_path = job
        async with semaphore:
            await save_with_retry(script, voice, profile, mp3_path)
        audio_bytes = mp3_path.read_bytes()
        rendered_entries[f"{language}/{section_id}"] = {
            "sourceTextSha256": hashlib.sha256(source_text.encode("utf-8")).hexdigest(),
            "audioSha256": hashlib.sha256(audio_bytes).hexdigest(),
            "bytes": len(audio_bytes),
            "voice": voice,
        }
        print(
            f"generated {language}/{mp3_path.name}: {voice}, "
            f"rate {profile['rate']}, pitch {profile['pitch']}",
            flush=True,
        )

    await asyncio.gather(*(render(job) for job in jobs))
    manifest_path = output_dir.parent.parent / "content" / "narration-manifest.json"
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    else:
        manifest = {"version": 1, "entries": {}}
    manifest["guideVersion"] = guide.get("version", "")
    manifest["renderedEntries"] = len(languages) * len(next(iter(languages.values())).get("sections", []))
    manifest.setdefault("entries", {}).update(rendered_entries)
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"updated {manifest_path}: {len(rendered_entries)} narration entries", flush=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--guide", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--concurrency", type=int, default=4)
    parser.add_argument("--section", action="append", default=[], help="Regenerate only this section id; may be repeated.")
    parser.add_argument("--language", action="append", choices=sorted(VOICE_JOBS), default=[], help="Regenerate only this language; may be repeated.")
    args = parser.parse_args()
    if not args.guide.is_file():
        parser.error(f"guide not found: {args.guide}")
    asyncio.run(generate(args.guide, args.output, args.force, args.concurrency, set(args.section), set(args.language)))


if __name__ == "__main__":
    main()
