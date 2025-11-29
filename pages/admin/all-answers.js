import { useEffect, useState } from "react";
import { db, auth } from "../../utils/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/router";

export default function AllAnswers() {
  const [answers, setAnswers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/admin/login");
        return;
      }

      const snapshot = await getDocs(collection(db, "assignments"));
      const arr = [];
      snapshot.forEach((doc) => arr.push(doc.data()));
      setAnswers(arr);
    });
  }, []);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">All Student Answers</h1>

      <button
        className="mb-6 bg-red-600 text-white px-4 py-2 rounded-md"
        onClick={() => signOut(auth)}
      >
        Logout
      </button>

      <div className="space-y-6">
        {answers.map((s, i) => (
          <div key={i} className="p-4 border rounded-lg shadow">
            <h2 className="font-bold text-xl">{s.name}</h2>
            <p className="text-gray-500">
              Submitted: {new Date(s.submittedAt.seconds * 1000).toString()}
            </p>

            <hr className="my-3" />

            <p><b>Q1:</b> {s.answers.q1}</p>
            <p><b>Q2:</b> {s.answers.q2}</p>
            <p><b>Q3:</b> {s.answers.q3}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
