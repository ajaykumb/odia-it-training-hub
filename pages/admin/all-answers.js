import { useEffect, useState, useRef } from "react";
import { auth, rtdb } from "../../utils/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue, set } from "firebase/database";
import { useRouter } from "next/router";

/* ✅ LIVE CAMERA VIEWER — MATCHES YOUR EXACT RTDB STRUCTURE */
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
      if (videoRef.current) {
        videoRef.current.srcObject = event.streams[0];
      }
    };

    onValue(offerRef, async (snapshot) => {
      if (!snapshot.exists()) return;

      const offer = snapshot.val();
      await pc.setRemoteDescription(
        new RTCSessionDescription(offer)
      );

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      await set(answerRef, answer);
    });

    onValue(candidatesRef, (snap) => {
      if (!snap.exists()) return;

      Object.values(snap.val()).forEach((c) => {
        pc.addIceCandidate(new RTCIceCandidate(c));
      });
    });

    return () => pc.close();
  }, [studentId]);

  return (
    <div className="mt-3 border rounded p-2 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-40 rounded"
      />
    </div>
  );
}

export default function LiveMonitorOnly() {
  const [liveStudents, setLiveStudents] = useState([]);
  const router = useRouter();

  // ✅ ADMIN PROTECTION
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) router.push("/admin/login");
    });
    return () => unsub();
  }, [router]);

  // ✅ PURE LIVE STUDENT LIST FROM RTDB
  useEffect(() => {
    const rootRef = ref(rtdb);

    const unsubscribe = onValue(rootRef, (snapshot) => {
      if (!snapshot.exists()) {
        setLiveStudents([]);
        return;
      }

      const data = snapshot.val();

      // Only students that have "offer" = LIVE
      const active = Object.keys(data).filter(
        (id) => data[id]?.offer
      );

      setLiveStudents(active);
    });

    return () => unsubscribe();
  }, []);

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-center">
          🔴 LIVE STUDENT MONITORING
        </h1>

        <button
          onClick={() => signOut(auth)}
          className="bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <p className="mb-4 text-sm text-gray-600 text-center">
        Live Students Connected: <b>{liveStudents.length}</b>
      </p>

      <div className="grid md:grid-cols-2 gap-6">
        {liveStudents.map((studentId) => (
          <div
            key={studentId}
            className="p-4 border rounded-lg shadow bg-white"
          >
            <h2 className="font-bold text-xl">
              {studentId} — LIVE 🎥
            </h2>

            <LiveCameraViewer studentId={studentId} />
          </div>
        ))}

        {liveStudents.length === 0 && (
          <p className="text-center col-span-2 text-gray-500">
            ❌ No students are live right now.
          </p>
        )}
      </div>
    </main>
  );
}
