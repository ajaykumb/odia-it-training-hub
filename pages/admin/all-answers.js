import { useEffect, useState, useMemo } from "react";
import { db, auth, rtdb } from "../../utils/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";
import { ref, onValue } from "firebase/database";

export default function AllAnswers() {
  const [answers, setAnswers] = useState([]);
  const [liveStudents, setLiveStudents] = useState({});
  const [filter, setFilter] = useState("all"); // all | manual | auto
  const router = useRouter();

  // ✅ AUTH + FIRESTORE SUBMISSIONS (REALTIME SAFE)
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const unsubSnap = onSnapshot(
        collection(db, "assignments"),
        (snapshot) => {
          const arr = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

          console.log("ADMIN LIVE DATA:", arr); // ✅ DEBUG
          setAnswers(arr);
        }
      );

      return () => unsubSnap();
    });

    return () => unsubAuth();
  }, [router]);

  // ✅ REALTIME LIVE STUDENTS
  useEffect(() => {
    const liveRef = ref(rtdb, "liveStudents");
    onValue(liveRef, (snap) => {
      setLiveStudents(snap.val() || {});
    });
  }, []);

  // ✅ FILTER LOGIC
  const filteredAnswers = useMemo(() => {
    if (filter === "auto") {
      return answers.filter((a) => a.autoSubmitted === true);
    }
    if (filter === "manual") {
      return answers.filter((a) => a.autoSubmitted === false);
    }
    return answers;
  }, [answers, filter]);

  // ✅ DATE FORMAT
  const formatDate = (d) => {
    if (!d) return "N/A";
    if (d.seconds) return new Date(d.seconds * 1000).toLocaleString();
    return new Date(d).toLocaleString();
  };

  // ✅ DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this submission?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "assignments", id));
    setAnswers((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      {/* ✅ HEADER */}
      <div className="flex justify-between items-center mb-6">
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

      {/* ✅ LIVE STUDENTS SECTION */}
      <div className="mb-10">
        <p className="text-lg font-semibold mb-2">
          Live Students Connected:{" "}
          {Object.keys(liveStudents).length}
        </p>

        {Object.keys(liveStudents).length === 0 && (
          <p className="text-red-500">
            ❌ No students are live right now.
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-4">
          {Object.entries(liveStudents).map(([id, s]) => (
            <div
              key={id}
              className="border p-4 rounded shadow bg-green-50"
            >
              <p className="font-bold">{s.name}</p>
              <p className="text-green-600 font-semibold">
                LIVE 🎥
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ FILTER BUTTONS */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("manual")}
          className={`px-4 py-2 rounded ${
            filter === "manual"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Manual Only
        </button>

        <button
          onClick={() => setFilter("auto")}
          className={`px-4 py-2 rounded ${
            filter === "auto"
              ? "bg-orange-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Auto-Submitted Only
        </button>
      </div>

      {/* ✅ SUBMITTED STUDENTS SECTION */}
      <h2 className="text-2xl font-bold mb-4">
        ✅ SUBMITTED STUDENTS
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredAnswers.map((s) => (
          <div key={s.id} className="p-4 border rounded shadow bg-white">
            <h2 className="font-bold text-xl">{s.name}</h2>

            <p className="text-sm text-gray-600 mt-1">
              Submitted: {formatDate(s.submittedAt)}
            </p>

            {/* ✅ BADGES */}
            <div className="mt-2 space-x-2">
              <span
                className={`px-2 py-1 text-xs rounded ${
                  s.autoSubmitted
                    ? "bg-orange-100 text-orange-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {s.autoSubmitted
                  ? "AUTO SUBMITTED"
                  : "MANUAL SUBMITTED"}
              </span>

              <span
                className={`px-2 py-1 text-xs rounded ${
                  s.cameraVerified
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                Camera: {s.cameraVerified ? "ON" : "OFF"}
              </span>
            </div>

            {/* ✅ ANSWERS IN SEQUENCE */}
            <div className="mt-4 space-y-1">
              {Object.entries(s.answers || {})
                .sort((a, b) => {
                  const na = parseInt(a[0].replace("q", ""));
                  const nb = parseInt(b[0].replace("q", ""));
                  return na - nb;
                })
                .map(([k, v]) => (
                  <p key={k}>
                    <b>{k.toUpperCase()}:</b> {v || "-"}
                  </p>
                ))}
            </div>

            <button
              onClick={() => handleDelete(s.id)}
              className="bg-red-500 text-white w-full mt-4 py-2 rounded"
            >
              Delete Submission
            </button>
          </div>
        ))}

        {filteredAnswers.length === 0 && (
          <p>No submitted students found.</p>
        )}
      </div>
    </main>
  );
}
