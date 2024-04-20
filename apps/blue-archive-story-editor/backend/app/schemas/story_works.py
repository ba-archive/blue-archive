from datetime import datetime
from typing import Optional
from odmantic import ObjectId
from pydantic import BaseModel

from app.models.users import User


class StoryWorkSchema(BaseModel):
    created: datetime
    updated: datetime
    id: ObjectId
    title: str
    description: str
    cover: str
    author: User
    loves: int
    hits: int
    story: dict
    released: bool

class StoryWorkCreate(BaseModel):
    title: str
    description: str
    cover: str 
    story: dict
    released: bool

class StoryWorkUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover: Optional[str] = None
    story: Optional[dict] = None
    released: Optional[bool] = None