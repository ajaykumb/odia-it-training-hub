import { useEffect, useState, useMemo } from "react";
import { db, auth, rtdb } from "../../utils/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  setDoc,
  addDoc,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { ref, onValue } from "firebase/database";

export default function AllAnswers() {
  const [answers, setAnswers] = useState([]);
  const [liveStudents, setLiveStudents] = useState({});
  const [filter, setFilter] = useState("all");

  const [className, setClassName] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  const [chatUsers, setChatUsers] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  const router = useRouter();

  // AUTH
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const q = query(collection(db, "assignments"), orderBy("submittedAt", "desc"));

      const unsubSnap = onSnapshot(q, (snapshot) => {
        const arr = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setAnswers(arr);
      });

      return () => unsubSnap();
    });

    return () => unsubAuth();
  }, [router]);

  // LIVE STUDENTS
  useEffect(() => {
    const liveRef = ref(rtdb, "liveStudents");
    onValue(liveRef, (snap) => setLiveStudents(snap.val() || {}));
  }, []);

  // FILTER LOGIC
  const filteredAnswers = useMemo(() => {
    if (filter === "auto") return answers.filter((a) => a.autoSubmitted);
    if (filter === "manual") return answers.filter((a) => !a.autoSubmitted);
    return answers;
  }, [answers, filter]);

  // FORMAT DATE
  const formatDate = (d) => {
    if (!d) return "N/A";
    if (typeof d?.toDate === "function") return d.toDate().toLocaleString();
    if (d.seconds) return new Date(d.seconds * 1000).toLocaleString();
    return new Date(d).toLocaleString();
  };

  // DELETE
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this submission?");
    if (!ok) return;
    await deleteDoc(doc(db, "assignments", id));
    setAnswers((prev) => prev.filter((i) => i.id !== id));
  };

  // LIVE CLASS FUNCTIONS
  const startLiveClass = async () => {
    if (!className.trim()) return alert("Enter class name");
    await setDoc(doc(db, "liveClass", "current"), {
      isLive: true,
      className,
      meetingUrl: meetingUrl.trim() || "https://meet.jit.si/OdiaITTrainingHubLiveClass",
      startedAt: Date.now(),
    });
    alert("Live class started!");
  };

  const stopLiveClass = async () => {
    await setDoc(doc(db, "liveClass", "current"), {
      isLive: false,
      className: "",
      meetingUrl: "",
      endedAt: Date.now(),
    });
    alert("Live class stopped.");
  };

  const joinAsTeacher = () => {
    const url = meetingUrl.trim() || "https://meet.jit.si/OdiaITTrainingHubLiveClass";
    window.open(url, "_blank");
  };

  // CHAT USERS
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setChatUsers(arr);
    });
    return () => unsub();
  }, []);

  // CHAT MESSAGES
  useEffect(() => {
    if (!selectedStudent) return;
    const msgRef = collection(db, "chats", selectedStudent, "messages");
    const q = query(msgRef, orderBy("timestamp", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(arr);
    });
    return () => unsub();
  }, [selectedStudent]);

  // SEND TEACHER MESSAGE
  const sendTeacherReply = async () => {
    if (!reply.trim()) return;
    await addDoc(collection(db, "chats", selectedStudent, "messages"), {
      sender: "teacher",
      text: reply.trim(),
      timestamp: serverTimestamp(),
      seenByTeacher: true,
    });
    await updateDoc(doc(db, "chats", selectedStudent), {
      updatedAt: serverTimestamp(),
    });
    setReply("");
  };

  return (
    <main className="relative min-h-screen p-6 max-w-7xl mx-auto overflow-hidden">

      {/* 🔵 ABSTRACT BLUR BACKGROUND */}
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-blue-300 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-[400px] h-[400px] bg-purple-300 opacity-20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[20%] left-[40%] w-[250px] h-[250px] bg-cyan-200 opacity-10 blur-3xl rounded-full"></div>

      {/* CONTENT */}
      <div className="relative z-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 drop-shadow">Admin Dashboard</h1>
          <button className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow" onClick={() => signOut(auth)}>
            Logout
          </button>
        </div>

        {/* ⭐ LIVE CLASS BLOCK */}
        <section className="bg-white shadow-lg rounded-xl p-6 mb-10 border backdrop-blur-sm bg-opacity-90">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">🎥 Live Class Control</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input className="w-full p-3 border rounded-lg shadow-sm" placeholder="Enter Class Name" value={className} onChange={(e) => setClassName(e.target.value)} />

            <input className="w-full p-3 border rounded-lg shadow-sm" placeholder="Paste Meeting URL" value={meetingUrl} onChange={(e) => setMeetingUrl(e.target.value)} />
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <button className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg shadow" onClick={startLiveClass}>
              Start Live Class
            </button>

            <button className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow" onClick={joinAsTeacher}>
              Join as Teacher
            </button>

            <button className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg shadow" onClick={stopLiveClass}>
              Stop Live Class
            </button>
          </div>
        </section>

        {/* ⭐ CHAT SUPPORT PANEL */}
        <section className="bg-white shadow-lg rounded-xl p-6 mb-10 border backdrop-blur-sm bg-opacity-90">

          <h2 className="text-2xl font-bold text-blue-600 mb-4">💬 Student Chat Support</h2>

          <div className="grid grid-cols-3 gap-6">

            {/* STUDENT LIST */}
            <div className="border rounded-xl p-4 shadow-sm h-[350px] overflow-y-auto bg-gray-50">
              <h3 className="font-bold mb-3 text-gray-700">Students</h3>

              {chatUsers.map((u) => (
                <div
                  key={u.id}
                  className={`p-3 mb-2 rounded-lg cursor-pointer shadow-sm border ${
                    selectedStudent === u.id ? "bg-blue-100 border-blue-300" : "bg-white"
                  }`}
                  onClick={() => setSelectedStudent(u.id)}
                >
                  <p className="font-bold text-gray-900">{u.name || "Unknown Student"}</p>
                  <p className="text-xs text-gray-500">{u.id}</p>
                </div>
              ))}
            </div>

            {/* CHAT WINDOW */}
            <div className="col-span-2 border rounded-xl p-4 shadow-sm flex flex-col bg-gray-50 h-[350px]">
              <h3 className="font-bold text-gray-700 mb-3">
                {selectedStudent ? `Chat with ${selectedStudent}` : "Select a student"}
              </h3>

              <div className="flex-1 overflow-y-auto bg-white rounded-lg p-3 shadow-inner mb-3">
                {messages.map((m) => (
                  <div key={m.id} className={`mb-3 flex ${m.sender === "teacher" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`px-3 py-2 rounded-lg shadow max-w-xs ${
                        m.sender === "teacher" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {selectedStudent && (
                <div className="flex gap-2">
                  <input
                    className="border rounded-lg flex-1 px-3 py-2 shadow-sm"
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <button
                    onClick={sendTeacherReply}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FILTER BUTTONS */}
        <div className="flex gap-3 mb-8">
          {["all", "manual", "auto"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-lg shadow text-sm font-semibold ${
                filter === f
                  ? f === "manual"
                    ? "bg-green-600 text-white"
                    : f === "auto"
                    ? "bg-orange-600 text-white"
                    : "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {f === "all" && "All"}
              {f === "manual" && "Manual Only"}
              {f === "auto" && "Auto-Submitted Only"}
            </button>
          ))}
        </div>

        {/* SUBMITTED STUDENTS */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📄 Submitted Students</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredAnswers.map((s) => (
            <div key={s.id} className="p-5 border rounded-xl shadow bg-white backdrop-blur-sm bg-opacity-90">
              <h2 className="font-bold text-xl text-gray-800">{s.name || s.safeName || s.id}</h2>
              <p className="text-sm text-gray-600 mt-1">Submitted: {formatDate(s.submittedAt)}</p>

              <div className="mt-3 flex gap-3 flex-wrap">
                <span className={`px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${
                  s.autoSubmitted ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                }`}>
                  {s.autoSubmitted ? "AUTO SUBMITTED" : "MANUAL SUBMITTED"}
                </span>

                <span className={`px-3 py-1 text-xs rounded-full font-semibold shadow-sm ${
                  s.cameraVerified ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"
                }`}>
                  Camera: {s.cameraVerified ? "ON" : "OFF"}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                {Object.entries(s.answers || {})
                  .sort((a, b) => {
                    const na = parseInt((a[0] + "").replace(/^q/i, ""), 10) || 0;
                    const nb = parseInt((b[0] + "").replace(/^q/i, ""), 10) || 0;
                    return na - nb;
                  })
                  .map(([k, v]) => (
                    <p key={k} className="text-gray-700">
                      <b>{k.toUpperCase()}:</b> {v || "-"}
                    </p>
                  ))}
              </div>

              <button
                onClick={() => handleDelete(s.id)}
                className="bg-red-500 hover:bg-red-600 text-white w-full mt-4 py-2 rounded-lg shadow"
              >
                Delete Submission
              </button>
            </div>
          ))}

          {filteredAnswers.length === 0 && (
            <p className="text-gray-500">No submissions found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
