"""Use the prepared transparent CT5-V Blackwing cutout as its cover photo.

Revision ID: 20261009_0021
Revises: 20261009_0020
Create Date: 2026-10-09
"""
from alembic import op
import sqlalchemy as sa

revision = "20261009_0021"
down_revision = "20261009_0020"
branch_labels = None
depends_on = None

SLUG = "2022-cadillac-ct5-v-blackwing-6-speed"
CUTOUT = f"/media/vehicles/{SLUG}/cutout.webp"


def upgrade():
    bind = op.get_bind()
    vehicles = sa.table("vehicles", sa.column("slug", sa.String), sa.column("images", sa.JSON))
    row = bind.execute(sa.select(vehicles.c.images).where(vehicles.c.slug == SLUG)).first()
    if row is None:
        return
    images = [image for image in (row.images or []) if image != CUTOUT]
    bind.execute(vehicles.update().where(vehicles.c.slug == SLUG).values(images=[CUTOUT, *images]))


def downgrade():
    bind = op.get_bind()
    vehicles = sa.table("vehicles", sa.column("slug", sa.String), sa.column("images", sa.JSON))
    row = bind.execute(sa.select(vehicles.c.images).where(vehicles.c.slug == SLUG)).first()
    if row is None:
        return
    bind.execute(vehicles.update().where(vehicles.c.slug == SLUG).values(images=[image for image in (row.images or []) if image != CUTOUT]))
