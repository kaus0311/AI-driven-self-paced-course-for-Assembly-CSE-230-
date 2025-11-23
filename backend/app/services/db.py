from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
import os

# database URL (get from environment variable, if there's not, get from default)
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/canvas_ai_tutor"
)

# create engine
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Session:
    """
    generator to get database session
    use FastAPI
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@contextmanager
def get_db_context():
    """
    get database session with context manager
    user with definition
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_db():
    """
    Initiate database
    create all tables
    """
    from app.models.domain_models import Base
    Base.metadata.create_all(bind=engine)


def drop_db():
    """
    delete database
    delete all tables (only use developing environment)
    """
    from app.models.domain_models import Base
    Base.metadata.drop_all(bind=engine)