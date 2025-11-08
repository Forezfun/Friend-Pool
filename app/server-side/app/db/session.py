from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql+psycopg2://friend:pool@127.0.0.1:5432/postgres"

engine = create_engine(
    DATABASE_URL
)

sessionLocal = sessionmaker(bind=engine)

db_session = None

def init_db():
    global db_session
    try:
        db_session = sessionLocal()
        result = db_session.execute(text("SELECT 1")).scalar()
        if result == 1:
            print("Подключение к БД успешно!")
        else:
            print("Подключение к БД выполнено, но тест не прошёл")
    except Exception as e:
        print("Ошибка подключения к БД:", e)

def close_db():
    global db_session
    if db_session:
        db_session.close()
        print("DB session closed")
