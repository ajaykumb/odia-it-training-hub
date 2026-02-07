import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { db } from "../utils/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export default function MyLearning() {
  const router = useRouter();

  const COURSE_ID = "PL-SQL"; // must match Firestore doc ID

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);

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
        const videosRef = collection(db, "courses", COURSE_ID, "videos");
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
  // RESUME LAST WATCHED LESSON
  // ---------------------------
  useEffect(() => {
    if (videos.length > 0) {
      const lastVideoId = localStorage.getItem("lastWatchedVideoId");
      if (lastVideoId) {
        const lastVideo = videos.find(v => v.id === lastVideoId);
        if (lastVideo) {
          setSelectedVideo(lastVideo);
        }
      }
    }
  }, [videos]);

  // ---------------------------
  // PROGRESS CALCULATION
  // ---------------------------
  const progress =
    videos.length > 0
      ? Math.round((completedVideos.length / videos.length) * 100)
      : 0;

  // ---------------------------
  // HANDLE VIDEO CLICK
  // ---------------------------
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    localStorage.setItem("lastWatchedVideoId", video.id); // ✅ SAVE
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-blue-300">My Learning</p>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              PL/SQL Course
            </h1>
            <p className="text-sm text-blue-400 mt-1">
              Odia IT Training Hub • Student Learning Portal
            </p>
          </div>

          {/* PROGRESS */}
          <div className="mt-4 md:mt-0 w-full md:w-72 flex flex-col items-end">
            <img
              src="/images/logo.png"
              alt="Odia IT Training Hub"
              className="w-12 mb-2 opacity-90"
            />
            <p className="text-sm font-semibold text-blue-300 mb-1">
              Course Progress — {progress}%
            </p>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-2.5 bg-blue-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pb-10 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* VIDEO LIST */}
        <aside className="lg:col-span-1 bg-slate-900 rounded-xl shadow-lg border border-slate-700 h-[75vh] overflow-y-auto">
          <div className="p-4 border-b border-slate-700 bg-slate-800 rounded-t-xl">
            <h2 className="font-bold text-lg text-white flex items-center gap-2">
              📚 Video Lessons
            </h2>
          </div>

          <div className="p-4">
            {videos.map((v) => (
              <div
                key={v.id}
                onClick={() => handleVideoSelect(v)}
                className={`p-3 mb-3 rounded-lg cursor-pointer border transition-all ${
                  selectedVideo?.id === v.id
                    ? "bg-blue-900 border-blue-500 shadow"
                    : "bg-slate-800 hover:bg-slate-700 border-slate-700"
                }`}
              >
                <p className="font-semibold text-slate-100">
                  {v.order}. {v.title}
                </p>

                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  ▶ Video Lesson
                  {completedVideos.includes(v.id) && (
                    <span className="text-green-400">✔</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* VIDEO PLAYER */}
        <section className="lg:col-span-3 rounded-xl shadow-lg border border-slate-700
          bg-gradient-to-br from-slate-900 to-blue-900
          p-6 sticky top-6 self-start">

          {!selectedVideo ? (
            <div className="flex items-center justify-center h-[60vh] text-slate-400">
              Select a lesson to start learning
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-4">
                🎬 {selectedVideo.title}
              </h2>

              <div className="aspect-video w-full rounded-xl overflow-hidden border border-slate-700 shadow-lg">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allowFullScreen
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 mt-6">

                {/* MARK COMPLETE */}
                <button
                  disabled={completedVideos.includes(selectedVideo.id)}
                  onClick={() => {
                    setCompletedVideos([...completedVideos, selectedVideo.id]);
                    alert(`✅ "${selectedVideo.title}" marked as completed`);
                  }}
                  className={`px-5 py-2 rounded-lg shadow transition ${
                    completedVideos.includes(selectedVideo.id)
                      ? "bg-green-600 text-white cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {completedVideos.includes(selectedVideo.id)
                    ? "Completed"
                    : "Mark as Completed"}
                </button>

                {/* ASK DOUBT */}
                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/919437401378?text=Hello Sir/Madam,%0A%0AI have a doubt in PL/SQL course.%0ALesson: ${selectedVideo.title}`,
                      "_blank"
                    )
                  }
                  className="bg-slate-800 border border-slate-700 text-slate-200 px-5 py-2 rounded-lg hover:bg-slate-700"
                >
                  Ask Doubt
                </button>

                {/* NOTES */}
                <button
                  onClick={() => {
                    const note = prompt(
                      `Write notes for:\n${selectedVideo.title}`
                    );
                    if (note) alert("📝 Note saved (temporarily)");
                  }}
                  className="bg-slate-800 border border-green-600 text-green-400 px-5 py-2 rounded-lg hover:bg-slate-700"
                >
                  Notes
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
