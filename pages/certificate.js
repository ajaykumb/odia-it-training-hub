import OdiaCertificate from "../components/OdiaCertificate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function CertificatePage() {
  const studentName = "Student Name"; // Later pull from Firestore
  const courseName = "Application & Production Support (6 Months)";
  const date = new Date().toLocaleDateString("en-IN");

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
