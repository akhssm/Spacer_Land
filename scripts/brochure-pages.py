"""
Turns a brochure PDF into one WebP image per page, ready for the flip-book viewer.

Usage:
    python scripts/brochure-pages.py <brochure.pdf> <output folder> [max width in px]

Example:
    python scripts/brochure-pages.py Latest_Broucher.pdf client/public/projects/ira-towers/brochure

Needs: pip install pypdfium2 pillow
"""

import sys
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image

DEFAULT_MAX_WIDTH = 1400
WEBP_QUALITY = 82


def render_pages(pdf_path: Path, out_dir: Path, max_width: int) -> list[Path]:
    out_dir.mkdir(parents=True, exist_ok=True)
    pdf = pdfium.PdfDocument(str(pdf_path))
    written = []

    for index in range(len(pdf)):
        page = pdf[index]
        width_pt, _ = page.get_size()
        # Render at whatever scale gives max_width pixels across (72 pt = 1 inch)
        scale = max_width / width_pt
        image = page.render(scale=scale).to_pil()
        if image.mode != "RGB":
            image = image.convert("RGB")

        target = out_dir / f"page-{index + 1}.webp"
        image.save(target, "WEBP", quality=WEBP_QUALITY, method=6)
        written.append(target)
        print(f"page {index + 1:>3}/{len(pdf)}  {image.width}x{image.height}  {target.stat().st_size // 1024} KB")

    return written


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)

    source = Path(sys.argv[1])
    destination = Path(sys.argv[2])
    width = int(sys.argv[3]) if len(sys.argv) > 3 else DEFAULT_MAX_WIDTH

    pages = render_pages(source, destination, width)
    total_kb = sum(p.stat().st_size for p in pages) // 1024
    print(f"\n{len(pages)} pages written to {destination} ({total_kb} KB total)")
