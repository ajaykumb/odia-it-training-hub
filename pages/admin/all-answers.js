import { useEffect, useState, useMemo, useRef } from "react";
import { db, auth, rtdb } from "../../utils/firebaseConfig";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { ref, onValue, set } from "firebase/database";

/* ✅ LIVE CAMERA VIEWER COMPONENT (SAFE ADDITION) */
function LiveCameraViewer({ studentId }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!studentId) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const offerRef = ref(rtdb, `webrtc/${studentId}/offer`);
    const answerRef = ref(rtdb, `webrtc/${studentId}/answer`);
    const candidatesRef = ref(rtdb, `webrtc/${studentId}/candidates`);

    // ✅ Attach incoming video
    pc.ontrack = (event) => {
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    // ✅ Receive Offer → Send Answer
    onValue(offerRef, async (snapshot) => {
      if (!snapshot.exists()) return;

      const offer = snapshot.val();
      await pc.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await set(answerRef, answer);
    });

    // ✅ ICE Candidates
    onValue(candidatesRef, (snap) => {
      if (!snap.exists()) return;
      Object.values(snap.val()).forEach((c) => {
        pc.addIceCandidate(new RTCIceCandidate(c));
      });
    });

    return () => pc.close();
  }, [studentId]);

  return (
    <div className="mt-3 border rounded p-2 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-40 rounded"
      />
    </div>
  );
}

export default function AllAnswers() {
  const [answers, setAnswers] = useState([]);
  const [filter, setFilter] = useState("all"); // all | manual | auto
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const q = query(
        collection(db, "assignments"),
        orderBy("submittedAt", "desc")
      );

      const snapshot = await getDocs(q);
      const arr = [];

      snapshot.forEach((docData) => {
        arr.push({ id: docData.id, ...docData.data() });
      });

      setAnswers(arr);
    });

    return () => unsubscribe();
  }, [router]);

  // ✅ FILTERED DATA (AUTO vs MANUAL)
  const filteredAnswers = useMemo(() => {
    if (filter === "auto") {
      return answers.filter((a) => a.autoSubmitted === true);
    }
    if (filter === "manual") {
      return answers.filter((a) => a.autoSubmitted === false);
    }
    return answers;
  }, [answers, filter]);

  // ✅ SAFE DATE FORMATTER
  const formatDate = (d) => {
    if (!d) return "N/A";
    if (d.seconds) return new Date(d.seconds * 1000).toLocaleString();
    return new Date(d).toLocaleString();
  };

  // ✅ TIMER USED TEXT
  const getTimerUsed = (s) => {
    if (s.autoSubmitted) return "30:00 (Time Over)";
    return "Submitted Before Time Over";
  };

  // ✅ CAMERA STATUS TEXT
  const getCameraStatus = (s) => {
    if (s.cameraVerified) return "ON";
    return "OFF";
  };

  // ✅ DELETE HANDLER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student's answer?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "assignments", id));
      setAnswers((prev) => prev.filter((item) => item.id !== id));
      alert("Student answer deleted successfully.");
    } catch (err) {
      console.error("Delete Error:", err.message);
      alert("Failed to delete. Check Firestore rules.");
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        All Student Answers (Admin)
      </h1>

      {/* ✅ TOP BAR */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
        {/* ✅ FILTER BUTTONS */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("manual")}
            className={`px-4 py-2 rounded-md ${
              filter === "manual"
                ? "bg-green-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Manual Only
          </button>

          <button
            onClick={() => setFilter("auto")}
            className={`px-4 py-2 rounded-md ${
              filter === "auto"
                ? "bg-orange-600 text-white"
                : "bg-gray-200"
            }`}
          >
            Auto-Submitted Only
          </button>
        </div>

        {/* ✅ LOGOUT */}
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md"
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </div>

      {/* ✅ RESULT COUNT */}
      <p className="mb-4 text-sm text-gray-600">
        Showing <b>{filteredAnswers.length}</b> submissions
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredAnswers.map((s) => (
          <div
            key={s.id}
            className="p-4 border rounded-lg shadow bg-white"
          >
            {/* ✅ HEADER */}
            <div className="flex items-center gap-4 mb-4">
              {s.cameraImage ? (
                <img
                  src={s.cameraImage}
                  alt="Student Face"
                  className="w-28 h-24 object-cover border rounded-md"
                />
              ) : (
                <div className="w-28 h-24 flex items-center justify-center border rounded-md text-red-500 text-sm">
                  No Photo
                </div>
              )}

              <div>
                <h2 className="font-bold text-xl">{s.name}</h2>

                <p className="text-sm text-gray-600">
                  Submitted: {formatDate(s.submittedAt)}
                </p>

                {/* ✅ AUTO / MANUAL BADGE */}
                <span
                  className={`inline-block mt-1 px-3 py-1 text-xs rounded-full ${
                    s.autoSubmitted
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {s.autoSubmitted ? "AUTO SUBMITTED" : "MANUAL SUBMITTED"}
                </span>

                {/* ✅ CAMERA STATUS */}
                <span
                  className={`inline-block mt-1 ml-2 px-3 py-1 text-xs rounded-full ${
                    s.cameraVerified
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  Camera: {getCameraStatus(s)}
                </span>

                {/* ✅ TIMER USED */}
                <p className="text-sm mt-1">
                  ⏱ Timer Used:{" "}
                  <b className="text-gray-700">
                    {getTimerUsed(s)}
                  </b>
                </p>

                {s.studentId && (
                  <p className="text-sm font-semibold mt-1">
                    Student ID: {s.studentId}
                  </p>
                )}
              </div>
            </div>

            <hr className="my-3" />

            {/* ✅ LIVE CAMERA WITH SAFE FALLBACK FIX */}
            {(s.safeName || s.name) && (
              <LiveCameraViewer
                studentId={(s.safeName || s.name)
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, "_")}
              />
            )}

            {/* ✅ ALL ANSWERS (SORTED Q1 → QN) */}
            <div className="space-y-2 mb-4 mt-3">
              {s.answers &&
                Object.entries(s.answers)
                  .sort((a, b) => {
                    const numA = parseInt(a[0].replace("q", ""));
                    const numB = parseInt(b[0].replace("q", ""));
                    return numA - numB;
                  })
                  .map(([key, value]) => (
                    <p key={key}>
                      <b>{key.toUpperCase()}:</b>{" "}
                      {value ? value : (
                        <span className="text-red-500">-</span>
                      )}
                    </p>
                  ))}
            </div>

            {/* ✅ DELETE BUTTON */}
            <button
              onClick={() => handleDelete(s.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full"
            >
              Delete This Submission
            </button>
          </div>
        ))}

        {filteredAnswers.length === 0 && (
          <p className="text-center col-span-2 text-gray-500">
            No student submissions found for this filter.
          </p>
        )}
      </div>
    </main>
  );
}
