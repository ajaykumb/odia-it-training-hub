import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jsPDF from "jspdf";
import { db } from "../utils/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export default function MyLearning() {
  const router = useRouter();

  // ===============================
  // DEFAULT COURSE
  // ===============================
  const DEFAULT_COURSE_ID = "PL-SQL";
  const [activeCourse, setActiveCourse] = useState(DEFAULT_COURSE_ID);
  const COURSE_ID = activeCourse;

  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [completedVideos, setCompletedVideos] = useState([]);

  // NOTES + DOUBTS
  const [notes, setNotes] = useState("");
  const [doubtText, setDoubtText] = useState("");
  const [doubts, setDoubts] = useState([]);

  // ===============================
  // LOGIN CHECK
  // ===============================
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    if (!token) router.push("/login");
  }, [router]);

  // ===============================
  // LOAD VIDEOS
  // ===============================
  useEffect(() => {
    const loadVideos = async () => {
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
    };

    loadVideos();
  }, [COURSE_ID]);

  // ===============================
  // LOAD COMPLETED VIDEOS
  // ===============================
  useEffect(() => {
    const saved =
      JSON.parse(
        localStorage.getItem(`completed_${COURSE_ID}`)
      ) || [];
    setCompletedVideos(saved);
  }, [COURSE_ID]);

  // ===============================
  // RESUME LAST WATCHED
  // ===============================
  useEffect(() => {
    if (videos.length > 0) {
      const lastVideoId =
        localStorage.getItem(`lastWatched_${COURSE_ID}`);
      if (lastVideoId) {
        const lastVideo = videos.find(
          (v) => v.id === lastVideoId
        );
        if (lastVideo) setSelectedVideo(lastVideo);
      }
    }
  }, [videos, COURSE_ID]);

  // ===============================
  // LOAD NOTES (PER VIDEO)
  // ===============================
  useEffect(() => {
    if (!selectedVideo) return;

    const savedNote = localStorage.getItem(
      `notes_${COURSE_ID}_${selectedVideo.id}`
    );
    setNotes(savedNote || "");
  }, [selectedVideo, COURSE_ID]);

  // ===============================
  // LOAD DOUBTS
  // ===============================
  useEffect(() => {
    const saved =
      JSON.parse(
        localStorage.getItem(`doubts_${COURSE_ID}`)
      ) || [];
    setDoubts(saved);
  }, [COURSE_ID]);

  // ===============================
  // PROGRESS
  // ===============================
  const progress =
    videos.length === 0
      ? 0
      : Math.round(
          (completedVideos.length / videos.length) * 100
        );

  // ===============================
  // VIDEO SELECT
  // ===============================
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
    localStorage.setItem(
      `lastWatched_${COURSE_ID}`,
      video.id
    );
  };

  // ===============================
  // SUBMIT DOUBT
  // ===============================
  const submitDoubt = () => {
    if (!doubtText.trim()) return;

    const newDoubt = {
      id: Date.now(),
      video: selectedVideo?.title || "General",
      text: doubtText,
      status: "Pending",
      time: new Date().toLocaleString(),
    };

    const updated = [newDoubt, ...doubts];
    setDoubts(updated);

    localStorage.setItem(
      `doubts_${COURSE_ID}`,
      JSON.stringify(updated)
    );

    setDoubtText("");
    alert("✅ Doubt submitted");
  };

  // ===============================
  // NOTES DOWNLOAD (TXT)
  // ===============================
  const downloadNotesTXT = () => {
    if (!selectedVideo || !notes.trim()) return;

    const content = `
Course : ${COURSE_ID}
Lesson : ${selectedVideo.title}

----------------------------
${notes}
----------------------------
`;

    const blob = new Blob([content], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${COURSE_ID}_${selectedVideo.title}_Notes.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // ===============================
  // NOTES DOWNLOAD (PDF)
  // ===============================
  const downloadNotesPDF = () => {
    if (!selectedVideo || !notes.trim()) return;

    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Course: ${COURSE_ID}`, 10, 15);
    doc.text(`Lesson: ${selectedVideo.title}`, 10, 25);
    doc.setFontSize(11);
    doc.text(notes, 10, 40, { maxWidth: 180 });
    doc.save(
      `${COURSE_ID}_${selectedVideo.title}_Notes.pdf`
    );
  };

  // ===============================
  // DOWNLOAD ALL NOTES
  // ===============================
  const downloadAllNotesTXT = () => {
    let content = `Course: ${COURSE_ID}\n\n`;

    videos.forEach((v) => {
      const note = localStorage.getItem(
        `notes_${COURSE_ID}_${v.id}`
      );
      if (note) {
        content += `
============================
Lesson: ${v.title}
----------------------------
${note}
============================
`;
      }
    });

    const blob = new Blob([content], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${COURSE_ID}_ALL_NOTES.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold text-white">
          {COURSE_ID} Course
        </h1>
        <p className="text-blue-400">
          Progress — {progress}%
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* VIDEO LIST */}
        <aside className="bg-slate-900 p-4 rounded">
          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => handleVideoSelect(v)}
              className="p-2 mb-2 bg-slate-800 rounded cursor-pointer"
            >
              {v.order}. {v.title}
            </div>
          ))}
        </aside>

        {/* PLAYER */}
        <section className="lg:col-span-3 bg-slate-900 p-6 rounded">
          {!selectedVideo ? (
            <p className="text-slate-300">
              Select a lesson to start
            </p>
          ) : (
            <>
              <h2 className="text-xl text-white mb-2">
                {selectedVideo.title}
              </h2>

              <iframe
                className="w-full h-80 mb-4"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                allowFullScreen
              />

              {/* MARK COMPLETED */}
              <button
                onClick={() => {
                  if (
                    !completedVideos.includes(
                      selectedVideo.id
                    )
                  ) {
                    const updated = [
                      ...completedVideos,
                      selectedVideo.id,
                    ];
                    setCompletedVideos(updated);
                    localStorage.setItem(
                      `completed_${COURSE_ID}`,
                      JSON.stringify(updated)
                    );
                  }
                  alert("Video marked completed");
                }}
                className="bg-blue-600 px-4 py-2 text-white rounded mb-4"
              >
                Mark Completed
              </button>

              {/* NOTES */}
              <h3 className="text-white font-semibold mt-6">
                📝 My Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-32 bg-slate-800 text-white p-3 rounded"
              />

              <div className="flex gap-3 mt-3 flex-wrap">
                <button
                  onClick={() => {
                    localStorage.setItem(
                      `notes_${COURSE_ID}_${selectedVideo.id}`,
                      notes
                    );
                    alert("Notes saved");
                  }}
                  className="bg-green-600 px-4 py-2 rounded text-white"
                >
                  Save Notes
                </button>

                <button
                  onClick={downloadNotesTXT}
                  className="bg-slate-700 px-4 py-2 rounded text-white"
                >
                  Download TXT
                </button>

                <button
                  onClick={downloadNotesPDF}
                  className="bg-red-600 px-4 py-2 rounded text-white"
                >
                  Download PDF
                </button>

                <button
                  onClick={downloadAllNotesTXT}
                  className="bg-purple-600 px-4 py-2 rounded text-white"
                >
                  All Notes
                </button>
              </div>

              {/* DOUBTS */}
              <h3 className="text-white font-semibold mt-8">
                ❓ Ask a Doubt
              </h3>
              <textarea
                value={doubtText}
                onChange={(e) =>
                  setDoubtText(e.target.value)
                }
                className="w-full h-24 bg-slate-800 text-white p-3 rounded"
              />

              <div className="flex gap-3 mt-2">
                <button
                  onClick={submitDoubt}
                  className="bg-blue-600 px-4 py-2 rounded text-white"
                >
                  Submit Doubt
                </button>

                <button
                  onClick={() =>
                    window.open(
                      `https://wa.me/919437401378?text=Course:${COURSE_ID}%0ALesson:${selectedVideo.title}%0ADoubt:${doubtText}`,
                      "_blank"
                    )
                  }
                  className="bg-green-600 px-4 py-2 rounded text-white"
                >
                  WhatsApp
                </button>
              </div>

              {/* DOUBT HISTORY */}
              <div className="mt-4">
                {doubts.map((d) => (
                  <div
                    key={d.id}
                    className="bg-slate-800 p-3 rounded mb-2"
                  >
                    <p className="text-white">
                      {d.text}
                    </p>
                    <p className="text-xs text-slate-400">
                      {d.video} • {d.time} •{" "}
                      {d.status}
                    </p>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
