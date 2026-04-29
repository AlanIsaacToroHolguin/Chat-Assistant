import { useCallback } from 'react'
import { useChatStore, useAuthStore } from '../store'
import { API_URL } from '../api/axios'

export function useChat() {
  const {
    activeConversationId,
    isStreaming,
    streamingContent,
    getActiveMessages,
    addUserMessage,
    setIsStreaming,
    clearStreamingContent,
    appendStreamingContent,
    commitStreamingMessage,
    autoTitle,
  } = useChatStore()

  const token = useAuthStore((s) => s.token)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeConversationId || isStreaming || !content.trim()) return

      const trimmed = content.trim()
      const existingMessages = getActiveMessages()
      const isFirst = existingMessages.length === 0

      addUserMessage(activeConversationId, trimmed)
      if (isFirst) autoTitle(activeConversationId, trimmed)

      setIsStreaming(true)
      clearStreamingContent()

      const allMessages = [
        ...existingMessages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: trimmed },
      ]

      try {
        const response = await fetch(`${API_URL}/api/chat/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ messages: allMessages }),
        })

        if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`)

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (raw === '[DONE]') {
              commitStreamingMessage(activeConversationId)
              return
            }
            try {
              const parsed = JSON.parse(raw)
              if (parsed.content) appendStreamingContent(parsed.content)
            } catch {
              // ignore partial JSON
            }
          }
        }

        commitStreamingMessage(activeConversationId)
      } catch (err) {
        console.error('Stream error:', err)
        setIsStreaming(false)
      }
    },
    [
      activeConversationId,
      isStreaming,
      token,
      getActiveMessages,
      addUserMessage,
      autoTitle,
      setIsStreaming,
      clearStreamingContent,
      appendStreamingContent,
      commitStreamingMessage,
    ]
  )

  return { sendMessage, isStreaming, streamingContent, activeConversationId }
}
