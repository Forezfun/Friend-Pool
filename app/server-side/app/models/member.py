from app.db.base import Base
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import Numeric, Enum, String
import enum

class RoleEnum(enum.Enum):
    host = "host"
    user = "user"

class Member(Base):
    __tablename__ = "members"

    googleId: Mapped[int] = mapped_column(Numeric(precision=30, scale=0), primary_key=True)
    role: Mapped[RoleEnum] = mapped_column(Enum(RoleEnum), nullable=False)
    roomId: Mapped[str] = mapped_column(String, nullable = False)