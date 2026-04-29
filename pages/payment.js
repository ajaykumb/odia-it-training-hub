import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

export default function Payment() {
  const router = useRouter();

  const handlePaymentRequest = async () => {
    const studentUID = localStorage.getItem("studentUID");

    if (!studentUID) {
      alert("Session expired. Login again.");
      router.push("/login");
      return;
    }

    try {
      await updateDoc(doc(db, "students", studentUID), {
        paymentRequested: true
      });

      alert("Payment request sent. Wait for admin approval.");
      router.push("/waiting-approval");

    } catch (err) {
      alert("Error submitting payment request");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">

      <h2 className="text-2xl font-bold mb-4">Complete Payment</h2>

      {/* YOUR QR IMAGE */}
      <img src="/images/upi-qr.png" className="w-64 h-64 border" />

      <p className="mt-4 text-gray-600">
        After payment, click below
      </p>

      <button
        onClick={handlePaymentRequest}
        className="mt-5 bg-blue-600 text-white px-6 py-2 rounded"
      >
        I Have Paid
      </button>

    </div>
  );
}
