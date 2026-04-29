import { useEffect, useState } from "react";
import { db } from "../utils/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  updateDoc
} from "firebase/firestore";

export default function AdminPayment() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Load students who requested payment
  const loadStudents = async () => {
    try {
      const snap = await getDocs(collection(db, "students"));

      const list = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Only show requested payments
      const filtered = list.filter(s => s.paymentRequested);

      setStudents(filtered);
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  // ✅ Approve payment + send email
  const approvePayment = async (id, student) => {
    try {
      await updateDoc(doc(db, "students", id), {
        paymentDone: true
      });

      // 🔥 SEND SUCCESS EMAIL
      try {
        await fetch("/api/sendPaymentSuccessMail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toEmail: student.email,
            name: student.name || "Student",
          }),
        });
      } catch (err) {
        console.error("Mail error:", err);
      }

      alert("✅ Payment Approved & Email Sent");

      loadStudents(); // refresh list
    } catch (err) {
      alert("Error approving payment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-3xl font-bold mb-6 text-blue-700">
        Admin Payment Approval
      </h1>

      {loading && <p>Loading...</p>}

      {!loading && students.length === 0 && (
        <p>No payment requests found.</p>
      )}

      <div className="space-y-4">
        {students.map((s) => (
          <div
            key={s.id}
            className="bg-white p-5 rounded-xl shadow-md border"
          >
            <p><b>Name:</b> {s.name}</p>
            <p><b>Email:</b> {s.email}</p>
            <p><b>Phone:</b> {s.phone}</p>

            <p className="mt-2">
              <b>Status:</b>{" "}
              {s.paymentDone ? (
                <span className="text-green-600 font-semibold">
                  Approved
                </span>
              ) : (
                <span className="text-yellow-600 font-semibold">
                  Pending
                </span>
              )}
            </p>

            {!s.paymentDone && (
              <button
                onClick={() => approvePayment(s.id, s)}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Approve Payment
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
