import json
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.dependencies import get_current_user
from app.schemas.message import ChatRequest
from app.services.ai_service import stream_ai_response

router = APIRouter()

SYSTEM_PROMPT = (
    "You are a helpful, knowledgeable, and friendly AI assistant. "
    "Provide clear, accurate, and well-structured responses. "
    "When writing code, use proper markdown code blocks with language identifiers. "
    "Be concise but thorough."
)


@router.post("/stream")
async def stream_chat(
    request: ChatRequest,
    current_user: dict = Depends(get_current_user),
):
    formatted = [{"role": "system", "content": SYSTEM_PROMPT}] + [
        {"role": m.role, "content": m.content} for m in request.messages
    ]

    async def generate():
        try:
            async for chunk in stream_ai_response(formatted):
                yield f"data: {json.dumps({'content': chunk})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as exc:
            yield f"data: {json.dumps({'error': str(exc)})}\n\n"
            yield "data: [DONE]\n\n"

    return StreamingResponse(
        generate(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
