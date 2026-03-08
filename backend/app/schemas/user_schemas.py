from pydantic import BaseModel, EmailStr, Field, field_validator

class UserCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=50, description= "User's full name")
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100, description="User's password")

    @field_validator('name')
    def validate_name(cls, value):
        if not value or value.isspace():
            raise ValueError('Name cannot be empty or just whitespace')
        return value.strip()
    
    @field_validator('password')
    def validate_password(cls, value):
        if not value or value.isspace():
            raise ValueError('Password cannot be empty')
        if ' ' in value:
            raise ValueError('Password cannot contain spaces')
        return value.strip()

class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=1, max_length=100, description="User's password")

class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr

    class Config:
        from_attribute = True

class Token(BaseModel):
    access_token: str
    token_type: str