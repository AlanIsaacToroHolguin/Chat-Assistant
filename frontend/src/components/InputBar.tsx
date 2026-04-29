import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { Send, Square } from 'lucide-react'
import clsx from 'clsx'

interface InputBarProps {
  onSend: (content: string) => Promise<void>
  isStreaming: boolean
}

export default function InputBar({ onSend, isStreaming }: InputBarProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px'
  }, [value])

  const handleSend = async () => {
    const trimmed = value.trim()
    if (!trimmed || isStreaming) return
    setValue('')
    await onSend(trimmed)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="border-t border-gray-800 bg-gray-950 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end gap-3 bg-gray-900 border border-gray-700 rounded-2xl px-4 py-3 focus-within:border-blue-500/50 focus-within:ring-1 focus-within:ring-blue-500/20 transition-all">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Chat Assistant... (Shift+Enter for new line)"
            disabled={isStreaming}
            rows={1}
            className={clsx(
              'flex-1 bg-transparent text-white placeholder-gray-500 text-sm resize-none outline-none',
              'leading-relaxed min-h-[24px] max-h-[200px] overflow-y-auto',
              isStreaming && 'opacity-50 cursor-not-allowed'
            )}
            style={{ scrollbarWidth: 'none' }}
          />

          <button
            onClick={handleSend}
            disabled={(!value.trim() && !isStreaming) || (isStreaming)}
            className={clsx(
              'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all',
              value.trim() && !isStreaming
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : isStreaming
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
            )}
          >
            {isStreaming ? <Square className="w-3.5 h-3.5 fill-current" /> : <Send className="w-3.5 h-3.5" />}
          </button>
        </div>

        <p className="text-center text-gray-700 text-xs mt-2">
          AI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  )
}
