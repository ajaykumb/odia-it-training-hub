import { useState } from "react";

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

        <h1 className="text-5xl font-extrabold mb-4">
          Real-Time IT Ticket Simulator
        </h1>

        <p className="text-xl max-w-3xl mx-auto opacity-90 leading-relaxed">
          Practice real production issues handled by L1 & L2 engineers in top
          MNCs. Learn troubleshooting exactly the way real IT teams solve
          incidents.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {[
            "SQL",
            "Linux",
            "Autosys",
            "Control-M",
            "Splunk",
            "Dynatrace",
            "Java",
            "API",
            "ETL",
            "AWS",
            "Shell Script",
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
            <h3 className="text-4xl font-extrabold text-purple-700 mt-2">
              14+
            </h3>
          </div>
        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-xl shadow-xl border-l-8 border-yellow-500">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              🔥 Most Common Issue Type
            </h3>
            <p className="text-gray-700">Application Errors & Job Failures</p>
            <p className="text-gray-500 text-sm mt-2">
              Based on real industry experience
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-xl border-l-8 border-red-500">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              ⚡ Ticket Difficulty Levels
            </h3>

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
          <h3 className="text-xl font-bold text-gray-800 mb-3">
            📁 Tools Covered in These Tickets
          </h3>

          <div className="flex flex-wrap gap-3">
            {[
              "SQL",
              "PL/SQL",
              "Linux",
              "Shell Script",
              "Autosys",
              "Control-M",
              "Splunk",
              "Dynatrace",
              "API Debugging",
              "Java",
              "ETL",
              "AWS",
              "Grafana",
              "ITIL",
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

      {/* ---------------- TICKET SECTIONS ---------------- */}

      <Section id="SQL" title="SQL & PL/SQL Tickets">
        <Ticket
          title="SQL Query Running Slow"
          tools="🗄 SQL | ⚡ Performance"
          border="border-blue-600"
          symptoms="Report taking 20 minutes instead of 30 seconds."
          log="Full table scan detected."
          rootCause="Missing index on STATUS column."
          resolution="Created index → Query improved dramatically."
        />

        <Ticket
          title="ORA-00001 Unique Constraint Error"
          tools="🗄 SQL | ❌ Constraint"
          border="border-red-600"
          symptoms="Batch job failed."
          log="ORA-00001: Unique constraint violated."
          rootCause="Duplicate primary key values."
          resolution="Added validation + fixed sequence mismatch."
        />
      </Section>

      <Section id="Linux" title="Linux & Shell Scripting Tickets">
        <Ticket
          title="File Not Found Issue"
          tools="🐧 Linux | 📂 File System"
          border="border-yellow-600"
          symptoms="Script failed during execution."
          log="No such file or directory."
          rootCause="Wrong file path in script."
          resolution="Corrected path & added validation."
        />

        <Ticket
          title="Permission Denied"
          tools="🐧 Linux | 🔐 Permission"
          border="border-green-600"
          symptoms="Script not executing."
          log="Permission denied."
          rootCause="Missing execute permission."
          resolution="Applied chmod +x script.sh."
        />
      </Section>

      <Section id="Autosys" title="Autosys Tickets">
        <Ticket
          title="Autosys Job Failure (Exit Code 255)"
          tools="❗ Autosys | 🗄 Database"
          border="border-red-500"
          symptoms="Downstream job not triggered."
          log="ORA-00942 table missing."
          rootCause="Missing table in schema."
          resolution="Created missing table & restarted job."
        />
      </Section>

      <Section id="Control-M" title="Control-M Tickets">
        <Ticket
          title="Control-M Job Hung"
          tools="📅 Control-M | 🗄 DB"
          border="border-purple-600"
          symptoms="Job running for hours."
          log="Waiting for resource LOCK_DB."
          rootCause="Database lock not released."
          resolution="Force released lock & reran job."
        />
      </Section>

      <Section id="Splunk" title="Splunk Monitoring Tickets">
        <Ticket
          title="High Error Count Alert"
          tools="🔍 Splunk | 📈 Monitoring"
          border="border-orange-500"
          symptoms="Application error spike detected."
          log="NullPointerException at line 120."
          rootCause="Missing JSON field."
          resolution="Fixed code & redeployed."
        />
      </Section>

      {/* ---------------- SYLLABUS SECTION ---------------- */}
      <SyllabusSection />

      {/* ---------------- INTERVIEW PREP SECTION ---------------- */}
      <InterviewSection />

      {/* ---------------- RESUME BUILDER SECTION ---------------- */}
      <ResumeBuilderSection />

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 mt-20">
        <p>© 2025 Odia IT Training Hub. All rights reserved.</p>
      </footer>
    </main>
  );
}

/* ---------------- GENERIC COMPONENTS ---------------- */

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
    <div
      className={`bg-white shadow-xl p-6 rounded-xl border-l-8 ${border} hover:shadow-2xl hover:scale-[1.02] transition-all`}
    >
      <h4 className="text-2xl font-bold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-500 mt-1">{tools}</p>

      <details className="mt-3">
        <summary className="cursor-pointer font-semibold text-blue-600">
          View Ticket Details
        </summary>
        <div className="mt-3 text-gray-700 space-y-2">
          <p>
            <strong>Symptoms:</strong> {symptoms}
          </p>
          <p>
            <strong>Log Snippet:</strong> {log}
          </p>
          <p>
            <strong>Root Cause:</strong> {rootCause}
          </p>
          <p>
            <strong>Resolution:</strong> {resolution}
          </p>
        </div>
      </details>
    </div>
  );
}

