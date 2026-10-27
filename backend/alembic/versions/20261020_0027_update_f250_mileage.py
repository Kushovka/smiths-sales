"""Correct vehicle mileages from their live listings.

Revision ID: 20261020_0027
Revises: 20261010_0026
Create Date: 2026-10-20
"""

from alembic import op
import sqlalchemy as sa


revision = "20261020_0027"
down_revision = "20261010_0026"
branch_labels = None
depends_on = None

MILEAGE_UPDATES = {
    "2024-ford-f-250-super-duty-black-widow": (11000, 11824),
    "2022-cadillac-ct5-v-blackwing-6-speed": (23000, 22981),
}


def _set_mileage(vehicle_id: str, mileage: int) -> None:
    vehicles = sa.table(
        "vehicles",
        sa.column("id", sa.String),
        sa.column("mileage", sa.Integer),
        sa.column("details", sa.JSON),
    )
    connection = op.get_bind()
    row = connection.execute(
        sa.select(vehicles.c.details).where(vehicles.c.id == vehicle_id)
    ).first()
    if row is None:
        raise RuntimeError(f"Could not find vehicle {vehicle_id}")

    details = dict(row.details or {})
    info = [dict(item) for item in details.get("info", [])]
    mileage_item = next(
        (item for item in info if str(item.get("label", "")).strip().lower() == "mileage"),
        None,
    )
    if mileage_item is None:
        info.insert(0, {"label": "Mileage", "value": f"{mileage:,} miles"})
    else:
        mileage_item["value"] = f"{mileage:,} miles"
    details["info"] = info

    connection.execute(
        sa.update(vehicles)
        .where(vehicles.c.id == vehicle_id)
        .values(mileage=mileage, details=details)
    )


def upgrade() -> None:
    for vehicle_id, (_, target_mileage) in MILEAGE_UPDATES.items():
        _set_mileage(vehicle_id, target_mileage)


def downgrade() -> None:
    for vehicle_id, (previous_mileage, _) in MILEAGE_UPDATES.items():
        _set_mileage(vehicle_id, previous_mileage)
