import React, { useEffect, useState } from "react";
import axios from "axios";



export default function Geminimodal()  {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  //const user = JSON.parse(localStorage.getItem("user") || "{}");

  const API_URL = "http://localhost:5000/api";

  // 🎨 Couleurs personnalisées
  const roleColors = {
    user: { primary: "bg-blue-600", hover: "hover:bg-blue-700", userBubble: "bg-blue-100", botBubble: "bg-white" },
  };
  const colors =  roleColors.user;

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      

      const res = await axios.post(`${API_URL}/chat`, {
        message: input,
        //role,
      });

      const reply = res.data.reply;
      const botMessage = { role: "assistant", content: reply };
      setMessages((prev) => [...prev, botMessage]);

     

    } catch (err) {
      console.error("Erreur chatbot :", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      {/* 🔘 Bouton flottant */}
      <button
        className={`fixed bottom-4 right-4 ${colors.primary} ${colors.hover} text-white p-4 rounded-full shadow-lg z-50 transition-all duration-200`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Ouvrir le chatbot"
      >
        {isOpen ? "✖" : "💬"}
      </button>

      {/* 💬 Fenêtre de chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 w-80 max-h-[80vh] bg-white shadow-2xl rounded-xl border border-gray-300 flex flex-col z-40">
          <div className={`p-3 font-semibold text-white text-center rounded-t-xl ${colors.primary}`}>
            🤖 Homie Assistant IA
          </div>

          {/* 📜 Zone de messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 text-sm rounded-lg max-w-[75%] whitespace-pre-wrap ${
                  msg.role === "user"
                    ? `${colors.userBubble} self-end ml-auto text-right`
                    : `${colors.botBubble} self-start mr-auto`
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="text-xs text-gray-500 italic">Assistant est en train de répondre...</div>
            )}
          </div>

          {/* 📝 Entrée utilisateur */}
          <div className="flex border-t p-2 bg-white">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-1 focus:ring-gray-400 text-sm"
              placeholder="Écris ton message ici..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              className={`${colors.primary} ${colors.hover} text-white px-4 py-2 rounded-r text-sm`}
              disabled={loading}
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

