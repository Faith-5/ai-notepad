from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine
from app.routes import auth_route, notes_route
from app.db import models

# Initialize FastAPI app
app = FastAPI(
    title="Ultra - AI Notepad",
    description="A simple AI-powered notepad application.",
)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Allow CORS from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.router.include_router(auth_route.router)
app.router.include_router(notes_route.router)

@app.get('/')
def root():
    return {"message": "API is running successfully."}

import uvicorn
if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=8000, reload=True)