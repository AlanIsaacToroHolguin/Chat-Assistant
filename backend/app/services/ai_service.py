from typing import AsyncGenerator, List
from app.config import settings


async def stream_ai_response(messages: List[dict]) -> AsyncGenerator[str, None]:
    if settings.AI_PROVIDER == "openai":
        async for chunk in _stream_openai(messages):
            yield chunk
    else:
        async for chunk in _stream_groq(messages):
            yield chunk


async def _stream_groq(messages: List[dict]) -> AsyncGenerator[str, None]:
    from groq import AsyncGroq

    client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    stream = await client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=messages,
        stream=True,
        max_tokens=4096,
        temperature=0.7,
    )
    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content


async def _stream_openai(messages: List[dict]) -> AsyncGenerator[str, None]:
    from openai import AsyncOpenAI

    client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
    stream = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=messages,
        stream=True,
        max_tokens=4096,
        temperature=0.7,
    )
    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            yield content
