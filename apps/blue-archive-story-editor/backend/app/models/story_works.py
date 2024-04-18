import asyncio
from typing import List, Optional, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from odmantic import AIOEngine, Model, ObjectId, Field, Reference

from app.db import get_engine
from app.models.users import User


def datetime_now_sec():
    return datetime.now().replace(microsecond=0)


class StoryWork(Model):
    created: datetime = Field(default_factory=datetime_now_sec)
    updated: datetime = Field(default_factory=datetime_now_sec)
    title: str
    description: str
    cover: str
    author: User = Reference()
    loves: int = 0
    hits: int = 0
    story: dict
