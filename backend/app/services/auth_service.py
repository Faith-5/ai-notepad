from app.db import models
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.schemas.user_schemas import UserCreate, UserLogin, Token
from app.core.security import hash_pwd, verify_pwd, create_access_token

def register_user(db: Session, user: UserCreate):
    # Confirm if email has once been registered
    existing_user = db.query(models.Users).filter(models.Users.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    # Hash password
    hashed_password = hash_pwd(user.password)

    # Create User object
    new_user = models.Users(name=user.name, email=user.email, hashed_password=hashed_password)

    # Save to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {'message': 'User registered successfully'}

def login_user(db: Session, user: UserLogin) -> Token:
    # Fetch user by email
    db_user = db.query(models.Users).filter(models.Users.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    # Verify password
    if not verify_pwd(user.password, db_user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    # Create JWT token
    access_token = create_access_token(data={"user_id": str(db_user.id)})
    
    return Token(access_token=access_token, token_type="bearer")