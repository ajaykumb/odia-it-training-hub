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
  const [batch, setBatch] = useState("");              // ✅ NEW
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [youtubeId, setYoutubeId] = useState("");
  const [duration, setDuration] = useState("");
  const [notifyStudents, setNotifyStudents] = useState(true); // ✅ NEW
  const [loading, setLoading] = useState(false);

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
  // UPLOAD VIDEO
  // ===============================
  const submitVideo = async () => {
    if (!title || !order || !youtubeId) {
      alert("Please fill all required fields");
      return;
    }

    if (notifyStudents && !batch.trim()) {
      alert("Please enter batch name to notify students");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Read existing videos
      const videosRef = collection(db, "courses", courseId, "videos");
      const snap = await getDocs(videosRef);

      // 2️⃣ Find MAX v-number
      let maxNumber = 0;
      snap.docs.forEach((d) => {
        const id = d.id;
        if (id.startsWith("v")) {
          const num = parseInt(id.replace("v", ""), 10);
          if (!isNaN(num) && num > maxNumber) {
            maxNumber = num;
          }
        }
      });

      // 3️⃣ Next ID
      const videoDocId = `v${maxNumber + 1}`;

      // 4️⃣ Save video
      await setDoc(
        doc(db, "courses", courseId, "videos", videoDocId),
        {
          title,
          order: Number(order),
          youtubeId,
          duration: Number(duration || 0),
          createdAt: serverTimestamp(),
        }
      );

      // 5️⃣ SEND EMAIL NOTIFICATION (SEPARATE API)
      if (notifyStudents) {
        await fetch("/api/video-upload-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            videoTitle: title,
            batch,
          }),
        });
      }

      // Reset
      setTitle("");
      setOrder("");
      setYoutubeId("");
      setDuration("");
      setBatch("");

      alert(`✅ Video uploaded successfully as ${videoDocId}`);

    } catch (err) {
      console.error(err);
      alert("Error uploading video");
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

      {/* VIDEO UPLOAD SECTION */}
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
          <option value="PROJECT">Project Class</option>
        </select>

        <label className="text-sm">Batch (for email)</label>
        <input
          value={batch}
          onChange={(e) => setBatch(e.target.value)}
          className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2"
          placeholder="GREEN_BATCH_1"
        />

        <label className="text-sm">Video Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2"
        />

        <label className="text-sm">Order</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          className="w-full mb-3 bg-slate-900 border border-slate-600 rounded p-2"
        />

        <label className="text-sm">YouTube Video ID
