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

  // ---------------------------
  // ADMIN LOGIN PROTECTION
  // ---------------------------
  useEffect(() => {
    const ok = localStorage.getItem("adminLogin");
    if (!ok) router.push("/admin/login");
  }, []);

  // ---------------------------
  // ANNOUNCEMENT STATES
  // ---------------------------
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  // ---------------------------
  // UPCOMING CLASS STATES
  // ---------------------------
  const [topic, setTopic] = useState("");
  const [teacher, setTeacher] = useState("");
  const [nextClassTime, setNextClassTime] = useState("");
  const [isUpcomingLive, setIsUpcomingLive] = useState(false);

  // Load upcoming class
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "liveClassStatus", "active"), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setTopic(data.topic || "");
        setTeacher(data.teacher || "");
        setNextClassTime(data.nextClassTime || "");
        setIsUpcomingLive(data.isLive || false);
      }
    });
    return () => unsub();
  }, []);

  // ---------------------------------------------------
  // SAVE ANNOUNCEMENT + SEND EMAIL (BATCH WISE)
  // ---------------------------------------------------
  const saveAnnouncement = async () => {
    if (!annTitle.trim() || !annMessage.trim() || !selectedBatch.trim()) {
      alert("Please fill all fields including batch");
      return;
    }

    await addDoc(collection(db, "announcements"), {
      title: annTitle,
      message: annMessage,
      batch: selectedBatch,
      timestamp: Date.now(),
    });

    try {
      const res = await fetch("/api/send-announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: annTitle,
          message: annMessage,
          batch: selectedBatch,
        }),
      });

      const result = await res.json();

      if (result.success) {
        alert(`📨 Email sent to ${result.sent} students`);
      } else {
        alert("Announcement saved but email sending failed.");
      }
    } catch (error) {
      console.error("EMAIL ERROR:", error);
      alert("Announcement saved but email sending failed.");
    }

    setAnnTitle("");
    setAnnMessage("");
    setSelectedBatch("");
  };

  // UPDATE UPCOMING CLASS
  const updateUpcomingClass = async () => {
    await setDoc(doc(db, "liveClassStatus", "active"), {
      topic,
      teacher,
      nextClassTime,
      isLive: isUpcomingLive,
    });
    alert("Upcoming class updated!");
  };

  // ---------------------------
  // AUTH + ASSIGNMENTS
  // ---------------------------
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return router.push("/admin/login");

      const q = query(
        collection(db, "assignments"),
        orderBy("submittedAt", "desc")
      );

      return onSnapshot(q, (snapshot) => {
        setAnswers(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      });
    });

    return () => unsubAuth();
  }, [router]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;
    await deleteDoc(doc(db, "assignments", id));
    setAnswers(prev => prev.filter(i => i.id !== id));
  };

  // ---------------------------
  // LIVE STUDENTS
  // ---------------------------
  useEffect(() => {
    onValue(ref(rtdb, "liveStudents"), (snap) => {
      setLiveStudents(snap.val() || {});
    });
  }, []);

  // ---------------------------
  // FILTER LOGIC
  // ---------------------------
  const filteredAnswers = useMemo(() => {
    if (filter === "auto") return answers.filter(a => a.autoSubmitted);
    if (filter === "manual") return answers.filter(a => !a.autoSubmitted);
    return answers;
  }, [answers, filter]);

  const formatDate = (d) => {
    try {
      if (typeof d?.toDate === "function") return d.toDate().toLocaleString();
      if (d?.seconds) return new Date(d.seconds * 1000).toLocaleString();
      return new Date(d).toLocaleString();
    } catch {
      return "N/A";
    }
  };

  // ---------------------------
  // LIVE CLASS CONTROLS
  // ---------------------------
  const startLiveClass = async () => {
    if (!className.trim()) return alert("Please enter class name");

    await setDoc(doc(db, "liveClass", "current"), {
      isLive: true,
      className,
      meetingUrl: meetingUrl || "https://meet.jit.si/OdiaITTrainingHubLiveClass",
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
    window.open(
      meetingUrl || "https://meet.jit.si/OdiaITTrainingHubLiveClass",
      "_blank"
    );
  };

  // ---------------------------
  // UI STARTS
  // ---------------------------
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-gray-100 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800">
          Admin Dashboard
        </h1>
        <button
          onClick={() => signOut(auth)}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow"
        >
          Logout
        </button>
      </div>

      {/* ANNOUNCEMENTS */}
      <section className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-yellow-300">
        <h2 className="text-2xl font-bold text-yellow-700 mb-5">
          📢 Announcements
        </h2>

        <input
          className="w-full p-3 border rounded-lg mb-3"
          placeholder="Announcement Title"
          value={annTitle}
          onChange={(e) => setAnnTitle(e.target.value)}
        />

        <textarea
          className="w-full p-3 border rounded-lg mb-3"
          placeholder="Announcement Message"
          rows="3"
          value={annMessage}
          onChange={(e) => setAnnMessage(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded-lg mb-3"
          placeholder="Batch name (e.g. GREEN_BATCH_1)"
          value={selectedBatch}
          onChange={(e) => setSelectedBatch(e.target.value)}
        />

        <button
          onClick={saveAnnouncement}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-5 py-2 rounded-lg shadow"
        >
          Post Announcement
        </button>
      </section>

      {/* UPCOMING CLASS DETAILS */}
      <section className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-yellow-300">
        <h3 className="font-bold text-lg mb-2">Upcoming Class Details</h3>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="w-full p-3 border rounded-lg"
            placeholder="Class Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <input
            className="w-full p-3 border rounded-lg"
            placeholder="Teacher Name"
            value={teacher}
            onChange={(e) => setTeacher(e.target.value)}
          />

          <input
            type="datetime-local"
            className="w-full p-3 border rounded-lg"
            value={nextClassTime}
            onChange={(e) => setNextClassTime(e.target.value)}
          />
        </div>

        <label className="flex items-center gap-2 mt-3">
          <input
            type="checkbox"
            checked={isUpcomingLive}
            onChange={(e) => setIsUpcomingLive(e.target.checked)}
          />
          <span className="font-semibold">Class is LIVE now</span>
        </label>

        <button
          onClick={updateUpcomingClass}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          Update Upcoming Class
        </button>
      </section>

      {/* ORIGINAL LIVE CLASS PANEL */}
      <section className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-blue-100">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          🎥 Teacher Live Class Control
        </h2>

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
          <button
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg shadow"
            onClick={startLiveClass}
          >
            Start Live Class
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow"
            onClick={joinAsTeacher}
          >
            Join as Teacher
          </button>

          <button
            className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg shadow"
            onClick={stopLiveClass}
          >
            Stop Live Class
          </button>
        </div>
      </section>

      {/* LIVE STUDENT MONITORING */}
      <section className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-green-100">
        <h2 className="text-2xl font-bold text-green-700 mb-4">
          🔴 Live Student Monitoring
        </h2>

        <p className="text-lg font-semibold mb-2">
          Live Students Connected:{" "}
          <span className="text-green-600 font-bold">
            {Object.keys(liveStudents).length}
          </span>
        </p>

        {Object.keys(liveStudents).length === 0 && (
          <p className="text-red-500">❌ No students are live right now.</p>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(liveStudents).map(([id, s]) => (
            <div key={id} className="border p-4 rounded-xl shadow bg-green-50">
              <p className="font-bold text-lg text-gray-800">{s.name}</p>
              <p className="text-green-700 font-semibold">LIVE 🎥</p>
            </div>
          ))}
        </div>
      </section>

{/* CHAT SUPPORT */}
      <section className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">💬 Student Chat Support</h2>

        <div className="grid grid-cols-3 gap-6">
          {/* STUDENT LIST */}
          <div className="border rounded-xl p-4 shadow-sm h-[350px] overflow-y-auto bg-gray-50">
            <h3 className="font-bold mb-3 text-gray-700">Students</h3>

            {chatUsers.length === 0 && (
              <p className="text-gray-500 text-sm">No students yet.</p>
            )}

            {chatUsers.map((u) => (
              <div
                key={u.id}
                className={`p-3 mb-2 rounded-lg cursor-pointer shadow-sm border ${
                  selectedStudent === u.id ? "bg-blue-100 border-blue-300" : "bg-white"
                }`}
                onClick={() => setSelectedStudent(u.id)}
              >
                <p className="font-semibold text-gray-800">
                  {u.name || "Unknown Student"}
                </p>
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
              {!selectedStudent && (
                <p className="text-gray-500 text-center mt-10">
                  Select a student to start chat.
                </p>
              )}

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
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ASSIGNMENTS LIST */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        📄 Submitted Students
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredAnswers.map((s) => (
          <div key={s.id} className="p-5 border rounded-xl shadow bg-white">
            <h2 className="font-bold text-xl text-gray-800">
              {s.name || s.id}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Submitted: {formatDate(s.submittedAt)}
            </p>

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
    </main>
  );
}
