from typing import Optional
from odmantic import ObjectId
from typing_extensions import Annotated
from pydantic import BaseModel, EmailStr, Field


class UserSchema(BaseModel):
    id: ObjectId
    name: str
    nickname: str
    email: str
    avatar: str


class UserCreate(BaseModel):
    name: str
    nickname: Optional[str]
    email: EmailStr
    password: str = Field(min_length=8, max_length=64)
    avatar: Optional[str]

