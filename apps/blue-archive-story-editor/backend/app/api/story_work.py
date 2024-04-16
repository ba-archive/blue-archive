from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic.networks import EmailStr
from motor.core import AgnosticDatabase
from odmantic import AIOEngine, ObjectId

from app.db import get_engine
from app.dependencies import dep_db
from app.model import StoryWork


router = APIRouter()


@router.get("/story-works/", response_model=List[StoryWork])
async def get_story_works(engine: AIOEngine = Depends(dep_db)):
    story_works = await engine.find(StoryWork)
    return story_works


@router.get("/story-works/{id}")
async def get_story_works_by_id(id: ObjectId, engine: AIOEngine = Depends(dep_db)):
    story_work = await engine.find_one(StoryWork, StoryWork.id == id)
    if story_work is None:
        raise HTTPException(404)
    return story_work


@router.post("/story-works/")
async def create_story_works(engine: AIOEngine = Depends(dep_db)):
    ...


@router.put("/story-works/")
async def update_story_works(engine: AIOEngine = Depends(dep_db)):
    ...


@router.delete("/story-works/{id}")
async def delete_story_works(id: ObjectId, engine: AIOEngine = Depends(dep_db)):
    ...
