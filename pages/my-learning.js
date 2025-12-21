import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  collection,
  getDocs,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function MyLearning() {
  const router = useRouter();

  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [progress, setProgress] = useState(0);

  const COURSE_ID = "PL-SQL"; // 🔹 Your course document ID

  // 🔐 Login check
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, [router]);

  // 📚 Load videos
  useEffect(() => {
    const loadVideos = async () => {
      const q = query(
        collection(db, "courses", COURSE_ID, "videos"),
        orderBy("order", "asc")
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setVideos(list);
    };
    loadVideos();
  }, []);

  // 📊 Progress calculation (basic)
  useEffect(() => {
    if (videos.length === 0) return;
    if (!currentVideo) return;
    const completed = 1; // temporary (we’ll automate next)
    setProgress(Math.round((completed / videos.length) * 100));
  }, [currentVideo, videos]);

  return (
    <main className="min-h-screen bg-blue-100 p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-4">
        📘 My Learning – PL/SQL
      </h1>

      {/* Progress */}
      <div className="bg-white rounded-xl p-4 shadow mb-6">
        <p className="font-semibold mb-2">Course Progress: {progress}%</p>
        <div className="w-full h-2 bg-gray-200 rounded">
          <div
            className="h-2 bg-blue-600 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* VIDEO LIST */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h2 className="font-bold text-lg mb-3">📚 Video Lessons</h2>

          {videos.length === 0 && (
            <p className="text-gray-500">No videos added yet</p>
          )}

          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => setCurrentVideo(v)}
              className={`p-3 mb-2 rounded-lg cursor-pointer border ${
                currentVideo?.id === v.id
                  ? "bg-blue-100 border-blue-400"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              ▶ {v.title}
            </div>
          ))}
        </div>

        {/* VIDEO PLAYER */}
        <div className="md:col-span-2 bg-white rounded-xl p-4 shadow">
          {!currentVideo && (
            <p className="text-gray-500 text-center mt-10">
              Select a video to start learning
            </p>
          )}

          {currentVideo && (
            <>
              <h2 className="font-bold text-xl mb-4">
                ▶ {currentVideo.title}
              </h2>

              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded-lg"
                  src={`https://www.youtube.com/embed/${currentVideo.youtubeId}`}
                  title={currentVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
