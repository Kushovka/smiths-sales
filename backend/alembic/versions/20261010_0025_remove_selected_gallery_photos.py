"""Remove user-selected photos from vehicle galleries.

Revision ID: 20261010_0025
Revises: 20261009_0024
Create Date: 2026-10-10
"""

from alembic import op
import sqlalchemy as sa


revision = "20261010_0025"
down_revision = "20261009_0024"
branch_labels = None
depends_on = None


REMOVALS = (
    ("2025-gmc-sierra-1500-pro-4x4", "/media/vehicles/2025-gmc-sierra-1500-pro-4x4/015.webp"),
    ("2023-cadillac-escalade-v-esv", "/media/vehicles/2023-cadillac-escalade-v-esv/017.webp"),
    ("2023-bmw-x6-m50i", "/media/vehicles/2023-bmw-x6-m50i/018.webp"),
    ("2023-bmw-x6-m50i", "/media/vehicles/2023-bmw-x6-m50i/025.webp"),
    ("2023-porsche-cayenne-platinum-edition", "/media/vehicles/2023-porsche-cayenne-platinum-edition/019.webp"),
    ("2022-cadillac-ct5-v-blackwing-6-speed", "/media/vehicles/2022-cadillac-ct5-v-blackwing-6-speed/020.webp"),
    ("2022-bmw-m5-competition-package", "/media/vehicles/2022-bmw-m5-competition-package/018.webp"),
    ("2022-bmw-m5-competition-package", "/media/vehicles/2022-bmw-m5-competition-package/021.webp"),
    ("2020-cadillac-escalade-esv-platinum-4wd", "/media/vehicles/2020-cadillac-escalade-esv-platinum-4wd/020.webp"),
    ("2018-toyota-land-cruiser-urj200", "/media/vehicles/2018-toyota-land-cruiser-urj200/014.webp"),
)


def upgrade() -> None:
    vehicles = sa.table(
        "vehicles",
        sa.column("slug", sa.String),
        sa.column("images", sa.JSON),
    )
    connection = op.get_bind()
    for slug, photo in REMOVALS:
        row = connection.execute(
            sa.select(vehicles.c.images).where(vehicles.c.slug == slug)
        ).first()
        if row is None:
            continue

        images = [image for image in (row.images or []) if image != photo]
        connection.execute(
            vehicles.update().where(vehicles.c.slug == slug).values(images=images)
        )


def downgrade() -> None:
    vehicles = sa.table(
        "vehicles",
        sa.column("slug", sa.String),
        sa.column("images", sa.JSON),
    )
    connection = op.get_bind()
    for slug, photo in REMOVALS:
        row = connection.execute(
            sa.select(vehicles.c.images).where(vehicles.c.slug == slug)
        ).first()
        if row is None:
            continue

        images = list(row.images or [])
        if photo in images:
            continue
        index_text = photo.rsplit("/", 1)[-1]
        index = int(index_text.split(".", 1)[0])
        insert_at = next(
            (
                i for i, image in enumerate(images)
                if image.rsplit("/", 1)[-1].split(".", 1)[0].isdigit()
                and int(image.rsplit("/", 1)[-1].split(".", 1)[0]) > index
            ),
            len(images),
        )
        images.insert(insert_at, photo)
        connection.execute(
            vehicles.update().where(vehicles.c.slug == slug).values(images=images)
        )
