import { useState } from "react";
import { db } from "../utils/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function TeacherLiveControl() {
  const [className, setClassName] = useState("");
  const [meetingUrl, setMeetingUrl] = useState("");

  const startLiveClass = async () => {
    if (!className.trim()) return alert("Class name required");

    await setDoc(doc(db, "liveClass", "current"), {
      isLive: true,
      className,
      meetingUrl: meetingUrl || "https://meet.jit.si/OdiaITTrainingHubLiveClass",
      startedAt: Date.now(),
    });

    alert("Live class started!");
  };

  const stopLiveClass = async () => {
    await setDoc(doc(db, "liveClass", "current"), {
      isLive: false,
      className: "",
      meetingUrl: "",
    });

    alert("Live class stopped.");
  };

  return (
    <div className="max-w-lg mx-auto mt-20 bg-white p-8 rounded-lg shadow-xl">

      <h1 className="text-2xl font-bold mb-6">Teacher Live Class Control</h1>

      <input
        type="text"
        placeholder="Enter Class Title"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <input
        type="text"
        placeholder="Meeting URL (optional)"
        value={meetingUrl}
        onChange={(e) => setMeetingUrl(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <button
        onClick={startLiveClass}
        className="w-full bg-green-600 text-white p-3 rounded mb-3"
      >
        Start Live Class
      </button>

      <button
        onClick={stopLiveClass}
        className="w-full bg-red-600 text-white p-3 rounded"
      >
        Stop Live Class
      </button>
    </div>
  );
}
