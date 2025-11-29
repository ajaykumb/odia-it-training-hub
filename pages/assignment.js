import { useState, useEffect } from "react";
import { db } from "../utils/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

// 🔴 CHANGE DEADLINE HERE
const DEADLINE = new Date("2025-12-05T23:59:00");

export default function Assignment() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState({
    q1: "",
    q2: "",
    q3: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  // 🔵 Assignment Questions
  const questions = {
    q1: "1) What is a Primary Key in SQL?",
    q2: "2) Write a PL/SQL block to print 'Hello World'.",
    q3: "3) What is the difference between VARCHAR and CHAR?",
  };

  // ✅ 2️⃣ TIMER COUNTDOWN
  useEffect(() => {
    const timer = setInterval(() => {
      const diff = DEADLINE - new Date();
      if (diff <= 0) {
        setTimeLeft("Time Over");
        clearInterval(timer);
      } else {
        const mins = Math.floor(diff / 60000);
        const secs = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${mins}m ${secs}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ✅ 4️⃣ AUTO SAVE DRAFT
  useEffect(() => {
    const saved = localStorage.getItem("assignmentDraft");
    if (saved) setAnswers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("assignmentDraft", JSON.stringify(answers));
  }, [answers]);

  // ✅ 5️⃣ PREVENT REFRESH / BACK
  useEffect(() => {
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  // ✅ SUBMIT LOGIC WITH ALL PROTECTIONS
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!answers.q1 || !answers.q2 || !answers.q3) {
      setError("Please answer all questions");
      return;
    }

    // ✅ 1️⃣ DEADLINE LOCK
    if (new Date() > DEADLINE) {
      setError("Assignment submission is closed.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Safe Firestore document ID
      const safeName = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_");

      const docRef = doc(db, "assignments", safeName);

      await setDoc(docRef, {
        name,
        safeName,
        answers,
        submittedAt: new Date().toISOString(),
      });

      setSubmitted(true);
      setSuccessMsg("Assignment submitted successfully!");
      localStorage.removeItem("assignmentDraft");
    } catch (err) {
      console.error(err);
      setError("Error submitting assignment.");
    }

    setLoading(false);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Assignment</h1>

      {/* ✅ TIMER DISPLAY */}
      <p className="text-red-600 font-bold text-center mb-4">
        Time Left: {timeLeft}
      </p>

      {submitted ? (
        <div className="bg-green-200 p-4 rounded-md text-center">
          <h2 className="text-xl font-semibold">{successMsg}</h2>
          <p>You can close this page now.</p>
        </div>
      ) : (
        <div className="space-y-4">

          {/* NAME INPUT */}
          <input
            type="text"
            placeholder="Enter Your Name"
            className="w-full p-3 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* QUESTIONS */}
          {Object.keys(questions).map((key) => (
            <div key={key}>
              <label className="font-bold">{questions[key]}</label>
              <textarea
                className="w-full p-3 border rounded-md mt-2"
                rows="4"
                value={answers[key]}
                onChange={(e) =>
                  setAnswers({ ...answers, [key]: e.target.value })
                }
                // ✅ 3️⃣ DISABLE COPY–PASTE
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
              ></textarea>
            </div>
          ))}

          {error && <p className="text-red-600">{error}</p>}

          {/* ✅ 6️⃣ DOUBLE SUBMIT PROTECTION */}
          <button
            onClick={handleSubmit}
            disabled={loading || submitted}
            className={`px-6 py-3 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      )}
    </main>
  );
}
