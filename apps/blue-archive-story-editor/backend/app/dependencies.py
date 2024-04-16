
from typing import Generator

from loguru import logger
from odmantic import AIOEngine

from app.db import MongoDatabase, get_engine


def dep_engine() -> AIOEngine:
    try:
        engine = get_engine()
        return engine
    finally:
        logger.error("can't get engine")
        pass
