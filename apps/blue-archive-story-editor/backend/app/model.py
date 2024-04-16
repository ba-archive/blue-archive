from typing import List, Optional
from datetime import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from odmantic import AIOEngine, Model, ObjectId, Field, Reference

from app.db import get_engine


class DateModel(BaseModel):
    create_at: datetime = Field(default_factory=datetime.now)
    update_at: datetime = Field(default_factory=datetime.now)


class User(DateModel):
    name: str
    nickname: str
    email: str
    avatar: Optional[str] = None


class UserCreate(User):
    ...

class UserUpdate(User):
    name: Optional[str]
    nickname: Optional[str]
    email: Optional[str]
    avatar: Optional[str]


class StoryWork(DateModel):
    title: str
    description: str
    cover: str
    author: User = Reference()
    loves: int
    hits: int

class StoryWorkCreate(StoryWork):
    author: User


class 