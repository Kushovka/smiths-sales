"""Change active stock number prefix from RUC to SSS.

Revision ID: 20261010_0026
Revises: 20261010_0025
Create Date: 2026-10-10
"""

from alembic import op
import sqlalchemy as sa


revision = "20261010_0026"
down_revision = "20261010_0025"
branch_labels = None
depends_on = None


def _replace_prefix(old_prefix: str, new_prefix: str) -> None:
    vehicles = sa.table(
        "vehicles",
        sa.column("id", sa.String),
        sa.column("stock_number", sa.String),
    )
    connection = op.get_bind()
    rows = connection.execute(
        sa.select(vehicles.c.id, vehicles.c.stock_number).where(
            vehicles.c.stock_number.like(f"{old_prefix}%")
        )
    )
    for vehicle_id, stock_number in rows:
        connection.execute(
            vehicles.update()
            .where(vehicles.c.id == vehicle_id)
            .values(stock_number=f"{new_prefix}{stock_number[len(old_prefix):]}")
        )


def upgrade() -> None:
    _replace_prefix("RUC", "SSS")


def downgrade() -> None:
    _replace_prefix("SSS", "RUC")
