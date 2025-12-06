// pages/assignment.js

import { useState, useEffect, useRef } from "react";
import { db, rtdb } from "../utils/firebaseConfig";
import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, set, onDisconnect } from "firebase/database";

const GOOGLE_SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSq_FDI-zBgdDU-VgkVW7ZXb5XsmXDvTEInkvCkUtFzdjMdBEQoTYnnCwqaE5H55kFlN4DYCkzKHcmN/pub?gid=0&single=true&output=csv";

export default function Assignment() {
  // student info
  const [name, setName] = useState("");
  const [liveStudentId, setLiveStudentId] = useState(null);

  // dynamic questions & answers
  const [questions, setQuestions] = useState({});
  const [answers, setAnswers] = useState({});

  // UI state
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState("");
  const [cameraOn, setCameraOn] = useState(false);

  // new modal state
  const [showModal, setShowModal] = useState(false);

  // anti-cheat
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const visibilityCountRef = useRef(0);

  const videoRef = useRef(null);

  // ----------------------------
  // Utilities
  // ----------------------------
  const makeSafeName = (raw) =>
    raw
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "") || null;

  // ----------------------------
  // RESET on mount
  // ----------------------------
  useEffect(() => {
    localStorage.removeItem("examEndTime");
  }, []);

  // ----------------------------
  // Load questions
  // ----------------------------
  useEffect(() => {
    let mounted = true;

    const loadQuestions = async () => {
      try {
        const res = await fetch(GOOGLE_SHEET_CSV_URL + "&t=" + Date.now());
        const text = await res.text();

        const rows = text
          .trim()
          .split("\n")
          .map((r) => {
            const idx = r.indexOf(",");
            if (idx === -1) return [r.trim()];
            const k = r.slice(0, idx).trim();
            const v = r.slice(idx + 1).trim();
            return [k, v];
          });

        const qObj = {};
        const aObj = {};

        for (let i = 1; i < rows.length; i++) {
          const key = rows[i][0]?.trim();
          const value = rows[i][1]?.trim();
          if (key && value) {
            qObj[key] = value;
            aObj[key] = "";
          }
        }

        if (!mounted) return;

        setQuestions(qObj);

        const saved = localStorage.getItem("assignmentDraft");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const merged = { ...aObj, ...parsed };
            setAnswers(merged);
          } catch {
            setAnswers(aObj);
          }
        } else {
          setAnswers(aObj);
        }
      } catch (err) {
        setError("Failed to load questions. Reload page.");
      }
    };

    loadQuestions();
    return () => (mounted = false);
  }, []);

  // ----------------------------
  // Auto-save draft
  // ----------------------------
  useEffect(() => {
    localStorage.setItem("assignmentDraft", JSON.stringify(answers));
  }, [answers]);

  // ----------------------------
  // Prevent accidental refresh
  // ----------------------------
  useEffect(() => {
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  // ----------------------------
  // Camera init
  // ----------------------------
  useEffect(() => {
    let canceled = false;

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (canceled) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play?.();
          setCameraOn(true);
        }
      })
      .catch(() => {
        setError("Camera access is mandatory.");
        setCameraOn(false);
      });

    return () => {
      canceled = true;
      const stream = videoRef.current?.srcObject;
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  // ----------------------------
  // Stable student ID
  // ----------------------------
  useEffect(() => {
    if (!name.trim()) return setLiveStudentId(null);

    const t = setTimeout(() => {
      setLiveStudentId(makeSafeName(name));
    }, 600);

    return () => clearTimeout(t);
  }, [name]);

  // ----------------------------
  // Update live student list
  // ----------------------------
  useEffect(() => {
    if (!cameraOn || !liveStudentId) return;

    const liveRef = ref(rtdb, `liveStudents/${liveStudentId}`);
    set(liveRef, {
      name,
      status: "live",
      startedAt: Date.now(),
    });

    onDisconnect(liveRef).remove();

    return () => set(liveRef, null);
  }, [cameraOn, liveStudentId, name]);

  // ----------------------------
  // Timer + auto submit
  // ----------------------------
  useEffect(() => {
    let endTime = localStorage.getItem("examEndTime");
    if (!endTime) {
      endTime = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      localStorage.setItem("examEndTime", endTime);
    }

    const tick = () => {
      const diff = new Date(endTime) - new Date();
      if (diff <= 0) {
        setTimeLeft("Time Over");
        if (!submitted) autoSubmit("timeout");
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs}s`);
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [submitted]);

  // ----------------------------
  // Anti-cheat: visibility + blur
  // ----------------------------
  useEffect(() => {
    const mark = () => {
      visibilityCountRef.current++;
      setTabSwitchCount(visibilityCountRef.current);
      setError(
        `Warning: You switched tabs ${visibilityCountRef.current} times.`
      );

      if (visibilityCountRef.current >= 3 && !submitted) {
        autoSubmit("tab-switch");
      }
    };

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) mark();
    });

    window.addEventListener("blur", mark);

    return () => {
      document.removeEventListener("visibilitychange", mark);
      window.removeEventListener("blur", mark);
    };
  }, [submitted]);

  // ----------------------------
  // Remove live student
  // ----------------------------
  const removeLive = async (sid) => {
    if (sid) set(ref(rtdb, `liveStudents/${sid}`), null);
  };

  // ----------------------------
  // Auto submit helper
  // ----------------------------
  const autoSubmit = async (reason) => {
    const sid = makeSafeName(name);
    if (!sid) return;

    try {
      setLoading(true);

      await setDoc(doc(db, "assignments", sid), {
        name,
        safeName: sid,
        answers,
        cameraVerified: cameraOn,
        autoSubmitted: true,
        autoSubmitReason: reason,
        submittedAt: serverTimestamp(),
      });

      await removeLive(sid);

      setSubmitted(true);
      setSuccessMsg(
        reason === "timeout"
          ? "Time Over! Auto-submitted."
          : "Auto-submitted due to tab switching."
      );

      localStorage.removeItem("assignmentDraft");
      localStorage.removeItem("examEndTime");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Manual submit
  // ----------------------------
  const handleSubmit = async () => {
    if (!name.trim()) return setError("Enter your name.");
    if (!cameraOn) return setError("Camera must be ON.");

    const sid = makeSafeName(name);
    if (!sid) return setError("Invalid name.");

    setLoading(true);

    try {
      await setDoc(doc(db, "assignments", sid), {
        name,
        safeName: sid,
        answers,
        cameraVerified: true,
        autoSubmitted: false,
        submittedAt: serverTimestamp(),
      });

      await removeLive(sid);

      setSubmitted(true);
      setSuccessMsg("Assignment Submitted Successfully!");

      localStorage.removeItem("assignmentDraft");
      localStorage.removeItem("examEndTime");
    } catch (err) {
      setError("Submit failed.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // UI Rendering (Premium Design)
  // ----------------------------
  return (
    <>
      {/* FIXED NAVBAR */}
      <header className="fixed top-0 left-0 w-full bg-black/40 backdrop-blur-lg border-b border-white/20 shadow-md z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between p-3">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              className="h-10 w-10 rounded-md shadow-md"
              alt="Odia IT Training Hub"
            />
            <h1 className="text-white text-xl font-bold tracking-wide">
              Odia IT Training Hub — Assignment
            </h1>
          </div>

          <div className="text-yellow-300 text-lg font-bold">
            ⏳ {timeLeft}
          </div>
        </div>
      </header>

      {/* BACKGROUND */}
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800 flex items-center justify-center p-6 pt-24">

        {/* MAIN CARD */}
        <main className="w-full max-w-3xl bg-white/10 backdrop-blur-xl shadow-2xl border border-white/20 rounded-2xl p-8 animate-fadeIn">
          
          {!cameraOn && (
            <p className="text-red-400 text-center font-semibold mb-4">
              ⚠ Camera access is mandatory.
            </p>
          )}

          {submitted ? (
            <div className="bg-green-500/20 p-4 rounded text-center text-white border border-green-400/40">
              <h2 className="text-xl font-semibold">{successMsg}</h2>
              <p>You may close this page.</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Name Field */}
              <input
                type="text"
                placeholder="Enter Your Name"
                className="w-full p-3 rounded bg-white/20 text-white placeholder-gray-300 
                  border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || submitted}
              />

              {/* Camera */}
              <div className="text-center">
                <p className="text-red-300 font-bold mb-2">Live Camera (Mandatory)</p>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="mx-auto w-48 h-36 border border-white/30 rounded-lg bg-black shadow-md"
                />
              </div>

              {/* Questions Loop */}
              {Object.keys(questions).map((key) => (
                <div key={key}>
                  <label className="font-bold block text-white drop-shadow-md">
                    {questions[key]}
                  </label>
                  <textarea
                    className="w-full p-3 bg-white/20 text-white border border-white/30 rounded mt-2 
                      focus:outline-none focus:ring-2 focus:ring-blue-400"
                    rows="4"
                    value={answers[key] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [key]: e.target.value }))
                    }
                    disabled={loading || submitted}
                  />
                </div>
              ))}

              {tabSwitchCount > 0 && (
                <p className="text-yellow-300">
                  ⚠ You switched tabs {tabSwitchCount} times.
                </p>
              )}

              {error && <p className="text-red-300">{error}</p>}

              {/* Submit Button */}
              <button
                onClick={() => setShowModal(true)}
                disabled={loading || submitted || !cameraOn}
                className={`w-full py-3 rounded text-white text-lg font-semibold mt-4 
                  transition shadow-lg ${
                    loading || !cameraOn
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
              >
                {loading ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          )}
        </main>
      </div>

      {/* CONFIRMATION MODAL */}
      {showModal && !submitted && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-xl p-8 shadow-2xl w-full max-w-md text-center">

            <h2 className="text-white text-2xl font-bold mb-4">
              Confirm Submission
            </h2>
            <p className="text-gray-200 mb-6">
              Are you sure you want to submit?  
              You cannot edit after submission.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 bg-gray-400 hover:bg-gray-500 rounded text-black font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-semibold shadow-lg"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
