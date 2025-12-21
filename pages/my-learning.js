import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function MyLearning() {
  const router = useRouter();

  const studentId =
    typeof window !== "undefined"
      ? localStorage.getItem("studentId")
      : null;

  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);
  const [progress, setProgress] = useState(0);

  /* ---------------- LOGIN CHECK ---------------- */
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, [router]);

  /* ---------------- LOAD VIDEOS ---------------- */
  useEffect(() => {
    const loadVideos = async () => {
      const q = query(
        collection(db, "courses", "PL-SQL", "videos"),
        orderBy("order", "asc")
      );

      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setVideos(list);
      if (list.length > 0) setCurrentVideo(list[0]);
    };

    loadVideos();
  }, []);

  /* ---------------- LOAD PROGRESS ---------------- */
  useEffect(() => {
    if (!studentId) return;

    const ref = doc(db, "studentProgress", studentId, "courses", "PL-SQL");
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const completed = snap.data().completedVideos || [];
        setCompletedVideos(completed);

        if (videos.length > 0) {
          const pct = Math.round(
            (completed.length / videos.length) * 100
          );
          setProgress(pct);
        }
      }
    });

    return () => unsub();
  }, [studentId, videos]);

  /* ---------------- MARK COMPLETED ---------------- */
  const markCompleted = async () => {
    if (!studentId || !currentVideo) return;

    const updated = completedVideos.includes(currentVideo.id)
      ? completedVideos
      : [...completedVideos, currentVideo.id];

    await setDoc(
      doc(db, "studentProgress", studentId, "courses", "PL-SQL"),
      {
        completedVideos: updated,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-200 to-blue-100 p-8">
      <h1 className="text-4xl font-bold text-blue-900 mb-6">
        📘 My Learning – PL/SQL
      </h1>

      {/* PROGRESS BAR */}
      <div className="bg-white rounded-xl p-5 shadow mb-8">
        <p className="font-semibold mb-2">Course Progress: {progress}%</p>
        <div className="w-full bg-gray-200 h-3 rounded-full">
          <div
            className="bg-blue-600 h-3 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* VIDEO LIST */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="font-bold text-lg mb-4">📚 Video Lessons</h2>

          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => setCurrentVideo(v)}
              className={`p-3 mb-2 rounded cursor-pointer border
                ${
                  currentVideo?.id === v.id
                    ? "bg-blue-100 border-blue-400"
                    : "bg-gray-50"
                }`}
            >
              <div className="flex justify-between items-center">
                <span>{v.title}</span>
                {completedVideos.includes(v.id) && (
                  <span className="text-green-600 font-bold">✔</span>
                )}
              </div>
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

              {/* ✅ YOUTUBE IFRAME (NO EXTRA LIBRARY) */}
              <div className="w-full aspect-video mb-4">
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${currentVideo.youtubeId}`}
                  title={currentVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                />
              </div>

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
