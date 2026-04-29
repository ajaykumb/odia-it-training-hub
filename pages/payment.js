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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-4">

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md text-center">

        {/* LOGO */}
        <div className="flex justify-center mb-4">
          <img src="/images/logo.png" className="h-20 w-20 rounded-full shadow" />
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-blue-700">
          Odia IT Training Hub
        </h2>

        <p className="text-gray-600 text-sm mt-1">
          Complete Your Course Payment
        </p>

        {/* PAYMENT NOTE */}
        <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-4 mt-5 text-sm text-gray-800">
          <p className="font-semibold text-yellow-700 mb-2">
            📢 Payment Instructions
          </p>

          <p>👉 Please pay your <b>First Installment</b> to continue the course.</p>

          <p className="mt-2">
            💰 You can choose:
          </p>

          <ul className="text-left mt-2 list-disc list-inside">
            <li>Pay in <b>3 Installments</b></li>
            <li>
              Pay <b>Full Amount</b> and get <span className="text-green-600 font-semibold">₹1000 Discount</span>
            </li>
          </ul>
        </div>

        {/* QR CODE */}
        <div className="mt-6">
          <img
            src="/images/upi-qr.png"
            className="w-56 h-56 mx-auto border rounded-lg shadow"
          />
        </div>

        {/* UPI NOTE */}
        <p className="mt-4 text-gray-600 text-sm">
          Scan using Google Pay / PhonePe / Paytm
        </p>

        {/* BUTTON */}
        <button
          onClick={handlePaymentRequest}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          I Have Paid
        </button>

        {/* FOOTER NOTE */}
        <p className="text-xs text-gray-500 mt-4">
          After payment, click the button above and wait for admin approval.
        </p>

      </div>
    </div>
  );
}
