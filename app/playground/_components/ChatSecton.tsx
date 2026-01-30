'use client'
import React, { useState, useRef, useEffect } from 'react'
import { Messages } from '../[projectId]/page'
import { Button } from '@/components/ui/button'
import { ArrowUp, Loader2 } from 'lucide-react'

type Props = {
  messages: Messages[]
  onSend: (input: string) => void 
  loading?: boolean
}

const ChatSection = ({ messages, onSend, loading = false }: Props) => {
  const [input, setInput] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input?.trim() || loading) return
    onSend(input)
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className='h-full flex flex-col bg-white'> {/* Changed: Added bg-white and h-full */}
      {/* Message section */}
      <div className='flex-1 min-h-0 overflow-y-auto p-4 space-y-3'> {/* Removed: flex flex-col */}
        {messages?.length === 0 ? (
          <div className='h-full flex items-center justify-center'>
            <p className='text-gray-500 text-center'>No messages yet. Start by describing your website design idea!</p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}
              >
                <div 
                  className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            
            {/* Loading indicator for AI response */}
            {loading && (
              <div className="flex justify-start mb-3">
                <div className="p-3 rounded-lg bg-gray-100 text-gray-900">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Invisible div for auto-scroll */}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      {/* Footer input */}
      <div className='p-3 border-t flex items-center gap-2 shrink-0 bg-white'> {/* Added: bg-white */}
        <textarea 
          value={input}
          placeholder='Describe your website design idea...'
          className='flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary min-h-[44px] max-h-[120px]'
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={loading}
          rows={1}
        />
        <Button 
          onClick={handleSend} 
          disabled={!input?.trim() || loading}
          className="min-w-[44px] h-[44px] shrink-0" 
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ArrowUp />
          )}
        </Button>
      </div>
    </div>
  )
}

export default ChatSection