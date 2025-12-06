// 📁 components/OdiaCertificate.js

export default function OdiaCertificate({ studentName, courseName, date }) {
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

      <h1 className="text-center text-4xl font-extrabold text-blue-900 mt-28">
        Odia IT Training Hub
      </h1>

      <h2 className="text-center text-3xl font-bold text-blue-700 mt-3">
        Certificate of Completion
      </h2>

      <p className="text-center text-lg text-gray-700 mt-8">
        This certificate is proudly presented to
      </p>

      <h2 className="text-center text-4xl font-bold text-blue-900 mt-4">
        {studentName}
      </h2>

      <p className="text-center text-lg text-gray-700 mt-6">
        for successfully completing the course
      </p>

      <h3 className="text-center text-2xl font-semibold text-blue-700 mt-3">
        {courseName}
      </h3>

      <p className="text-center text-gray-600 mt-6">
        Completion Date: <strong>{date}</strong>
      </p>

      <div className="absolute bottom-14 left-0 right-0 flex justify-around px-16">
        <div className="text-center">
          <img src="/images/signature.png" className="w-40 mx-auto" />
          <p className="font-semibold text-gray-700 mt-1">Instructor</p>
        </div>

        <div className="text-center">
          <div className="w-40 mx-auto border-b-2 border-gray-500 mb-1"></div>
          <p className="font-semibold text-gray-700">Director</p>
        </div>
      </div>
    </div>
  );
}
