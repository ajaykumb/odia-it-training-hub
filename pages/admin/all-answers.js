import { useEffect, useState } from "react";
import { db, auth } from "../../utils/firebaseConfig";
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

export default function AllAnswers() {
  const [answers, setAnswers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
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

    return () => unsubscribe();
  }, []);

  // ✅ Safe date formatter
  const formatDate = (d) => {
    if (!d) return "N/A";
    if (d.seconds) return new Date(d.seconds * 1000).toLocaleString();
    return new Date(d).toLocaleString();
  };

  // ✅ DELETE HANDLER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student's answer?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "assignments", id));

      // ✅ Remove from UI instantly
      setAnswers((prev) => prev.filter((item) => item.id !== id));

      alert("Student answer deleted successfully.");
    } catch (err) {
      console.error("Delete Error:", err.message);
      alert("Failed to delete. Check Firestore rules.");
    }
  };

  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        All Student Answers (Admin)
      </h1>

      <div className="flex justify-end mb-6">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded-md"
          onClick={() => signOut(auth)}
        >
          Logout
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {answers.map((s, i) => (
          <div
            key={i}
            className="p-4 border rounded-lg shadow bg-white"
          >
            {/* ✅ HEADER */}
            <div className="flex items-center gap-4 mb-4">
              {s.cameraImage ? (
                <img
                  src={s.cameraImage}
                  alt="Student Face"
                  className="w-28 h-24 object-cover border rounded-md"
                />
              ) : (
                <div className="w-28 h-24 flex items-center justify-center border rounded-md text-red-500 text-sm">
                  No Photo
                </div>
              )}

              <div>
                <h2 className="font-bold text-xl">{s.name}</h2>
                <p className="text-sm text-gray-600">
                  Submitted: {formatDate(s.submittedAt)}
                </p>
                {s.studentId && (
                  <p className="text-sm font-semibold">
                    Student ID: {s.studentId}
                  </p>
                )}
              </div>
            </div>

            <hr className="my-3" />

{/* ✅ ALL ANSWERS (DYNAMIC) */}
<div className="space-y-2 mb-4">
  {s.answers &&
    Object.keys(s.answers).map((key, index) => (
      <p key={key}>
        <b>Q{index + 1}:</b> {s.answers[key]}
      </p>
    ))}
</div>

            {/* ✅ DELETE BUTTON */}
            <button
              onClick={() => handleDelete(s.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md w-full"
            >
              Delete This Submission
            </button>
          </div>
        ))}

        {answers.length === 0 && (
          <p className="text-center col-span-2 text-gray-500">
            No student submissions yet.
          </p>
        )}
      </div>
    </main>
  );
}
