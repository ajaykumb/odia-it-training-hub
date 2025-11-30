import { useEffect, useState, useMemo, useRef } from "react";
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
import { useRouter } from "next/router";
import { ref, onValue, set } from "firebase/database";

/* ✅ LIVE CAMERA RECEIVER */
function LiveCameraViewer({ studentId }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (!studentId) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    const offerRef = ref(rtdb, `${studentId}/offer`);
    const answerRef = ref(rtdb, `${studentId}/answer`);
    const candidatesRef = ref(rtdb, `${studentId}/candidates`);

    pc.ontrack = (event) => {
      videoRef.current.srcObject = event.streams[0];
    };

    // ✅ Receive offer → send answer
    onValue(offerRef, async (snap) => {
      if (!snap.exists()) return;

      const offer = snap.val();
      await pc.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await set(answerRef, answer);
    });

    // ✅ Receive ICE candidates
    onValue(candidatesRef, (snap) => {
      if (!snap.exists()) return;
      Object.values(snap.val()).forEach((c) => {
        pc.addIceCandidate(new RTCIceCandidate(c));
      });
    });

    return () => pc.close();
  }, [studentId]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      className="w-full h-48 bg-black rounded"
    />
  );
}

export default function AllAnswers() {
  const [answers, setAnswers] = useState([]);
  const [liveStudents, setLiveStudents] = useState({});
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const q = query(
        collection(db, "assignments"),
        orderBy("submittedAt", "desc")
      );

      const snap = await getDocs(q);
      const arr = [];
      snap.forEach((d) => arr.push({ id: d.id, ...d.data() }));
      setAnswers(arr);
    });

    return () => unsub();
  }, [router]);

  // ✅ LIVE FROM RTDB
  useEffect(() => {
    const liveRef = ref(rtdb, "liveStudents");
    onValue(liveRef, (snap) => {
      setLiveStudents(snap.val() || {});
    });
  }, []);

  const formatDate = (d) =>
    new Date(d).toLocaleString();

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          🔴 LIVE STUDENT MONITORING
        </h1>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </div>

      {/* ✅ LIVE STUDENTS */}
      <h2 className="text-xl font-bold mb-2">
        Live Students Connected:{" "}
        {Object.keys(liveStudents).length}
      </h2>

      {Object.keys(liveStudents).length === 0 && (
        <p className="text-red-500">
          ❌ No students are live right now.
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {Object.entries(liveStudents).map(([id, s]) => (
          <div key={id} className="border p-4 rounded bg-green-50">
            <p className="font-bold mb-2">{s.name} — LIVE 🎥</p>
            <LiveCameraViewer studentId={id} />
          </div>
        ))}
      </div>

      {/* ✅ SUBMITTED STUDENTS */}
      <h2 className="text-2xl font-bold mb-4">
        ✅ SUBMITTED STUDENTS
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {answers.map((s) => (
          <div key={s.id} className="border p-4 rounded">
            <h3 className="text-xl font-bold">{s.name}</h3>
            <p className="text-sm text-gray-600">
              Submitted: {formatDate(s.submittedAt)}
            </p>

            <div className="mt-3 space-y-1">
              {Object.entries(s.answers || {})
                .sort((a, b) =>
                  parseInt(a[0].slice(1)) -
                  parseInt(b[0].slice(1))
                )
                .map(([k, v]) => (
                  <p key={k}>
                    <b>{k.toUpperCase()}:</b> {v || "-"}
                  </p>
                ))}
            </div>

            <button
              onClick={() =>
                deleteDoc(doc(db, "assignments", s.id))
              }
              className="bg-red-500 text-white w-full mt-4 py-2 rounded"
            >
              Delete Submission
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
