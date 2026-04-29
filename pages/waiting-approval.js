import { useEffect } from "react";
import { useRouter } from "next/router";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function WaitingApproval() {
  const router = useRouter();

  useEffect(() => {
    const uid = localStorage.getItem("studentUID");

    if (!uid) {
      router.push("/login");
      return;
    }

    // 🔥 REAL-TIME LISTENER (BEST FIX)
    const unsub = onSnapshot(doc(db, "students", uid), (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        console.log("Payment Status:", data.paymentDone);

        if (data.paymentDone === true) {
          router.push("/student-dashboard");
        }
      }
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2 className="text-xl text-gray-700">
        ⏳ Payment verification in progress... Please wait for admin approval.
      </h2>
    </div>
  );
}
