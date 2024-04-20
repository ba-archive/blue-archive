
import hashlib
import os

from bson import ObjectId
from fastapi import Depends, UploadFile
from loguru import logger
from odmantic import AIOEngine

from app import storage
from app.db import get_engine
from app.models.uploads import Upload
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


# https://stackoverflow.com/questions/63580229/how-to-save-uploadfile-in-fastapi
async def dep_upload(
    *, engine: AIOEngine = Depends(dep_engine), file: UploadFile, user=Depends(dep_user)
) -> Upload:
    file_ext = ""
    if file.filename:
        _, file_ext = os.path.splitext(file.filename)

    # 分片 hash
    data = await file.read()
    ctx = hashlib.sha256(data)
    filehash = ctx.hexdigest()
    file_path = f"./{filehash}{file_ext}"

    await storage.save_file(file_path, data)

    upload = Upload(
        id=ObjectId(),
        user=user,
        ext=file_ext,
        name=file.filename,
        path=file_path,
        hash=filehash
    )

    return await engine.save(upload)
