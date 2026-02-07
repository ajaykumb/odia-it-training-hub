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
  // PROGRESS CALCULATION
  // (simple version – unchanged)
  // ---------------------------
  const progress =
    videos.length > 0 && selectedVideo
      ? Math.round((1 / videos.length) * 100)
      : 0;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-gray-500">My Learning</p>
            <h1 className="text-3xl font-bold text-blue-900">
              📘 PL/SQL Course
            </h1>
          </div>

          {/* PROGRESS */}
          <div className="mt-4 md:mt-0 w-full md:w-72">
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Course Progress — {progress}%
            </p>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pb-10 grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* VIDEO LIST */}
        <aside className="lg:col-span-1 bg-white rounded-xl shadow border border-gray-200 p-4 h-[75vh] overflow-y-auto">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            📚 Video Lessons
          </h2>

          {videos.length === 0 && (
            <p className="text-gray-500 text-sm">
              No videos added yet
            </p>
          )}

          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVideo(v)}
              className={`p-3 mb-3 rounded-lg cursor-pointer border transition-all ${
                selectedVideo?.id === v.id
                  ? "bg-blue-100 border-blue-500 shadow-sm"
                  : "bg-gray-50 hover:bg-gray-100 border-gray-200"
              }`}
            >
              <p className="font-semibold text-gray-800">
                {v.order}. {v.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ▶️ Video Lesson
              </p>
            </div>
          ))}
        </aside>

        {/* VIDEO PLAYER */}
<section className="lg:col-span-3 rounded-xl shadow border border-blue-200 
  bg-gradient-to-br from-blue-50 to-blue-100
  p-6 sticky top-6 self-start">

  {!selectedVideo ? (
    <div className="flex items-center justify-center h-[60vh]">
      
      {/* NOTICE BOARD CARD */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 
        max-w-xl w-full flex">

        {/* LEFT ACCENT BAR */}
        <div className="w-2 bg-blue-600 rounded-l-lg"></div>

        {/* CONTENT */}
        <div className="p-6 text-center w-full">
          
          {/* LOGO */}
          <img
            src="/images/logo.png"
            alt="Odia IT Training Hub"
            className="w-20 mx-auto mb-3"
          />

          {/* NOTICE TITLE */}
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            📢 Class Notice
          </p>

          <h3 className="text-2xl font-bold text-gray-800 mt-2">
            Today’s PL/SQL Session
          </h3>

          <p className="text-gray-600 mt-3">
            Please select today’s lesson from the left panel
            to begin your class.
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Real-time examples will be covered in this session.
          </p>

          <p className="text-sm text-blue-600 mt-4 font-medium">
            ⏰ Be attentive • Practice along
          </p>
        </div>
      </div>
    </div>

          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎬 {selectedVideo.title}
              </h2>

              <div className="aspect-video w-full rounded-lg overflow-hidden border">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                  title={selectedVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-4 mt-6">
                <button className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 shadow">
                  ✅ Mark as Completed
                </button>

                <button className="bg-gray-100 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-200">
                  ❓ Ask Doubt
                </button>

                <button className="bg-green-100 text-green-700 px-5 py-2 rounded-md hover:bg-green-200">
                  📝 Notes
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
