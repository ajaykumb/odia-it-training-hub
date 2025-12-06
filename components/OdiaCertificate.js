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

      {/* HEADING */}
      <h1 className="text-center text-4xl font-extrabold text-blue-900 mt-28">
        Odia IT Training Hub
      </h1>

      <h2 className="text-center text-3xl font-bold text-blue-700 mt-3">
        Certificate of Completion
      </h2>

      {/* DESCRIPTION */}
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

      {/* COURSE NAME */}
      <h3 className="text-center text-2xl font-semibold text-blue-700 mt-3">
        {courseName}
      </h3>

      {/* ⭐ DATE + CERTIFICATE ID — moved DOWN (perfect position) */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center">
        <p className="text-gray-700 text-lg">
          Completion Date: <strong>{date}</strong>
        </p>

        <p className="text-gray-700 text-lg mt-1">
          Certificate ID: <strong>{certificateId}</strong>
        </p>
      </div>

      {/* SIGNATURE (Left side) */}
      <div className="absolute bottom-20 left-20 text-center">
        <img
          src="/images/signature.png"
          className="w-20 h-auto object-contain opacity-90"
        />
        <p className="font-semibold text-gray-700 mt-1 text-lg">Instructor</p>
      </div>

    </div>
  );
}
