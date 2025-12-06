import { useState } from "react";
import { db } from "../utils/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function TeacherLive() {
  const [className, setClassName] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  const startLiveClass = async () => {
    if (!className.trim()) {
      alert("Please enter class name");
      return;
    }

    try {
      await setDoc(doc(db, "liveClass", "current"), {
        isLive: true,
        className,
        meetingUrl:
          meetingUrl || "https://meet.jit.si/OdiaITTrainingHubLiveClass",
        startedAt: Date.now(),
      });

      alert("Live class started!");
    } catch (err) {
      console.error("Firestore write error:", err);
      alert("Error starting live class (check console)");
    }
  };

  const stopLiveClass = async () => {
    try {
      await setDoc(doc(db, "liveClass", "current"), {
        isLive: false,
        className: "",
        meetingUrl: "",
        endedAt: Date.now(),
      });

      alert("Live class stopped!");
    } catch (err) {
      console.error("Firestore write error:", err);
      alert("Error stopping live class");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">

        <h1 className="text-3xl font-bold text-center mb-8">
          Teacher Live Class Control
        </h1>

        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Enter Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Meeting URL (optional)"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
        />

        <button
          onClick={startLiveClass}
          className="w-full bg-green-600 text-white p-3 rounded-lg mb-3"
        >
          Start Live Class
        </button>

        <button
          onClick={stopLiveClass}
          className="w-full bg-red-600 text-white p-3 rounded-lg"
        >
          Stop Live Class
        </button>

      </div>
    </div>
  );
}
