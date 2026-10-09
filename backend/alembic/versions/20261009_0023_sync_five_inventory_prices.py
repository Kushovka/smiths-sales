"""Sync five vehicle prices with the approved inventory sheet.

Revision ID: 20261009_0023
Revises: 20261009_0022
Create Date: 2026-10-09
"""
from alembic import op
import sqlalchemy as sa


revision = "20261009_0023"
down_revision = "20261009_0022"
branch_labels = None
depends_on = None


# (price currently published, price from Sheet1 / Our Price)
PRICE_UPDATES = {
    "2022-bmw-m5-competition-package": (54999, 59999),
    "2024-chevrolet-corvette-stingray-convertible-z51-2lt": (49999, 53499),
    "2022-tesla-model-s-plaid": (39999, 48999),
    "2018-porsche-718-cayman-gts": (30999, 40000),
    "2023-cadillac-escalade-v-esv": (84999, 79999),
}


def _set_prices(expected_index: int, target_index: int) -> None:
    bind = op.get_bind()
    vehicles = sa.table(
        "vehicles",
        sa.column("slug", sa.String),
        sa.column("price", sa.Integer),
    )

    for slug, prices in PRICE_UPDATES.items():
        expected_price = prices[expected_index]
        target_price = prices[target_index]
        result = bind.execute(
            vehicles.update()
            .where(vehicles.c.slug == slug, vehicles.c.price == expected_price)
            .values(price=target_price)
        )
        if result.rowcount != 1:
            raise RuntimeError(
                f"Expected {slug} at ${expected_price:,} before updating its price; "
                "no price was changed for this row."
            )


def upgrade() -> None:
    _set_prices(expected_index=0, target_index=1)


def downgrade() -> None:
    _set_prices(expected_index=1, target_index=0)
