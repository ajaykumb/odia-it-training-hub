import { useEffect, useState } from "react";
import { db, auth, rtdb } from "../../utils/firebaseConfig";
import {
  collection,
  getDocs,
  orderBy,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { useRouter } from "next/router";

/* ✅ LIVE CAMERA VIEWER */
function LiveCameraViewer({ studentId }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const pc = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        {
          urls: "turn:openrelay.metered.ca:80",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
        {
          urls: "turn:openrelay.metered.ca:443",
          username: "openrelayproject",
          credential: "openrelayproject",
        },
      ],
    });

    pc.ontrack = (e) => (videoRef.current.srcObject = e.streams[0]);

    return () => pc.close();
  }, []);

  return <video ref={videoRef} autoPlay playsInline className="w-full h-48" />;
}

export default function AllAnswers() {
  const [answers, setAnswers] = useState([]);
  const [liveStudents, setLiveStudents] = useState({});
  const router = useRouter();

  // ✅ Auth + Firestore
  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) router.push("/admin/login");

      const q = query(
        collection(db, "assignments"),
        orderBy("submittedAt", "desc")
      );

      const snap = await getDocs(q);
      const data = [];
      snap.forEach((d) => data.push({ id: d.id, ...d.data() }));
      setAnswers(data);
    });
  }, []);

  // ✅ Live Students
  useEffect(() => {
    onValue(ref(rtdb, "liveStudents"), (snap) => {
      setLiveStudents(snap.val() || {});
    });
  }, []);

  // ✅ Delete handler
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "assignments", id));
    setAnswers((p) => p.filter((x) => x.id !== id));
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">🔴 LIVE STUDENT MONITORING</h1>
        <button
          className="bg-red-600 text-white px-4 py-2"
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </div>

      {/* ✅ LIVE STUDENTS */}
      {Object.entries(liveStudents).map(([id, s]) => (
        <div key={id} className="border p-4 mb-4 bg-green-50">
          <b>{s.name} — LIVE 🎥</b>
          <LiveCameraViewer studentId={id} />
        </div>
      ))}

      {/* ✅ SUBMITTED */}
      <h2 className="text-2xl mt-10 mb-4">✅ SUBMITTED STUDENTS</h2>
      {answers.map((s) => (
        <div key={s.id} className="border p-4 mb-4">
          <b>{s.name}</b>
          <p>{new Date(s.submittedAt).toLocaleString()}</p>

          {Object.entries(s.answers || {}).map(([k, v]) => (
            <p key={k}>
              <b>{k.toUpperCase()}:</b> {v}
            </p>
          ))}

          <button
            onClick={() => handleDelete(s.id)}
            className="bg-red-500 text-white px-4 py-2 mt-2"
          >
            Delete
          </button>
        </div>
      ))}
    </main>
  );
}
