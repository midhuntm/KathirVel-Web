import os
from functools import lru_cache

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()


@lru_cache(maxsize=1)
def _get_client():
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017")
    return MongoClient(
        mongo_uri,
        maxPoolSize=20,
        minPoolSize=2,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        socketTimeoutMS=10000,
        appname="kathirvel-api",
    )


@lru_cache(maxsize=1)
def _get_db():
    database_name = os.getenv("MONGODB_DB_NAME", "KathirVel")
    client = _get_client()
    return client[database_name]


def get_database():
    return _get_db()