/* ---------------- SYLLABUS SECTION ---------------- */

function SyllabusSection() {
  return (
    <section className="py-20 bg-white mt-10">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-extrabold text-blue-700 mb-10 text-center">
          📘 Complete Syllabus – Job Ready Training
        </h2>

        <div className="space-y-6">
          <Syllabus title="SQL & PL/SQL Syllabus">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Basic to Advanced SQL Queries</li>
              <li>Joins, Subqueries, Analytical Functions</li>
              <li>Indexes, Performance Tuning Concepts</li>
              <li>PL/SQL Functions, Procedures, Packages, Cursors</li>
              <li>Real-time Debugging & RCA</li>
            </ul>
          </Syllabus>

          <Syllabus title="Linux & Shell Scripting Syllabus">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Linux Commands & Permissions</li>
              <li>Shell Script Programming</li>
              <li>Automation Using CRON</li>
              <li>Log Reading & Issue Debugging</li>
            </ul>
          </Syllabus>

          <Syllabus title="Autosys Job Scheduling Syllabus">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Autosys Architecture</li>
              <li>JIL Creation</li>
              <li>Job Monitoring & Troubleshooting</li>
            </ul>
          </Syllabus>

          <Syllabus title="Control-M Scheduling Syllabus">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Job Dependencies</li>
              <li>SLA & Forecasting</li>
              <li>Job Rerun & Failure Fixing</li>
            </ul>
          </Syllabus>

          <Syllabus title="Splunk Monitoring Syllabus">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>SPL Queries</li>
              <li>Dashboards & Alerts</li>
              <li>Log Debugging</li>
            </ul>
          </Syllabus>

          <Syllabus title="Dynatrace Syllabus">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>Performance Monitoring</li>
              <li>API Tracing</li>
              <li>Error & RCA Analysis</li>
            </ul>
          </Syllabus>

          <Syllabus title="API Debugging & JSON Syllabus">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>REST API Basics</li>
              <li>Postman Usage</li>
              <li>500, 400 Error Fixing</li>
            </ul>
          </Syllabus>

          <Syllabus title="ETL (Informatica) Syllabus">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>ETL Mapping</li>
              <li>Workflows & Sessions</li>
              <li>Error Handling</li>
            </ul>
          </Syllabus>

          <Syllabus title="AWS Cloud (Support Level) Syllabus">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>S3, EC2, IAM</li>
              <li>CloudWatch Logs</li>
              <li>Access Issues Troubleshooting</li>
            </ul>
          </Syllabus>

          <Syllabus title="Java (Core) Syllabus">
            <ul className="list-disc ml-6 space-y-2 text-gray-700">
              <li>OOP Basics</li>
              <li>Exception Handling</li>
              <li>Error Debugging (NPE, etc.)</li>
            </ul>
          </Syllabus>
        </div>
      </div>
    </section>
  );
}

