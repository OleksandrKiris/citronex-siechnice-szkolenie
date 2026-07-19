"""Remove detached raster fragments while preserving the main transparent figure."""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("target", type=Path, nargs="?")
    parser.add_argument("--alpha-threshold", type=int, default=4)
    parser.add_argument("--check-only", action="store_true")
    args = parser.parse_args()

    image = Image.open(args.source).convert("RGBA")
    alpha = image.getchannel("A")
    width, height = image.size
    visible = bytearray(1 if value > args.alpha_threshold else 0 for value in alpha.getdata())
    visited = bytearray(width * height)
    components: list[list[int]] = []

    for start in range(width * height):
        if not visible[start] or visited[start]:
            continue
        visited[start] = 1
        queue = deque([start])
        component: list[int] = []
        while queue:
            index = queue.popleft()
            component.append(index)
            x, y = index % width, index // width
            for ny in range(max(0, y - 1), min(height, y + 2)):
                for nx in range(max(0, x - 1), min(width, x + 2)):
                    neighbor = ny * width + nx
                    if visible[neighbor] and not visited[neighbor]:
                        visited[neighbor] = 1
                        queue.append(neighbor)
        components.append(component)

    if not components:
        raise SystemExit(f"No visible pixels found in {args.source}")

    keep = max(components, key=len)
    sizes = sorted((len(component) for component in components), reverse=True)
    removed = sum(len(component) for component in components) - len(keep)
    print(
        f"{args.source.name}: kept {len(keep)} px; detached {removed} px; "
        f"components={len(components)}; largest={sizes[:5]}"
    )
    if args.check_only:
        return
    if args.target is None:
        parser.error("target is required unless --check-only is used")

    keep_mask = bytearray(width * height)
    for index in keep:
        keep_mask[index] = 1

    pixels = list(image.getdata())
    cleaned = [pixel if keep_mask[index] else (0, 0, 0, 0) for index, pixel in enumerate(pixels)]
    image.putdata(cleaned)
    args.target.parent.mkdir(parents=True, exist_ok=True)
    image.save(args.target, optimize=True)



if __name__ == "__main__":
    main()
