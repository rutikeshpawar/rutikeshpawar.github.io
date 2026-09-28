import { useState, useEffect, useRef } from 'react'
import { X, Send, Bot } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface JarvisAssistantProps {
  recruiterMode: boolean
}

export function JarvisAssistant({ recruiterMode }: JarvisAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [remaining, setRemaining] = useState(10)
  const [typingIndex, setTypingIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [hasWelcomed, setHasWelcomed] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const suggestedQuestions = [
    "What are your top AI projects?",
    "What skills do you have?",
    "Tell me about your experience",
    "Are you open to work?",
    "How can I contact you?",
  ]

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' })
    }
  }, [messages, typingIndex, prefersReducedMotion])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    // Add welcome message when panel first opens
    if (isOpen && !hasWelcomed && messages.length === 0) {
      setMessages([{ role: 'assistant', content: 'Hi! I\'m Jarvis, Rutikesh\'s AI assistant. I can tell you about his projects, skills, and experience based on his portfolio data.' }])
      setHasWelcomed(true)
    }
  }, [isOpen, hasWelcomed, messages.length])

  useEffect(() => {
    // Typing effect for assistant messages
    if (isTyping && typingIndex < messages[messages.length - 1]?.content.length) {
      const timer = setTimeout(() => {
        setTypingIndex(typingIndex + 1)
      }, prefersReducedMotion ? 0 : 20)
      return () => clearTimeout(timer)
    } else if (isTyping) {
      setIsTyping(false)
      setTypingIndex(0)
    }
  }, [isTyping, typingIndex, messages, prefersReducedMotion])

  const sendQuestion = async (question: string) => {
    if (!question.trim() || isLoading) return

    const userMessage = question.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage }),
      })

      const data = await response.json()

      if (response.ok) {
        // Strip markdown symbols from response
        const cleanResponse = data.response.replace(/\*\*/g, '').replace(/#{1,6}\s/g, '')
        setMessages(prev => [...prev, { role: 'assistant', content: cleanResponse }])
        setRemaining(data.remaining)
        setIsTyping(true)
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Sorry, something went wrong.' }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendQuestion(input)
  }

  const getCurrentAssistantMessage = () => {
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'assistant' && isTyping) {
      return lastMessage.content.substring(0, typingIndex)
    }
    return ''
  }

  return (
    <>
      {/* Floating Orb Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-cyan-500 text-white shadow-lg hover:bg-cyan-400 transition-all ${
          !recruiterMode && !prefersReducedMotion ? 'animate-pulse-ring' : ''
        }`}
        aria-label={isOpen ? 'Close Jarvis Assistant' : 'Open Jarvis Assistant'}
        style={{
          boxShadow: '0 4px 20px rgba(34, 211, 238, 0.4)',
        }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 max-h-[500px] bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold text-white">Jarvis</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Suggested Questions - shown when empty (after welcome) */}
            {messages.length === 1 && messages[0].role === 'assistant' && (
              <div className="flex flex-wrap gap-2 mb-4">
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => sendQuestion(question)}
                    className="text-xs bg-slate-700 text-cyan-400 px-3 py-1.5 rounded-full hover:bg-slate-600 hover:text-cyan-300 transition-colors border border-slate-600 hover:border-cyan-500/50"
                    disabled={isLoading}
                    aria-label={`Ask: ${question}`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {message.role === 'assistant' && index === messages.length - 1 && isTyping ? (
                    <span>{getCurrentAssistantMessage()}</span>
                  ) : (
                    <span className="text-sm whitespace-pre-wrap">{message.content}</span>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 rounded-lg p-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Rate Limit Indicator */}
          <div className="px-4 py-2 bg-slate-800 border-t border-slate-700">
            <p className="text-xs text-slate-400 text-center">
              {remaining} questions left today
            </p>
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700 bg-slate-800">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-700 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-slate-400"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-cyan-500 text-white rounded-lg px-4 py-2 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  )
}
