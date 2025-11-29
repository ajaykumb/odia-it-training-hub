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

  // ✅ CAMERA STATE
  const [cameraImage, setCameraImage] = useState(null);

  // 🔵 Assignment Questions
  const questions = {
    q1: "1) What is a Primary Key in SQL?",
    q2: "2) Write a PL/SQL block to print 'Hello World'.",
    q3: "3) What is the difference between VARCHAR and CHAR?",
  };

  // ✅ TIMER COUNTDOWN
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

  // ✅ AUTO SAVE DRAFT
  useEffect(() => {
    const saved = localStorage.getItem("assignmentDraft");
    if (saved) setAnswers(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("assignmentDraft", JSON.stringify(answers));
  }, [answers]);

  // ✅ PREVENT REFRESH / BACK
  useEffect(() => {
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, []);

  // ✅ START CAMERA AUTOMATICALLY
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        const video = document.getElementById("studentCam");
        if (video) video.srcObject = stream;
      })
      .catch((err) => {
        console.log("Camera permission denied", err);
      });
  }, []);

  // ✅ CAPTURE PHOTO FUNCTION
  const capturePhoto = () => {
    const video = document.getElementById("studentCam");
    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, 320, 240);
    const imageData = canvas.toDataURL("image/png");
    setCameraImage(imageData);
    return imageData;
  };

  // ✅ SUBMIT LOGIC WITH CAMERA SAVE
  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (!answers.q1 || !answers.q2 || !answers.q3) {
      setError("Please answer all questions");
      return;
    }

    if (new Date() > DEADLINE) {
      setError("Assignment submission is closed.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const safeName = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "_");

      const docRef = doc(db, "assignments", safeName);

      // ✅ CAPTURE CAMERA IMAGE
      const cameraSnap = capturePhoto();

      await setDoc(docRef, {
        name,
        safeName,
        answers,
        cameraImage: cameraSnap, // ✅ PHOTO SAVED
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

          {/* ✅ CAMERA PREVIEW */}
          <div className="mb-6 text-center">
            <p className="font-semibold mb-2 text-red-600">Face Verification</p>
            <video
              id="studentCam"
              autoPlay
              className="mx-auto w-48 h-36 border rounded-md shadow"
            ></video>
          </div>

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
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
              ></textarea>
            </div>
          ))}

          {error && <p className="text-red-600">{error}</p>}

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
