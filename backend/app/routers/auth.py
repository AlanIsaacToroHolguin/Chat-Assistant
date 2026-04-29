from fastapi import APIRouter, HTTPException, status
from app.schemas.auth import UserLogin, TokenWithUser, UserResponse
from app.utils.jwt import create_access_token
from app.config import settings

router = APIRouter()

DEMO_USER = UserResponse(id=1, email=settings.DEMO_EMAIL, username=settings.DEMO_USERNAME)


@router.post("/login", response_model=TokenWithUser)
def login(data: UserLogin):
    if data.email != settings.DEMO_EMAIL or data.password != settings.DEMO_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )
    token = create_access_token({
        "sub": "1",
        "email": settings.DEMO_EMAIL,
        "username": settings.DEMO_USERNAME,
    })
    return {"access_token": token, "token_type": "bearer", "user": DEMO_USER}


@router.get("/me", response_model=UserResponse)
def get_me():
    return DEMO_USER


@router.get("/demo-credentials")
def demo_credentials():
    return {"email": settings.DEMO_EMAIL, "password": settings.DEMO_PASSWORD}
