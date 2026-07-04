import os
from collections.abc import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from api.config import DB_MAX_OVERFLOW, DB_POOL_RECYCLE, DB_POOL_SIZE

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "sqlite:///./argos.db",
)

_is_sqlite = DATABASE_URL.startswith("sqlite")
connect_args = {"check_same_thread": False} if _is_sqlite else {}

_engine_kwargs: dict = {
    "pool_pre_ping": True,
    "connect_args": connect_args,
}
if not _is_sqlite:
    _engine_kwargs.update(
        pool_size=DB_POOL_SIZE,
        max_overflow=DB_MAX_OVERFLOW,
        pool_recycle=DB_POOL_RECYCLE,
    )

engine = create_engine(DATABASE_URL, **_engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
