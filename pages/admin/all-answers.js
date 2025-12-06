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

  // ==============================
  // AUTH CHECK
  // ==============================
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");

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

    return () => unsub();
  }, [router]);

  // ==============================
  // LIVE STUDENTS (Realtime DB)
  // ==============================
  useEffect(() => {
    const liveRef = ref(rtdb, "liveStudents");
    onValue(liveRef, (snap) => setLiveStudents(snap.val() || {}));
  }, []);

  // ==============================
  // FILTER
  // ==============================
  const filteredAnswers = useMemo(() => {
    if (filter === "auto") return answers.filter((a) => a.autoSubmitted);
    if (filter === "manual") return answers.filter((a) => !a.autoSubmitted);
    return answers;
  }, [answers, filter]);

  const formatDate = (d) => {
    if (!d) return "N/A";
    if (typeof d?.toDate === "function") return d.toDate().toLocaleString();
    if (d.seconds) return new Date(d.seconds * 1000).toLocaleString();
    return new Date(d).toLocaleString();
  };

  // ==============================
  // DELETE SUBMISSION
  // ==============================
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this submission?");
    if (!ok) return;
    await deleteDoc(doc(db, "assignments", id));
    setAnswers((prev) => prev.filter((i) => i.id !== id));
  };

  // ==============================
  // LIVE CLASS CONTROL
  // ==============================
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

  // ==============================
  // CHAT USERS
  // ==============================
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setChatUsers(arr);
    });
    return () => unsub();
  }, []);

  // ==============================
  // LOAD CHAT MESSAGES
  // ==============================
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

  // ==============================
  // SEND REPLY
  // ==============================
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
    <div className="flex bg-[#f4f6f9] min-h-screen">

      {/* ========================== */}
      {/*        SIDEBAR            */}
      {/* ========================== */}
      <aside className="w-64 bg-white shadow-xl border-r min-h-screen fixed left-0 top-0 p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-6">Odia IT Admin</h1>

        <nav className="space-y-3">
          <div className="p-3 bg-blue-100 rounded-lg font-semibold text-blue-700">
            Dashboard
          </div>
        </nav>

        <button
          onClick={() => signOut(auth)}
          className="mt-10 bg-red-600 text-white w-full py-2 rounded-lg shadow hover:bg-red-700"
        >
          Logout
        </button>
      </aside>

      {/* ========================== */}
      {/*     MAIN CONTENT AREA      */}
      {/* ========================== */}
      <main className="flex-1 ml-64 p-8">

        {/* TOP BAR */}
        <div className="bg-white rounded-xl shadow p-4 mb-8 border flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-700">Admin Dashboard</h2>
        </div>

        {/* LIVE CLASS PANEL */}
        <section className="bg-white shadow rounded-xl p-6 border mb-10">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">🎥 Live Class Control</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              className="w-full p-3 border rounded-lg shadow-sm"
              placeholder="Enter Class Name"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />

            <input
              className="w-full p-3 border rounded-lg shadow-sm"
              placeholder="Paste Meeting URL"
              value={meetingUrl}
              onChange={(e) => setMeetingUrl(e.target.value)}
            />
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

        {/* CHAT SUPPORT */}
        <section className="bg-white shadow rounded-xl p-6 border mb-10">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">💬 Student Chat Support</h2>

          <div className="grid grid-cols-3 gap-6">

            {/* STUDENT LIST */}
            <div className="border rounded-xl p-4 shadow-sm h-[350px] overflow-y-auto bg-gray-50">
              <h3 className="font-bold text-gray-700 mb-3">Students</h3>

              {chatUsers.map((u) => (
                <div
                  key={u.id}
                  className={`p-3 mb-2 rounded-lg cursor-pointer shadow-sm border ${
                    selectedStudent === u.id ? "bg-blue-100 border-blue-400" : "bg-white"
                  }`}
                  onClick={() => setSelectedStudent(u.id)}
                >
                  <p className="font-semibold">{u.name || "Unknown Student"}</p>
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
                  <div
                    key={m.id}
                    className={`mb-3 flex ${
                      m.sender === "teacher" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-3 py-2 rounded-lg shadow max-w-xs ${
                        m.sender === "teacher"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800"
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
                    placeholder="Type reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                  />
                  <button
                    onClick={sendTeacherReply}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ========================== */}
        {/* SUBMITTED STUDENTS */}
        {/* ========================== */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📄 Submitted Students</h2>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${
              filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("manual")}
            className={`px-4 py-2 rounded-lg ${
              filter === "manual" ? "bg-green-600 text-white" : "bg-gray-200"
            }`}
          >
            Manual Only
          </button>
          <button
            onClick={() => setFilter("auto")}
            className={`px-4 py-2 rounded-lg ${
              filter === "auto" ? "bg-orange-600 text-white" : "bg-gray-200"
            }`}
          >
            Auto Submitted
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filteredAnswers.map((s) => (
            <div key={s.id} className="p-5 bg-white rounded-xl shadow border">
              <h2 className="text-xl font-bold text-gray-800">
                {s.name || s.safeName || s.id}
              </h2>

              <p className="text-gray-600">
                Submitted: {formatDate(s.submittedAt)}
              </p>

              <div className="mt-3 flex gap-3">
                <span className={`px-3 py-1 rounded-full text-xs shadow ${
                  s.autoSubmitted
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }`}>
                  {s.autoSubmitted ? "AUTO SUBMITTED" : "MANUAL"}
                </span>

                <span className={`px-3 py-1 rounded-full text-xs shadow ${
                  s.cameraVerified
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  Camera: {s.cameraVerified ? "ON" : "OFF"}
                </span>
              </div>

              <div className="mt-4 space-y-1">
                {Object.entries(s.answers || {}).map(([k, v]) => (
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
            <p className="text-gray-500">No submissions available.</p>
          )}
        </div>
      </main>
    </div>
  );
}
