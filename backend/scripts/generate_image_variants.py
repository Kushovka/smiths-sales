"""Generate immutable WebP derivatives for vehicle previews and homepage art.

Requires Pillow in the image-preparation environment; it is not a backend runtime
dependency. Run from the repository root with:
    python3 backend/scripts/generate_image_variants.py
"""

from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[2]
VEHICLE_ROOT = ROOT / "backend/app/static/media/vehicles"
PUBLIC_IMAGES = ROOT / "frontend/public/images"


def save_variant(source: Path, output: Path, max_width: int, quality: int) -> None:
    output.parent.mkdir(parents=True, exist_ok=True)
    if output.exists() and output.stat().st_mtime >= source.stat().st_mtime:
        return

    with Image.open(source) as image:
        image.thumbnail((max_width, max_width), Image.Resampling.LANCZOS)
        image.save(
            output,
            "WEBP",
            quality=quality,
            method=6,
            alpha_quality=90,
        )


def generate_vehicle_variants() -> tuple[int, int]:
    card_count = 0
    thumb_count = 0
    for source in sorted(VEHICLE_ROOT.glob("*/*.webp")):
        save_variant(source, source.parent / "cards" / source.name, 800, 78)
        save_variant(source, source.parent / "thumbs" / source.name, 480, 74)
        card_count += 1
        thumb_count += 1
    return card_count, thumb_count


def generate_site_variants() -> int:
    variants = (
        ("smiths-sales-hero.webp", "smiths-sales-hero-960.webp", 960, 80),
        ("smiths-sales-hero.webp", "smiths-sales-hero-1894.webp", 1894, 80),
        ("smiths-sales-logo.webp", "smiths-sales-logo-512.webp", 512, 84),
        ("smiths-sales-logo-dark.webp", "smiths-sales-logo-dark-512.webp", 512, 84),
        ("dealership-about.webp", "dealership-about-1600.webp", 1600, 80),
        ("commodore-dealership.webp", "commodore-dealership-1400.webp", 1400, 80),
        ("reviews-banner.webp", "reviews-banner-1000.webp", 1000, 80),
    )
    for source_name, output_name, width, quality in variants:
        save_variant(PUBLIC_IMAGES / source_name, PUBLIC_IMAGES / output_name, width, quality)
    return len(variants)


if __name__ == "__main__":
    cards, thumbs = generate_vehicle_variants()
    site_images = generate_site_variants()
    print(f"Generated or verified {cards} card images and {thumbs} gallery thumbnails.")
    print(f"Generated or verified {site_images} optimized homepage image variants.")
