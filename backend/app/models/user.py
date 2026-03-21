from pydantic import BaseModel, EmailStr
from typing import Optional
from enum import Enum

class Role(str, Enum):
    student = "student"
    staff = "staff"
    admin = "admin"

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: Role = Role.student

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str
    name: str
    email: str
    role: str
