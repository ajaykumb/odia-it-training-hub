import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../utils/firebaseConfig";
import {
  collection,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export default function MyLearning() {
  const router = useRouter();

  const COURSE_ID = "PL-SQL"; // must match Firestore doc ID

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // ---------------------------
  // LOGIN CHECK
  // ---------------------------
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, [router]);

  // ---------------------------
  // LOAD VIDEOS FROM FIRESTORE
  // ---------------------------
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const videosRef = collection(
          db,
          "courses",
          COURSE_ID,
          "videos"
        );

        const q = query(videosRef, orderBy("order", "asc"));
        const snap = await getDocs(q);

        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setVideos(list);
      } catch (err) {
        console.error("Error loading videos:", err);
      }
    };

    loadVideos();
  }, []);

  // ---------------------------
  // PROGRESS CALCULATION
  // (simple version for now)
  // ---------------------------
  const progress =
    videos.length > 0 && selectedVideo
      ? Math.round((1 / videos.length) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-blue-100 p-8">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        📘 My Learning — PL/SQL
      </h1>

      {/* PROGRESS BAR */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <p className="font-semibold mb-2">
          Course Progress: {progress}%
        </p>
        <div className="w-full bg-gray-200 h-2 rounded">
          <div
            className="bg-blue-600 h-2 rounded"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* VIDEO LIST */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="font-bold text-lg mb-3">📚 Video Lessons</h2>

          {videos.length === 0 && (
            <p className="text-gray-500">No videos added yet</p>
          )}

          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVideo(v)}
              className={`p-3 mb-2 rounded cursor-pointer border ${
                selectedVideo?.id === v.id
                  ? "bg-blue-100 border-blue-400"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <p className="font-semibold">{v.title}</p>
              <p className="text-xs text-gray-500">
                Lesson {v.order}
              </p>
            </div>
          ))}
        </div>

        {/* VIDEO PLAYER */}
        <div className="md:col-span-2 bg-white p-4 rounded-lg shadow">
          {!selectedVideo ? (
            <p className="text-gray-500 text-center mt-20">
              Select a video to start learning
            </p>
          ) : (
            <>
              <h2 className="font-bold text-xl mb-4">
                🎬 {selectedVideo.title}
              </h2>

              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full rounded"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
