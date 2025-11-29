import { useState } from "react";
import { db } from "../utils/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

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

  // 🔵 Assignment Questions
  const questions = {
    q1: "1) What is a Primary Key in SQL?",
    q2: "2) Write a PL/SQL block to print 'Hello World'.",
    q3: "3) What is the difference between VARCHAR and CHAR?",
  };

  // 🔵 SUBMIT LOGIC (NO READ → ALWAYS WORKS)
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // -----------------------------
      // Safe Firestore document ID
      // -----------------------------
      const safeName = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_");

      if (!safeName) {
        setError("Invalid name");
        setLoading(false);
        return;
      }

      // 🔥 Direct create — NO getDoc()
      const docRef = doc(db, "assignments", safeName);

      await setDoc(docRef, {
        name,
        safeName,
        answers,
        submittedAt: new Date().toISOString(),
      });

      setSubmitted(true);
      setSuccessMsg("Assignment submitted successfully!");
    } catch (err) {
      console.error(err);
      setError("Error submitting assignment.");
    }

    setLoading(false);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Assignment</h1>

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
              ></textarea>
            </div>
          ))}

          {error && <p className="text-red-600">{error}</p>}

          {/* SUBMIT BUTTON */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      )}
    </main>
  );
}
