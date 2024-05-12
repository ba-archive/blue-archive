import asyncio
from enum import Enum
from typing import List, Optional, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from odmantic import AIOEngine, Model, ObjectId, Field, Reference

from app.db import get_engine
from app.models.users import User


def datetime_now_sec():
    return datetime.now().replace(microsecond=0)


class Upload(Model):
    created: datetime = Field(default_factory=datetime_now_sec)
    updated: datetime = Field(default_factory=datetime_now_sec)
    user: User = Reference()
    ext: Optional[str] = ""
    name: Optional[str] = ""
    path: str
    hash: str

class AssetType(Enum):
    Background = "Background"
    Image = "Image"
    Music = "Music"
    Sound = "Sound"
    Spine = "Spine"
    Video = "Video"

class Asset():
    user: User = Reference()
    upload: Upload = Reference()
    name: str
    type: AssetType