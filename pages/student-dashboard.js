export default function StudentDashboard() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <a href="/" className="text-blue-600 text-sm hover:underline">
          ← Back to Main Site
        </a>
      </header>

      {/* Dashboard Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-blue-700 mb-3">
          Student Dashboard
        </h1>

        <p className="text-gray-600 mb-6">
          Welcome! Select your class notes below.
        </p>

        {/* Notes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <a
            href="/class-notes"
            className="p-5 rounded-xl border border-gray-300 bg-blue-50 hover:bg-blue-100 transition shadow-sm"
          >
            <h2 className="text-lg font-semibold text-blue-700">
              📘 Class Notes
            </h2>
            <p className="text-gray-600 text-sm">
              Access notes for all completed sessions.
            </p>
          </a>

          <a
            href="#"
            className="p-5 rounded-xl border border-gray-300 bg-green-50 cursor-not-allowed opacity-60"
          >
            <h2 className="text-lg font-semibold text-green-700">
              📝 Assignments (Coming Soon)
            </h2>
            <p className="text-gray-600 text-sm">Will be available soon.</p>
          </a>

          <a
            href="#"
            className="p-5 rounded-xl border border-gray-300 bg-purple-50 cursor-not-allowed opacity-60"
          >
            <h2 className="text-lg font-semibold text-purple-700">
              📊 Progress Report (Coming Soon)
            </h2>
            <p className="text-gray-600 text-sm">Will be available soon.</p>
          </a>
        </div>
      </div>
    </main>
  );
}
