import { useState, useEffect, useRef } from "react";
import { db, rtdb } from "../utils/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, set, onDisconnect } from "firebase/database";

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSq_FDI-zBgdDU-VgkVW7ZXb5XsmXDvTEInkvCkUtFzdjMdBEQoTYnnCwqaE5H55kFlN4DYCkzKHcmN/pub?gid=0&single=true&output=csv";

export default function Assignment() {
  const [name, setName] = useState("");
  const [liveStudentId, setLiveStudentId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [questions, setQuestions] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef(null);
  const pcRef = useRef(null);

  // ✅ Load Questions
  useEffect(() => {
    fetch(GOOGLE_SHEET_CSV_URL)
      .then((r) => r.text())
      .then((text) => {
        const rows = text.split("\n").map((r) => r.split(","));
        const q = {};
        rows.slice(1).forEach((r) => (q[r[0]] = r[1]));
        setQuestions(q);
      });
  }, []);

  // ✅ Camera Init + WebRTC Sender
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      videoRef.current.srcObject = stream;
      setCameraOn(true);

      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          {
            urls: "turn:openrelay.metered.ca:80",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
          {
            urls: "turn:openrelay.metered.ca:443",
            username: "openrelayproject",
            credential: "openrelayproject",
          },
        ],
      });

      stream.getTracks().forEach((t) => pc.addTrack(t, stream));
      pcRef.current = pc;
    });
  }, []);

  // ✅ Stable student ID
  useEffect(() => {
    if (!name) return;
    const t = setTimeout(() => {
      setLiveStudentId(name.toLowerCase().replace(/[^a-z0-9]+/g, "_"));
    }, 1000);
    return () => clearTimeout(t);
  }, [name]);

  // ✅ Push Live Student
  useEffect(() => {
    if (!liveStudentId || !cameraOn) return;

    const liveRef = ref(rtdb, `liveStudents/${liveStudentId}`);
    set(liveRef, { name, live: true });
    onDisconnect(liveRef).remove();
  }, [liveStudentId, cameraOn]);

  // ✅ Timer
  useEffect(() => {
    const end = Date.now() + 30 * 60 * 1000;
    const t = setInterval(() => {
      const d = end - Date.now();
      setTimeLeft(
        `${Math.floor(d / 60000)}m ${Math.floor((d % 60000) / 1000)}s`
      );
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // ✅ Submit
  const handleSubmit = async () => {
    await addDoc(collection(db, "assignments"), {
      name,
      safeName: liveStudentId,
      answers,
      cameraVerified: true,
      autoSubmitted: false,
      submittedAt: new Date().toISOString(),
    });

    await set(ref(rtdb, `liveStudents/${liveStudentId}`), null);
    setSubmitted(true);
  };

  return (
    <main className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl text-center font-bold">Assignment</h1>

      <p className="text-center text-red-600">Time Left: {timeLeft}</p>

      <input
        className="w-full p-3 border mt-4"
        placeholder="Enter Name"
        onChange={(e) => setName(e.target.value)}
      />

      <p className="text-red-600 mt-4">Live Camera (Mandatory)</p>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-48 h-36 border"
      />

      {Object.keys(questions).map((k) => (
        <div key={k}>
          <b>{questions[k]}</b>
          <textarea
            className="w-full p-2 border"
            onChange={(e) =>
              setAnswers({ ...answers, [k]: e.target.value })
            }
          />
        </div>
      ))}

      <button
        className="bg-blue-600 text-white px-6 py-2 mt-4"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </main>
  );
}
