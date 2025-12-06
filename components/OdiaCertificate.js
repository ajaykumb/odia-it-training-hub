// 📁 components/OdiaCertificate.js

export default function OdiaCertificate({ studentName, courseName, date, certificateId }) {
  return (
    <div
      id="certificate"
      className="relative w-[900px] h-[650px] mx-auto bg-white p-10 border-[18px] border-yellow-400 shadow-2xl"
      style={{
        backgroundImage: "url('/images/certificate-pattern.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* LOGO */}
      <img
        src="/images/logo.png"
        className="absolute top-10 left-1/2 -translate-x-1/2 w-24"
      />

      {/* MAIN HEADING */}
      <h1 className="text-center text-4xl font-extrabold text-blue-900 mt-28">
        Odia IT Training Hub
      </h1>

      <h2 className="text-center text-3xl font-bold text-blue-700 mt-3">
        Certificate of Completion
      </h2>

      {/* INTRO */}
      <p className="text-center text-lg text-gray-700 mt-8">
        This certificate is proudly presented to
      </p>

      {/* STUDENT NAME */}
      <h2 className="text-center text-4xl font-bold text-blue-900 mt-4 capitalize">
        {studentName}
      </h2>

      <p className="text-center text-lg text-gray-700 mt-6">
        for successfully completing the course
      </p>

      {/* COURSE */}
      <h3 className="text-center text-2xl font-semibold text-blue-700 mt-3">
        {courseName}
      </h3>

      {/* COMPLETION DATE + CERTIFICATE ID — moved UP */}
      <div className="text-center mt-10 mb-4">
        <p className="text-gray-700 text-lg">
          Completion Date: <strong>{date}</strong>
        </p>
        <p className="text-gray-700 mt-1 text-lg">
          Certificate ID: <strong>{certificateId}</strong>
        </p>
      </div>

      {/* ⭐ SIGNATURE (small + clean + left aligned) */}
      <div className="absolute bottom-10 left-20 text-center">

        {/* Smaller Signature Image */}
        <img
          src="/images/signature.png"
          className="w-24 h-auto object-contain opacity-90"
        />

        <p className="font-semibold text-gray-700 mt-1 text-lg">Instructor</p>
      </div>

    </div>
  );
}
