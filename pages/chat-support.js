import { useEffect, useState, useRef } from "react";
import { db } from "../utils/firebaseConfig";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

export default function ChatSupport() {
  const [studentId, setStudentId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  // Load student UID
  useEffect(() => {
    const id = localStorage.getItem("studentUID");
    if (id) setStudentId(id);
  }, []);

  // Load chat messages
  useEffect(() => {
    if (!studentId) return;

    const msgRef = collection(db, "chats", studentId, "messages");
    const q = query(msgRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(arr);

      // Auto scroll
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    });

    return () => unsub();
  }, [studentId]);

  // Send Message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !studentId) return;

    try {
      const chatDocRef = doc(db, "chats", studentId);
      const msgRef = collection(db, "chats", studentId, "messages");

      // Create main chat doc
      await setDoc(
        chatDocRef,
        {
          studentId,
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      // Add message
      await addDoc(msgRef, {
        text: input,
        sender: "student",
        createdAt: Date.now(),
      });

      setInput("");
    } catch (err) {
      console.error("Send message error:", err);
      alert("Unable to send message.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">

      {/* HEADER */}
      <header className="bg-blue-700 text-white p-4 text-center text-xl font-bold shadow">
        Student Chat Support
      </header>

      <div className="flex-1 max-w-2xl mx-auto w-full p-4 bg-white shadow-md mt-6 rounded-xl flex flex-col">

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`max-w-xs p-3 rounded-lg text-white ${
                msg.sender === "student"
                  ? "bg-blue-600 self-end"
                  : "bg-gray-500 self-start"
              }`}
            >
              {msg.text}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* Input Field */}
        <form onSubmit={sendMessage} className="p-4 flex gap-2 border-t bg-gray-50">
          <input
            type="text"
            className="flex-1 border p-3 rounded-lg"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg shadow"
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
