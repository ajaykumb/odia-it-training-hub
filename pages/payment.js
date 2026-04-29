import { useRouter } from "next/router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { motion } from "framer-motion";

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
    <div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-500 to-indigo-600 flex items-center justify-center px-4">

      {/* MAIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
      >

        {/* HEADER */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <img
            src="/images/logo.png"
            className="h-14 w-14 mx-auto mb-2 rounded-full"
          />
          <h2 className="text-xl font-bold">Odia IT Training Hub</h2>
          <p className="text-sm opacity-90">Secure Payment Portal</p>
        </div>

        {/* CONTENT */}
        <div className="p-6">

          {/* COURSE INFO */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-700 mb-2">
              🎓 Course Payment
            </p>

            <p>👉 Please pay your <b>First Installment</b></p>

            <ul className="mt-2 list-disc list-inside text-gray-700">
              <li>3 Installments available</li>
              <li>
                Full Payment →{" "}
                <span className="text-green-600 font-semibold">
                  ₹1000 Discount
                </span>
              </li>
            </ul>
          </div>

          {/* QR SECTION */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-2">
              Scan to Pay via UPI
            </p>

            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/images/upi-qr.png"
              className="w-56 h-56 mx-auto border rounded-xl shadow-md"
            />
          </div>

          {/* PAYMENT METHODS */}
          <p className="text-center text-xs text-gray-500 mt-3">
            Google Pay • PhonePe • Paytm • Any UPI App
          </p>

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePaymentRequest}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
          >
            I Have Paid
          </motion.button>

          {/* FOOTER NOTE */}
          <p className="text-xs text-gray-500 mt-4 text-center">
            After payment, click above and wait for admin approval.
          </p>

        </div>

        {/* FOOTER */}
        <div className="bg-gray-50 text-center p-3 text-xs text-gray-500">
          Need help? Contact: +91 9437401378
        </div>

      </motion.div>
    </div>
  );
}
