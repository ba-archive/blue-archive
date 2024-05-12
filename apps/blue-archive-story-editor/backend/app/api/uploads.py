from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic.networks import EmailStr
from odmantic import AIOEngine, ObjectId

from app.db import get_engine
from app.dependencies import dep_engine, dep_upload, dep_user
from app.models.story_works import StoryWork
from app.models.uploads import Upload
from app.models.users import User
from app.schemas.story_works import StoryWorkCreate, StoryWorkSchema, StoryWorkUpdate


router = APIRouter()


@router.post("/uploads/")
async def upload(upload: Upload = Depends(dep_upload)):
    return upload

