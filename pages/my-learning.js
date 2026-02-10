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

  // NOTES & DOUBTS
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
      const ref = collection(db, "courses", COURSE_ID, "videos");
      const q = query(ref, orderBy("order", "asc"));
      const snap = await getDocs(q);

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
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
  // RESUME LAST VIDEO
  // ===============================
  useEffect(() => {
    if (videos.length > 0) {
      const last = localStorage.getItem(
        `lastWatched_${COURSE_ID}`
      );
      if (last) {
        const v = videos.find((x) => x.id === last);
        if (v) setSelectedVideo(v);
      }
    }
  }, [videos, COURSE_ID]);

  // ===============================
  // LOAD NOTES (PER VIDEO)
  // ===============================
  useEffect(() => {
    if (!selectedVideo) return;

    const saved = localStorage.getItem(
      `notes_${COURSE_ID}_${selectedVideo.id}`
    );
    setNotes(saved || "");
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
  // SAVE DOUBT
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
    alert("Doubt submitted");
  };

  // ===============================
  // 🔽 NOTES DOWNLOAD (TXT)
  // ===============================
  const downloadNotesTXT = () => {
    if (!selectedVideo || !notes.trim()) {
      alert("No notes to download");
      return;
    }

    const content = `
Course: ${COURSE_ID}
Lesson: ${selectedVideo.title}

------------------------
${notes}
------------------------
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
  // 🔽 NOTES DOWNLOAD (PDF)
  // ===============================
  const downloadNotesPDF = () => {
    if (!selectedVideo || !notes.trim()) {
      alert("No notes to download");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(14);
    doc.text(`Course: ${COURSE_ID}`, 10, 15);
    doc.text(
      `Lesson: ${selectedVideo.title}`,
      10,
      25
    );

    doc.setFontSize(11);
    doc.text(notes, 10, 40, {
      maxWidth: 180,
    });

    doc.save(
      `${COURSE_ID}_${selectedVideo.title}_Notes.pdf`
    );
  };

  // ===============================
  // 🔽 DOWNLOAD ALL NOTES
  // ===============================
  const downloadAllNotesTXT = () => {
    let content = `Course: ${COURSE_ID}\n\n`;

    videos.forEach((v) => {
      const note = localStorage.getItem(
        `notes_${COURSE_ID}_${v.id}`
      );

      if (note) {
        content += `
========================
Lesson: ${v.title}
------------------------
${note}
========================
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
    <main className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">
        {COURSE_ID} Course
      </h1>

      <p className="mb-4">Progress: {progress}%</p>

      <div className="grid grid-cols-4 gap-6">
        {/* VIDEO LIST */}
        <aside className="col-span-1 bg-slate-800 p-4 rounded">
          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => handleVideoSelect(v)}
              className="cursor-pointer mb-2 p-2 bg-slate-700 rounded"
            >
              {v.order}. {v.title}
            </div>
          ))}
        </aside>

        {/* CONTENT */}
        <section className="col-span-3 bg-slate-800 p-4 rounded">
          {!selectedVideo ? (
            <p>Select a video</p>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-2">
                {selectedVideo.title}
              </h2>

              <iframe
                className="w-full h-80"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}`}
                allowFullScreen
              />

              {/* NOTES */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">
                  My Notes
                </h3>

                <textarea
                  value={notes}
                  onChange={(e) =>
                    setNotes(e.target.value)
                  }
                  className="w-full h-32 text-black p-2"
                />

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => {
                      localStorage.setItem(
                        `notes_${COURSE_ID}_${selectedVideo.id}`,
                        notes
                      );
                      alert("Notes saved");
                    }}
                    className="bg-green-600 px-3 py-1 rounded"
                  >
                    Save Notes
                  </button>

                  <button
                    onClick={downloadNotesTXT}
                    className="bg-slate-600 px-3 py-1 rounded"
                  >
                    Download TXT
                  </button>

                  <button
                    onClick={downloadNotesPDF}
                    className="bg-red-600 px-3 py-1 rounded"
                  >
                    Download PDF
                  </button>

                  <button
                    onClick={downloadAllNotesTXT}
                    className="bg-purple-600 px-3 py-1 rounded"
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
