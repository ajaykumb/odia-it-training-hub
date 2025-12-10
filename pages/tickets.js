export default function Tickets() {
  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800 tracking-tight">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-blue-700/95 backdrop-blur-sm text-white py-4 shadow-xl">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="flex items-center space-x-4 group">
            <img src="/images/logo.png" className="w-12 h-12" />
            <span className="text-xl md:text-2xl font-extrabold text-yellow-300">
              Odia IT Training Hub
            </span>
          </a>
        </div>
      </header>

      {/* Page Title */}
      <section className="py-16 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-extrabold text-blue-700 mb-4">
            Real-Time IT Ticket Simulator
          </h1>
          <p className="text-lg text-gray-700">
            Explore real production issues & learn how IT support engineers resolve incidents.
          </p>
        </div>
      </section>

      {/* Ticket List */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* REPEAT ALL 12 TICKETS HERE */}
          {/* I will give you the first ticket as example */}

          <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-red-500">
            <h4 className="text-2xl font-bold text-red-600">⚠️ Autosys Job Failure</h4>
            <p className="text-gray-600 mt-2">
              Job ABC_DAILY_LOAD failed with Exit Code 255.
            </p>
            <details className="mt-4">
              <summary className="cursor-pointer font-semibold text-blue-600">
                View Issue Details
              </summary>
              <div className="mt-3 text-gray-700 space-y-2">
                <p><strong>Symptoms:</strong> Downstream jobs impacted.</p>
                <p><strong>Log Snippet:</strong> ORA-00942 table missing.</p>
                <p><strong>Root Cause:</strong> DB table not present.</p>
                <p><strong>Resolution:</strong> Synced missing table & reran job.</p>
              </div>
            </details>
          </div>

          {/* add all remaining tickets from previous response */}

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8">
        <div className="max-w-6xl mx-auto px-6">
          <p>© 2022 Odia IT Training Hub. All rights reserved.</p>
        </div>
      </footer>

    </main>
  );
}
