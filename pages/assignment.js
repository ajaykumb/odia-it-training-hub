// pages/assignment.js
import { useState, useEffect, useRef } from "react";
import { db, rtdb } from "../utils/firebaseConfig";
import {
  collection,
  // addDoc, // not used
  doc,
  setDoc,
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

  // anti-cheat: count times page hidden / blurred
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
  // RESET on mount (fresh attempt)
  // ----------------------------
  useEffect(() => {
    localStorage.removeItem("examEndTime");
    // do not remove assignmentDraft here if you want restore on reload - optional
    // localStorage.removeItem("assignmentDraft");
  }, []);

  // ----------------------------
  // Load questions from Google Sheet & init answers
  // ----------------------------
  useEffect(() => {
    let mounted = true;
    const loadQuestions = async () => {
      try {
        const res = await fetch(GOOGLE_SHEET_CSV_URL + "&t=" + Date.now());
        const text = await res.text();

        // Robust CSV split (works for simple CSV: key,question)
        const rows = text
          .trim()
          .split("\n")
          .map((r) => {
            // split only first comma so question may contain commas
            const idx = r.indexOf(",");
            if (idx === -1) return [r];
            return [r.slice(0, idx), r.slice(idx + 1)];
          });

        const qObj = {};
        const aObj = {};

        for (let i = 1; i < rows.length; i++) {
          const key = rows[i][0]?.trim();
          const value = rows[i][1]?.trim();
          if (key && value) {
            qObj[key] = value;
            aObj[key] = ""; // create corresponding answer key
          }
        }

        if (!mounted) return;
        setQuestions(qObj);

        // If there's a saved draft, prefer it; otherwise use new aObj
        const saved = localStorage.getItem("assignmentDraft");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            // ensure we include all keys from sheet (merge)
            const merged = { ...aObj, ...parsed };
            setAnswers(merged);
          } catch {
            setAnswers(aObj);
          }
        } else {
          setAnswers(aObj);
        }
      } catch (e) {
        console.error("Failed to load questions:", e);
        setError("Failed to load questions. Try reloading the page.");
      }
    };

    loadQuestions();
    return () => {
      mounted = false;
    };
  }, []);

  // ----------------------------
  // Auto-save draft to localStorage
  // ----------------------------
  useEffect(() => {
    try {
      localStorage.setItem("assignmentDraft", JSON.stringify(answers));
    } catch (e) {
      // ignore storage errors
    }
  }, [answers]);

  // ----------------------------
  // Prevent accidental refresh/close
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
    let cancelled = false;
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (cancelled) {
          // stop tracks if not needed
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play?.();
          setCameraOn(true);
        }
      })
      .catch((err) => {
        console.warn("Camera error:", err);
        setCameraOn(false);
        setError("Camera access is mandatory. Please allow camera and refresh.");
      });

    return () => {
      cancelled = true;
      // stop camera if attached
      try {
        const stream = videoRef.current?.srcObject;
        if (stream) {
          stream.getTracks().forEach((t) => t.stop());
        }
      } catch (e) {}
    };
  }, []);

  // ----------------------------
  // Stable student id (debounced)
  // ----------------------------
  useEffect(() => {
    if (!name.trim()) {
      setLiveStudentId(null);
      return;
    }
    const to = setTimeout(() => {
      const sid = makeSafeName(name);
      setLiveStudentId(sid);
    }, 800);

    return () => clearTimeout(to);
  }, [name]);

  // ----------------------------
  // Push live student entry to RTDB and cleanup with onDisconnect
  // ----------------------------
  useEffect(() => {
    if (!cameraOn || !liveStudentId) return;
    const liveRef = ref(rtdb, `liveStudents/${liveStudentId}`);

    // push live status
    set(liveRef, {
      name,
      status: "live",
      startedAt: Date.now(),
    }).catch((e) => {
      console.warn("RTDB set error:", e);
    });

    // Ensure removal on disconnect
    onDisconnect(liveRef).remove();

    // cleanup function: remove entry when component unmounts / student leaves
    return () => {
      set(liveRef, null).catch(() => {});
    };
  }, [cameraOn, liveStudentId, name]);

  // ----------------------------
  // Timer: 30 minutes default, auto-submit at end
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
        if (!submitted) {
          autoSubmit("timeout");
        }
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs}s`);
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [submitted]);

  // ----------------------------
  // Anti-cheat: detect visibilitychange & blur/focus
  // counts switches; auto-submit after 3 switches
  // ----------------------------
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        visibilityCountRef.current += 1;
        setTabSwitchCount(visibilityCountRef.current);
        setError(
          `Warning: You switched tabs or minimized the browser (${visibilityCountRef.current} times). Avoid switching.`
        );

        // auto-submit after 3 switches
        if (visibilityCountRef.current >= 3 && !submitted) {
          autoSubmit("tab-switch");
        }
      } else {
        // regained focus
        setError("");
      }
    };

    const handleBlur = () => {
      visibilityCountRef.current += 1;
      setTabSwitchCount(visibilityCountRef.current);
      setError(
        `Warning: You left the page (${visibilityCountRef.current} times). Avoid switching.`
      );
      if (visibilityCountRef.current >= 3 && !submitted) {
        autoSubmit("tab-switch");
      }
    };

    const handleFocus = () => {
      // clear any non-critical error when back
      setError("");
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  // ----------------------------
  // Remove live student from RTDB
  // ----------------------------
  const removeLive = async () => {
    if (liveStudentId) {
      try {
        await set(ref(rtdb, `liveStudents/${liveStudentId}`), null);
      } catch (e) {
        console.warn("removeLive error:", e);
      }
    }
  };

  // ----------------------------
  // Auto submit helper (used by timer and anti-cheat)
  // reason: "timeout" | "tab-switch"
  // ----------------------------
  const autoSubmit = async (reason = "auto") => {
    if (!name.trim() || !liveStudentId) {
      console.warn("autoSubmit skipped: missing name or liveStudentId");
      return;
    }

    try {
      setLoading(true);
      await setDoc(doc(db, "assignments", liveStudentId), {
        name,
        safeName: liveStudentId,
        answers,
        cameraVerified: cameraOn,
        autoSubmitted: true,
        submittedAt: new Date(),
        autoSubmitReason: reason,
      });

      await removeLive();

      setSubmitted(true);
      setSuccessMsg(
        reason === "timeout"
          ? "Time Over! Assignment Auto-Submitted."
          : reason === "tab-switch"
          ? "Auto-Submitted due to multiple tab switches."
          : "Assignment Auto-Submitted."
      );

      localStorage.removeItem("assignmentDraft");
      localStorage.removeItem("examEndTime");
      setError("");
    } catch (err) {
      console.error("Auto submit error:", err);
      setError("Auto-submit failed. Please contact admin.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // Manual submit (user clicks)
  // ----------------------------
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!cameraOn) {
      setError("Camera must be ON.");
      return;
    }

    if (!liveStudentId) {
      setError("Invalid student id. Please change name and try again.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await setDoc(doc(db, "assignments", liveStudentId), {
        name,
        safeName: liveStudentId,
        answers,
        cameraVerified: true,
        autoSubmitted: false,
        submittedAt: new Date(),
      });

      await removeLive();

      setSubmitted(true);
      setSuccessMsg("Assignment Submitted Successfully!");
      localStorage.removeItem("assignmentDraft");
      localStorage.removeItem("examEndTime");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err?.message || "Submit failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------
  // UI render
  // ----------------------------
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Assignment</h1>

      <p className="text-red-600 font-bold text-center mb-2">
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
          <p>You can now close this page.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter Your Name"
            className="w-full p-3 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading || submitted}
          />

          <div className="text-center">
            <p className="text-red-600 font-bold mb-2">Live Camera (Mandatory)</p>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="mx-auto w-48 h-36 border rounded bg-black"
            />
          </div>

          {Object.keys(questions).length === 0 && (
            <p className="text-gray-600">Loading questions…</p>
          )}

          {Object.keys(questions).map((key) => (
            <div key={key}>
              <label className="font-bold block">{questions[key]}</label>
              <textarea
                className="w-full p-3 border rounded mt-2"
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
            <p className="text-yellow-600">
              ⚠ You switched away from the test {tabSwitchCount} time
              {tabSwitchCount > 1 ? "s" : ""}. Avoid switching tabs.
            </p>
          )}

          {error && <p className="text-red-600">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading || submitted || !cameraOn}
            className={`px-6 py-3 rounded text-white ${
              loading || !cameraOn ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      )}
    </main>
  );
}
