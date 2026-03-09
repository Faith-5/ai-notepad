from app.services import notes_service
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.schemas.note_schemas import NoteCreate, NoteUpdate, Note
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List

security = HTTPBearer()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

router = APIRouter(prefix="/notes", tags=["notes"])

@router.post("/", response_model=Note)
def create_note(note: NoteCreate, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    pass

@router.get("/", response_model=List[Note])
def get_notes(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    pass

@router.get("/{note_id}", response_model=Note)
def get_note(note_id: str, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    pass

@router.put("/{note_id}", response_model=Note)
def update_note(note_id: str, note: NoteUpdate, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    pass

@router.delete("/{note_id}")
def delete_note(note_id: str, credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
    pass