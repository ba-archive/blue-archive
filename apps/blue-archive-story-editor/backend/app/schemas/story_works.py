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

class StoryWorkCreate(BaseModel):
    title: str
    description: str
    cover: str 
    story: dict

class StoryWorkUpdate(BaseModel):
    title: Optional[str]
    description: Optional[str]
    cover: Optional[str]
    story: Optional[dict]