from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Numeric, String
from app.db.base import Base


class AccessToken(Base):
    __tablename__ = "access_tokens"

    googleId: Mapped[int] = mapped_column(Numeric(precision=30, scale=0), nullable=False)
    accessToken: Mapped[str] = mapped_column(String, primary_key=True)
