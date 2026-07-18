"""Generate clear, natural male presenter recordings for every supported language."""

from __future__ import annotations

import argparse
import asyncio
import subprocess
from pathlib import Path

import edge_tts


VOICE_JOBS = {
    "pl": (
        "pl-PL-MarekNeural",
        "Witaj. To jest system szkoleniowy dla Citronex Siechnice. "
        "Nie wiesz, gdzie iść? Otwórz mapę i wybierz miejsce pracy. "
        "Po przyjściu wybierz potrzebną sekcję.",
    ),
    "en": (
        "en-GB-RyanNeural",
        "Welcome. This is the training system for Citronex in Siechnice. "
        "If you do not know where to go, open the map and choose your workplace. "
        "When you arrive, choose the section you need.",
    ),
    "ua": (
        "uk-UA-OstapNeural",
        "Вітаємо. Це система навчання для Сітронекс у Сехніце. "
        "Не знаєте, куди йти? Відкрийте карту та виберіть місце роботи. "
        "Після прибуття виберіть потрібний розділ.",
    ),
    "ru": (
        "ru-RU-DmitryNeural",
        "Здравствуйте! Меня зовут Александр. Я ваш цифровой помощник по обучению в Сехнице. "
        "Сначала откройте карту и проверьте, куда вам нужно приехать. "
        "Если вы работаете в теплице, изучите разделы: «Теплица», «Ридер» и «Планшет». "
        "Если вы работаете на складе, откройте раздел «Склад». "
        "Не спешите. Просмотрите инструкцию полностью. После приезда обязательно пройдите очный инструктаж у руководителя. "
        "Желаю вам спокойной и безопасной работы!",
    ),
    "az": (
        "az-AZ-BabekNeural",
        "Salam. Bu, Citronex Siechnice üçün təlim sistemidir. "
        "Hara gedəcəyinizi bilmirsiniz? Xəritəni açın və iş yerinizi seçin. "
        "Gəldikdən sonra lazım olan bölməni seçin.",
    ),
    "es": (
        "es-ES-AlvaroNeural",
        "Bienvenido. Este es el sistema de formación de Citronex en Siechnice. "
        "¿No sabes adónde ir? Abre el mapa y elige tu lugar de trabajo. "
        "Cuando llegues, elige la sección que necesitas.",
    ),
    "fil": (
        "fil-PH-AngeloNeural",
        "Maligayang pagdating. Ito ang training system para sa Citronex Siechnice. "
        "Kung hindi mo alam kung saan pupunta, buksan ang mapa at piliin ang lugar ng trabaho. "
        "Pagdating mo, piliin ang seksiyong kailangan mo.",
    ),
    "id": (
        "id-ID-ArdiNeural",
        "Selamat datang. Ini adalah sistem pelatihan Citronex di Siechnice. "
        "Jika Anda tidak tahu harus pergi ke mana, buka peta dan pilih tempat kerja Anda. "
        "Setelah tiba, pilih bagian yang Anda perlukan.",
    ),
    "ne": (
        "ne-NP-SagarNeural",
        "सिट्रोनेक्स सिएखनित्सेमा स्वागत छ। यो प्रशिक्षण प्रणाली हो। "
        "कहाँ जाने थाहा छैन? नक्सा खोल्नुहोस् र काम गर्ने ठाउँ छान्नुहोस्। "
        "पुगेपछि आवश्यक भाग छान्नुहोस्।",
    ),
}


async def generate(output_dir: Path, ffmpeg: Path) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    for language, (voice, script) in VOICE_JOBS.items():
        mp3_path = output_dir / f"intro-{language}.mp3"
        wav_path = output_dir / f"intro-{language}.wav"
        communicate = edge_tts.Communicate(
            script,
            voice,
            rate="-2%",
            volume="+0%",
            pitch="-2Hz",
        )
        await communicate.save(str(mp3_path))
        subprocess.run(
            [
                str(ffmpeg), "-hide_banner", "-loglevel", "error", "-y",
                "-i", str(mp3_path), "-ac", "1", "-ar", "44100",
                "-c:a", "pcm_s16le", str(wav_path),
            ],
            check=True,
        )
        print(f"generated {language}: {voice}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--ffmpeg", type=Path, required=True)
    args = parser.parse_args()
    if not args.ffmpeg.is_file():
        parser.error(f"ffmpeg not found: {args.ffmpeg}")
    asyncio.run(generate(args.output, args.ffmpeg))


if __name__ == "__main__":
    main()
