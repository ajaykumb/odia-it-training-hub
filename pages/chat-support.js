// pages/chat-support.js

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
  getDoc
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function ChatSupport() {
  const router = useRouter();

  const [studentId, setStudentId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);

  const chatBoxRef = useRef(null);

  // Load student ID from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("studentToken");
    const uid = localStorage.getItem("studentUID");

    if (!token || !uid) {
      router.push("/login");
      return;
    }

    setStudentId(uid);
  }, [router]);

  // Load chat messages
  useEffect(() => {
    if (!studentId) return;

    const chatDocRef = doc(db, "chats", studentId);

    // Ensure chat doc exists
    setDoc(
      chatDocRef,
      {
        updatedAt: serverTimestamp(),
        name: "Unknown Student",
      },
      { merge: true }
    ).catch(console.error);

    const msgRef = collection(db, "chats", studentId, "messages");
    const q = query(msgRef, orderBy("timestamp", "asc"));

    const unsub = onSnapshot(
      q,
      (snap) => {
        const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setMessages(arr);
        setLoading(false);

        setTimeout(() => {
          if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
          }
        }, 100);
      },
      (err) => {
        console.error("Chat listen error:", err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [studentId]);

  // ⭐ Send message (first message = student name)
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !studentId) return;

    try {
      const msgRef = collection(db, "chats", studentId, "messages");
      const chatDocRef = doc(db, "chats", studentId);

      // Read existing chat data
      const chatSnap = await getDoc(chatDocRef);
      let currentName = chatSnap.exists() ? chatSnap.data().name : null;

      // ⭐ FIRST MESSAGE → treat as student name
      if (!currentName || currentName === "Unknown Student") {
        const realName = input.trim();

        await updateDoc(chatDocRef, {
          name: realName,
          updatedAt: serverTimestamp(),
        });

        // Save name locally for future display
        localStorage.setItem("studentName", realName);

        // Also save message normally
        await addDoc(msgRef, {
          sender: "student",
          text: realName,
          timestamp: serverTimestamp(),
          seenByTeacher: false,
        });

        setInput("");
        return;
      }

      // ⭐ NORMAL MESSAGES
      await addDoc(msgRef, {
        sender: "student",
        text: input.trim(),
        timestamp: serverTimestamp(),
        seenByTeacher: false,
      });

      await updateDoc(chatDocRef, {
        updatedAt: serverTimestamp(),
      });

      setInput("");
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Unable to send message. Please try again.");
    }
  };

  const formatTime = (ts) =>
    ts?.toDate ? ts.toDate().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col">
      
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => router.push("/student-dashboard")}
          className="text-blue-600 text-sm"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">IT Training Hub Chat Support</h1>
      </div>

      <div className="max-w-3xl mx-auto flex-1 flex items-center">
        <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">

          <div className="bg-blue-600 text-white px-5 py-3">
            <div className="font-semibold">Instructor Chat</div>
            <div className="text-xs opacity-90">Ask doubts anytime</div>
          </div>

          <div
            ref={chatBoxRef}
            className="flex-1 bg-white px-4 py-3 overflow-y-auto"
            style={{ minHeight: "320px" }}
          >
            {loading && <p className="text-center text-gray-400 mt-10">Loading...</p>}

            {!loading && messages.length === 0 && (
              <p className="text-center text-gray-400 mt-10">
                👋 Welcome! Please type your name to start.
              </p>
            )}

            {messages.map((m) => {
              const isStudent = m.sender === "student";
              return (
                <div key={m.id} className={`mb-3 flex ${isStudent ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-3 py-2 rounded-2xl text-sm shadow ${
                      isStudent
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    <div>{m.text}</div>
                    <div className="text-[10px] opacity-80 mt-1 text-right">
                      {formatTime(m.timestamp)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleSend}
            className="border-t bg-gray-50 px-4 py-3 flex items-center gap-3"
          >
            <input
              type="text"
              className="flex-1 border rounded-lg px-3 py-2 text-sm"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm">
              Send
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
