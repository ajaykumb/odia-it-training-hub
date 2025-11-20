export default function ClassNotes() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Back Button */}
        <a href="/student-dashboard" className="text-blue-600 text-sm hover:underline">
          ← Back to Dashboard
        </a>

        {/* Title */}
        <h1 className="text-3xl font-bold text-blue-700 mt-4 mb-4">
          Class Notes
        </h1>

        <p className="text-gray-600 mb-6">
          Below are class-wise notes. Click to open or download.
        </p>

        {/* Notes List */}
        <div className="space-y-4">

          {/* Example Notes – Replace With Your Files */}
          <a
            href="https://your-pdf-link.com/note1.pdf"
            target="_blank"
            className="block p-4 bg-white border border-gray-300 rounded-xl hover:bg-blue-50 transition"
          >
            <h3 className="text-lg font-semibold text-blue-700">
              📘 Class 1 – Introduction to Linux
            </h3>
            <p className="text-gray-600 text-sm">PDF Format</p>
          </a>

          <a
            href="https://your-pdf-link.com/note2.pdf"
            target="_blank"
            className="block p-4 bg-white border border-gray-300 rounded-xl hover:bg-blue-50 transition"
          >
            <h3 className="text-lg font-semibold text-blue-700">
              📘 Class 2 – Linux Commands (Basic)
            </h3>
            <p className="text-gray-600 text-sm">PDF Format</p>
          </a>

          <a
            href="https://your-pdf-link.com/note3.pdf"
            target="_blank"
            className="block p-4 bg-white border border-gray-300 rounded-xl hover:bg-blue-50 transition"
          >
            <h3 className="text-lg font-semibold text-blue-700">
              📘 Class 3 – Advanced Commands
            </h3>
            <p className="text-gray-600 text-sm">PDF Format</p>
          </a>

        </div>
      </div>
    </main>
  );
}
