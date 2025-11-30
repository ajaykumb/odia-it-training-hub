import { useState, useEffect, useRef } from "react";
import { db, rtdb } from "../utils/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, set, onDisconnect, push } from "firebase/database";

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSq_FDI-zBgdDU-VgkVW7ZXb5XsmXDvTEInkvCkUtFzdjMdBEQoTYnnCwqaE5H55kFlN4DYCkzKHcmN/pub?gid=0&single=true&output=csv";

export default function Assignment() {
  const [name, setName] = useState("");
  const [liveStudentId, setLiveStudentId] = useState(null);
  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "", q4: "" });
  const [questions, setQuestions] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef(null);

  // ✅ RESET
  useEffect(() => {
    localStorage.removeItem("examEndTime");
    localStorage.removeItem("assignmentDraft");
  }, []);

  // ✅ LOAD QUESTIONS
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await fetch(GOOGLE_SHEET_CSV_URL + "&t=" + Date.now());
        const text = await res.text();
        const rows = text.split("\n").map((r) => r.split(","));
        const qObj = {};

        for (let i = 1; i < rows.length; i++) {
          const key = rows[i][0]?.trim();
          const value = rows[i][1]?.trim();
          if (key && value) qObj[key] = value;
        }

        setQuestions(qObj);
      } catch {
        setError("Failed to load questions.");
      }
    };

    loadQuestions();
  }, []);

  // ✅ AUTO SAVE DRAFT
  useEffect(() => {
    const saved = localStorage.getItem("assignmentDraft");
    if (saved) setAnswers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("assignmentDraft", JSON.stringify(answers));
  }, [answers]);

  // ✅ CAMERA INIT
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraOn(true);
        }
      })
      .catch(() => {
        setCameraOn(false);
        setError("Camera access is mandatory.");
      });
  }, []);

  // ✅ STABLE STUDENT ID
  useEffect(() => {
    if (!name.trim()) return;

    const t = setTimeout(() => {
      const safe = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_");

      setLiveStudentId(safe);
    }, 1000);

    return () => clearTimeout(t);
  }, [name]);

  // ✅ PUSH LIVE STUDENT TO RTDB
  useEffect(() => {
    if (!cameraOn || !liveStudentId) return;

    const liveRef = ref(rtdb, `liveStudents/${liveStudentId}`);

    set(liveRef, {
      name,
      status: "live",
      startedAt: Date.now(),
    });

    onDisconnect(liveRef).remove();

    return () => {
      set(liveRef, null);
    };
  }, [cameraOn, liveStudentId]);

  // ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅
  // ✅ WEBRTC SENDER (THIS FIXES BLACK SCREEN)
  // ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅ ✅
  useEffect(() => {
    if (!cameraOn || !liveStudentId || !videoRef.current) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const offerRef = ref(rtdb, `${liveStudentId}/offer`);
    const candidatesRef = ref(rtdb, `${liveStudentId}/candidates`);

    const stream = videoRef.current.srcObject;
    stream.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        push(candidatesRef, event.candidate.toJSON());
      }
    };

    const createOffer = async () => {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      await set(offerRef, offer);
    };

    createOffer();

    return () => pc.close();
  }, [cameraOn, liveStudentId]);

  // ✅ 30 MIN TIMER
  useEffect(() => {
    let endTime = localStorage.getItem("examEndTime");

    if (!endTime) {
      endTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      localStorage.setItem("examEndTime", endTime);
    }

    const timer = setInterval(() => {
      const diff = new Date(endTime) - new Date();

      if (diff <= 0) {
        clearInterval(timer);
        setTimeLeft("Time Over");
        if (!submitted) autoSubmit();
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [submitted]);

  const removeLive = async () => {
    if (liveStudentId) {
      await set(ref(rtdb, `liveStudents/${liveStudentId}`), null);
    }
  };

  // ✅ AUTO SUBMIT
  const autoSubmit = async () => {
    if (!name.trim()) return;

    try {
      await addDoc(collection(db, "assignments"), {
        name,
        safeName: liveStudentId,
        answers,
        cameraVerified: cameraOn,
        autoSubmitted: true,
        submittedAt: new Date().toISOString(),
      });

      await removeLive();
      setSubmitted(true);
      setSuccessMsg("Time Over! Auto Submitted.");
      localStorage.clear();
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ MANUAL SUBMIT
  const handleSubmit = async () => {
    if (!name.trim()) return setError("Enter name");
    if (!cameraOn) return setError("Camera required");

    setLoading(true);
    setError("");

    try {
      await addDoc(collection(db, "assignments"), {
        name,
        safeName: liveStudentId,
        answers,
        cameraVerified: true,
        autoSubmitted: false,
        submittedAt: new Date().toISOString(),
      });

      await removeLive();
      setSubmitted(true);
      setSuccessMsg("Submitted Successfully!");
      localStorage.clear();
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-4">Assignment</h1>
      <p className="text-red-600 font-bold text-center mb-4">
        Time Left: {timeLeft}
      </p>

      {submitted ? (
        <div className="bg-green-200 p-4 rounded text-center">
          {successMsg}
        </div>
      ) : (
        <>
          <input
            className="w-full p-3 border rounded mb-4"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="mx-auto w-48 h-36 border rounded mb-4"
          />

          {Object.keys(questions).map((key) => (
            <textarea
              key={key}
              className="w-full border p-2 mb-3"
              value={answers[key] || ""}
              onChange={(e) =>
                setAnswers({ ...answers, [key]: e.target.value })
              }
            />
          ))}

          <button
            onClick={handleSubmit}
            disabled={loading || !cameraOn}
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Submit
          </button>
        </>
      )}
    </main>
  );
}
