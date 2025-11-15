export default function Success() {
  const students = [
    { name: "Abhijit", company: "Clover", package: "8.0 LPA" },
    { name: "Bijay", company: "Infosys", package: "7.5 LPA" },
    { name: "Yas", company: "ANZ", package: "7.0 LPA" },
    { name: "S Pahi", company: "Indigo", package: "6.0 LPA" },
    { name: "Dipti R", company: "Hiiden Company", package: "6.0 LPA" },
    { name: "Satya AXE", company: "Airtel client", package: "6.0 LPA" },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 text-gray-800 px-4 py-10">
      <h1 className="text-4xl font-bold text-green-700 text-center mb-10">
        Our Successful Candidates 🎉
      </h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {students.map((s, i) => (
          <div
            key={i}
            className="bg-white shadow-md p-6 rounded-xl border-l-4 border-green-600"
          >
            <h2 className="text-2xl font-semibold">{s.name}</h2>
            <p className="text-lg">Company: {s.company}</p>
            <p className="text-lg font-bold">Package: {s.package}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
