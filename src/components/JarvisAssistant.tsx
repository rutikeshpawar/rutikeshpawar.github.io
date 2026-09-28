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
        className={`fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 rounded-full transition-all ${
          !recruiterMode && !prefersReducedMotion && !isOpen ? 'jarvis-orb' : ''
        } ${isOpen ? 'jarvis-orb-close' : ''} ${recruiterMode ? 'jarvis-recruiter-mode' : ''}`}
        aria-label={isOpen ? 'Close Jarvis Assistant' : 'Open Jarvis Assistant'}
        style={
          !recruiterMode && !prefersReducedMotion && !isOpen
            ? {
                background: 'radial-gradient(circle at 30% 30%, rgba(34, 211, 238, 0.8), rgba(6, 182, 212, 0.6), rgba(139, 92, 246, 0.4))',
                boxShadow: '0 0 30px rgba(34, 211, 238, 0.6), 0 0 60px rgba(139, 92, 246, 0.3), inset 0 0 20px rgba(255, 255, 255, 0.2)',
              }
            : {
                background: 'radial-gradient(circle at 30% 30%, rgba(34, 211, 238, 0.9), rgba(6, 182, 212, 0.7))',
                boxShadow: '0 4px 20px rgba(34, 211, 238, 0.4)',
              }
        }
      >
        {!isOpen && !recruiterMode && !prefersReducedMotion && (
          <>
            {/* Rotating Ring 1 */}
            <div
              className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
              style={{
                animation: 'jarvis-rotate-ring-1 8s linear infinite',
                transformStyle: 'preserve-3d',
              }}
            />
            {/* Rotating Ring 2 */}
            <div
              className="absolute inset-0 rounded-full border-2 border-violet-400/30"
              style={{
                animation: 'jarvis-rotate-ring-2 6s linear infinite',
                transformStyle: 'preserve-3d',
              }}
            />
          </>
        )}
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6 text-white" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-[calc(100vw-2rem)] md:w-96 max-h-[500px] rounded-2xl overflow-hidden ${
            !recruiterMode && !prefersReducedMotion ? 'jarvis-panel-animate' : ''
          } ${recruiterMode ? 'jarvis-recruiter-mode' : ''}`}
          style={{
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.5), rgba(139, 92, 246, 0.5))',
            padding: '1px',
            boxShadow: '0 0 40px rgba(34, 211, 238, 0.2), 0 0 80px rgba(139, 92, 246, 0.1)',
            transformOrigin: 'bottom right',
          }}
        >
          <div
            className="rounded-2xl flex flex-col overflow-hidden"
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(20px)',
              boxShadow: 'inset 0 0 20px rgba(34, 211, 238, 0.05)',
            }}
          >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 border-b"
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(34, 211, 238, 0.2)',
            }}
          >
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold text-white">Jarvis</span>
              {!recruiterMode && !prefersReducedMotion && (
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full bg-cyan-400"
                    style={{ animation: 'jarvis-pulse-dot 2s ease-in-out infinite' }}
                  />
                  <span className="text-xs text-cyan-400">Online</span>
                </div>
              )}
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
                    className="text-xs bg-slate-700/50 text-cyan-400 px-3 py-1.5 rounded-full hover:bg-slate-600/50 hover:text-cyan-300 transition-all border border-slate-600/50 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/20"
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
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} ${
                  !recruiterMode && !prefersReducedMotion ? 'message-animate' : ''
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'text-slate-950'
                      : 'text-slate-200 border border-slate-600/50'
                  }`}
                  style={
                    message.role === 'user'
                      ? {
                          background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.9), rgba(6, 182, 212, 0.8))',
                          boxShadow: '0 4px 15px rgba(34, 211, 238, 0.3)',
                        }
                      : {
                          background: 'rgba(30, 41, 59, 0.8)',
                          backdropFilter: 'blur(10px)',
                        }
                  }
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
                <div
                  className="rounded-lg p-3"
                  style={{
                    background: 'rgba(30, 41, 59, 0.8)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(100, 116, 139, 0.3)',
                  }}
                >
                  <div className="flex gap-1">
                    <div
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      style={{ animation: prefersReducedMotion ? 'none' : 'jarvis-pulse-dot 1.4s ease-in-out infinite', animationDelay: '0ms' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      style={{ animation: prefersReducedMotion ? 'none' : 'jarvis-pulse-dot 1.4s ease-in-out infinite', animationDelay: '200ms' }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-cyan-400"
                      style={{ animation: prefersReducedMotion ? 'none' : 'jarvis-pulse-dot 1.4s ease-in-out infinite', animationDelay: '400ms' }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Rate Limit Indicator */}
          <div
            className="px-4 py-2 border-t"
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(34, 211, 238, 0.2)',
            }}
          >
            <p className="text-xs text-slate-400 text-center">
              {remaining} questions left today
            </p>
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-4 border-t"
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(34, 211, 238, 0.2)',
            }}
          >
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 bg-slate-700/50 text-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder-slate-400 border border-slate-600/50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-cyan-500 text-white rounded-lg px-4 py-2 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
      )}
    </>
  )
}
