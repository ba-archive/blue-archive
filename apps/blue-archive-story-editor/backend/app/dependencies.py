
from typing import Generator

from bson import ObjectId
from fastapi import Depends
from loguru import logger
from odmantic import AIOEngine

from app.db import MongoDatabase, get_engine
from app.models.users import User


def dep_engine() -> AIOEngine:
    try:
        logger.debug("get engine")
        engine = get_engine()
        return engine
    finally:
        logger.error("can't get engine")
        pass

async def dep_user(engine: AIOEngine = Depends(dep_engine)) -> User:
    user = await engine.find_one(User, User.name == "isnotype")
    assert user
    return user