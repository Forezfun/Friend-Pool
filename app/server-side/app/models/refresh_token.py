from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Numeric, String
from app.db.base import Base


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"

    googleId: Mapped[int] = mapped_column(Numeric(precision=30, scale=0), nullable=False)
    refreshToken: Mapped[str] = mapped_column(String, primary_key=True)
