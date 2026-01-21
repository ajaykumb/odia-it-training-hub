import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

import OdiaCertificate from "../components/OdiaCertificate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CertificatePage() {
  const [studentName, setStudentName] = useState("Loading...");
  const [certificateId, setCertificateId] = useState("Loading...");
  const [isEligible, setIsEligible] = useState(null); // ⭐ NEW

  const courseName = "Application & Production Support (6 Months)";
  const date = new Date().toLocaleDateString("en-IN");

  // ⭐ Generate Certificate ID
  const generateCertificateId = (uid) => {
    if (!uid) return "CERT-UNKNOWN";
    const year = new Date().getFullYear();
    const shortId = uid.substring(0, 12).toUpperCase();
    return `CERT-${year}-${shortId}`;
  };

  // ✔ Fetch student info + eligibility
  useEffect(() => {
    const fetchStudentData = async () => {
      const uid = localStorage.getItem("studentUID");

      if (!uid) {
        setStudentName("Unknown Student");
        setCertificateId("CERT-UNKNOWN");
        setIsEligible(false);
        return;
      }

      // ⭐ Generate certificate ID
      setCertificateId(generateCertificateId(uid));

      const ref = doc(db, "students", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setStudentName(data.name || "No Name Found");
        setIsEligible(data.certificateEligible === true);
      } else {
        setStudentName("User Not Found");
        setIsEligible(false);
      }
    };

    fetchStudentData();
  }, []);

  // ⏳ Loading state
  if (isEligible === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Checking certificate eligibility...
        </p>
      </main>
    );
  }

  // 🔒 Not eligible – block certificate
  if (!isEligible) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          🔒 Certificate Locked
        </h1>
        <p className="text-gray-700 text-center max-w-xl">
          Your certificate is not available yet.
          <br />
          Please complete the course and maintain minimum attendance
          to unlock your certificate.
        </p>
      </main>
    );
  }

  // 📄 PDF Download (UNCHANGED)
  const downloadPDF = async () => {
    const certificate = document.getElementById("certificate");

    const canvas = await html2canvas(certificate, {
      scale: 2,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "px", [900, 650]);
    pdf.addImage(imgData, "PNG", 0, 0, 900, 650);
    pdf.save(`Certificate-${studentName}.pdf`);
  };

  // ✅ Eligible – show certificate
  return (
    <main className="min-h-screen bg-gray-100 py-10">

      <h1 className="text-center text-3xl font-bold text-blue-700 mb-2">
        Your Course Certificate
      </h1>

      {/* ⭐ SHOW CERTIFICATE ID */}
      <p className="text-center text-gray-700 mb-6 text-lg">
        Certificate ID: <strong>{certificateId}</strong>
      </p>

      <div className="flex flex-col items-center gap-8">
        <OdiaCertificate
          studentName={studentName}
          courseName={courseName}
          date={date}
          certificateId={certificateId}
        />

        <button
          onClick={downloadPDF}
          className="bg-blue-700 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-800"
        >
          Download Certificate (PDF)
        </button>
      </div>
    </main>
  );
}
