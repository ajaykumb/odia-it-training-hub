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

      {/* HERO SECTION */}
      <section className="py-20 bg-gradient-to-br from-blue-800 to-indigo-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"></div>

        <h1 className="text-5xl font-extrabold mb-4">Real-Time IT Ticket Simulator</h1>
        <p className="text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
          Practice real production issues handled by L1 & L2 engineers in top MNCs.
          Learn troubleshooting exactly the way real IT teams solve incidents.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {[
            "SQL", "Linux", "Autosys", "Control-M", "Splunk", "Dynatrace",
            "Java", "API", "ETL", "AWS", "Shell Script"
          ].map((cat) => (
            <a
              key={cat}
              href={`#${cat}`}
              className="px-6 py-2 bg-yellow-400 text-blue-900 rounded-full font-bold shadow hover:bg-yellow-300 transition-all"
            >
              {cat}
            </a>
          ))}
        </div>
      </section>

      {/* 📊 ANALYTICS DASHBOARD */}
      <section className="max-w-6xl mx-auto px-6 py-12 mt-10">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">
          📊 Ticket Analytics Dashboard
        </h2>

        {/* FIRST ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow-xl border-l-8 border-blue-600">
            <p className="text-gray-500 font-semibold">Total Tickets</p>
            <h3 className="text-4xl font-extrabold text-blue-700 mt-2">12</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl border-l-8 border-green-600">
            <p className="text-gray-500 font-semibold">Categories Covered</p>
            <h3 className="text-4xl font-extrabold text-green-700 mt-2">11</h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl border-l-8 border-purple-600">
            <p className="text-gray-500 font-semibold">Tools & Technologies</p>
            <h3 className="text-4xl font-extrabold text-purple-700 mt-2">14+</h3>
          </div>

        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

          <div className="bg-white p-6 rounded-xl shadow-xl border-l-8 border-yellow-500">
            <h3 className="text-xl font-bold text-gray-800 mb-2">🔥 Most Common Issue Type</h3>
            <p className="text-gray-700">Application Errors & Job Failures</p>
            <p className="text-gray-500 text-sm mt-2">Based on real industry experience</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl border-l-8 border-red-500">
            <h3 className="text-xl font-bold text-gray-800 mb-2">⚡ Ticket Difficulty Levels</h3>

            <ul className="text-gray-700 space-y-1">
              <li>🟢 Beginner – 4 Tickets</li>
              <li>🟡 Intermediate – 5 Tickets</li>
              <li>🔴 Advanced – 3 Tickets</li>
            </ul>

            <p className="text-sm text-gray-500 mt-2">
              Balanced to prepare you for L1 & L2 job roles
            </p>
          </div>

        </div>

        {/* THIRD ROW */}
        <div className="bg-white p-6 rounded-xl shadow-xl border-l-8 border-indigo-600 mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-3">📁 Tools Covered in These Tickets</h3>

          <div className="flex flex-wrap gap-3">
            {[
              "SQL", "PL/SQL", "Linux", "Shell Script", "Autosys",
              "Control-M", "Splunk", "Dynatrace", "API Debugging",
              "Java", "ETL", "AWS", "Grafana", "ITIL"
            ].map((tool) => (
              <span
                key={tool}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold shadow"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY COMPONENT */}
      <Section id="SQL" title="SQL & PL/SQL Tickets">
        <Ticket title="SQL Query Running Slow" tools="🗄 SQL | ⚡ Performance"
          border="border-blue-600"
          symptoms="Report taking 20 minutes instead of 30 seconds."
          log="Full table scan detected."
          rootCause="Missing index on STATUS column."
          resolution="Created index → Query improved dramatically."
        />

        <Ticket title="ORA-00001 Unique Constraint Error" tools="🗄 SQL | ❌ Constraint"
          border="border-red-600"
          symptoms="Batch job failed."
          log="ORA-00001: Unique constraint violated."
          rootCause="Duplicate primary key values."
          resolution="Added validation + fixed sequence mismatch."
        />
      </Section>

      {/* LINUX */}
      <Section id="Linux" title="Linux & Shell Scripting Tickets">
        <Ticket title="File Not Found Issue" tools="🐧 Linux | 📂 File System"
          border="border-yellow-600"
          symptoms="Script failed during execution."
          log="No such file or directory."
          rootCause="Wrong file path in script."
          resolution="Corrected path & added validation."
        />

        <Ticket title="Permission Denied" tools="🐧 Linux | 🔐 Permission"
          border="border-green-600"
          symptoms="Script not executing."
          log="Permission denied."
          rootCause="Missing execute permission."
          resolution="Applied chmod +x script.sh."
        />
      </Section>

      {/* AUTOSYS */}
      <Section id="Autosys" title="Autosys Tickets">
        <Ticket title="Autosys Job Failure (Exit Code 255)" tools="❗ Autosys | 🗄 Database"
          border="border-red-500"
          symptoms="Downstream job not triggered."
          log="ORA-00942 table missing."
          rootCause="Missing table in schema."
          resolution="Created missing table & restarted job."
        />
      </Section>

      {/* CONTROL-M */}
      <Section id="Control-M" title="Control-M Tickets">
        <Ticket title="Control-M Job Hung" tools="📅 Control-M | 🗄 DB"
          border="border-purple-600"
          symptoms="Job running for hours."
          log="Waiting for resource LOCK_DB."
          rootCause="Database lock not released."
          resolution="Force released lock & reran job."
        />
      </Section>

      {/* SPLUNK */}
      <Section id="Splunk" title="Splunk Monitoring Tickets">
        <Ticket title="High Error Count Alert" tools="🔍 Splunk | 📈 Monitoring"
          border="border-orange-500"
          symptoms="Application error spike detected."
          log="NullPointerException at line 120."
          rootCause="Missing JSON field."
          resolution="Fixed code & redeployed."
        />
      </Section>

      {/* Interview Section */}
      <InterviewSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 mt-20">
        <p>© 2025 Odia IT Training Hub. All rights reserved.</p>
      </footer>

    </main>
  );
}

/* ---------------- THINGS BELOW ARE UI COMPONENTS ---------------- */

function Section({ id, title, children }) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-extrabold text-blue-700 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
    </section>
  );
}

