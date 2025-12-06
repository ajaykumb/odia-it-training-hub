import { useState } from "react";
import { db } from "../utils/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function TeacherLive() {
  const [className, setClassName] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  // START LIVE CLASS
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
          meetingUrl.trim() || "https://meet.jit.si/OdiaITTrainingHubLiveClass",
        startedAt: Date.now(),
      });

      alert("Live class started!");
    } catch (err) {
      console.error("Firestore write error:", err);
      alert("Error starting live class (check console)");
    }
  };

  // STOP LIVE CLASS
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

  // TEACHER JOINS THE SAME URL AS STUDENTS
  const joinAsTeacher = () => {
    const url =
      meetingUrl.trim() || "https://meet.jit.si/OdiaITTrainingHubLiveClass";

    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full">

        <h1 className="text-3xl font-bold text-center mb-8">
          Teacher Live Class Control
        </h1>

        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Enter Class Name (Example: Green Batch SQL)"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />

        <input
          className="w-full p-3 border rounded mb-4"
          placeholder="Paste Meeting URL (Google Meet / Zoom / Teams)"
          value={meetingUrl}
          onChange={(e) => setMeetingUrl(e.target.value)}
        />

        {/* START LIVE CLASS BUTTON */}
        <button
          onClick={startLiveClass}
          className="w-full bg-green-600 text-white p-3 rounded-lg mb-3 hover:bg-green-700"
        >
          Start Live Class
        </button>

        {/* JOIN AS TEACHER BUTTON */}
        <button
          onClick={joinAsTeacher}
          className="w-full bg-blue-600 text-white p-3 rounded-lg mb-3 hover:bg-blue-700"
        >
          Join as Teacher
        </button>

        {/* STOP LIVE CLASS BUTTON */}
        <button
          onClick={stopLiveClass}
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700"
        >
          Stop Live Class
        </button>

      </div>
    </div>
  );
}
