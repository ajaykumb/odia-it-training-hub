import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import YouTube from "react-youtube";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function MyLearning() {
  const router = useRouter();

  // 🔐 STUDENT AUTH (simple)
  const studentId =
    typeof window !== "undefined"
      ? localStorage.getItem("studentId")
      : null;

  const COURSE_ID = "PL-SQL";

  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);

  // 🚫 Redirect if not logged in
  useEffect(() => {
    if (!studentId) router.push("/login");
  }, []);

  // 📥 LOAD COURSE VIDEOS
  useEffect(() => {
    const q = query(
      collection(db, "courses", COURSE_ID, "videos"),
      orderBy("order", "asc")
    );

    getDocs(q).then((snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setVideos(list);
      if (!currentVideo && list.length > 0) {
        setCurrentVideo(list[0]);
      }
    });
  }, []);

  // 📥 LOAD STUDENT PROGRESS
  useEffect(() => {
    if (!studentId) return;

    const ref = doc(
      db,
      "studentProgress",
      studentId,
      "courses",
      COURSE_ID
    );

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setCompletedVideos(snap.data().completedVideos || []);
      }
    });

    return () => unsub();
  }, [studentId]);

  // ✅ MARK VIDEO COMPLETED
  const markCompleted = async () => {
    if (!currentVideo || !studentId) return;

    const ref = doc(
      db,
      "studentProgress",
      studentId,
      "courses",
      COURSE_ID
    );

    await setDoc(
      ref,
      {
        completedVideos: arrayUnion(currentVideo.id),
        lastVideo: currentVideo.id,
        updatedAt: Date.now(),
      },
      { merge: true }
    );

    alert("✅ Video marked as completed");
  };

  // 📊 PROGRESS %
  const progress =
    videos.length === 0
      ? 0
      : Math.round((completedVideos.length / videos.length) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-50 p-8">

      <h1 className="text-4xl font-bold text-blue-900 mb-6">
        📘 My Learning – PL/SQL
      </h1>

      {/* PROGRESS BAR */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <p className="font-semibold text-gray-800 mb-2">
          Course Progress: {progress}%
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {/* VIDEO LIST */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-bold text-xl mb-4">📚 Course Videos</h2>

          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => setCurrentVideo(v)}
              className={`p-3 mb-2 rounded-lg cursor-pointer border ${
                currentVideo?.id === v.id
                  ? "bg-blue-100 border-blue-500"
                  : "bg-gray-50"
              }`}
            >
              <p className="font-semibold">{v.title}</p>

              {completedVideos.includes(v.id) && (
                <span className="text-green-600 text-xs">✔ Completed</span>
              )}
            </div>
          ))}
        </div>

        {/* VIDEO PLAYER */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">
          {currentVideo ? (
            <>
              <h2 className="font-bold text-xl mb-4">
                ▶ {currentVideo.title}
              </h2>

              <YouTube
                videoId={currentVideo.youtubeId}
                className="w-full aspect-video mb-4"
                opts={{ width: "100%", height: "400" }}
              />

              <button
                onClick={markCompleted}
                disabled={completedVideos.includes(currentVideo.id)}
                className={`px-6 py-2 rounded-lg font-semibold ${
                  completedVideos.includes(currentVideo.id)
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {completedVideos.includes(currentVideo.id)
                  ? "Completed"
                  : "Mark as Completed"}
              </button>
            </>
          ) : (
            <p>Select a video to start learning</p>
          )}
        </div>

      </div>
    </main>
  );
}
