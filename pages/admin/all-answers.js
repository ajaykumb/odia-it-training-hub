import { useEffect, useState, useMemo } from "react";
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
import { ref, onValue } from "firebase/database";

export default function AllAnswers() {
  const [answers, setAnswers] = useState([]);
  const [liveStudents, setLiveStudents] = useState({});
  const [filter, setFilter] = useState("all");
  const router = useRouter();

  // ✅ AUTH + FIRESTORE
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

      const snapshot = await getDocs(q);
      const arr = [];
      snapshot.forEach((docData) => {
        arr.push({ id: docData.id, ...docData.data() });
      });

      setAnswers(arr);
    });

    return () => unsub();
  }, [router]);

  // ✅ RTDB LIVE STUDENTS
  useEffect(() => {
    const liveRef = ref(rtdb, "liveStudents");

    onValue(liveRef, (snap) => {
      setLiveStudents(snap.val() || {});
    });
  }, []);

  const filteredAnswers = useMemo(() => {
    if (filter === "auto") {
      return answers.filter((a) => a.autoSubmitted === true);
    }
    if (filter === "manual") {
      return answers.filter((a) => a.autoSubmitted === false);
    }
    return answers;
  }, [answers, filter]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this submission?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "assignments", id));
    setAnswers((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
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

      {/* ✅ LIVE STUDENTS */}
      <div className="mb-10">
        <p className="text-lg font-semibold mb-2">
          Live Students Connected:{" "}
          {Object.keys(liveStudents).length}
        </p>

        {Object.keys(liveStudents).length === 0 && (
          <p className="text-red-500">❌ No students are live right now.</p>
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

      {/* ✅ SUBMITTED STUDENTS */}
      <h2 className="text-2xl font-bold mb-4">✅ SUBMITTED STUDENTS</h2>

      <div className="grid md:grid-cols-2 gap-6">
        {filteredAnswers.map((s) => (
          <div key={s.id} className="p-4 border rounded shadow">
            <h2 className="font-bold text-xl">{s.name}</h2>

            <div className="mt-2 space-y-1">
              {Object.entries(s.answers || {}).map(([k, v]) => (
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
          <p>No submitted students yet.</p>
        )}
      </div>
    </main>
  );
}
