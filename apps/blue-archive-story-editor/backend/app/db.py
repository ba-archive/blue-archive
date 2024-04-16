from odmantic import AIOEngine
from motor.motor_asyncio import AsyncIOMotorClient
from motor.core import AgnosticDatabase

mongodb_url = "mongodb+srv://notnotype:8LJKszsJXVuslRw8@cluster0.szlao7w.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
mongodb_database = 'plana_studio_backend'

class _MongoClientSingleton:
    mongo_client: AsyncIOMotorClient | None
    engine: AIOEngine

    def __new__(cls):
        if not hasattr(cls, "_instance"):
            cls._instance = super(_MongoClientSingleton, cls).__new__(cls)
            cls._instance.mongo_client = AsyncIOMotorClient(mongodb_url)
            cls._instance.engine = AIOEngine(
                client=cls._instance.mongo_client, database=mongodb_database
            )
        return cls._instance


def MongoDatabase() -> AgnosticDatabase:
    return _MongoClientSingleton().mongo_client[mongodb_database]


def get_engine() -> AIOEngine:
    return _MongoClientSingleton().engine


__all__ = ["MongoDatabase"]
