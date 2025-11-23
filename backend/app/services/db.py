import os
from contextlib import contextmanager
from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
load_dotenv()


DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/canvas_ai_tutor",
) 

#DATABASE_URL = os.getenv(
 #   "DATABASE_URL",
  #  "postgresql://app:app_password@localhost:5432/app",
#)


engine = create_engine(DATABASE_URL, future=True, pool_pre_ping=True)


Base = declarative_base()


SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


# @contextmanager
def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()