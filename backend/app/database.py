from motor.motor_asyncio import AsyncIOMotorClient
from app.config import MONGODB_URL

client: AsyncIOMotorClient = None

async def connect_db():
    global client
    client = AsyncIOMotorClient(MONGODB_URL)
    print("Connected to MongoDB")

async def close_db():
    global client
    if client:
        client.close()
        print("MongoDB connection closed")

def get_db():
    return client["alertnest"]
