import firebase_admin
from firebase_admin import credentials, firestore
import os

_db = None

def connect_db():
    global _db
    cred_path = os.path.join(os.path.dirname(__file__), '..', 'firebase-service-account.json')
    cred = credentials.Certificate(os.path.abspath(cred_path))
    firebase_admin.initialize_app(cred)
    _db = firestore.client()
    print("Connected to Firestore")

def close_db():
    print("Firestore connection closed")

def get_db():
    return _db
