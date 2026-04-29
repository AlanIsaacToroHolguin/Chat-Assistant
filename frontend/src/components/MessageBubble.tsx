import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Copy, Check, Bot, User } from 'lucide-react'
import type { Message } from '../types'
import clsx from 'clsx'

interface MessageBubbleProps {
  message: Message
  isStreaming?: boolean
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
      title="Copy message"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  )
}

export default function MessageBubble({ message, isStreaming = false }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end px-4 py-2 group">
        <div className="flex items-end gap-2 max-w-[80%]">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={message.content} />
          </div>
          <div className="bg-blue-600 text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed">
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
            <User className="w-3.5 h-3.5 text-gray-300" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-3 px-4 py-4 group">
      <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Bot className="w-4 h-4 text-blue-400" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="prose prose-invert prose-sm max-w-none text-gray-100">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '')
                const codeString = String(children).replace(/\n$/, '')
                if (match) {
                  return (
                    <div className="relative group/code my-3">
                      <div className="flex items-center justify-between bg-gray-800 px-4 py-1.5 rounded-t-lg border border-gray-700 border-b-0">
                        <span className="text-xs text-gray-400 font-mono">{match[1]}</span>
                        <button
                          onClick={() => navigator.clipboard.writeText(codeString)}
                          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          borderRadius: '0 0 8px 8px',
                          border: '1px solid #374151',
                          borderTop: 'none',
                          fontSize: '13px',
                        }}
                        {...(props as any)}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  )
                }
                return (
                  <code
                    className="bg-gray-800 text-pink-400 rounded px-1.5 py-0.5 text-[13px] font-mono border border-gray-700"
                    {...props}
                  >
                    {children}
                  </code>
                )
              },
              pre({ children }) {
                return <>{children}</>
              },
              p({ children }) {
                return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>
              },
              ul({ children }) {
                return <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>
              },
              ol({ children }) {
                return <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
              },
              li({ children }) {
                return <li className="text-gray-200">{children}</li>
              },
              h1({ children }) {
                return <h1 className="text-xl font-bold text-white mb-3 mt-4">{children}</h1>
              },
              h2({ children }) {
                return <h2 className="text-lg font-semibold text-white mb-2 mt-4">{children}</h2>
              },
              h3({ children }) {
                return <h3 className="text-base font-semibold text-white mb-2 mt-3">{children}</h3>
              },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-4 border-blue-500 pl-4 my-3 text-gray-400 italic">
                    {children}
                  </blockquote>
                )
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-3">
                    <table className="min-w-full border border-gray-700 rounded-lg overflow-hidden text-sm">
                      {children}
                    </table>
                  </div>
                )
              },
              th({ children }) {
                return (
                  <th className="bg-gray-800 border border-gray-700 px-3 py-2 text-left font-semibold text-gray-200">
                    {children}
                  </th>
                )
              },
              td({ children }) {
                return (
                  <td className="border border-gray-700 px-3 py-2 text-gray-300">{children}</td>
                )
              },
              a({ href, children }) {
                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
                  >
                    {children}
                  </a>
                )
              },
              hr() {
                return <hr className="border-gray-700 my-4" />
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {isStreaming && (
          <span className="inline-block w-2 h-4 bg-blue-400 rounded-sm ml-0.5 animate-blink" />
        )}

        <div className="opacity-0 group-hover:opacity-100 transition-opacity mt-1">
          <CopyButton text={message.content} />
        </div>
      </div>
    </div>
  )
}
