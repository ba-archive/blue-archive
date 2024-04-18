from datetime import datetime
from pydantic import BaseModel

from app.models.users import User


class StoryWorkSchema(BaseModel):
    created: datetime
    updated: datetime
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