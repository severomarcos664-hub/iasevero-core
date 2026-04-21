"use client";
import { useState } from "react";

export default function Console() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.reply || data.response || data.text || "Sem resposta",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Erro ao conectar IA" },
      ]);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #08203e 0%, #050816 45%, #120a2a 100%)",
        color: "#f5f7ff",
        padding: "24px 16px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <h1
          style={{
            margin: 0,
            fontSize: "48px",
            lineHeight: 1,
            background: "linear-gradient(90deg, #7c3aed, #ec4899)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          IASevero Console
        </h1>

        <p
          style={{
            marginTop: 12,
            marginBottom: 24,
            color: "#cbd5e1",
            fontSize: 22,
          }}
        >
          Neural Interface • Omega Core
        </p>

        <div
          style={{
            background: "rgba(2, 6, 23, 0.75)",
            border: "1px solid rgba(148, 163, 184, 0.18)",
            borderRadius: 24,
            padding: 20,
            minHeight: 360,
            boxShadow: "0 20px 50px rgba(0,0,0,0.35)",
            marginBottom: 20,
          }}
        >
          {messages.length === 0 ? (
            <div style={{ color: "#cbd5e1", fontSize: 22, lineHeight: 1.8 }}>
              <div>IASevero Console inicializado.</div>
              <div>Digite um comando para começar.</div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} style={{ marginBottom: 18, fontSize: 24, lineHeight: 1.6 }}>
                <span
                  style={{
                    fontWeight: 700,
                    color: m.role === "user" ? "#93c5fd" : "#f9a8d4",
                  }}
                >
                  {m.role === "user" ? "Você" : "IASevero"}:
                </span>{" "}
                <span style={{ color: "#f8fafc" }}>{m.text}</span>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            style={{
              flex: 1,
              height: 58,
              borderRadius: 16,
              border: "1px solid rgba(148, 163, 184, 0.22)",
              background: "rgba(15, 23, 42, 0.9)",
              color: "#f8fafc",
              padding: "0 18px",
              fontSize: 22,
              outline: "none",
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              height: 58,
              padding: "0 26px",
              borderRadius: 16,
              border: "none",
              cursor: "pointer",
              fontWeight: 700,
              fontSize: 22,
              color: "#ffffff",
              background: "linear-gradient(90deg, #7c3aed, #ec4899)",
            }}
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
