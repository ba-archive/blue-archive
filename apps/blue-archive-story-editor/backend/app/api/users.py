from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from motor.core import AgnosticDatabase
from odmantic import AIOEngine, ObjectId

from app.db import get_engine
from app.dependencies import dep_engine, dep_user
from app.models.users import User


router = APIRouter()


@router.get("/users/whoami", response_model=User)
async def whoami(user: User = Depends(dep_user)):
    return user
