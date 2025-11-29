import { useEffect, useState } from "react";
import { db, auth } from "../../utils/firebaseConfig";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
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

      // ✅ Ordered by latest submission
      const q = query(
        collection(db, "assignments"),
        orderBy("submittedAt", "desc")
      );

      const snapshot = await getDocs(q);
      const arr = [];
      snapshot.forEach((doc) => {
        arr.push({ id: doc.id, ...doc.data() });
      });

      setAnswers(arr);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Safe date formatter (works for both Timestamp & ISO string)
  const formatDate = (d) => {
    if (!d) return "N/A";

    // If Firestore Timestamp
    if (d.seconds) {
      return new Date(d.seconds * 1000).toLocaleString();
    }

    // If ISO string
    return new Date(d).toLocaleString();
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
            {/* ✅ STUDENT HEADER */}
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

            {/* ✅ STUDENT ANSWERS */}
            <div className="space-y-2">
              <p><b>Q1:</b> {s.answers?.q1}</p>
              <p><b>Q2:</b> {s.answers?.q2}</p>
              <p><b>Q3:</b> {s.answers?.q3}</p>
            </div>
          </div>
        ))}

        {/* ✅ EMPTY STATE */}
        {answers.length === 0 && (
          <p className="text-center col-span-2 text-gray-500">
            No student submissions yet.
          </p>
        )}
      </div>
    </main>
  );
}
