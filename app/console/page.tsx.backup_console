'use client'

import { useEffect, useRef, useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function IASeveroConsolePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'IASevero Console inicializado.\nDigite um comando para começar.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
        }),
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const data = await res.json()

      const reply =
        data.reply ||
        data.response ||
        data.output ||
        data.message ||
        'A IA respondeu, mas o payload veio em formato inesperado.'

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: String(reply) },
      ])
    } catch (error) {
      console.error('Erro ao chamar /api/chat:', error)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'Falha ao conectar com a IA no endpoint /api/chat. Verifique se a rota está ativa e se o payload de resposta está correto.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: '28px 20px 40px',
        background:
          'linear-gradient(180deg, rgba(5,10,30,0.98), rgba(3,6,18,1))',
        color: '#f5f7ff',
        fontFamily: 'Arial, Helvetica, sans-serif',
      }}
    >
      <section
        style={{
          maxWidth: 980,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            marginBottom: 22,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: '-1px',
              background: 'linear-gradient(90deg,#7bc6ff,#b36bff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            IASevero
            <br />
            Console
          </div>

          <div
            style={{
              marginTop: 14,
              fontSize: 22,
              color: 'rgba(255,255,255,.82)',
            }}
          >
            Neural Interface • Omega Core
          </div>
        </div>

        <div
          style={{
            borderRadius: 30,
            border: '1px solid rgba(255,255,255,.10)',
            background:
              'linear-gradient(180deg, rgba(5,10,26,.82), rgba(3,6,18,.92))',
            boxShadow:
              '0 20px 60px rgba(0,0,0,.35), inset 0 0 0 1px rgba(255,255,255,.03)',
            minHeight: 520,
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 14,
              flex: 1,
              overflowY: 'auto',
              paddingRight: 4,
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '86%',
                  padding: '16px 18px',
                  borderRadius: 20,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                  fontSize: 16,
                  background:
                    msg.role === 'user'
                      ? 'linear-gradient(90deg, rgba(110,130,255,.22), rgba(215,95,255,.20))'
                      : 'rgba(255,255,255,.04)',
                  border:
                    msg.role === 'user'
                      ? '1px solid rgba(180,180,255,.18)'
                      : '1px solid rgba(255,255,255,.06)',
                  color: 'rgba(255,255,255,.95)',
                }}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  maxWidth: '86%',
                  padding: '16px 18px',
                  borderRadius: 20,
                  background: 'rgba(255,255,255,.04)',
                  border: '1px solid rgba(255,255,255,.06)',
                  color: 'rgba(255,255,255,.72)',
                }}
              >
                IASevero está processando...
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto',
              gap: 14,
              marginTop: 8,
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite seu comando ou mensagem..."
              disabled={loading}
              style={{
                width: '100%',
                padding: '20px 24px',
                borderRadius: 22,
                border: '1px solid rgba(255,255,255,.10)',
                background: 'rgba(10,16,34,.92)',
                color: '#ffffff',
                outline: 'none',
                fontSize: 18,
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.04)',
              }}
            />

            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                padding: '0 24px',
                minWidth: 120,
                borderRadius: 22,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 18,
                fontWeight: 800,
                color: '#fff',
                background:
                  'linear-gradient(90deg, rgba(109,124,255,1), rgba(222,93,196,1))',
                boxShadow: '0 8px 22px rgba(120,120,255,0.18)',
                opacity: loading || !input.trim() ? 0.6 : 1,
              }}
            >
              {loading ? '...' : 'Enviar'}
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
