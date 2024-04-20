from typing import Any, List

from fastapi import APIRouter, Body, Depends, HTTPException
from pydantic.networks import EmailStr
from odmantic import AIOEngine, ObjectId

from app.db import get_engine
from app.dependencies import dep_engine, dep_user
from app.models.story_works import StoryWork
from app.models.users import User
from app.schemas.story_works import StoryWorkCreate, StoryWorkSchema, StoryWorkUpdate


router = APIRouter()


@router.get("/story-works/", response_model=List[StoryWork])
async def get_story_works(*, engine: AIOEngine = Depends(dep_engine)):
    story_works = await engine.find(StoryWork)
    return story_works


@router.get("/story-works/my-works", response_model=List[StoryWork])
async def get_story_works_my_works(
    *,
    engine: AIOEngine = Depends(dep_engine),
    user: User = Depends(dep_user)

):
    story_works = await engine.find(StoryWork, StoryWork.author == user.id)
    return story_works


@router.get("/story-works/{id}", response_model=StoryWorkSchema)
async def get_story_works_by_id(*, id: ObjectId, engine: AIOEngine = Depends(dep_engine)):
    story_work = await engine.find_one(StoryWork, StoryWork.id == id)
    if story_work is None:
        raise HTTPException(404)
    return story_work


@router.post("/story-works/", response_model=StoryWorkSchema)
async def create_story_works(
    *,
    engine: AIOEngine = Depends(dep_engine),
    user: User = Depends(dep_user),
    story_work_create: StoryWorkCreate
):
    story_work = StoryWork(
        **story_work_create.model_dump(exclude_none=True),
        author=user,
    )
    return await engine.save(story_work)


@router.put("/story-works/{id}", response_model=StoryWorkSchema)
async def update_story_works(
    *,
    id: ObjectId,
    engine: AIOEngine = Depends(dep_engine),
    user: User = Depends(dep_user),
    story_work_update: StoryWorkUpdate
):
    story_work = await engine.find_one(StoryWork, StoryWork.id == id)
    if story_work is None:
        raise HTTPException(404)
    story_work.model_update(story_work_update)
    return await engine.save(story_work)


@router.delete("/story-works/{id}", response_model=StoryWorkSchema)
async def delete_story_works(
    *,
    id: ObjectId,
    engine: AIOEngine = Depends(dep_engine),
    user: User = Depends(dep_user),
):
    story_work = await engine.find_one(StoryWork, StoryWork.id == id)
    if story_work is None:
        raise HTTPException(404)
    await engine.delete(story_work)
    return story_work
