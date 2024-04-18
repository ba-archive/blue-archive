import os
from fastapi import APIRouter
from loguru import logger
from pathlib import Path

# auto register services
def include_router(package: str):
    _router = APIRouter()

    package_path = package.replace(".", "/")
    for each in os.listdir(package_path):
        if each.endswith(".py") and each != "__init__.py":
            import_name = f"{package}.{each[:-3]}"
            logger.info(f"load router from {import_name}")
            _router.include_router(__import__(import_name, fromlist=["router"]).router)
        elif all([
            os.path.isdir(f"{package_path}/{each}"),
            os.path.exists(f"{package_path}/{each}/__init__.py")  # sub module
        ]):
            logger.info(f"load sub module from {package}.{each}")
            _router.include_router(include_router(f"{package_path}/{each}"))
    return _router


router = include_router("app.api")
router.prefix = "/api"

__all__ = ["router"]
