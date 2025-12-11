import { useState, useRef } from "react";

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
      <ResumeIOLayout />

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


/* ---------------- RESUME EDITOR with 10 Templates (ALL FIELDS) + PDF/DOC ---------------- */
function ResumeIOLayout() {
  const [form, setForm] = useState({
    fullName: "",
    roleTitle: "",
    phone: "",
    email: "",
    location: "",
    experience: "",
    summary: "",
    skills: [],
    languages: [],
    workExperience: "",
    education: "",
    projectDesc: "",
    responsibilities: "",
    declaration: "",
  });

  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const previewRef = useRef(null);

  const handleInput = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
  };

  const safeArray = (v) => {
    if (!v) return [];
    if (Array.isArray(v)) return v.filter(Boolean).map((s) => String(s).trim());
    return String(v)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  };

  /* ---------------- PDF Download ---------------- */
  const downloadPDF = async () => {
    if (!previewRef.current) return alert("Preview not ready.");

    try {
      const html2canvasModule = await import("html2canvas");
      const jsPDFModule = await import("jspdf");
      const html2canvas = html2canvasModule.default;
      const { default: jsPDF } = jsPDFModule;

      const element = previewRef.current;

      // temporarily expand width for A4-like capture if needed
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 0;
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);

      let heightLeft = imgHeight - pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `${(form.fullName || "Resume").replace(/\s+/g, "_")}.pdf`;
      pdf.save(filename);
    } catch (err) {
      console.error("PDF error:", err);
      alert("PDF generation failed — check console for details.");
    }
  };

  /* ---------------- DOC Download (.doc via HTML) ---------------- */
  const downloadDOC = () => {
    if (!previewRef.current) return alert("Preview not ready.");

    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office'
            xmlns:w='urn:schemas-microsoft-com:office:word'
            xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset="utf-8"><title>Resume</title></head><body>
    `;

    // Remove any react data attributes to keep Word clean:
    const previewHtml = previewRef.current.outerHTML.replace(/ data-reactroot="?"| data-reactid="[^"]*"/g, "");
    const footer = "</body></html>";
    const html = header + previewHtml + footer;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(form.fullName || "Resume").replace(/\s+/g, "_")}.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /* ---------------- Template renderer (10 templates) ---------------- */
  const TemplateRenderer = ({ which }) => {
    // arrays
    const skills = safeArray(form.skills);
    const languages = safeArray(form.languages);

    // standardized block used by all templates (Standard CV Order)
    const StandardBlocks = () => (
      <>
        {/* Profile Summary */}
        <section className="mt-4">
          <h4 className="font-semibold">Profile Summary</h4>
          <p className="whitespace-pre-line text-sm text-gray-700">{form.summary || "—"}</p>
        </section>

        {/* Skills */}
        <section className="mt-4">
          <h4 className="font-semibold">Skills</h4>
          <p className="text-sm text-gray-700">{skills.length ? skills.join(", ") : "—"}</p>
        </section>

        {/* Languages */}
        <section className="mt-4">
          <h4 className="font-semibold">Languages</h4>
          <p className="text-sm text-gray-700">{languages.length ? languages.join(", ") : "—"}</p>
        </section>

        {/* Work Experience */}
        <section className="mt-4">
          <h4 className="font-semibold">Work Experience</h4>
          <p className="whitespace-pre-line text-sm text-gray-700">{form.workExperience || "—"}</p>
        </section>

        {/* Project Description */}
        <section className="mt-4">
          <h4 className="font-semibold">Project Description</h4>
          <p className="whitespace-pre-line text-sm text-gray-700">{form.projectDesc || "—"}</p>
        </section>

        {/* Roles & Responsibilities */}
        <section className="mt-4">
          <h4 className="font-semibold">Roles & Responsibilities</h4>
          <p className="whitespace-pre-line text-sm text-gray-700">{form.responsibilities || "—"}</p>
        </section>

        {/* Education */}
        <section className="mt-4">
          <h4 className="font-semibold">Education</h4>
          <p className="whitespace-pre-line text-sm text-gray-700">{form.education || "—"}</p>
        </section>

        {/* Declaration */}
        <section className="mt-4">
          <h4 className="font-semibold">Declaration</h4>
          <p className="whitespace-pre-line text-sm text-gray-700">{form.declaration || "—"}</p>
        </section>
      </>
    );

    /* Return per-template layout but include StandardBlocks in each */
    switch (which) {
      /* 1 — Modern Blue (two-column left skills) */
      case "template1":
        return (
          <div className="text-gray-900 bg-white p-8" ref={previewRef}>
            <div className="grid grid-cols-3 gap-6">
              <aside className="col-span-1 pr-4 border-r">
                <h3 className="text-lg font-bold text-blue-700 mb-2">{form.fullName || "YOUR NAME"}</h3>
                <p className="text-sm">{form.roleTitle || "YOUR TITLE"}</p>

                <div className="mt-4 text-sm text-gray-700 space-y-1">
                  <p><strong>Phone:</strong> {form.phone || "—"}</p>
                  <p><strong>Email:</strong> {form.email || "—"}</p>
                  <p><strong>Location:</strong> {form.location || "—"}</p>
                  <p><strong>Experience:</strong> {form.experience || "—"}</p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold">Skills</h4>
                  <ul className="list-disc ml-5 text-sm">
                    {skills.length ? skills.map((s,i) => <li key={i}>{s}</li>) : <li>—</li>}
                  </ul>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold">Languages</h4>
                  <ul className="list-disc ml-5 text-sm">
                    {languages.length ? languages.map((l,i) => <li key={i}>{l}</li>) : <li>—</li>}
                  </ul>
                </div>
              </aside>

              <main className="col-span-2">
                <div>
                  <h1 className="text-2xl font-extrabold text-blue-700">{form.fullName || "YOUR NAME"}</h1>
                  <p className="text-sm font-semibold text-gray-700 mt-1">{form.roleTitle || "YOUR TITLE"}</p>
                  <div className="my-3 border-b-4 w-24 border-blue-600"></div>
                </div>

                <StandardBlocks />
              </main>
            </div>
          </div>
        );

      /* 2 — ATS Minimal (single column) */
      case "template2":
        return (
          <div className="bg-white p-8 text-black" ref={previewRef}>
            <header>
              <h1 className="text-2xl font-bold">{form.fullName || "YOUR NAME"}</h1>
              <p className="text-sm text-gray-700">{form.roleTitle || "YOUR TITLE"}</p>
              <p className="text-xs text-gray-600 mt-1">{form.email || "—"} | {form.phone || "—"} | {form.location || "—"}</p>
            </header>

            <div className="mt-4">
              <StandardBlocks />
            </div>
          </div>
        );

      /* 3 — Executive Dark header */
      case "template3":
        return (
          <div className="bg-white p-8" ref={previewRef}>
            <div className="bg-gray-900 text-white p-4 rounded">
              <h1 className="text-2xl font-bold">{form.fullName || "YOUR NAME"}</h1>
              <p className="text-sm">{form.roleTitle || "YOUR TITLE"}</p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <StandardBlocks />
              </div>

              <aside className="col-span-1 border-l pl-4 text-sm text-gray-700">
                <p><strong>Email:</strong> {form.email || "—"}</p>
                <p><strong>Phone:</strong> {form.phone || "—"}</p>
                <p><strong>Location:</strong> {form.location || "—"}</p>
                <p className="mt-4"><strong>Education:</strong><br/>{form.education || "—"}</p>
              </aside>
            </div>
          </div>
        );

      /* 4 — Two-column MNC */
      case "template4":
        return (
          <div className="bg-white p-8" ref={previewRef}>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h2 className="text-xl font-bold text-blue-700">{form.fullName || "YOUR NAME"}</h2>
                <p className="text-sm">{form.roleTitle || "YOUR TITLE"}</p>

                <div className="mt-4 text-sm text-gray-700 space-y-1">
                  <p><strong>Phone:</strong> {form.phone || "—"}</p>
                  <p><strong>Email:</strong> {form.email || "—"}</p>
                  <p><strong>Location:</strong> {form.location || "—"}</p>
                  <p><strong>Experience:</strong> {form.experience || "—"}</p>
                </div>

                <div className="mt-6">
                  <h4 className="font-semibold">Skills</h4>
                  <p className="text-sm">{skills.join(", ") || "—"}</p>

                  <h4 className="font-semibold mt-4">Languages</h4>
                  <p className="text-sm">{languages.join(", ") || "—"}</p>

                  <h4 className="font-semibold mt-4">Education</h4>
                  <p className="text-sm whitespace-pre-line">{form.education || "—"}</p>
                </div>
              </div>

              <div>
                <StandardBlocks />
              </div>
            </div>
          </div>
        );

      /* 5 — Clean Corporate (single-column center) */
      case "template5":
        return (
          <div className="bg-white p-8 text-center" ref={previewRef}>
            <h1 className="text-2xl font-bold">{form.fullName || "YOUR NAME"}</h1>
            <p className="text-sm text-gray-700">{form.roleTitle || "YOUR TITLE"}</p>
            <p className="text-xs text-gray-600 mt-2">{form.email || "—"} | {form.phone || "—"} | {form.location || "—"}</p>

            <div className="mt-4 text-left">
              <StandardBlocks />
            </div>
          </div>
        );

      /* 6 — Consulting style */
      case "template6":
        return (
          <div className="bg-white p-8" ref={previewRef}>
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-bold">{form.fullName || "YOUR NAME"}</h1>
                <p className="text-sm">{form.roleTitle || "YOUR TITLE"}</p>
              </div>
              <div className="text-sm text-right">
                <p>{form.email || "—"}</p>
                <p>{form.phone || "—"}</p>
                <p>{form.location || "—"}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-6">
              <div className="col-span-2">
                <StandardBlocks />
              </div>
              <aside className="col-span-1 border-l pl-4">
                <h4 className="font-semibold">Skills</h4>
                <p className="text-sm">{skills.join(", ") || "—"}</p>

                <h4 className="font-semibold mt-4">Education</h4>
                <p className="text-sm whitespace-pre-line">{form.education || "—"}</p>
              </aside>
            </div>
          </div>
        );

      /* 7 — Creative */
      case "template7":
        return (
          <div className="bg-white p-8" ref={previewRef}>
            <div className="flex gap-6">
              <aside className="w-1/4 border-r pr-4">
                <h2 className="font-bold">{form.fullName || "YOUR NAME"}</h2>
                <p className="text-sm">{form.roleTitle || "YOUR TITLE"}</p>

                <div className="mt-4 text-sm">
                  <p><strong>Email:</strong> {form.email || "—"}</p>
                  <p><strong>Phone:</strong> {form.phone || "—"}</p>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold">Skills</h4>
                  <ul className="list-disc ml-5 text-sm">{skills.length ? skills.map((s,i)=> <li key={i}>{s}</li>) : <li>—</li>}</ul>
                </div>
              </aside>

              <main className="flex-1 pl-4">
                <StandardBlocks />
              </main>
            </div>
          </div>
        );

      /* 8 — Simple Serif (print-friendly) */
      case "template8":
        return (
          <div className="bg-white p-8 font-serif" ref={previewRef}>
            <h1 className="text-2xl font-bold">{form.fullName || "YOUR NAME"}</h1>
            <p className="text-sm">{form.roleTitle || "YOUR TITLE"}</p>

            <div className="mt-4">
              <StandardBlocks />
            </div>
          </div>
        );

      /* 9 — Technical compact */
      case "template9":
        return (
          <div className="bg-white p-6" ref={previewRef}>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold">{form.fullName || "YOUR NAME"}</h1>
                <p className="text-sm">{form.roleTitle || "YOUR TITLE"}</p>
              </div>
              <div className="text-sm text-right">
                <p>{form.email || "—"}</p>
                <p>{form.phone || "—"}</p>
                <p>{form.location || "—"}</p>
              </div>
            </div>

            <div className="mt-4">
              <StandardBlocks />
            </div>
          </div>
        );

      /* 10 — Premium Resume.io inspired */
      case "template10":
        return (
          <div className="bg-white p-8" ref={previewRef}>
            <div className="flex justify-between">
              <div>
                <h1 className="text-3xl font-extrabold text-blue-700">{form.fullName || "YOUR NAME"}</h1>
                <p className="text-sm font-semibold">{form.roleTitle || "YOUR TITLE"}</p>
              </div>

              <div className="text-sm">
                <p>{form.email || "—"}</p>
                <p>{form.phone || "—"}</p>
                <p>{form.location || "—"}</p>
                <p>{form.experience ? `Experience: ${form.experience}` : "—"}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-6">
              <div>
                <StandardBlocks />
              </div>

              <aside>
                <h4 className="font-semibold">Skills</h4>
                <ul className="list-disc ml-5">{skills.length ? skills.map((s,i)=> <li key={i}>{s}</li>) : <li>—</li>}</ul>

                <h4 className="font-semibold mt-4">Education</h4>
                <p className="text-sm whitespace-pre-line">{form.education || "—"}</p>
              </aside>
            </div>
          </div>
        );

      default:
        return <div ref={previewRef}>Select a template</div>;
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Resume Editor</h2>
            <p className="text-sm text-gray-600">
              Fill details below — select a template → download.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Template</label>
            <select
              className="border rounded px-3 py-2"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="template1">Modern Blue (Two-column)</option>
              <option value="template2">ATS Minimal</option>
              <option value="template3">Executive Dark</option>
              <option value="template4">Two-column MNC</option>
              <option value="template5">Clean Corporate</option>
              <option value="template6">Consulting</option>
              <option value="template7">Creative</option>
              <option value="template8">Simple Serif</option>
              <option value="template9">Technical Compact</option>
              <option value="template10">Premium Resume.io</option>
            </select>

            <button
              onClick={downloadPDF}
              className="bg-green-600 text-white rounded px-3 py-2 text-sm hover:bg-green-700"
            >
              📄 Download PDF
            </button>

            <button
              onClick={downloadDOC}
              className="bg-indigo-600 text-white rounded px-3 py-2 text-sm hover:bg-indigo-700"
            >
              📁 Download DOC
            </button>
          </div>
        </div>

        {/* Main layout: left editor + right preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT: Editor */}
          <div className="bg-white rounded-2xl shadow p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold">Full Name</label>
              <input className="inputbox mt-1" onChange={(e)=>handleInput("fullName", e.target.value)} value={form.fullName}/>
            </div>

            <div>
              <label className="block text-sm font-semibold">Job Title</label>
              <input className="inputbox mt-1" onChange={(e)=>handleInput("roleTitle", e.target.value)} value={form.roleTitle}/>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold">Phone</label>
                <input className="inputbox mt-1" onChange={(e)=>handleInput("phone", e.target.value)} value={form.phone}/>
              </div>
              <div>
                <label className="block text-sm font-semibold">Email</label>
                <input className="inputbox mt-1" onChange={(e)=>handleInput("email", e.target.value)} value={form.email}/>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold">Location</label>
                <input className="inputbox mt-1" onChange={(e)=>handleInput("location", e.target.value)} value={form.location}/>
              </div>
              <div>
                <label className="block text-sm font-semibold">Experience</label>
                <input className="inputbox mt-1" onChange={(e)=>handleInput("experience", e.target.value)} value={form.experience}/>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold">Profile Summary</label>
              <textarea className="inputbox mt-1" rows={3} onChange={(e)=>handleInput("summary", e.target.value)} value={form.summary}/>
            </div>

            <div>
              <label className="block text-sm font-semibold">Skills (comma separated)</label>
              <textarea className="inputbox mt-1" rows={2} onChange={(e)=>handleInput("skills", e.target.value.split(","))} value={Array.isArray(form.skills)?form.skills.join(", "):form.skills}/>
            </div>

            <div>
              <label className="block text-sm font-semibold">Languages (comma separated)</label>
              <textarea className="inputbox mt-1" rows={2} onChange={(e)=>handleInput("languages", e.target.value.split(","))} value={Array.isArray(form.languages)?form.languages.join(", "):form.languages}/>
            </div>

            <div>
              <label className="block text-sm font-semibold">Work Experience</label>
              <textarea className="inputbox mt-1" rows={3} onChange={(e)=>handleInput("workExperience", e.target.value)} value={form.workExperience}/>
            </div>

            <div>
              <label className="block text-sm font-semibold">Education</label>
              <input className="inputbox mt-1" onChange={(e)=>handleInput("education", e.target.value)} value={form.education}/>
            </div>

            <div>
              <label className="block text-sm font-semibold">Project Description</label>
              <textarea className="inputbox mt-1" rows={3} onChange={(e)=>handleInput("projectDesc", e.target.value)} value={form.projectDesc}/>
            </div>

            <div>
              <label className="block text-sm font-semibold">Roles & Responsibilities</label>
              <textarea className="inputbox mt-1" rows={3} onChange={(e)=>handleInput("responsibilities", e.target.value)} value={form.responsibilities}/>
            </div>

            <div>
              <label className="block text-sm font-semibold">Declaration</label>
              <textarea className="inputbox mt-1" rows={2} onChange={(e)=>handleInput("declaration", e.target.value)} value={form.declaration}/>
            </div>
          </div>

          {/* RIGHT: Preview (renders selected template) */}
          <div className="bg-white rounded-2xl shadow p-4 overflow-hidden">
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <TemplateRenderer which={selectedTemplate} />
            </div>
          </div>
        </div>
      </div>

      <style>{`
  .inputbox { 
    width: 100%; 
    padding: 10px; 
    border: 1px solid #ddd; 
    border-radius: 8px; 
  }

  .heading {
    font-size: 18px;
    font-weight: bold;
    margin-top: 20px;
  }

  /* PDF FIXES */
  .preview-page {
    width: 794px;        /* Exact A4 width in px for html2canvas */
    margin: 0 auto;      /* Center page */
    background: white;
    padding: 20px;
  }

  .resume-section {
    page-break-inside: avoid;   /* Avoid content cutting */
    margin-bottom: 20px;        /* Add spacing for clean breaks */
  }
`}</style>
    </section>
  );
}
