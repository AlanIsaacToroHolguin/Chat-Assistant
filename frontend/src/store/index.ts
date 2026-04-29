import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, Conversation, Message } from '../types'

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

interface ChatStore {
  conversations: Conversation[]
  activeConversationId: string | null
  isStreaming: boolean
  streamingContent: string

  createConversation: () => Conversation
  deleteConversation: (id: string) => void
  renameConversation: (id: string, title: string) => void
  setActiveConversation: (id: string | null) => void
  getActiveMessages: () => Message[]

  addUserMessage: (conversationId: string, content: string) => Message
  appendStreamingContent: (chunk: string) => void
  commitStreamingMessage: (conversationId: string) => void
  setIsStreaming: (v: boolean) => void
  clearStreamingContent: () => void
  autoTitle: (conversationId: string, firstMessage: string) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('token', token)
        set({ user, token, isAuthenticated: true })
      },
      clearAuth: () => {
        localStorage.removeItem('token')
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    { name: 'auth-storage' }
  )
)

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      activeConversationId: null,
      isStreaming: false,
      streamingContent: '',

      createConversation: () => {
        const conv: Conversation = {
          id: uid(),
          title: 'New Chat',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          messages: [],
        }
        set((s) => ({ conversations: [conv, ...s.conversations], activeConversationId: conv.id }))
        return conv
      },

      deleteConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
          activeConversationId: s.activeConversationId === id ? null : s.activeConversationId,
        })),

      renameConversation: (id, title) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, title, updated_at: new Date().toISOString() } : c
          ),
        })),

      setActiveConversation: (id) =>
        set({ activeConversationId: id, streamingContent: '' }),

      getActiveMessages: () => {
        const { conversations, activeConversationId } = get()
        return conversations.find((c) => c.id === activeConversationId)?.messages ?? []
      },

      addUserMessage: (conversationId, content) => {
        const msg: Message = {
          id: uid(),
          role: 'user',
          content,
          created_at: new Date().toISOString(),
        }
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, msg], updated_at: new Date().toISOString() }
              : c
          ),
        }))
        return msg
      },

      appendStreamingContent: (chunk) =>
        set((s) => ({ streamingContent: s.streamingContent + chunk })),

      commitStreamingMessage: (conversationId) => {
        const { streamingContent } = get()
        if (!streamingContent) return
        const msg: Message = {
          id: uid(),
          role: 'assistant',
          content: streamingContent,
          created_at: new Date().toISOString(),
        }
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId
              ? { ...c, messages: [...c.messages, msg], updated_at: new Date().toISOString() }
              : c
          ),
          streamingContent: '',
          isStreaming: false,
        }))
      },

      setIsStreaming: (isStreaming) => set({ isStreaming }),
      clearStreamingContent: () => set({ streamingContent: '' }),

      autoTitle: (conversationId, firstMessage) => {
        const title = firstMessage.slice(0, 50) + (firstMessage.length > 50 ? '...' : '')
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === conversationId && c.title === 'New Chat' ? { ...c, title } : c
          ),
        }))
      },
    }),
    { name: 'chat-storage' }
  )
)
