from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Numeric, String
from app.db.base import Base
import random


def generate_nickname() -> str:
    prefix = "GP"
    digits = ''.join(random.choices('0123456789', k=4))
    return f"{prefix} {digits}"


class User(Base):
    __tablename__ = "users"

    googleId: Mapped[int] = mapped_column(
        Numeric(precision=30, scale=0),
        primary_key=True
    )

    nickname: Mapped[str] = mapped_column(
        String,
        nullable=False,
        default=generate_nickname
    )
