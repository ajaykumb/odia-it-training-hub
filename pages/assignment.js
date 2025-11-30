import { useState, useEffect, useRef } from "react";
import { db, rtdb } from "../utils/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import { ref, set, onDisconnect } from "firebase/database";

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSq_FDI-zBgdDU-VgkVW7ZXb5XsmXDvTEInkvCkUtFzdjMdBEQoTYnnCwqaE5H55kFlN4DYCkzKHcmN/pub?gid=0&single=true&output=csv";

export default function Assignment() {
  const [name, setName] = useState("");
  const [liveStudentId, setLiveStudentId] = useState(null);

  const [answers, setAnswers] = useState({ q1: "", q2: "", q3: "" });
  const [questions, setQuestions] = useState({ q1: "", q2: "", q3: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [cameraOn, setCameraOn] = useState(false);

  const videoRef = useRef(null);

  // ✅ RESET FOR NEW ATTEMPT
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

  // ✅ PREVENT REFRESH WARNING
  useEffect(() => {
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  // ✅ CAMERA INIT
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
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

  // ✅ STABLE LIVE STUDENT ID (DEBOUNCED)
  useEffect(() => {
    if (!name.trim()) return;

    const timeout = setTimeout(() => {
      const stableId = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_");

      setLiveStudentId(stableId);
    }, 1200);

    return () => clearTimeout(timeout);
  }, [name]);

  // ✅ PUSH LIVE STUDENT TO RTDB (CLEAN)
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
      set(liveRef, null); // ✅ clean old entries
    };
  }, [cameraOn, liveStudentId]);

  // ✅ 30 MINUTE TIMER WITH AUTO SUBMIT
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

  // ✅ REMOVE LIVE AFTER SUBMIT
  const removeLive = async () => {
    if (liveStudentId) {
      await set(ref(rtdb, `liveStudents/${liveStudentId}`), null);
    }
  };

  // ✅ AUTO SUBMIT
  const autoSubmit = async () => {
    if (!name.trim()) return;

    try {
      const safeName = liveStudentId;

      await addDoc(collection(db, "assignments"), {
        name,
        safeName,
        answers,
        cameraVerified: cameraOn,
        autoSubmitted: true,
        submittedAt: new Date().toISOString(),
      });

      await removeLive();

      setSubmitted(true);
      setSuccessMsg("Time Over! Assignment Auto Submitted.");
      localStorage.removeItem("assignmentDraft");
      localStorage.removeItem("examEndTime");
    } catch (err) {
      console.error("Auto submit error:", err);
    }
  };

  // ✅ MANUAL SUBMIT
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!cameraOn) {
      setError("Camera must be ON.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const safeName = liveStudentId;

      await addDoc(collection(db, "assignments"), {
        name,
        safeName,
        answers,
        cameraVerified: true,
        autoSubmitted: false,
        submittedAt: new Date().toISOString(),
      });

      await removeLive();

      setSubmitted(true);
      setSuccessMsg("Assignment Submitted Successfully!");
      localStorage.removeItem("assignmentDraft");
      localStorage.removeItem("examEndTime");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Assignment</h1>

      <p className="text-red-600 font-bold text-center mb-4">
        Time Left: {timeLeft}
      </p>

      {!cameraOn && (
        <p className="text-red-600 text-center font-semibold mb-4">
          ⚠ Camera access is mandatory.
        </p>
      )}

      {submitted ? (
        <div className="bg-green-200 p-4 rounded text-center">
          <h2 className="text-xl font-semibold">{successMsg}</h2>
          <p>You can close this page.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Your Name"
            className="w-full p-3 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="text-center">
            <p className="text-red-600 font-bold mb-2">
              Live Camera (Mandatory)
            </p>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="mx-auto w-48 h-36 border rounded"
            />
          </div>

          {Object.keys(questions).map((key) => (
            <div key={key}>
              <label className="font-bold">{questions[key]}</label>
              <textarea
                className="w-full p-3 border rounded mt-2"
                rows="4"
                value={answers[key]}
                onChange={(e) =>
                  setAnswers({ ...answers, [key]: e.target.value })
                }
              ></textarea>
            </div>
          ))}

          {error && <p className="text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || submitted || !cameraOn}
            className={`px-6 py-3 rounded text-white ${
              loading || !cameraOn
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      )}
    </main>
  );
}
