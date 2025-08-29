
// // components/Chatbot.jsx
// import React, { useState, useEffect, useRef } from "react";
// import { Send } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// const Chatbot = () => {
//   const [messages, setMessages] = useState([
//     { id: 1, sender: "bot", text: "👋 Hi! I'm EduNex AI, your career guide. What subject or career are you curious about?" },
//   ]);
  
//   const [input, setInput] = useState("");
//   const [open, setOpen] = useState(false);
//   const [botTyping, setBotTyping] = useState(false);
//   const scrollRef = useRef(null);
//   const [userData, setUserData] = useState({
//     name: "",
//     email: "",
//     username: "",
//     role: "",
//   });

//   // Token decode (as it is)
//   function parseJwt(token) {
//     try {
//       const base64Url = token.split(".")[1];
//       const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
//       const jsonPayload = decodeURIComponent(
//         atob(base64)
//           .split("")
//           .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
//           .join("")
//       );
//       return JSON.parse(jsonPayload);
//     } catch {
//       return null;
//     }
//   }

//   useEffect(() => {
//     const adminToken = localStorage.getItem("admin");
//     const teacherToken = localStorage.getItem("teacher");
//     const studentToken = localStorage.getItem("student");

//     const token = adminToken || teacherToken || studentToken;
//     if (token) {
//       const decoded = parseJwt(token);
//       if (decoded) {
//         setUserData({
//           name: decoded.name || "U",
//           email: decoded.email || "",
//           username: decoded.username || "",
//           role: decoded.role || "",
//         });
//       }
//     }
//   }, []);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { id: Date.now(), sender: "user", text: input };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setBotTyping(true);

//     try {
//       const res = await fetch("http://localhost:8000/api/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: input }),
//       });
//       const data = await res.json();
//       const botMessage = {
//         id: Date.now() + 1,
//         sender: "bot",
//         text: data.reply,
//       };
//       setMessages((prev) => [...prev, botMessage]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { id: Date.now() + 1, sender: "bot", text: "❌ Gemini API failed" },
//       ]);
//     } finally {
//       setBotTyping(false);
//     }
//   };

//   // Auto-scroll
//   useEffect(() => {
//     scrollRef.current?.scrollTo({
//       top: scrollRef.current.scrollHeight,
//       behavior: "smooth",
//     });
//   }, [messages, botTyping]);

//   return (
//     <div className="fixed bottom-5 right-5 z-50">
//       {/* Floating Chat Button */}
//       <AnimatePresence>
//       <motion.button
//   onClick={() => setOpen(!open)}
//   className="cursor-pointer flex flex-col items-center focus:outline-none"
//   initial={{ scale: 1 }}
//   whileHover={{ scale: 1.1 }}
//   whileTap={{ scale: 0.95 }}
// >
//   {/* Bot Avatar */}
//   <motion.img
//     src="assets/ai_agent.png"
//     alt="EduNex AI Assistant"
//     className="w-24 h-24 object-contain drop-shadow-xl"
//     animate={{ y: [0, -8, 0] }}
//     transition={{ 
//       y: { repeat: Infinity, repeatType: "loop", duration: 2, ease: "easeInOut" } 
//     }}
//   />

//   {/* Waving Chat Bubble */}
  
//     {!open && (
//       <motion.div
//         className="mt-2 px-2 py-1 bg-blue-500 text-white text-xs rounded-xl shadow-lg"
//         initial={{ opacity: 0, y: -10 }}
//         animate={{ opacity: 1, y: 0 }}
//         exit={{ opacity: 0, y: -10 }}
//         transition={{ duration: 0.3, ease: "easeInOut" }}
//       >
//         👋 Hi! Need Help?
//       </motion.div>
//     )}

// </motion.button>
// </AnimatePresence>

//       {/* Chat Window */}
//       <AnimatePresence>
//         {open && (
//           <motion.div
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: 30 }}
//             transition={{ duration: 0.3 }}
//             className="mt-3 w-80 sm:w-96 h-[550px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
//           >
//             {/* Header */}
//             <div className="bg-gradient-to-r from-indigo-500 to-[#9078e2] text-white px-4 py-4 flex justify-between items-center rounded-t-3xl shadow-md">
//               <h2 className="font-bold text-lg flex items-center gap-2">
//                 EduNex AI <span className="animate-pulse">🤖</span>
//               </h2>
//               <button
//                 onClick={() => setOpen(false)}
//                 className="text-white text-xl font-bold hover:text-gray-200 transition"
//               >
//                 ✖
//               </button>
//             </div>

