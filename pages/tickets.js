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
            Explore real production issues handled by L1 & L2 engineers in top IT companies.
          </p>
        </div>
      </section>

      {/* CATEGORY: SQL & PL/SQL */}
      <Section title="SQL & PL/SQL Tickets">
        <Ticket 
          title="SQL Query Running Slow"
          border="border-blue-600"
          symptoms="Report taking 20 minutes instead of 30 seconds."
          log="Full table scan detected."
          rootCause="Missing index on STATUS column."
          resolution="Created index → Query improved dramatically."
        />

        <Ticket 
          title="ORA-00001 Unique Constraint Error"
          border="border-red-600"
          symptoms="Batch job failed."
          log="ORA-00001: Unique constraint violated."
          rootCause="Duplicate primary key values."
          resolution="Added validation + fixed sequence mismatch."
        />
      </Section>

      {/* CATEGORY: Linux & Shell Scripting */}
      <Section title="Linux & Shell Scripting Tickets">
        <Ticket 
          title="File Not Found Error"
          border="border-yellow-600"
          symptoms="Shell script failed during execution."
          log="No such file or directory."
          rootCause="Wrong file path passed to script."
          resolution="Corrected path & added path validation."
        />

        <Ticket 
          title="Permission Denied"
          border="border-green-600"
          symptoms="Script not executing."
          log="Permission denied."
          rootCause="Missing execute permission."
          resolution="Added chmod +x script.sh."
        />
      </Section>

      {/* CATEGORY: Autosys */}
      <Section title="Autosys Tickets">
        <Ticket 
          title="Autosys Job Failed - Exit Code 255"
          border="border-red-500"
          symptoms="Downstream job not triggered."
          log="ORA-00942 table missing."
          rootCause="Missing table in production schema."
          resolution="Created table + restarted job."
        />
      </Section>

      {/* CATEGORY: Control-M */}
      <Section title="Control-M Tickets">
        <Ticket 
          title="Control-M Job Hung"
          border="border-purple-600"
          symptoms="Job running for hours."
          log="Waiting for resource LOCK_DB."
          rootCause="Database resource not released."
          resolution="Force released lock & reran job."
        />
      </Section>

      {/* CATEGORY: Splunk */}
      <Section title="Splunk Monitoring Tickets">
        <Ticket 
          title="High Error Count Alert"
          border="border-orange-500"
          symptoms="Application error spike."
          log="NullPointerException at line 120."
          rootCause="Missing JSON field."
          resolution="Fixed code & redeployed."
        />
      </Section>

      {/* CATEGORY: Dynatrace */}
      <Section title="Dynatrace Performance Tickets">
        <Ticket 
          title="Slow API Response"
          border="border-indigo-600"
          symptoms="API taking 6 seconds instead of 200ms."
          log="Database query bottleneck."
          rootCause="Inefficient join in SQL."
          resolution="Optimized query + added index."
        />
      </Section>

      {/* CATEGORY: API Issues */}
      <Section title="API Tickets">
        <Ticket 
          title="API Returning 500 Error"
          border="border-red-700"
          symptoms="Users unable to submit forms."
          log="Internal Server Error."
          rootCause="Null object in request payload."
          resolution="Backend validation patch deployed."
        />
      </Section>

      {/* CATEGORY: ETL Informatica */}
      <Section title="ETL (Informatica) Tickets">
        <Ticket 
          title="ETL Load Failure"
          border="border-lime-600"
          symptoms="Mapping aborted unexpectedly."
          log="Source qualifier transformation error."
          rootCause="Unexpected NULL value."
          resolution="Added NULL handling logic."
        />
      </Section>

      {/* CATEGORY: AWS */}
      <Section title="AWS Cloud Tickets">
        <Ticket 
          title="S3 Access Denied"
          border="border-yellow-500"
          symptoms="ETL job unable to read S3 bucket."
          log="403 Access Denied."
          rootCause="IAM role missing S3:GetObject."
          resolution="Added correct IAM policy."
        />
      </Section>

      {/* CATEGORY: Jenkins */}
      <Section title="Jenkins CI/CD Tickets">
        <Ticket 
          title="Build Failed"
          border="border-blue-800"
          symptoms="Pipeline aborted."
          log="Maven dependency not found."
          rootCause="Incorrect repository URL."
          resolution="Fixed Maven repo configuration."
        />
      </Section>

      {/* CATEGORY: Java Application Tickets */}
      <Section title="Java Application Tickets">
        <Ticket 
          title="NullPointerException"
          border="border-red-700"
          symptoms="Application crash."
          log="NullPointerException at ServiceImpl."
          rootCause="Missing data validation."
          resolution="Added null checks + redeployed."
        />
      </Section>

      {/* INTERVIEW PREPARATION SECTION */}
      <InterviewSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8">
        <div className="max-w-6xl mx-auto px-6">
          <p>© 2022 Odia IT Training Hub. All rights reserved.</p>
        </div>
      </footer>

    </main>
  );
}

/* COMPONENTS */

function Section({ title, children }) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">{children}</div>
    </section>
  );
}

function Ticket({ title, border, symptoms, log, rootCause, resolution }) {
  return (
    <div className={`bg-white shadow-xl p-6 rounded-xl border-l-8 ${border}`}>
      <h4 className="text-2xl font-bold mb-2">{title}</h4>
      <details className="mt-2">
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

          <div className="p-6 bg-white border-l-8 border-blue-500 rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-2">Self Introduction (Perfect Format)</h3>
            <p className="text-gray-700">
              “Hi, my name is _______. I have hands-on experience in SQL, Linux, ITIL processes, 
              real-time ticket handling, and production support issues like job failures,
              application errors, performance troubleshooting, and log analysis…”
            </p>
          </div>

          <div className="p-6 bg-white border-l-8 border-green-500 rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-2">Roles & Responsibilities (L1/L2)</h3>
            <ul className="list-disc ml-6 text-gray-700 space-y-1">
              <li>Monitoring Applications, Jobs & Alerts</li>
              <li>Analyzing logs and identifying failures</li>
              <li>Raising and resolving incidents on time</li>
              <li>Following ITIL standards (Incident, Problem, Change)</li>
              <li>Communicating updates with stakeholders</li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
