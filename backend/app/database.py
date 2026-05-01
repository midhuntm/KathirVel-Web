import os
from functools import lru_cache

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()


@lru_cache(maxsize=1)
def _get_client():
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017")
    return MongoClient(mongo_uri)


def get_database():
    database_name = os.getenv("MONGODB_DB_NAME", "KathirVel")
    client = _get_client()
    return client[database_name]
