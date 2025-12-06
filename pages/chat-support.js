// pages/chat-support.js
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function ChatSupport() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const chatBoxRef = useRef(null);

  // Get logged-in student UID
  useEffect(() => {
    const uid = localStorage.getItem("studentUID");
    if (!uid) {
      router.push("/login");
      return;
    }
    setStudentId(uid);
  }, [router]);

  // Real-time messages listener
  useEffect(() => {
    if (!studentId) return;

    // Make sure chat document exists
    const chatDocRef = doc(db, "chats", studentId);
    setDoc(
      chatDocRef,
      {
        studentId,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    const msgRef = collection(db, "chats", studentId, "messages");
    const q = query(msgRef, orderBy("timestamp", "asc"));

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(list);
      setLoading(false);

      // auto scroll
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 100);
    });

    return () => unsub();
  }, [studentId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !studentId) return;

    const msgRef = collection(db, "chats", studentId, "messages");

    await addDoc(msgRef, {
      sender: "student",
      text: input.trim(),
      timestamp: serverTimestamp(),
      seenByTeacher: false,
    });

    // update last activity time
    await setDoc(
      doc(db, "chats", studentId),
      { updatedAt: serverTimestamp() },
      { merge: true }
    );

    setInput("");
  };

  const formatTime = (ts) => {
    if (!ts?.toDate) return "";
    return ts.toDate().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ArrowLeftIcon
          className="w-6 h-6 cursor-pointer text-blue-700"
          onClick={() => router.push("/student-dashboard")}
        />
        <h1 className="text-2xl font-bold text-blue-700">Chat Support</h1>
      </div>

      {/* Chat card */}
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl flex flex-col h-[75vh]">
        {/* Top bar */}
        <div className="px-5 py-3 border-b rounded-t-2xl bg-blue-600 text-white">
          <div className="font-semibold">Instructor Chat</div>
          <div className="text-xs opacity-80">
            Ask doubts and get help from your mentor
          </div>
        </div>

        {/* Messages */}
        <div
          ref={chatBoxRef}
          className="flex-1 px-4 py-3 overflow-y-auto bg-gray-50"
        >
          {loading && (
            <p className="text-center text-gray-400 mt-10">
              Loading conversation...
            </p>
          )}

          {!loading && messages.length === 0 && (
            <p className="text-center text-gray-400 mt-10">
              👋 Say hello to your instructor to start chatting.
            </p>
          )}

          {messages.map((msg) => {
            const isMe = msg.sender === "student";
            return (
              <div
                key={msg.id}
                className={`flex mb-2 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-2xl text-sm shadow ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-900 rounded-bl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[10px] opacity-80">
                    <span>{formatTime(msg.timestamp)}</span>
                    {isMe && (
                      <span>
                        {msg.seenByTeacher ? "✓✓ Seen" : "✓ Delivered"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input */}
        <form
          onSubmit={sendMessage}
          className="px-4 py-3 border-t flex items-center gap-3 bg-white rounded-b-2xl"
        >
          <input
            type="text"
            className="flex-1 border rounded-lg px-4 py-2 text-sm"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            disabled={!input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </main>
  );
}
