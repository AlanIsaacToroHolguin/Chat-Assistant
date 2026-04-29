import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'
import SkeletonLoader from './SkeletonLoader'
import { useChatStore } from '../store'
import type { Message } from '../types'

interface ChatWindowProps {
  messages: Message[]
}

export default function ChatWindow({ messages }: ChatWindowProps) {
  const isStreaming = useChatStore((s) => s.isStreaming)
  const streamingContent = useChatStore((s) => s.streamingContent)
  const activeConversationId = useChatStore((s) => s.activeConversationId)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, streamingContent])

  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center overflow-y-auto">
        <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-1">How can I help you?</h3>
          <p className="text-gray-500 text-sm">Ask me anything — I'm here to help.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md mt-2">
          {[
            'Explain quantum computing',
            'Write a Python function',
            'Help me debug my code',
            'Summarize a concept',
          ].map((s) => (
            <div
              key={s}
              className="bg-gray-800/50 border border-gray-700/50 rounded-xl px-3 py-2.5 text-gray-400 text-xs"
            >
              {s}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto py-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isStreaming && streamingContent && (
          <MessageBubble
            message={{
              id: '__streaming__',
              role: 'assistant',
              content: streamingContent,
              created_at: new Date().toISOString(),
            }}
            isStreaming
          />
        )}

        {isStreaming && !streamingContent && <SkeletonLoader />}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}
