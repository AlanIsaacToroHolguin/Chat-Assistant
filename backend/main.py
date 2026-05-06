from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import auth, chat

app = FastAPI(
    title="Chat Assistant API",
    description="AI Chat Assistant with streaming responses and JWT authentication",
    version="1.0.0",
)

origins = [o.strip() for o in settings.ALLOWED_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])


@app.get("/", tags=["Health"])
def root():
    return {"message": "Chat Assistant API", "version": "1.0.0", "status": "running"}


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy"}
