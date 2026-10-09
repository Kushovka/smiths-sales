"""Keep cutout art for the home showcase only; restore originals elsewhere.

Revision ID: 20261009_0022
Revises: 20261009_0021
Create Date: 2026-10-09
"""
from alembic import op
import sqlalchemy as sa

revision = "20261009_0022"
down_revision = "20261009_0021"
branch_labels = None
depends_on = None

CUTOUT_SLUGS = (
    "2018-porsche-718-cayman-gts",
    "2018-toyota-land-cruiser-urj200",
    "2020-cadillac-escalade-esv-platinum-4wd",
    "2021-ford-f-150-shelby-raptor-baja-supercrew",
    "2022-bmw-m5-competition-package",
    "2022-cadillac-ct5-v-blackwing-6-speed",
)


def upgrade():
    bind = op.get_bind()
    vehicles = sa.table("vehicles", sa.column("slug", sa.String), sa.column("images", sa.JSON))
    for slug in CUTOUT_SLUGS:
        row = bind.execute(sa.select(vehicles.c.images).where(vehicles.c.slug == slug)).first()
        if row is None:
            continue
        images = [image for image in (row.images or []) if not image.endswith("/cutout.webp")]
        bind.execute(vehicles.update().where(vehicles.c.slug == slug).values(images=images))


def downgrade():
    pass
