"""Update mileage from the current inventory spreadsheet.

Revision ID: 20261001_0014
Revises: 20260928_0013
Create Date: 2026-10-01
"""

from alembic import op
import sqlalchemy as sa


revision = "20261001_0014"
down_revision = "20260928_0013"
branch_labels = None
depends_on = None

UPDATED_MILEAGES = {
    "2022-bmw-m5-competition-package": 19449,
    "2024-chevrolet-corvette-stingray-convertible-z51-2lt": 7006,
    "2024-mercedes-amg-g63": 6439,
    "2022-tesla-model-s-plaid": 16861,
    "2023-bmw-x6-m50i": 31090,
    "2025-gmc-sierra-1500-pro-4x4": 504,
    "2018-porsche-718-cayman-gts": 11492,
    "2024-toyota-4runner-trd-off-road-premium-4x4": 11934,
    "2023-cadillac-escalade-v-esv": 40614,
}

PREVIOUS_MILEAGES = {
    "2022-bmw-m5-competition-package": 26000,
    "2024-chevrolet-corvette-stingray-convertible-z51-2lt": 12000,
    "2024-mercedes-amg-g63": 369,
    "2022-tesla-model-s-plaid": 22000,
    "2023-bmw-x6-m50i": 18000,
    "2025-gmc-sierra-1500-pro-4x4": 2000,
    "2018-porsche-718-cayman-gts": 105000,
    "2024-toyota-4runner-trd-off-road-premium-4x4": 8000,
    "2023-cadillac-escalade-v-esv": 11000,
}


def _set_mileages(values: dict[str, int]) -> None:
    vehicles = sa.table(
        "vehicles",
        sa.column("id", sa.String),
        sa.column("mileage", sa.Integer),
        sa.column("details", sa.JSON),
    )
    connection = op.get_bind()

    for vehicle_id, mileage in values.items():
        row = connection.execute(
            sa.select(vehicles.c.details).where(vehicles.c.id == vehicle_id)
        ).first()
        if row is None:
            continue

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
    _set_mileages(UPDATED_MILEAGES)


def downgrade() -> None:
    _set_mileages(PREVIOUS_MILEAGES)