//             {/* Messages */}
//             <div
//               ref={scrollRef}
//               className="flex-1 p-4 overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-gray-100"
//             >
//               {messages.map((msg) => (
//                 <motion.div
//                   key={msg.id}
//                   initial={{ opacity: 0, x: msg.sender === "user" ? 50 : -50 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   transition={{ duration: 0.3 }}
//                   className={`flex ${
//                     msg.sender === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   {msg.sender === "bot" && (
//                     <div className="w-9 h-9 bg-[#c4bef0] text-white rounded-full flex items-center justify-center text-sm font-bold mr-2 shadow-md">
//                       🤖
//                     </div>
//                   )}
//                   <div
//                     className={`max-w-[70%] px-4 py-2 rounded-2xl break-words text-sm leading-relaxed shadow ${
//                       msg.sender === "user"
//                         ? "bg-gradient-to-r from-indigo-500 to-[#9078e2] text-white rounded-br-none"
//                         : "bg-white text-gray-800 rounded-bl-none"
//                     }`}
//                   >
//                     {msg.text}
//                   </div>
//                   {msg.sender === "user" && (
//                     <div className="w-9 h-9 bg-[#9078e2] text-white rounded-full flex items-center justify-center text-sm font-bold ml-2 shadow-md">
//                       {userData?.name?.charAt(0).toUpperCase()}
//                     </div>
//                   )}
//                 </motion.div>
//               ))}

//               {/* Typing Indicator */}
//               {botTyping && (
//                 <div className="flex items-center gap-2">
//                   <div className="w-8 h-8 bg-indigo-400 text-white rounded-full flex items-center justify-center">
//                     🤖
//                   </div>
//                   <div className="flex gap-1">
//                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
//                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
//                     <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Input */}
//             <div className="p-3 border-t border-gray-200 flex items-center gap-2 bg-white">
//               <input
//                 type="text"
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                 placeholder="Ask about careers, subjects..."
//                 className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#9078e2] bg-gray-50 text-sm"
//               />
//               <motion.button
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={handleSend}
//                 className="bg-gradient-to-r from-indigo-500 to-[#9078e2] text-white p-3 rounded-full shadow hover:shadow-lg transition"
//               >
//                 <Send className="w-5 h-5" />
//               </motion.button>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default Chatbot;















// components/Chatbot.jsx
import React, { useState, useEffect, useRef } from "react";
import { BookOpen, TrendingUp, AlertCircle, Target, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const [studentStats, setStudentStats] = useState([]);
  const scrollRef = useRef(null);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    role: "",
    student_id: ""
  });

  // --- Token Decode ---
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
    const admin = localStorage.getItem("admin");
    const teacher = localStorage.getItem("teacher");
    const student = localStorage.getItem("student");
    const token = admin || teacher || student;
  
    if (token) {
      const decoded = parseJwt(token);
      if (decoded) {
        setUserData({
          name: decoded.name || "",
          email: decoded.email || "",
          username: decoded.username || "",
          role: decoded.role || "",
          student_id: decoded.student_id || ""
        });


        if (decoded.role === "student") {
          setMessages([
            {
              id: 1,
              sender: "bot",
              text: `👋 Welcome back, ${decoded.name}! I'm your personal AI career counselor. Ask me anything about your performance, courses, or career guidance.`
            }
          ]);
        } else {
          setMessages([
            {
              id: 1,
              sender: "bot",
              text: "❌ Only students can access personalized career counseling. Please login as a student."
            }
          ]);
        }
      }
    } else {
      setMessages([
        { id: 1, sender: "bot", text: "👋 Please login to access EduNex AI counseling." }
      ]);
    }
  }, []);

  // --- Handle Send ---
