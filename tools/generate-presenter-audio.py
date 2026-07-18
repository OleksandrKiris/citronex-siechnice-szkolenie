"""Generate chapter-based male presenter recordings for every supported language."""

from __future__ import annotations

import argparse
import asyncio
import json
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


async def save_with_retry(script: str, voice: str, target: Path) -> None:
    error: Exception | None = None
    for attempt in range(1, 4):
        try:
            communicate = edge_tts.Communicate(
                script,
                voice,
                rate="-3%",
                volume="+0%",
                pitch="-2Hz",
            )
            await communicate.save(str(target))
            return
        except Exception as exc:  # pragma: no cover - network retry
            error = exc
            if attempt < 3:
                await asyncio.sleep(attempt * 1.5)
    raise RuntimeError(f"failed to generate {target.name}") from error


async def generate(guide_path: Path, output_dir: Path, force: bool, concurrency: int) -> None:
    guide = json.loads(guide_path.read_text(encoding="utf-8"))
    languages = guide.get("languages", {})
    missing = sorted(set(VOICE_JOBS) - set(languages))
    if missing:
        raise ValueError(f"guide is missing languages: {', '.join(missing)}")

    output_dir.mkdir(parents=True, exist_ok=True)
    semaphore = asyncio.Semaphore(max(1, concurrency))
    jobs: list[tuple[str, str, str, Path]] = []
    for language, voice in VOICE_JOBS.items():
        language_dir = output_dir / language
        language_dir.mkdir(parents=True, exist_ok=True)
        sections = languages[language].get("sections", [])
        for index, section in enumerate(sections, start=1):
            section_id = section.get("id", f"chapter-{index}")
            mp3_path = language_dir / f"{index:02d}-{section_id}.mp3"
            if mp3_path.exists() and not force:
                print(f"kept {language}/{mp3_path.name}", flush=True)
                continue
            jobs.append((language, voice, section["text"], mp3_path))

    async def render(job: tuple[str, str, str, Path]) -> None:
        language, voice, script, mp3_path = job
        async with semaphore:
            await save_with_retry(script, voice, mp3_path)
        print(f"generated {language}/{mp3_path.name}: {voice}", flush=True)

    await asyncio.gather(*(render(job) for job in jobs))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--guide", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--force", action="store_true")
    parser.add_argument("--concurrency", type=int, default=4)
    args = parser.parse_args()
    if not args.guide.is_file():
        parser.error(f"guide not found: {args.guide}")
    asyncio.run(generate(args.guide, args.output, args.force, args.concurrency))


if __name__ == "__main__":
    main()
