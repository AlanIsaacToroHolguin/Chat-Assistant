import { useCallback } from 'react'
import { useChatStore } from '../store'

export function useConversations() {
  const {
    conversations,
    activeConversationId,
    createConversation,
    deleteConversation,
    renameConversation,
    setActiveConversation,
  } = useChatStore()

  const handleCreate = useCallback(() => {
    return createConversation()
  }, [createConversation])

  const handleDelete = useCallback(
    (id: string) => deleteConversation(id),
    [deleteConversation]
  )

  const handleRename = useCallback(
    (id: string, title: string) => renameConversation(id, title),
    [renameConversation]
  )

  const handleSelect = useCallback(
    (id: string) => setActiveConversation(id),
    [setActiveConversation]
  )

  return {
    conversations,
    activeConversationId,
    createConversation: handleCreate,
    deleteConversation: handleDelete,
    renameConversation: handleRename,
    selectConversation: handleSelect,
  }
}
