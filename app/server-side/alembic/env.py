import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# --------------------------------------------------
# Добавляем путь до server-side/app, чтобы видеть пакеты
# --------------------------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'app'))
sys.path.append(BASE_DIR)

# --------------------------------------------------
# Alembic config
# --------------------------------------------------
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# --------------------------------------------------
# Импорт Base и моделей
# --------------------------------------------------
from app.db.base import Base        # Base из db/base.py
# Явно импортируем все модели, чтобы Alembic их увидел
from app.models.user import User
from app.models.room import Room
from app.models.member import Member
from app.models.refresh_token import RefreshToken
from app.models.access_token import AccessToken
# from app.models.other_model import OtherModel  # добавляйте другие модели по необходимости

target_metadata = Base.metadata

# Для отладки: какие таблицы Alembic видит
print("Alembic sees tables:", Base.metadata.tables.keys())

# --------------------------------------------------
# Миграции оффлайн
# --------------------------------------------------
def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )
    with context.begin_transaction():
        context.run_migrations()

# --------------------------------------------------
# Миграции онлайн
# --------------------------------------------------
def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )
        with context.begin_transaction():
            context.run_migrations()

# --------------------------------------------------
# Запуск миграций
# --------------------------------------------------
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