const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { id: Date.now(), sender: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setInput("");
  setBotTyping(true);

  try {
    // yahan original token nikaalo
    const tokenString = localStorage.getItem("student");

    if (!tokenString) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: "bot", text: "❌ Please login to continue" }
      ]);
      setBotTyping(false);
      return;
    }

    // decode sirf check ke liye
    const studentData = JSON.parse(tokenString);

    const decoded = parseJwt(studentData.token);
    if(!decoded)return;
    console.log("Decoded token:", decoded);
    
    const token = studentData.token;
    const res = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // 👈 yahan decoded nahi, raw token bhejna hai
      },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || "Request failed");

    if (data.studentStats) setStudentStats(data.studentStats);

    const botMessage = {
      id: Date.now() + 1,
      sender: "bot",
      text: data.reply,
    };
    setMessages((prev) => [...prev, botMessage]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        sender: "bot",
        text:
          err.message === "Access denied. Students only."
            ? "❌ Only students can access this feature."
            : "❌ Something went wrong. Please try again.",
      },
    ]);
  } finally {
    setBotTyping(false);
  }
};

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth"
    });
  }, [messages, botTyping]);

  // Quick actions (students only)
  const quickActions =
    userData.role === "student"
      ? [
          {
            icon: <BookOpen className="w-3 h-3" />,
            text: "Recommend courses",
            action:
              "Based on my performance and interests, which courses would you recommend?"
          },
          {
            icon: <TrendingUp className="w-3 h-3" />,
            text: "Career guidance",
            action: "Give me career guidance based on my performance and skills"
          },
          {
            icon: <AlertCircle className="w-3 h-3" />,
            text: "My performance",
            action: "Analyze my academic performance and suggest improvements"
          },
          {
            icon: <Target className="w-3 h-3" />,
            text: "Learning path",
            action: "Create a personalized learning path for me"
          }
        ]
      : [];

  // Risk color
  const getRiskColor = (risk) => {
    switch (risk) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Floating Button */}
      <AnimatePresence>
        <motion.button
          onClick={() => setOpen(!open)}
          className="cursor-pointer flex flex-col items-center focus:outline-none"
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.img
            src="assets/ai_agent.png"
            alt="EduNex AI"
            className="w-20 h-20 object-contain drop-shadow-xl"
            animate={{ y: [0, -8, 0] }}
            transition={{
              y: { repeat: Infinity, repeatType: "loop", duration: 2 }
            }}
          />
          {!open && (
            <motion.div
              className="mt-1 px-2 py-1 bg-indigo-500 text-white text-xs rounded-xl shadow"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
            className="mt-3 w-96 h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 flex justify-between items-center">
              <div>
                <h2 className="font-bold text-lg flex items-center gap-1">
                  EduNex AI <span>🤖</span>
                </h2>
                <div className="flex gap-2 text-xs mt-1">
                  <span className="bg-white/20 px-2 rounded-full">
                    {userData.role || "Guest"}
                  </span>
                  {studentStats && (
                    <>
                      <span
                        className={`${getRiskColor(
                          studentStats.dropoutRisk
                        )} bg-white/20 px-2 rounded-full`}
                      >
                        Risk: {studentStats.dropoutRisk}
                      </span>
                      <span className="bg-white/20 px-2 rounded-full">
                        {studentStats.attendance}% Attendance
                      </span>
                    </>
                  )}
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white text-lg"
              >
                ✖
              </button>
            </div>

            {/* Quick Actions */}
            {quickActions.length > 0 && messages.length <= 2 && (
              <div className="px-4 py-2 border-b bg-gray-50">
                <p className="text-xs text-gray-600 mb-1">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  {quickActions.map((qa, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(qa.action);
                        handleSend();
                      }}
                      className="flex items-center gap-1 text-xs bg-white border px-3 py-1.5 rounded-full hover:bg-indigo-50"
                    >
                      {qa.icon}
                      {qa.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 p-3 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100 space-y-3"
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
                    <div className="w-8 h-8 bg-indigo-400 text-white rounded-full flex items-center justify-center mr-2">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow ${
                      msg.sender === "user"
                        ? "bg-indigo-500 text-white rounded-br-none"
                        : "bg-white text-gray-800 border rounded-bl-none"
                    }`}
                    style={{ whiteSpace: "pre-line" }}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {botTyping && (
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 bg-indigo-400 text-white rounded-full flex items-center justify-center">
                    🤖
                  </div>
                  <div className="bg-white px-3 py-2 rounded-2xl shadow">
                    <span className="animate-bounce">● ● ●</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex items-center border-t p-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none"
              />
              <button
                onClick={handleSend}
                className="ml-2 bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-full"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Chatbot;

