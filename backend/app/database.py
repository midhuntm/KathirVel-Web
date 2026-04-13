import os

from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()


def get_database():
    mongo_uri = os.getenv("MONGODB_URI", "mongodb://127.0.0.1:27017")
    database_name = os.getenv("MONGODB_DB_NAME", "KathirVel")

    client = MongoClient(mongo_uri)
    return client[database_name]
