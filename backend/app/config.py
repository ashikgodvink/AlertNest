import os
from dotenv import load_dotenv

load_dotenv()

# Firebase is used for auth and database — no JWT or MongoDB needed
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "")
