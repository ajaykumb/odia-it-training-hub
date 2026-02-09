import { useEffect, useState } from "react";
import { db } from "../../utils/firebaseConfig";
import {
  collection,
  getDocs,
  setDoc,
  updateDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

export default function AdminUploadAndDoubts() {

  // ===============================
  // VIDEO UPLOAD STATES
  // ===============================
  const [courseId, setCourseId] = useState("PL-SQL");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔔 NOTIFICATION + BATCH
  const [notifyStudents, setNotifyStudents] = useState(true);
  const [targetBatch, setTargetBatch] = useState("");

  // ===============================
  // DOUBT STATES
  // ===============================
  const [doubts, setDoubts] = useState([]);
  const [replyText, setReplyText] = useState("");

  // ===============================
  // LOAD DOUBTS
  // ===============================
  useEffect(() => {
    const loadDoubts = async () => {
      const q = query(
        collection(db, "doubts"),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);

      setDoubts(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    };

    loadDoubts();
  }, []);

  // ===============================
  // UPLOAD VIDEO + NOTIFICATION
  // ===============================
  const submitVideo = async () => {
    if (!title || !order || !youtubeId) {
      alert("Please fill all required fields");
      return;
    }

    if (notifyStudents && !targetBatch.trim()) {
      alert("Please enter target batch for notification");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ READ EXISTING VIDEOS
      const videosRef = collection(db, "courses", courseId, "videos");
      const snap = await getDocs(videosRef);

      // 2️⃣ FIND MAX VIDEO NUMBER
      let maxNumber = 0;
      snap.docs.forEach((d) => {
        if (d.id.startsWith("v")) {
          const num = parseInt(d.id.replace("v", ""), 10);
          if (!isNaN(num) && num > maxNumber) maxNumber = num;
        }
      });

      // 3️⃣ NEXT VIDEO ID
      const videoDocId = `v${maxNumber + 1}`;

      // 4️⃣ SAVE VIDEO WITH CONFIRMATION DATA
      await setDoc(
        doc(db, "courses", courseId, "videos", videoDocId),
        {
          title,
          order: Number(order),
          youtubeId,
          duration: Number(duration || 0),
          createdAt: serverTimestamp(),

          // ✅ CONFIRMATION
          targetBatch: notifyStudents ? targetBatch : null,
          notification: {
            sent: notifyStudents,
            sentAt: notifyStudents ? serverTimestamp() : null,
          },
        }
      );

      // 5️⃣ SEND EMAIL (SEPARATE API)
      if (notifyStudents) {
        try {
          await fetch("/api/video-upload-notification", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              courseId,
              videoTitle: title,
              batch: targetBatch,
            }),
          });
        } catch (mailErr) {
          console.error("❌ Video email failed:", mailErr);
        }
      }

      // RESET FORM
      setTitle("");
      setOrder("");
      setYoutubeId("");
      setDuration("");
      setTargetBatch("");

      alert(`✅ Video uploaded successfully as ${videoDocId}`);
    } catch (err) {
      console.error(err);
      alert("❌ Error uploading video");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // REPLY TO DOUBT
  // ===============================
  const replyDoubt = async (id) => {
    if (!replyText.trim()) return;

    await updateDoc(doc(db, "doubts", id), {
      reply: replyText,
      status: "Replied",
      repliedAt: serverTimestamp(),
    });

    alert("Reply sent");
    setReplyText("");
  };

  return (
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">
        🎓 Admin / Trainer Dashboard
      </h1>

      {/* ===============================
          VIDEO UPLOAD SECTION
      =============================== */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-10 max-w-xl">
        <h2 className="text-xl font-semibold mb-4">
          🎬 Upload Course Video
        </h2>

        <label className="text-sm">Course</label>
        <select
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2"
        >
          <option value="PL-SQL">PL/SQL</option>
          <option value="SQL">SQL</option>
          <option value="LINUX">Linux</option>
          <option value="DEVOPS">DevOps AWS</option>
          <option value="SHELL SCRIPTING">Shell Scripting</option>
          <option value="JENKINS">Jenkins</option>
          <option value="SPLUNK">Splunk</option>
          <option value="AUTOSYS-CONTROL-M">Job Scheduling Tools</option>
          <option value="PROJECT">Project Class</option>
        </select>

        <label className="text-sm">Video Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2"
          placeholder="SQL Class 10 – Joins"
        />

        <label className="text-sm">Order</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2"
        />

        <label className="text-sm">YouTube Video ID</label>
        <input
          value={youtubeId}
          onChange={(e) => setYoutubeId(e.target.value)}
          className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2"
          placeholder="3EOrXQePqBo"
        />

        <label className="text-sm">Duration (minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2"
        />

        {/* 🔔 BATCH + NOTIFICATION */}
        <label className="text-sm">Target Batch (exact match)</label>
        <input
          value={targetBatch}
          onChange={(e) => setTargetBatch(e.target.value)}
          className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2"
          placeholder="Yellow"
        />

        <label className="flex items-center gap-2 mb-4 text-sm">
          <input
            type="checkbox"
            checked={notifyStudents}
            onChange={(e) => setNotifyStudents(e.target.checked)}
          />
          Notify students by email
        </label>

        <button
          onClick={submitVideo}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
        >
          {loading ? "Uploading..." : "Upload Video"}
        </button>
      </div>

      {/* ===============================
          DOUBTS SECTION
      =============================== */}
      <div className="max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">
          ❓ Student Doubts
        </h2>

        {doubts.length === 0 && (
          <p className="text-slate-400">
            No doubts raised yet
          </p>
        )}

        {doubts.map((d) => (
          <div
            key={d.id}
            className="border border-slate-700 rounded p-4 mb-4"
          >
            <p className="text-sm text-blue-400">
              Course: {d.courseId}
            </p>
            <p className="font-semibold mt-1">
              Q: {d.question}
            </p>

            {d.status === "Replied" ? (
              <p className="text-green-400 mt-2">
                Reply: {d.reply}
              </p>
            ) : (
              <>
                <textarea
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full mt-2 bg-slate-800 border border-slate-600 rounded p-2"
                  placeholder="Type reply..."
                />
                <button
                  onClick={() => replyDoubt(d.id)}
                  className="mt-2 bg-blue-600 px-4 py-2 rounded"
                >
                  Send Reply
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
