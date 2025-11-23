from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    userid: str
    password: str = Field(min_length=6, max_length=72)


class UserLogin(BaseModel):
    userid: str
    password: str = Field(max_length=72)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    userid: str
    message: str
