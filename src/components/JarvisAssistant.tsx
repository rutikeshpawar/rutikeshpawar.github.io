import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import { X, Send } from 'lucide-react'
import { AssistantOrb } from './AssistantOrb'

const ASSISTANT_NAME = 'Ask Rutikesh'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface JarvisAssistantProps {
  recruiterMode: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function JarvisAssistant({ recruiterMode, onOpenChange }: JarvisAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [remaining, setRemaining] = useState(10)
  const [typingIndex, setTypingIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const [hasWelcomed, setHasWelcomed] = useState(false)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const shouldAutoScrollRef = useRef(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showLatest, setShowLatest] = useState(false)

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const updateOpen = useCallback((open: boolean) => {
    setIsOpen(open)
    onOpenChange(open)
  }, [onOpenChange])

  const suggestedQuestions = [
    "What are your top AI projects?",
    "What skills do you have?",
    "Tell me about your experience",
    "Are you open to work?",
    "How can I contact you?",
  ]

  useLayoutEffect(() => {
    const messagesContainer = messagesContainerRef.current
    if (messagesContainer && shouldAutoScrollRef.current) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight
      setShowLatest(false)
    }
  }, [messages, typingIndex, isLoading])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        updateOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, updateOpen])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    // Add welcome message when panel first opens
    if (isOpen && !hasWelcomed && messages.length === 0) {
      setMessages([{ role: 'assistant', content: 'Hi! I\'m Rutikesh\'s AI assistant. Ask me about his projects, skills, experience, education or how to contact him.' }])
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
        type="button"
        onClick={() => updateOpen(!isOpen)}
        className={`assistant-launcher fixed z-50 flex items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950${isOpen ? ' assistant-launcher--open' : ''}`}
        aria-label={isOpen ? `Close ${ASSISTANT_NAME}` : `Open ${ASSISTANT_NAME}`}
        aria-expanded={isOpen}
        aria-controls="assistant-chat-panel"
      >
        <AssistantOrb
          isOpen={isOpen}
          isThinking={isLoading}
          recruiterMode={recruiterMode}
          prefersReducedMotion={prefersReducedMotion}
        />
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          id="assistant-chat-panel"
          className={`assistant-panel fixed z-50 flex flex-col w-[calc(100vw-2rem)] md:w-96 rounded-2xl overflow-hidden ${
            !recruiterMode && !prefersReducedMotion ? 'jarvis-panel-animate' : ''
          } ${recruiterMode ? 'jarvis-recruiter-mode' : ''}`}
          style={{
            height: 'min(34rem, calc(100dvh - 7rem))',
            background: 'linear-gradient(135deg, rgba(34, 211, 238, 0.5), rgba(139, 92, 246, 0.5))',
            padding: '1px',
            boxShadow: '0 0 40px rgba(34, 211, 238, 0.2), 0 0 80px rgba(139, 92, 246, 0.1)',
            transformOrigin: 'bottom right',
          }}
        >
          <div
            className="assistant-panel__inner flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl"
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(20px)',
              boxShadow: 'inset 0 0 20px rgba(34, 211, 238, 0.05)',
            }}
          >
          {/* Header */}
          <div
            className="flex shrink-0 items-center justify-between p-4 border-b"
            style={{
              background: 'rgba(15, 23, 42, 0.9)',
              borderColor: 'rgba(34, 211, 238, 0.2)',
            }}
          >
            <div className="flex items-center gap-2">
              <AssistantOrb
                isOpen={isOpen}
                isThinking={isLoading}
                recruiterMode={recruiterMode}
                prefersReducedMotion={prefersReducedMotion}
                compact
              />
              <div className="flex flex-col">
                <span className="font-semibold leading-tight text-white">{ASSISTANT_NAME}</span>
                <span className="text-xs leading-tight text-cyan-400">AI assistant</span>
              </div>
            </div>
            <button
              onClick={() => updateOpen(false)}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label={`Close ${ASSISTANT_NAME}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="assistant-messages relative min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 space-y-4"
            onScroll={(event) => {
              const element = event.currentTarget
              const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight <= 24
              shouldAutoScrollRef.current = atBottom
              setShowLatest(!atBottom)
            }}
          >
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

            {showLatest && (
              <button
                type="button"
                onClick={() => {
                  shouldAutoScrollRef.current = true
                  const element = messagesContainerRef.current
                  if (element) element.scrollTop = element.scrollHeight
                  setShowLatest(false)
                }}
                className="assistant-latest absolute bottom-3 right-3 rounded-full border border-cyan-400/40 bg-slate-900/95 px-3 py-1.5 text-xs font-medium text-cyan-300 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                Latest
              </button>
            )}
          </div>

          {/* Rate Limit Indicator */}
          <div
            className="shrink-0 px-4 py-2 border-t"
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
            className="shrink-0 p-4 border-t"
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
                aria-label={`Message ${ASSISTANT_NAME}`}
                className="assistant-input flex-1 bg-slate-700/50 text-white rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-cyan-500/50 placeholder-slate-400 border border-slate-600/50"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-cyan-500 text-white rounded-lg px-4 py-2 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                aria-label={`Send message to ${ASSISTANT_NAME}`}
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