function Ticket({ title, tools, border, symptoms, log, rootCause, resolution }) {
  return (
    <div className={`bg-white shadow-xl p-6 rounded-xl border-l-8 ${border} hover:shadow-2xl hover:scale-[1.02] transition-all`}>
      <h4 className="text-2xl font-bold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{tools}</p>

      <details className="mt-3">
        <summary className="cursor-pointer font-semibold text-blue-600">
          View Ticket Details
        </summary>
        <div className="mt-3 text-gray-700 space-y-2">
          <p><strong>Symptoms:</strong> {symptoms}</p>
          <p><strong>Log Snippet:</strong> {log}</p>
          <p><strong>Root Cause:</strong> {rootCause}</p>
          <p><strong>Resolution:</strong> {resolution}</p>
        </div>
      </details>
    </div>
  );
}

function InterviewSection() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-3xl font-bold text-blue-700 mb-6">Interview Preparation</h2>

        <div className="space-y-6">

          {/* Self Introduction */}
          <div className="p-6 bg-white border-l-8 border-blue-500 rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-2">Self Introduction (Perfect Example)</h3>
            <p className="text-gray-700 leading-relaxed">
              “Hi, my name is _______. I have hands-on experience in SQL, Linux, Autosys, ITIL processes,
              and real-time production issues like job failures, application errors, performance troubleshooting,
              and log analysis…”
            </p>
          </div>

          {/* Roles & Responsibilities */}
          <div className="p-6 bg-white border-l-8 border-green-500 rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-2">Roles & Responsibilities (L1/L2)</h3>

            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Monitoring Applications, Jobs & Alerts</li>
              <li>Analyzing logs & troubleshooting failures</li>
              <li>Handling Incidents & Change Requests</li>
              <li>Working with Splunk, Autosys, SQL, Linux</li>
              <li>Communicating updates to stakeholders</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
