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
  const router = useRouter();

  // ---------------------------
  // STATE
  // ---------------------------
  const [answers, setAnswers] = useState([]);
  const [liveStudents, setLiveStudents] = useState({});
  const [filter, setFilter] = useState("all");

  const [className, setClassName] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  // CHAT STATES
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  // ANNOUNCEMENT STATES
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");

  // UPCOMING CLASS STATES
  const [topic, setTopic] = useState("");
  const [teacher, setTeacher] = useState("");
  const [nextClassTime, setNextClassTime] = useState("");
  const [isUpcomingLive, setIsUpcomingLive] = useState(false);

  // ---------------------------
  // ADMIN LOGIN CHECK
  // ---------------------------
  useEffect(() => {
    const ok = localStorage.getItem("adminLogin");
    if (!ok) router.push("/admin/login");
  }, [router]);

  // ---------------------------
  // AUTH + ASSIGNMENTS
  // ---------------------------
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const q = query(
        collection(db, "assignments"),
        orderBy("submittedAt", "desc")
      );

      const unsubSnap = onSnapshot(q, (snapshot) => {
        setAnswers(snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        })));
      });

      return () => unsubSnap();
    });

    return () => unsubAuth();
  }, [router]);

  // ---------------------------
  // LIVE STUDENTS
  // ---------------------------
  useEffect(() => {
    const liveRef = ref(rtdb, "liveStudents");
    onValue(liveRef, (snap) => {
      setLiveStudents(snap.val() || {});
    });
  }, []);

  // ---------------------------
  // UPCOMING CLASS LOAD
  // ---------------------------
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "liveClassStatus", "active"), (snap) => {
      if (snap.exists()) {
        const d = snap.data();
        setTopic(d.topic || "");
        setTeacher(d.teacher || "");
        setNextClassTime(d.nextClassTime || "");
        setIsUpcomingLive(d.isLive || false);
      }
    });
    return () => unsub();
  }, []);

  // ---------------------------
  // CHAT USERS (RESTORED)
  // ---------------------------
  useEffect(() => {
    const q = query(collection(db, "chats"), orderBy("updatedAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setChatUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  // ---------------------------
  // CHAT MESSAGES (RESTORED + STABLE)
  // ---------------------------
  useEffect(() => {
    if (!selectedStudent) {
      setMessages([]);
      return;
    }

    setMessages([]);
    setReply("");

    const msgRef = collection(db, "chats", selectedStudent, "messages");
    const q = query(msgRef, orderBy("timestamp", "asc"));

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [selectedStudent]);

  // ---------------------------
  // SEND TEACHER MESSAGE
  // ---------------------------
  const sendTeacherReply = async () => {
    if (!reply.trim() || !selectedStudent) return;

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

  // ---------------------------
  // ANNOUNCEMENT (BATCH WISE)
  // ---------------------------
  const saveAnnouncement = async () => {
    if (!annTitle || !annMessage || !selectedBatch) {
      alert("Please fill all fields including batch");
      return;
    }

    await addDoc(collection(db, "announcements"), {
      title: annTitle,
      message: annMessage,
      batch: selectedBatch,
      timestamp: Date.now(),
    });

    await fetch("/api/send-announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: annTitle,
        message: annMessage,
        batch: selectedBatch,
      }),
    });

    setAnnTitle("");
    setAnnMessage("");
    setSelectedBatch("");
  };

  // ---------------------------
  // UPCOMING CLASS UPDATE
  // ---------------------------
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
  // LIVE CLASS CONTROLS
  // ---------------------------
  const startLiveClass = async () => {
    if (!className.trim()) return alert("Please enter class name");

    await setDoc(doc(db, "liveClass", "current"), {
      isLive: true,
      className,
      meetingUrl:
        meetingUrl || "https://meet.jit.si/OdiaITTrainingHubLiveClass",
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
  // FILTER
  // ---------------------------
  const filteredAnswers = useMemo(() => {
    if (filter === "auto") return answers.filter((a) => a.autoSubmitted);
    if (filter === "manual") return answers.filter((a) => !a.autoSubmitted);
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
  // UI
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
          className="bg-red-600 text-white px-5 py-2 rounded-lg shadow"
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
          className="bg-yellow-600 text-white px-5 py-2 rounded-lg shadow"
        >
          Post Announcement
        </button>
      </section>

      {/* UPCOMING CLASS */}
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
          className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg shadow"
        >
          Update Upcoming Class
        </button>
      </section>

      {/* CHAT SUPPORT */}
      <section className="bg-white shadow-xl rounded-2xl p-6 mb-10 border border-blue-100">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
          💬 Student Chat Support
        </h2>

        <div className="grid grid-cols-3 gap-6">
          <div className="border rounded-xl p-4 h-[350px] overflow-y-auto bg-gray-50">
            {chatUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => setSelectedStudent(u.id)}
                className={`p-3 mb-2 cursor-pointer rounded ${
                  selectedStudent === u.id
                    ? "bg-blue-100"
                    : "bg-white"
                }`}
              >
                {u.name || u.id}
              </div>
            ))}
          </div>

          <div className="col-span-2 border rounded-xl p-4 flex flex-col h-[350px] bg-gray-50">
            <div className="flex-1 overflow-y-auto bg-white p-3 mb-3 rounded">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`mb-2 ${
                    m.sender === "teacher" ? "text-right" : ""
                  }`}
                >
                  <span className="inline-block px-3 py-2 rounded bg-gray-200">
                    {m.text}
                  </span>
                </div>
              ))}
            </div>

            {selectedStudent && (
              <div className="flex gap-2">
                <input
                  className="border rounded flex-1 px-3 py-2"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <button
                  onClick={sendTeacherReply}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Send
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ASSIGNMENTS */}
      <h2 className="text-2xl font-bold mb-4">📄 Submitted Students</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredAnswers.map((s) => (
          <div key={s.id} className="bg-white p-5 rounded shadow">
            <h2 className="font-bold text-lg">{s.name || s.id}</h2>
            <p className="text-sm text-gray-500">
              Submitted: {formatDate(s.submittedAt)}
            </p>
            <button
              onClick={() => deleteDoc(doc(db, "assignments", s.id))}
              className="bg-red-600 text-white w-full mt-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
