from pydantic import BaseModel
from app.db.base import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Numeric, String


class roomScreenInformation(BaseModel):
    name: str
    id: int


class Room(Base):
    __tablename__ = "rooms"

    id: Mapped[int] = mapped_column(
        Numeric(precision=30, scale=0),
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    goal: Mapped[str] = mapped_column(
        String,
        nullable=False
    )

    details: Mapped[str] = mapped_column(
        String,
        nullable=False
    )