function Syllabus({ title, children }) {
  return (
    <details className="bg-white p-6 rounded-xl shadow border-l-8 border-blue-600">
      <summary className="cursor-pointer text-xl font-bold text-blue-700">
        {title}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

/* ---------------- INTERVIEW PREP SECTION ---------------- */

function InterviewSection() {
  return (
    <section className="py-16 bg-blue-50">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">
          Interview Preparation
        </h2>

        <div className="space-y-6">
          {/* Self Introduction */}
          <div className="p-6 bg-white border-l-8 border-blue-500 rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-2">
              Self Introduction (Perfect Example)
            </h3>
            <p className="text-gray-700 leading-relaxed">
              “Hi, my name is _______. I have hands-on experience in SQL, Linux,
              Autosys, ITIL processes, and real-time production issues like job
              failures, application errors, performance troubleshooting, and log
              analysis…”
            </p>
          </div>

          {/* Roles & Responsibilities */}
          <div className="p-6 bg-white border-l-8 border-green-500 rounded-xl shadow">
            <h3 className="text-2xl font-bold mb-2">
              Roles & Responsibilities (L1/L2)
            </h3>

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

/* ---------------- RESUME BUILDER SECTION ---------------- */

function ResumeBuilderSection() {
  const [form, setForm] = useState({
    fullName: "",
    roleTitle: "Application / Production Support Engineer",
    experience: "3.9",
    location: "Bhubaneswar, Odisha",
    phone: "+91-",
    email: "",
    linkedin: "",
    summary:
      "Technical professional with hands-on experience in application and production support (L1/L2), incident analysis, log analysis, job monitoring, and root cause analysis using SQL, Linux, Autosys, Splunk and ITIL processes.",
    skills:
      "SQL, PL/SQL, Linux, Shell Script, Autosys, Control-M, Splunk, Dynatrace, ITIL, Incident Management, RCA, Monitoring, Job Scheduling",
    tools:
      "Oracle, SQL Developer, Linux (RHEL), Autosys, Control-M, Splunk, Dynatrace, Git, ServiceNow / JIRA",
    currentCompany: "TCS (Previous Organization)",
    currentRole: "Application & Production Support Engineer (L1/L2)",
    responsibilities:
      "• Monitoring critical batch jobs, applications and alerts using Autosys, Control-M and Splunk.\n• Analyzing logs, identifying root cause and providing quick resolution for job failures and production incidents.\n• Working with SQL/PLSQL for data validation, debugging queries and performance analysis.\n• Coordinating with L3/Dev teams and stakeholders for incident resolution and status updates.\n• Preparing RCA documents and maintaining knowledge base for recurring issues.",
    education: "B.Tech in Computer Science / IT (Year – College Name)",
    noticePeriod: "Immediate Joiner",
  });

  const [template, setTemplate] = useState("template1");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCopy = () => {
    const text = `
${form.fullName.toUpperCase()}
${form.roleTitle}

Contact: ${form.phone} | ${form.email}
Location: ${form.location}
LinkedIn: ${form.linkedin}

PROFILE SUMMARY
${form.summary}

SKILLS
${form.skills}

TOOLS & TECHNOLOGIES
${form.tools}

EXPERIENCE
${form.currentCompany}
${form.currentRole}
${form.responsibilities}

EDUCATION
${form.education}

OTHER DETAILS
Total Experience: ${form.experience} Years
Notice Period: ${form.noticePeriod}
`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          alert(
            "✅ Resume text copied! You can paste it into Word / Naukri / LinkedIn."
          );
        })
        .catch(() => {
          alert(
            "Copy failed. Please select and copy manually from the preview."
          );
        });
    } else {
      alert(
        "Your browser does not support direct copy. Please copy manually from preview."
      );
    }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-extrabold text-blue-700 mb-4 text-center">
          📝 Automatic Resume Builder – Job Ready Profile
        </h2>

        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-6">
          Fill your details below and get a professional{" "}
          <strong>IT Support / Production Support resume</strong> ready for
          Naukri, LinkedIn, and HR calls. You can copy the text in one click
          and choose between multiple templates.
        </p>

        {/* Template Selector */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setTemplate("template1")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              template === "template1"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Template 1
          </button>

          <button
            onClick={() => setTemplate("template2")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              template === "template2"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Template 2
          </button>

          <button
            onClick={() => setTemplate("template3")}
            className={`px-4 py-2 rounded-lg font-semibold ${
              template === "template3"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            Template 3
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Left: Form */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ✏️ Fill Your Details
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                  placeholder="Tarinee Prasad Chand"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Role Title
                  </label>
                  <input
                    type="text"
                    name="roleTitle"
                    value={form.roleTitle}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Total Experience (Years)
                  </label>
                  <input
                    type="text"
                    name="experience"
                    value={form.experience}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="+91-7894..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Profile Summary
                </label>
                <textarea
                  name="summary"
                  value={form.summary}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Skills (comma separated)
                </label>
                <textarea
                  name="skills"
                  value={form.skills}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Tools & Technologies (comma separated)
                </label>
                <textarea
                  name="tools"
                  value={form.tools}
                  onChange={handleChange}
                  rows={2}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Current / Last Company
                </label>
                <input
                  type="text"
                  name="currentCompany"
                  value={form.currentCompany}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Role & Designation
                </label>
                <input
                  type="text"
                  name="currentRole"
                  value={form.currentRole}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Roles & Responsibilities (each point in new line)
                </label>
                <textarea
                  name="responsibilities"
                  value={form.responsibilities}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Education
                </label>
                <input
                  type="text"
                  name="education"
                  value={form.education}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Notice Period / Availability
                </label>
                <input
                  type="text"
                  name="noticePeriod"
                  value={form.noticePeriod}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <button
                type="button"
                onClick={handleCopy}
                className="w-full mt-4 bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
              >
                📋 Copy Resume Text
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 max-h-[700px] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              👀 Live Resume Preview ({template})
            </h3>

            {template === "template1" && <Template1 form={form} />}
            {template === "template2" && <Template2 form={form} />}
            {template === "template3" && <Template3 form={form} />}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- RESUME TEMPLATES & HELPERS ---------------- */

function Template1({ form }) {
  return (
    <div className="text-gray-900 space-y-4">
      <div className="border-b pb-3">
        <h2 className="text-3xl font-extrabold text-blue-700">
          {form.fullName || "Your Name"}
        </h2>
        <p className="text-lg font-semibold">{form.roleTitle}</p>
        <p className="text-gray-700">
          {form.location} | {form.phone} | {form.email}
        </p>
        {form.linkedin && <p>LinkedIn: {form.linkedin}</p>}
      </div>

      <SectionBlock title="Profile Summary" text={form.summary} />

      <SectionBlock title="Skills" chips={form.skills} />

      <SectionBlock title="Tools & Technologies" chips={form.tools} />

      <ExperienceBlock form={form} />

      <SectionBlock title="Education" text={form.education} />

      <SectionBlock
        title="Other Details"
        text={`Total Experience: ${form.experience} Years\nNotice Period: ${form.noticePeriod}`}
      />
    </div>
  );
}

function Template2({ form }) {
  return (
    <div className="text-gray-800 space-y-4 font-serif">
      <h2 className="text-3xl font-bold">{form.fullName || "Your Name"}</h2>
      <p className="text-lg italic">{form.roleTitle}</p>
      <p>
        {form.phone} | {form.email} | {form.location}
      </p>

      <h3 className="text-xl font-bold mt-4">Summary</h3>
      <p>{form.summary}</p>

      <h3 className="text-xl font-bold mt-4">Skills</h3>
      <p>{form.skills}</p>

      <h3 className="text-xl font-bold mt-4">Tools</h3>
      <p>{form.tools}</p>

      <h3 className="text-xl font-bold mt-4">Experience</h3>
      <p className="font-semibold">{form.currentCompany}</p>
      <p className="italic">{form.currentRole}</p>
      <pre className="whitespace-pre-wrap">{form.responsibilities}</pre>

      <h3 className="text-xl font-bold mt-4">Education</h3>
      <p>{form.education}</p>

      <h3 className="text-xl font-bold mt-4">Other Details</h3>
      <p>Total Experience: {form.experience} Years</p>
      <p>Notice Period: {form.noticePeriod}</p>
    </div>
  );
}

function Template3({ form }) {
  return (
    <div className="text-gray-900 text-sm leading-relaxed space-y-3">
      <p className="text-xl font-bold">{form.fullName || "Your Name"}</p>
      <p>{form.roleTitle}</p>
      <p>
        {form.email} | {form.phone} | {form.location}
      </p>

      <h4 className="font-bold mt-4">PROFILE SUMMARY</h4>
      <p>{form.summary}</p>

      <h4 className="font-bold">SKILLS</h4>
      <p>{form.skills}</p>

      <h4 className="font-bold">TOOLS & TECHNOLOGIES</h4>
      <p>{form.tools}</p>

      <h4 className="font-bold">EXPERIENCE</h4>
      <p>{form.currentCompany}</p>
      <p>{form.currentRole}</p>
      <pre className="whitespace-pre-wrap">{form.responsibilities}</pre>

      <h4 className="font-bold">EDUCATION</h4>
      <p>{form.education}</p>

      <h4 className="font-bold">OTHER DETAILS</h4>
      <p>Total Experience: {form.experience} Years</p>
      <p>Notice Period: {form.noticePeriod}</p>
    </div>
  );
}

function SectionBlock({ title, text, chips }) {
  return (
    <div>
      <h4 className="font-bold text-gray-900 mb-1">{title}</h4>

      {text && <p className="leading-relaxed whitespace-pre-wrap">{text}</p>}

      {chips && (
        <div className="flex flex-wrap">
          {chips.split(",").map((item, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full mr-2 mb-2"
            >
              {item.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function ExperienceBlock({ form }) {
  return (
    <div>
      <h4 className="font-bold text-gray-900 mb-1">Experience</h4>
      <p className="font-semibold">{form.currentCompany}</p>
      <p className="italic text-gray-700 mb-1">{form.currentRole}</p>
      <pre className="whitespace-pre-wrap">{form.responsibilities}</pre>
    </div>
  );
}
