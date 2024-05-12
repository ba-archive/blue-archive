import asyncio
from typing import List, Optional, Any
from datetime import datetime

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from odmantic import AIOEngine, Model, ObjectId, Field, Reference

from app.db import get_engine


def datetime_now_sec():
    return datetime.now().replace(microsecond=0)


class User(Model):
    created: datetime = Field(default_factory=datetime_now_sec)
    updated: datetime = Field(default_factory=datetime_now_sec)
    name: str = Field()
    nickname: str = Field()
    email: EmailStr
    avatar: str = Field()
    hashed_password: str = Field()



mockUser = User(
    id=ObjectId(),
    name="isnotype",
    nickname="isnotype",
    email="notnotype@gmail.com",
    avatar="https://sdfsdf.dev/50x50.jpg",
    hashed_password="114514",
)

if __name__ == "__main__":
    async def main():
        engine = get_engine()
        await engine.save(mockUser)

    asyncio.run(main())
