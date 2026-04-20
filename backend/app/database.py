from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

_db = None
_client = None

def connect_db():
    global _db, _client
    mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017/alertnest")
    try:
        _client = MongoClient(
            mongodb_url,
            serverSelectionTimeoutMS=10000,
            tls=True,
            tlsAllowInvalidCertificates=True,
        )
        _client.admin.command('ping')
        _db = _client.alertnest
        print("✅ Connected to MongoDB")
    except Exception as e:
        print(f"Failed to connect to MongoDB: {e}")
        print("WARNING: Running without database connection")
        _db = None

def close_db():
    global _client
    if _client:
        _client.close()
    print("MongoDB connection closed")

def get_db():
    return _db
