import { useState } from "react";
import { db } from "../../utils/firebaseConfig";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function UploadVideo() {
  const [courseId, setCourseId] = useState("PL-SQL");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const submitVideo = async () => {
    if (!title || !order || !youtubeId) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await addDoc(
        collection(db, "courses", courseId, "videos"),
        {
          title,
          order: Number(order),
          youtubeId,
          duration: Number(duration || 0),
          createdAt: serverTimestamp(),
        }
      );

      setTitle("");
      setOrder("");
      setYoutubeId("");
      setDuration("");

      alert("✅ Video uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("Error uploading video");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white flex justify-center items-start py-10">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-6">
          🎬 Admin – Upload Course Video
        </h1>

        {/* COURSE */}
        <label className="block text-sm mb-1">
          Course
        </label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full mb-4 bg-slate-900 border border-slate-600 rounded p-2"
        >
          <option value="PL-SQL">PL/SQL</option>
          <option value="SQL">SQL</option>
          <option value="LINUX">Linux</option>
          <option value="DEVOPS">DevOps AWS</option>
          <option value="SHELL SCRIPTING">Shell Scripting</option>
          <option value="JENKINS">Jenkins</option>
          <option value="SPLUNK">Splunk</option>
          <option value="AUTOSYS-CONTROL-M">
            Job Scheduling Tools
          </option>
          <option value="PROJECT">Project Class</option>
        </select>

        {/* TITLE */}
        <label className="block text-sm mb-1">
          Video Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-4 bg-slate-900 border border-slate-600 rounded p-2"
          placeholder="Linux Class 1 – Introduction"
        />

        {/* ORDER */}
        <label className="block text-sm mb-1">
          Order
        </label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="w-full mb-4 bg-slate-900 border border-slate-600 rounded p-2"
          placeholder="1"
        />

        {/* YOUTUBE ID */}
        <label className="block text-sm mb-1">
          YouTube Video ID
        </label>
        <input
          value={youtubeId}
          onChange={(e) => setYoutubeId(e.target.value)}
          className="w-full mb-4 bg-slate-900 border border-slate-600 rounded p-2"
          placeholder="tXREBkHrVkY"
        />

        {/* DURATION */}
        <label className="block text-sm mb-1">
          Duration (minutes)
        </label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full mb-6 bg-slate-900 border border-slate-600 rounded p-2"
          placeholder="60"
        />

        <button
          onClick={submitVideo}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </div>
    </main>
  );
}
