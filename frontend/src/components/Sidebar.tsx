import { useState } from 'react'
import { Plus, Trash2, MessageSquare, LogOut, Pencil, Check, X } from 'lucide-react'
import { useConversations } from '../hooks/useConversations'
import { useAuth } from '../hooks/useAuth'
import clsx from 'clsx'

interface SidebarProps {
  onNewChat: () => void
  onSelectConversation: (id: string) => void
}

export default function Sidebar({ onNewChat, onSelectConversation }: SidebarProps) {
  const { conversations, activeConversationId, deleteConversation, renameConversation } =
    useConversations()
  const { user, logout } = useAuth()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')

  const startEdit = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation()
    setEditingId(id)
    setEditTitle(title)
  }

  const commitEdit = (id: string) => {
    if (editTitle.trim()) renameConversation(id, editTitle.trim())
    setEditingId(null)
  }

  const formatDate = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return new Date(dateStr).toLocaleDateString()
  }

  const grouped = conversations.reduce<Record<string, typeof conversations>>((acc, conv) => {
    const label = formatDate(conv.updated_at)
    if (!acc[label]) acc[label] = []
    acc[label].push(conv)
    return acc
  }, {})

  return (
    <div className="flex flex-col h-full bg-gray-900 border-r border-gray-800">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-800">
        <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
          <MessageSquare className="w-4 h-4 text-white" />
        </div>
        <span className="text-white font-semibold text-sm">Chat Assistant</span>
      </div>

      {/* New Chat */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-4">
        {conversations.length === 0 ? (
          <p className="text-gray-600 text-xs text-center py-8">No conversations yet</p>
        ) : (
          Object.entries(grouped).map(([label, convs]) => (
            <div key={label}>
              <p className="text-gray-600 text-xs font-medium px-2 mb-1">{label}</p>
              <div className="space-y-0.5">
                {convs.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => onSelectConversation(conv.id)}
                    className={clsx(
                      'group relative flex items-center gap-2 rounded-xl px-3 py-2.5 cursor-pointer transition-colors',
                      activeConversationId === conv.id
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-400 hover:bg-gray-800/60 hover:text-gray-200'
                    )}
                  >
                    {editingId === conv.id ? (
                      <div
                        className="flex-1 flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') commitEdit(conv.id)
                            if (e.key === 'Escape') setEditingId(null)
                          }}
                          autoFocus
                          className="flex-1 bg-gray-700 text-white text-xs rounded px-2 py-1 outline-none"
                        />
                        <button onClick={() => commitEdit(conv.id)} className="p-1 text-green-400">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditingId(null)} className="p-1 text-gray-400">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="flex-1 text-xs truncate">{conv.title}</span>
                        <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
                          <button
                            onClick={(e) => startEdit(e, conv.id, conv.title)}
                            className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-gray-300"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteConversation(conv.id)
                            }}
                            className="p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* User footer */}
      <div className="p-3 border-t border-gray-800">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold uppercase">
              {user?.username?.[0] ?? 'D'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.username ?? 'Demo User'}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            title="Logout"
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
