// components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "bot", text: "👋 Hi! I'm EduNex AI, your career guide. What subject or career are you curious about?" },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const scrollRef = useRef(null);
  const [userData, setUserData] = useState({
    name: "S",
    email: "",
    username: "",
    role: "",
  });

  // Token decode (as it is)
  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  useEffect(() => {
    const adminToken = localStorage.getItem("admin");
    const teacherToken = localStorage.getItem("teacher");
    const studentToken = localStorage.getItem("student");

    const token = adminToken || teacherToken || studentToken;
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUserData({
          name: decoded.name || "U",
          email: decoded.email || "",
          username: decoded.username || "",
          role: decoded.role || "",
        });
      }
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setBotTyping(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      const botMessage = {
        id: Date.now() + 1,
        sender: "bot",
        text: data.reply,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: "❌ Gemini API failed" },
      ]);
    } finally {
      setBotTyping(false);
    }
  };

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, botTyping]);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Chat Button */}
      <AnimatePresence>
      <motion.button
  onClick={() => setOpen(!open)}
  className="cursor-pointer flex flex-col items-center focus:outline-none"
  initial={{ scale: 1 }}
  whileHover={{ scale: 1.1 }}
  whileTap={{ scale: 0.95 }}
>
  {/* Bot Avatar */}
  <motion.img
    src="assets/ai_agent.png"
    alt="EduNex AI Assistant"
    className="w-24 h-24 object-contain drop-shadow-xl"
    animate={{ y: [0, -8, 0] }}
    transition={{ 
      y: { repeat: Infinity, repeatType: "loop", duration: 2, ease: "easeInOut" } 
    }}
  />

  {/* Waving Chat Bubble */}
  
    {!open && (
      <motion.div
        className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-xl shadow-lg"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        👋 Hi! Need Help?
      </motion.div>
    )}

</motion.button>
</AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.3 }}
            className="mt-3 w-80 sm:w-96 h-[550px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-[#9078e2] text-white px-4 py-4 flex justify-between items-center rounded-t-3xl shadow-md">
              <h2 className="font-bold text-lg flex items-center gap-2">
                EduNex AI <span className="animate-pulse">🤖</span>
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white text-xl font-bold hover:text-gray-200 transition"
              >
                ✖
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-gray-100"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "bot" && (
                    <div className="w-9 h-9 bg-[#c4bef0] text-white rounded-full flex items-center justify-center text-sm font-bold mr-2 shadow-md">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl break-words text-sm leading-relaxed shadow ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-indigo-500 to-[#9078e2] text-white rounded-br-none"
                        : "bg-white text-gray-800 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-9 h-9 bg-[#9078e2] text-white rounded-full flex items-center justify-center text-sm font-bold ml-2 shadow-md">
                      {userData?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {botTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-400 text-white rounded-full flex items-center justify-center">
                    🤖
                  </div>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about careers, subjects..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9078e2] bg-gray-50 text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                className="bg-gradient-to-r from-indigo-500 to-[#9078e2] text-white p-3 rounded-full shadow hover:shadow-lg transition"
              >
                <Send className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;
