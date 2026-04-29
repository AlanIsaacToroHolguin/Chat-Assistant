import { useState } from 'react'
import { Menu } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import ChatWindow from '../components/ChatWindow'
import InputBar from '../components/InputBar'
import { useConversations } from '../hooks/useConversations'
import { useChat } from '../hooks/useChat'
import { useChatStore } from '../store'

export default function Chat() {
  const { createConversation, selectConversation } = useConversations()
  const { sendMessage, isStreaming } = useChat()
  const activeConversationId = useChatStore((s) => s.activeConversationId)
  const messages = useChatStore((s) => s.getActiveMessages())
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleNewChat = () => {
    createConversation()
    setSidebarOpen(false)
  }

  const handleSelect = (id: string) => {
    selectConversation(id)
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          fixed lg:relative inset-y-0 left-0 z-30 w-72 lg:w-64 flex-shrink-0
          transform transition-transform duration-200 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <Sidebar onNewChat={handleNewChat} onSelectConversation={handleSelect} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 p-4 border-b border-gray-800 lg:hidden bg-gray-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white font-medium text-sm">Chat Assistant</span>
        </div>

        {activeConversationId ? (
          <>
            <ChatWindow messages={messages} />
            <InputBar onSend={sendMessage} isStreaming={isStreaming} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white mb-2">Start a conversation</h2>
              <p className="text-gray-500 text-sm max-w-xs">
                Create a new chat from the sidebar or click below to get started.
              </p>
            </div>
            <button
              onClick={handleNewChat}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-medium transition-colors text-sm"
            >
              New Chat
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
