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

  // 🔽 ADDED: NOTES + DOUBTS STATE
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
  // LOAD VIDEOS (COURSE-WISE)
  // ===============================
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
  }, [COURSE_ID]);

  // ===============================
  // LOAD COMPLETED VIDEOS (COURSE-WISE)
  // ===============================
  useEffect(() => {
    const saved =
      JSON.parse(
        localStorage.getItem(`completed_${COURSE_ID}`)
      ) || [];
    setCompletedVideos(saved);
  }, [COURSE_ID]);

  // ===============================
  // RESUME LAST WATCHED (COURSE-WISE)
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
  // 🔽 LOAD NOTES (PER VIDEO)
  // ===============================
  useEffect(() => {
    if (!selectedVideo) return;

    const savedNote = localStorage.getItem(
      `notes_${COURSE_ID}_${selectedVideo.id}`
    );
    setNotes(savedNote || "");
  }, [selectedVideo, COURSE_ID]);

  // ===============================
  // 🔽 LOAD DOUBTS (COURSE-WISE)
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
  // VIDEO CLICK
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
  // 🔽 NOTES DOWNLOAD (TXT)
  // ===============================
  const downloadNotesTXT = () => {
    if (!selectedVideo || !notes.trim()) {
      alert("No notes available to download");
      return;
    }

    const content = `
Course : ${COURSE_ID}
Lesson : ${selectedVideo.title}

--------------------------------
${notes}
--------------------------------
`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${COURSE_ID}_${selectedVideo.title}_Notes.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  // ===============================
  // 🔽 NOTES DOWNLOAD (PDF)
  // ===============================
  const downloadNotesPDF = () => {
    if (!selectedVideo || !notes.trim()) {
      alert("No notes available to download");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`Course: ${COURSE_ID}`, 10, 15);
    doc.text(`Lesson: ${selectedVideo.title}`, 10, 25);

    doc.setFontSize(11);
    doc.text(notes, 10, 40, { maxWidth: 180 });

    doc.save(`${COURSE_ID}_${selectedVideo.title}_Notes.pdf`);
  };

  // ===============================
  // 🔽 DOWNLOAD ALL NOTES (COURSE)
  // ===============================
  const downloadAllNotesTXT = () => {
    let content = `Course: ${COURSE_ID}\n\n`;

    videos.forEach((v) => {
      const note = localStorage.getItem(
        `notes_${COURSE_ID}_${v.id}`
      );

      if (note) {
        content += `
================================
Lesson: ${v.title}
--------------------------------
${note}
================================
`;
      }
    });

    const blob = new Blob([content], { type: "text/plain" });
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-blue-300">My Learning</p>
            <h1 className="text-3xl font-extrabold text-white">
              {COURSE_ID} Course
            </h1>
            <p className="text-sm text-blue-400">
              Odia IT Training Hub • Student Portal
            </p>
          </div>

          <select
            value={activeCourse}
            onChange={(e) => {
              setActiveCourse(e.target.value);
              setSelectedVideo(null);
            }}
            className="bg-slate-800 border border-slate-600 text-white px-4 py-2 rounded-lg"
          >
            <option value="PL-SQL">PL/SQL</option>
            <option value="DEVOPS">Devops AWS</option>
            <option value="LINUX">Linux</option>
            <option value="SHELL SCRIPTING">Shell Scripting</option>
            <option value="JENKINS">Jenkins</option>
            <option value="GIT & GITHUB">Git & Github</option>
            <option value="SPLUNK">Splunk</option>
            <option value="AUTOSYS-CONTROL-M">Job Scheduling Tools</option>
            <option value="ITIL">ITIL Process</option>
            <option value="PROJECT">Project Class</option>
          </select>

          <div className="w-full md:w-64">
            <p className="text-sm text-blue-300 mb-1">
              Progress — {progress}%
            </p>
            <div className="w-full h-2 bg-slate-800 rounded">
              <div
                className="h-2 bg-blue-500 rounded"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pb-10 grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="bg-slate-900 rounded-xl border border-slate-700 p-4 h-[75vh] overflow-y-auto">
          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => handleVideoSelect(v)}
              className={`p-3 mb-3 rounded-lg cursor-pointer border ${
                selectedVideo?.id === v.id
                  ? "bg-blue-900 border-blue-500"
                  : "bg-slate-800 border-slate-700 hover:bg-slate-700"
              }`}
            >
              <p className="text-white font-semibold">
                {v.order}. {v.title}
                {completedVideos.includes(v.id) && (
                  <span className="text-green-400 text-xs ml-2">
                    ✔
                  </span>
                )}
              </p>
            </div>
          ))}
        </aside>

        <section className="lg:col-span-3 rounded-xl shadow-lg border border-slate-700 bg-gradient-to-br from-slate-900 to-blue-900 p-6 sticky top-6 self-start">
          {!selectedVideo ? (
            <div className="flex items-center justify-center h-[60vh]">
              <p className="text-slate-300">
                Please select a lesson to start.
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-white mb-4">
                {selectedVideo.title}
              </h2>

              <div className="aspect-video rounded overflow-hidden border border-slate-700">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                  allowFullScreen
                />
              </div>

              {/* NOTES */}
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-2">
                  📝 My Notes
                </h3>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full min-h-[120px] bg-slate-800 border border-slate-700 rounded p-3 text-white"
                />

                <div className="flex flex-wrap gap-3 mt-3">
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
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
