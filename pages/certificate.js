import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";

import OdiaCertificate from "../components/OdiaCertificate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CertificatePage() {
  const [studentName, setStudentName] = useState("Loading...");
  const [courseName, setCourseName] = useState("Application & Production Support (6 Months)");
  const date = new Date().toLocaleDateString("en-IN");

  // 🔥 Fetch student name from Firestore
  useEffect(() => {
    const fetchStudent = async () => {
      const uid = localStorage.getItem("studentUID"); // stored during login

      if (!uid) {
        setStudentName("Unknown Student");
        return;
      }

      const ref = doc(db, "students", uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setStudentName(data.name || "No Name Found");
      } else {
        setStudentName("No Record Found");
      }
    };

    fetchStudent();
  }, []);

  // PDF Download
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

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <h1 className="text-center text-3xl font-bold text-blue-700 mb-10">
        Your Course Certificate
      </h1>

      <div className="flex flex-col items-center gap-8">
        <OdiaCertificate
          studentName={studentName}
          courseName={courseName}
          date={date}
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
