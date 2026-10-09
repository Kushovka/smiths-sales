"""Assign RUC stock numbers to the active Smith's inventory.

Revision ID: 20261009_0024
Revises: 20261009_0023
Create Date: 2026-10-09
"""

from alembic import op
import sqlalchemy as sa


revision = "20261009_0024"
down_revision = "20261009_0023"
branch_labels = None
depends_on = None


STOCK_NUMBERS = {
    "2018-toyota-land-cruiser-urj200": "RUC09306",
    "2022-bmw-m5-competition-package": "RUC97283",
    "2024-ford-f-250-super-duty-black-widow": "RUC71887",
    "2023-porsche-cayenne-platinum-edition": "RUC83374",
    "2024-chevrolet-corvette-stingray-convertible-z51-2lt": "RUC05413",
    "2024-mercedes-amg-g63": "RUC90891",
    "2020-cadillac-escalade-esv-platinum-4wd": "RUC33565",
    "2022-tesla-model-s-plaid": "RUC49652",
    "2021-ford-f-150-shelby-raptor-baja-supercrew": "RUC62858",
    "2023-bmw-x6-m50i": "RUC24398",
    "2025-gmc-sierra-1500-pro-4x4": "RUC54499",
    "2022-cadillac-ct5-v-blackwing-6-speed": "RUC15285",
    "2018-porsche-718-cayman-gts": "RUC11918",
    "2024-toyota-4runner-trd-off-road-premium-4x4": "RUC42310",
    "2023-cadillac-escalade-v-esv": "RUC59246",
}


def upgrade() -> None:
    vehicles = sa.table(
        "vehicles",
        sa.column("slug", sa.String),
        sa.column("stock_number", sa.String),
    )
    connection = op.get_bind()
    for slug, stock_number in STOCK_NUMBERS.items():
        connection.execute(
            vehicles.update()
            .where(vehicles.c.slug == slug)
            .values(stock_number=stock_number)
        )


def downgrade() -> None:
    vehicles = sa.table(
        "vehicles",
        sa.column("slug", sa.String),
        sa.column("stock_number", sa.String),
    )
    connection = op.get_bind()
    for slug, stock_number in STOCK_NUMBERS.items():
        connection.execute(
            vehicles.update()
            .where(vehicles.c.slug == slug)
            .where(vehicles.c.stock_number == stock_number)
            .values(stock_number=None)
        )
