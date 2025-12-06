import { useEffect, useState, useMemo } from "react";
import { db, auth, rtdb } from "../../utils/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  setDoc
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { ref, onValue } from "firebase/database";

export default function AllAnswers() {
  const [answers, setAnswers] = useState([]);
  const [liveStudents, setLiveStudents] = useState({});
  const [filter, setFilter] = useState("all");

  // ⭐ New states for Teacher Live Control
  const [className, setClassName] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  const router = useRouter();

  // AUTH + SUBMISSIONS
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const q = query(collection(db, "assignments"), orderBy("submittedAt", "desc"));

      const unsubSnap = onSnapshot(
        q,
        (snapshot) => {
          const arr = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

          setAnswers(arr);
        },
        (err) => console.error(err)
      );

      return () => unsubSnap();
    });

    return () => unsubAuth();
  }, [router]);

  // LIVE STUDENTS (RTDB)
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

  // DATE FORMAT
  const formatDate = (d) => {
    if (!d) return "N/A";
    if (typeof d?.toDate === "function") return d.toDate().toLocaleString();
    if (d.seconds) return new Date(d.seconds * 1000).toLocaleString();
    try {
      return new Date(d).toLocaleString();
    } catch {
      return String(d);
    }
  };

  // DELETE SUBMISSION
  const handleDelete = async (id) => {
    const ok = window.confirm("Delete this submission?");
    if (!ok) return;

    await deleteDoc(doc(db, "assignments", id));
    setAnswers((prev) => prev.filter((i) => i.id !== id));
  };

  // ⭐ TEACHER LIVE CLASS CONTROLS
  const startLiveClass = async () => {
    if (!className.trim()) return alert("Please enter class name");

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

  return (
    <main className="p-6 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => signOut(auth)}>
          Logout
        </button>
      </div>

      {/* ⭐ NEW SECTION — TEACHER LIVE CLASS CONTROL */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-10 border">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">🎥 Teacher Live Class Control</h2>

        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Enter Class Name (Example: Green Batch SQL)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Paste Meeting URL (Google Meet / Zoom / Teams)"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
        />

        <button
          onClick={startLiveClass}
          className="w-full bg-green-600 text-white p-3 rounded-lg mb-3 hover:bg-green-700"
        >
          Start Live Class
        </button>

        <button
          onClick={joinAsTeacher}
          className="w-full bg-blue-600 text-white p-3 rounded-lg mb-3 hover:bg-blue-700"
        >
          Join as Teacher
        </button>

        <button
          onClick={stopLiveClass}
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
        >
          Stop Live Class
        </button>
      </div>

      {/* LIVE STUDENT MONITORING */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-3">🔴 LIVE STUDENT MONITORING</h2>

        <p className="text-lg font-semibold mb-2">
          Live Students Connected: {Object.keys(liveStudents).length}
        </p>

        {Object.keys(liveStudents).length === 0 && (
          <p className="text-red-500">❌ No students are live right now.</p>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(liveStudents).map(([id, s]) => (
            <div key={id} className="border p-4 rounded shadow bg-green-50">
              <p className="font-bold">{s.name}</p>
              <p className="text-green-600 font-semibold">LIVE 🎥</p>
            </div>
          ))}
        </div>
      </div>

      {/* FILTER BUTTONS */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>All</button>
        <button onClick={() => setFilter("manual")} className={`px-4 py-2 rounded ${filter === "manual" ? "bg-green-600 text-white" : "bg-gray-200"}`}>Manual Only</button>
        <button onClick={() => setFilter("auto")} className={`px-4 py-2 rounded ${filter === "auto" ? "bg-orange-600 text-white" : "bg-gray-200"}`}>Auto-Submitted Only</button>
      </div>

      {/* SUBMITTED STUDENTS */}
      <h2 className="text-2xl font-bold mb-4">✅ SUBMITTED STUDENTS</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredAnswers.map((s) => (
          <div key={s.id} className="p-4 border rounded shadow bg-white">
            <h2 className="font-bold text-xl">{s.name || s.safeName || s.id}</h2>

            <p className="text-sm text-gray-600 mt-1">Submitted: {formatDate(s.submittedAt)}</p>

            <div className="mt-2 space-x-2">
              <span className={`px-2 py-1 text-xs rounded ${s.autoSubmitted ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                {s.autoSubmitted ? "AUTO SUBMITTED" : "MANUAL SUBMITTED"}
              </span>

              <span className={`px-2 py-1 text-xs rounded ${s.cameraVerified ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
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
                  <p key={k}>
                    <b>{k.toUpperCase()}:</b> {v || "-"}
                  </p>
                ))}
            </div>

            <button
              onClick={() => handleDelete(s.id)}
              className="bg-red-500 text-white w-full mt-4 py-2 rounded"
            >
              Delete Submission
            </button>
          </div>
        ))}

        {filteredAnswers.length === 0 && <p>No submitted students found.</p>}
      </div>
    </main>
  );
}
