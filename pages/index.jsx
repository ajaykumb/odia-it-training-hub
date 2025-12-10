import { BoltIcon, AcademicCapIcon, MapPinIcon, GlobeAltIcon, UsersIcon, CheckCircleIcon, ArrowRightIcon, StarIcon, LightBulbIcon, PhoneIcon } from '@heroicons/react/24/solid'; // Added StarIcon, LightBulbIcon, PhoneIcon for flashier design

export default function Home() {
  // Use icons for courses to make them more visually appealing
  const courses = [
    { title: "Oracle SQL & PL/SQL", icon: <BoltIcon className="w-6 h-6 text-yellow-500" /> },
    { title: "Unix/Linux & Shell Scripting", icon: <AcademicCapIcon className="w-6 h-6 text-green-500" /> },
    { title: "ITIL & Batch Tools (Autosys, Control-M)", icon: <UsersIcon className="w-6 h-6 text-red-500" /> },
    { title: "ETL Processes & DevOps Tools", icon: <GlobeAltIcon className="w-6 h-6 text-purple-500" /> },
    { title: "Real-Time Projects & Resume Prep", icon: <CheckCircleIcon className="w-6 h-6 text-cyan-500" /> },
    { title: "Interview Q&A & Doubt-Clearing", icon: <BoltIcon className="w-6 h-6 text-orange-500" /> },
    { title: "Splunk, Dynatrace, ServiceNow", icon: <MapPinIcon className="w-6 h-6 text-blue-500" /> },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      name: e.target.name.value,
      email: e.target.email.value,
      phone: e.target.phone.value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        console.log("Success! Your details have been submitted. We'll be in touch soon.");
        e.target.reset();
      } else {
        console.error("Failed to send. Please ensure all fields are correct and try again.");
      }
    } catch (error) {
      console.error("An error occurred. Please check your network connection.");
    }
  };


  return (
    
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800 tracking-tight overflow-x-hidden">

      
      {/* 🚀 Header - Sticky and Blurry */}
      <header className="sticky top-0 z-50 bg-blue-700/95 backdrop-blur-sm text-white py-4 shadow-xl">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 overflow-x-hidden">
          
<a href="#" className="flex items-center space-x-4 group">
  <img 
    src="/images/logo.png"   // your actual filename
    alt="Odia IT Training Hub Logo"
    className="w-12 h-12 md:w-13 md:h-13"
  />
  <span className="text-xl md:text-2xl font-extrabold text-yellow-300 group-hover:text-yellow-400 transition">
    Odia IT Training Hub
  </span>
</a>
          <nav className="space-x-8 text-lg font-medium hidden md:flex items-center">
  <a href="#about" className="hover:text-yellow-300 transition">About</a>
  <a href="#courses" className="hover:text-yellow-300 transition">Courses</a>
  <a href="#developer-focus" className="hover:text-red-300 transition">New Batch</a>
  <a href="#placement" className="hover:text-yellow-300 transition">Success</a>
  <a href="#contact" className="hover:text-yellow-300 transition">Contact</a>

  {/* ⭐ Login Button */}
  <a
    href="/login"
    className="ml-6 bg-white text-blue-700 px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition-all shadow-md"
  >
    Login
  </a>
</nav>

    {/* Mobile Login Button */}
    <a
      href="/login"
      className="md:hidden bg-white text-blue-700 px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-gray-200 transition"
    >
      Login
    </a>
        </div>
      </header>

      {/* 🌟 Hero Section - High Impact with Image Placeholder */}
      <section className="bg-blue-800 text-white relative overflow-hidden py-32 md:py-40">
        <div className="absolute inset-0 opacity-10">
          {/* Add a subtle background pattern or a relevant image */}
          
        </div>
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <p className="text-xl font-medium text-yellow-400 mb-2">Your Career Starts Here</p>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Learn IT in <span className="text-yellow-300">Odia</span> — <br className='hidden md:block' /> Real-Time, Hands-On Training
          </h2>
          <p className="text-2xl mb-10 max-w-3xl mx-auto">
            Upskill with practical training designed for freshers & working professionals, delivered in Odia,English & Hindi.
          </p>
          <a
            href="#contact"
            className="bg-yellow-400 text-blue-800 px-10 py-4 rounded-full font-bold text-xl shadow-2xl hover:bg-yellow-300 transition-all transform hover:scale-105 animate-pulse"
          >
            Get Started Now <ArrowRightIcon className="w-5 h-5 inline ml-2" />
          </a>
        </div>
      </section>

      {/* --- */}

      {/* ℹ️ About Section - Clean and Direct */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">Our Commitment</h3>
          <p className="text-xl text-gray-600 mb-10 text-center max-w-4xl mx-auto">
            We provide practical and customizable IT training sessions, focusing on **job-readiness** with real-time project exposure.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border-b-4 border-blue-500 rounded-lg shadow-md hover:shadow-xl transition">
              <p className="text-5xl text-blue-500 mb-3">🗣️</p>
              <h4 className="text-xl font-bold mb-2">Local Language Support</h4>
              <p className="text-gray-600">Training available in both Odia and English for complete conceptual clarity.</p>
            </div>
            <div className="p-6 border-b-4 border-yellow-500 rounded-lg shadow-md hover:shadow-xl transition">
              <p className="text-5xl text-yellow-500 mb-3">🛠️</p>
              <h4 className="text-xl font-bold mb-2">100% Practical Training</h4>
              <p className="text-gray-600">Focus on real-time projects and industry-standard tools for immediate application.</p>
            </div>
            <div className="p-6 border-b-4 border-green-500 rounded-lg shadow-md hover:shadow-xl transition">
              <p className="text-5xl text-green-500 mb-3">🤝</p>
              <h4 className="text-xl font-bold mb-2">Lifetime Support</h4>
              <p className="text-gray-600">Dedicated career and placement support even after course completion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* 📚 Courses Section - Structured with Icons and Hover Effects */}
      <section id="courses" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-blue-700 mb-14 text-center">Master These In-Demand Technologies</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white p-6 shadow-xl rounded-xl border-t-8 border-blue-600 hover:shadow-2xl transition-all transform hover:scale-[1.02] cursor-pointer"
              >
                <div className="flex items-center space-x-4">
                  {course.icon}
                  <p className="text-xl font-bold text-gray-900">{course.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 👉 REAL-TIME TICKET SIMULATOR SECTION */}
      <section id="ticket-simulator" className="py-20 bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="max-w-6xl mx-auto px-6">

          <h3 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">
            Real-Time IT Ticket Simulator
          </h3>

          <p className="text-xl text-gray-700 text-center mb-12 max-w-3xl mx-auto">
            Practice real production issues exactly like in IT companies. 
            Learn how L1 & L2 engineers analyze, troubleshoot, and resolve critical incidents.
          </p>

          {/* Grid of Tickets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Ticket 1 - Autosys Job Failure */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-red-500 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-red-600">⚠️ Autosys Job Failure</h4>
              <p className="text-gray-600 mt-2">Job <strong>ABC_DAILY_LOAD</strong> failed with Exit Code 255.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Symptoms:</strong> Downstream jobs not triggered, SLA breach risk.</p>
                  <p><strong>Log Snippet:</strong> ORA-00942: Table or view does not exist.</p>
                  <p><strong>Root Cause:</strong> Missing table in production schema after deployment.</p>
                  <p><strong>Resolution:</strong> Synced missing table from UAT, re-granted privileges & re-ran job successfully.</p>
                </div>
              </details>
            </div>

            {/* Ticket 2 - SQL Performance Issue */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-blue-500 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-blue-600">🐢 SQL Performance Issue</h4>
              <p className="text-gray-600 mt-2">Report generation taking <strong>24 minutes</strong> instead of <strong>2 minutes</strong>.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Symptoms:</strong> Application timeout, users complaining of slowness.</p>
                  <p><strong>Log Snippet:</strong> Full table scan on 5M row transaction table.</p>
                  <p><strong>Root Cause:</strong> Missing index + inefficient WHERE clause with functions.</p>
                  <p><strong>Resolution:</strong> Added composite index, rewrote query using proper predicates, performance improved to 3 seconds.</p>
                </div>
              </details>
            </div>

            {/* Ticket 3 - Application Log Errors */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-yellow-500 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-yellow-600">📄 Application Log Errors</h4>
              <p className="text-gray-600 mt-2">Users unable to submit forms on production.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Symptoms:</strong> HTTP 500 error after clicking Submit.</p>
                  <p><strong>Log Snippet:</strong> <code>NullPointerException at ServiceImpl.java:88</code></p>
                  <p><strong>Root Cause:</strong> Missing mandatory JSON field from frontend in specific scenario.</p>
                  <p><strong>Resolution:</strong> Added backend null checks, updated frontend payload, redeployed fixed build.</p>
                </div>
              </details>
            </div>

            {/* Ticket 4 - ITIL Incident Handling */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-green-600 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-green-600">📝 ITIL Incident Handling</h4>
              <p className="text-gray-600 mt-2">P1 Incident – Entire application is down during business hours.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Symptoms:</strong> All users unable to login, monitoring alerts fired.</p>
                  <p><strong>Log Snippet:</strong> Database connection timeout, "could not connect to listener".</p>
                  <p><strong>Root Cause:</strong> Database listener service crashed due to OS patching.</p>
                  <p><strong>Resolution:</strong> Engaged DB team, restarted listener, validated services, updated incident timeline & RCA in ITIL tool.</p>
                </div>
              </details>
            </div>

            {/* Ticket 5 - Control-M Job Failure */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-indigo-600 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-indigo-600">📆 Control-M Job Failure</h4>
              <p className="text-gray-600 mt-2">Control-M job missed SLA and is stuck in "Executing" state.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Symptoms:</strong> Job not completing, downstream jobs waiting.</p>
                  <p><strong>Log Snippet:</strong> "Agent communication error".</p>
                  <p><strong>Root Cause:</strong> Control-M agent service stopped on target server.</p>
                  <p><strong>Resolution:</strong> Restarted agent, performed test job, forced complete or reran job as per SOP.</p>
                </div>
              </details>
            </div>

            {/* Ticket 6 - Shell Script Debugging */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-orange-500 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-orange-500">💻 Shell Script Error Debugging</h4>
              <p className="text-gray-600 mt-2">Shell script exiting with code 1 during file processing.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Symptoms:</strong> Batch load not completed, partial data in target table.</p>
                  <p><strong>Log Snippet:</strong> <code>syntax error near unexpected token `done'</code></p>
                  <p><strong>Root Cause:</strong> Missing <code>do</code> keyword in <code>for</code> loop, wrong file path variable.</p>
                  <p><strong>Resolution:</strong> Fixed script syntax, added error handling & logging, validated on lower environment.</p>
                </div>
              </details>
            </div>

            {/* Ticket 7 - File Not Found / Permission Denied */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-pink-500 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-pink-500">📂 File Not Found / Permission Denied</h4>
              <p className="text-gray-600 mt-2">Batch job failing while reading input file from Unix directory.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Symptoms:</strong> <code>No such file or directory</code> or <code>Permission denied</code> errors.</p>
                  <p><strong>Root Cause:</strong> Wrong directory path OR missing read permission for batch user.</p>
                  <p><strong>Resolution:</strong> Corrected file path, applied proper Unix permissions (<code>chown</code>, <code>chmod</code>), revalidated job.</p>
                </div>
              </details>
            </div>

            {/* Ticket 8 - API Failure Issue */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-cyan-500 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-cyan-500">🌐 API Failure Issue</h4>
              <p className="text-gray-600 mt-2">Third-party API returning intermittent 502 / 504 errors.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Symptoms:</strong> Payment/status update not reflecting for some users.</p>
                  <p><strong>Log Snippet:</strong> <code>HTTP 504 Gateway Timeout</code> from external API.</p>
                  <p><strong>Root Cause:</strong> Network latency & lack of retry mechanism in code.</p>
                  <p><strong>Resolution:</strong> Implemented retry logic, added circuit breaker config, coordinated with vendor team.</p>
                </div>
              </details>
            </div>

            {/* Ticket 9 - Splunk Alert Investigation */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-lime-500 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-lime-600">📊 Splunk Alert Investigation</h4>
              <p className="text-gray-600 mt-2">Automated alert triggered due to error spike in logs.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Symptoms:</strong> Splunk dashboard shows sudden increase in <code>ERROR</code> entries.</p>
                  <p><strong>Root Cause:</strong> New release introduced extra logging for non-critical validation failures.</p>
                  <p><strong>Resolution:</strong> Tuned Splunk query to exclude known benign errors, raised change request to downgrade log level.</p>
                </div>
              </details>
            </div>

            {/* Ticket 10 - Dynatrace Monitoring Issue */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-teal-500 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-teal-600">📈 Dynatrace Performance Alert</h4>
              <p className="text-gray-600 mt-2">Dynatrace flagged high response time for login API.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Symptoms:</strong> Response time above threshold, user login feels slow.</p>
                  <p><strong>Root Cause:</strong> Slow downstream DB call + thread contention in app server.</p>
                  <p><strong>Resolution:</strong> Analyzed hotspots in Dynatrace, optimized DB query, increased app server thread pool as per capacity plan.</p>
                </div>
              </details>
            </div>

            {/* Ticket 11 - ServiceNow Change Request */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-sky-500 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-sky-600">🛠️ ServiceNow Change Request</h4>
              <p className="text-gray-600 mt-2">Planned change to update batch job schedule across environments.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Activities:</strong> Raised CR, added impact analysis, rollback plan, and testing steps.</p>
                  <p><strong>Risk:</strong> Wrong schedule could break daily data load.</p>
                  <p><strong>Resolution:</strong> Performed lower env testing, implemented change in production during window, updated ServiceNow with results.</p>
                </div>
              </details>
            </div>

            {/* Ticket 12 - Batch Failure + Rollback */}
            <div className="bg-white shadow-xl p-6 rounded-xl border-l-8 border-gray-700 hover:scale-[1.02] transition cursor-pointer">
              <h4 className="text-2xl font-bold text-gray-800">🔄 Batch Failure & Rollback</h4>
              <p className="text-gray-600 mt-2">Nightly batch corrupted partial data due to mid-run failure.</p>

              <details className="mt-4">
                <summary className="cursor-pointer font-semibold text-blue-600">View Issue Details</summary>
                <div className="mt-3 text-gray-700 space-y-2">
                  <p><strong>Symptoms:</strong> Mismatched totals & duplicate records in reporting tables.</p>
                  <p><strong>Root Cause:</strong> No proper transaction handling & checkpoints in batch framework.</p>
                  <p><strong>Resolution:</strong> Rolled back using backup table, re-ran batch with enhanced commit/rollback logic, added validation script.</p>
                </div>
              </details>
            </div>

          </div>

          <p className="mt-10 text-center text-lg text-gray-700 font-semibold">
            💼 These are the kind of real tickets you’ll practice in our training – 
            so you can speak confidently in interviews and perform from Day 1 on the job.
          </p>

        </div>
      </section>

      {/* --- */}

      {/* 🚀 New Batch Callout - Software Developer Focus (Flashier Version!) */}
      <section id="developer-focus" className="py-20 bg-gradient-to-br from-purple-800 to-indigo-900 text-white shadow-2xl relative overflow-hidden">
        {/* Decorative background elements for flashiness */}
        <div className="absolute inset-0 z-0 opacity-10 flex items-center justify-center pointer-events-none">
            <StarIcon className="w-72 h-72 text-yellow-300 animate-pulse-slow" style={{ animationDelay: '0s' }} />
            <StarIcon className="w-52 h-52 text-blue-300 animate-pulse-slow ml-20" style={{ animationDelay: '1.5s' }} />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-yellow-300 animate-fade-in-up">
            <LightBulbIcon className="w-10 h-10 inline-block mr-3 text-red-400 animate-bounce-slow" />
            Software Developers: New Batch Launching Soon!
          </h3>
          <p className="text-xl md:text-2xl font-semibold text-pink-200 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            📢 Don't miss out! Spread the word in your network!
          </p>

          <div className="bg-gradient-to-br from-indigo-700 to-purple-700 p-8 md:p-10 rounded-3xl shadow-glow border-b-8 border-red-500 transform hover:scale-[1.01] transition-all duration-300">
            <h4 className="text-2xl md:text-3xl font-extrabold mb-6 text-yellow-400 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              ✨ Essential Skills for Next-Gen Software Developers ✨
            </h4>
            <p className="text-lg md:text-xl mb-8 italic text-purple-200 animate-fade-in-up" style={{ animationDelay: '0.6s'}}>
              Master these core technologies to build, deploy, and excel in real-world IT projects.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-left mb-10">
              <div className="flex items-start space-x-3 text-lg md:text-xl text-white animate-fade-in-left" style={{ animationDelay: '0.8s' }}>
                <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <p><strong>Python (Core Concepts)</strong> — foundation for automation, data, and backend.</p>
              </div>
              <div className="flex items-start space-x-3 text-lg md:text-xl text-white animate-fade-in-right" style={{ animationDelay: '1s' }}>
                <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <p><strong>Git & GitHub</strong> — version control and collaboration essentials.</p>
              </div>
              <div className="flex items-start space-x-3 text-lg md:text-xl text-white animate-fade-in-left" style={{ animationDelay: '1.2s' }}>
                <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <p><strong>Docker</strong> — containerization for real-time deployment and DevOps.</p>
              </div>
              <div className="flex items-start space-x-3 text-lg md:text-xl text-white animate-fade-in-right" style={{ animationDelay: '1.4s' }}>
                <CheckCircleIcon className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                <p><strong>Java (Core & OOP)</strong> — enterprise application development stronghold.</p>
              </div>
            </div>

            <p className="text-2xl md:text-3xl font-extrabold text-red-400 mb-6 animate-fade-in-up" style={{ animationDelay: '1.6s' }}>
              🚀 Learn. Build. Deploy. Grow your career with the right skills.
            </p>
            <a
              href="tel:9437401378"
              className="inline-flex items-center bg-red-500 text-white px-8 py-4 rounded-full font-black text-xl md:text-2xl shadow-neon hover:bg-red-600 transition-all transform hover:scale-105 animate-pulse-fast"
            >
              <PhoneIcon className="w-7 h-7 mr-3 animate-wiggle" />
              Call to Enroll: 9437401378
            </a>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* 🎓 Student Portal Preview Section (Add-on Feature Only) */}
<section id="portal-preview" className="py-20 bg-white">
  <div className="max-w-7xl mx-auto px-6">

    {/* Title */}
    <h3 className="text-4xl font-extrabold text-blue-700 text-center mb-6">
      Student Portal Preview
    </h3>
    <p className="text-xl text-gray-600 text-center mb-14 max-w-3xl mx-auto">
      A quick look at the real-time dashboard our students use every day for classes, materials, and assignments.
    </p>

    {/* Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

      {/* Dashboard Card */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-8 border-blue-600 hover:shadow-2xl hover:scale-[1.02] transition-all">
        <img
          src="/images/portal-dashboard.png"
          alt="Dashboard Preview"
          className="rounded-lg shadow-md mb-5"
          onError={(e) => (e.target.src = 'https://placehold.co/600x350/1e40af/ffffff?text=Dashboard')}
        />
        <h4 className="text-xl font-bold text-blue-800 mb-2">Dashboard Overview</h4>
        <p className="text-gray-600">
          Clean, simple, and organized — track your classes, progress, and notifications instantly.
        </p>
      </div>

      {/* Notes & Materials */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-8 border-yellow-500 hover:shadow-2xl hover:scale-[1.02] transition-all">
        <img
          src="/images/portal-materials.png"
          alt="Study Materials Preview"
          className="rounded-lg shadow-md mb-5"
          onError={(e) => (e.target.src = 'https://placehold.co/600x350/facc15/000000?text=Materials')}
        />
        <h4 className="text-xl font-bold text-yellow-600 mb-2">Study Materials</h4>
        <p className="text-gray-600">
          Access structured notes, PDFs, assignments, and project files all in one place.
        </p>
      </div>

      {/* Assignments */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-8 border-purple-600 hover:shadow-2xl hover:scale-[1.02] transition-all">
        <img
          src="/images/portal-assignments.png"
          alt="Assignments Preview"
          className="rounded-lg shadow-md mb-5"
          onError={(e) => (e.target.src = 'https://placehold.co/600x350/7c3aed/ffffff?text=Assignments')}
        />
        <h4 className="text-xl font-bold text-purple-700 mb-2">Assignments & Tests</h4>
        <p className="text-gray-600">
          Submit tasks, take quizzes, and receive instructor feedback directly in your portal.
        </p>
      </div>

      {/* Support Ticket */}
      <div className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-8 border-red-600 hover:shadow-2xl hover:scale-[1.02] transition-all">
        <img
          src="/images/portal-support.png"
          alt="Support Preview"
          className="rounded-lg shadow-md mb-5"
          onError={(e) => (e.target.src = 'https://placehold.co/600x350/d97706/ffffff?text=Support')}
        />
        <h4 className="text-xl font-bold text-red-700 mb-2">Support Ticket System</h4>
        <p className="text-gray-600">
          Raise any issue and get real-time help from mentors with dedicated support.
        </p>
      </div>

    </div>
  </div>
</section>

{/* --- */}

      {/* ✅ Placement Section - Trust Building with Numbers and Success Color */}
      <section id="placement" className="py-20 bg-green-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold mb-4">Your Success is Our Mission</h3>
          <p className="text-xl leading-relaxed mb-10">
            We're not just training, we're building careers. Our rigorous process includes real-time projects, focused interview preparation, and resume building.
          </p>

          <div className='mb-12'>
            <p className="text-6xl font-extrabold text-yellow-300">95%+</p>
            <p className="text-xl font-medium mt-2">Placement Success Rate in the Last 3 Years</p>
          </div>

          <a
            href="/success"
            className="bg-yellow-400 text-green-800 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition shadow-lg flex items-center justify-center max-w-sm mx-auto"
          >
            View Successful Candidates Stories
          </a>
        </div>
      </section>
      
      {/* --- */}

     {/* 🎥 Intro Video Section */}
<section 
  id="intro-video" 
  className="py-16 md:py-20 bg-gradient-to-b from-white via-gray-100 to-white relative"
>

  {/* Soft background circle effect */}
  <div className="absolute inset-0 flex justify-center opacity-20 pointer-events-none">
    <div className="w-[600px] h-[600px] bg-blue-100 rounded-full blur-3xl"></div>
  </div>

  <div className="relative max-w-4xl mx-auto px-6 text-center">

    <h3 className="text-4xl font-extrabold text-blue-700 mb-4">
      Why Join Odia IT Training Hub?
    </h3>

    <p className="text-lg text-gray-600 mb-10">
      Watch this short 53-second video to see how we help you launch your IT career.
    </p>

    {/* Video wrapper */}
    <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-4 md:p-6 mx-auto hover:shadow-blue-200 transition-all duration-300 max-w-3xl">

      <div 
        className="relative w-full rounded-2xl overflow-hidden" 
        style={{ paddingTop: "56.25%" }}
      >
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-2xl"
          src="https://www.youtube.com/embed/H2_rO9GC2ac"
          title="Odia IT Training Hub Intro Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

    </div>

  </div>
</section>


{/* --- */}

      {/* 📞 Contact Section - Clean Form with Clear Contact Info */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-blue-700 mb-12 text-center">Ready to Start Your IT Career?</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Details Column */}
            <div className="p-8 bg-blue-50 rounded-xl shadow-lg">
              <h4 className="text-2xl font-bold text-blue-700 mb-6">Connect with Our Team</h4>
              <div className="space-y-4">
                <p className="text-lg flex items-center space-x-3"><span className="text-blue-500 font-bold">📧</span> <strong>Email:  </strong> trainingaj.group@gmail.com</p>
                <p className="text-lg flex items-center space-x-3"><span className="text-blue-500 font-bold">📞</span> <strong>Contact:  </strong> +91 9437401378 / +91 9040833981</p>
                <p className="text-lg flex items-center space-x-3"><span className="text-blue-500 font-bold">📍</span> <strong>Locations: </strong> Bhubaneswar & Bangalore</p>
              </div>

              <div className="mt-8 pt-4 border-t border-blue-200">
                <h5 className="text-xl font-bold text-blue-700 mb-4">Follow Us</h5>
                <div className="flex space-x-6">
                  {/* Updated to use <img> tags referencing the user's uploaded files (with placeholder fallback) */}
                  <a href="https://www.instagram.com/odiaittraininghub" className="hover:opacity-80 transition" aria-label="Instagram">
                    <img 
                      src="/images/instagram.ico" 
                      alt="Instagram Logo" 
                      className="w-7 h-7"
                      onError={(e) => {
                        e.target.onerror = null; // prevents infinite loop
                        e.target.src = "https://placehold.co/30x30/d81b60/ffffff?text=I"; // Pink/White for Instagram
                        e.target.className += " rounded-lg";
                      }}
                    />
                  </a>
                  <a href="https://wa.me/919437401378" className="hover:opacity-80 transition" aria-label="WhatsApp">
                    <img 
                      src="/images/whatsapp.ico"
                      alt="WhatsApp Logo" 
                      className="w-7 h-7"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/30x30/25d366/ffffff?text=W"; // Green/White for WhatsApp
                        e.target.className += " rounded-lg";
                      }}
                    />
                  </a>
                  <a href="https://youtube.com/@odiaittraininghub" className="hover:opacity-80 transition" aria-label="YouTube">
                    <img 
                      src="/images/youtube.ico"
                      alt="YouTube Logo" 
                      className="w-7 h-7"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/30x30/ff0000/ffffff?text=Y"; // Red/White for YouTube
                        e.target.className += " rounded-lg";
                      }}
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="bg-gray-100 p-8 rounded-xl shadow-2xl">
              <h4 className="text-2xl font-extrabold text-blue-700 mb-6">Submit Your Inquiry</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Full Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email Address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your Phone Number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700 transition transform hover:shadow-xl"
                >
                  Request a Free Demo Class
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* --- */}

      {/* 📞 Floating WhatsApp Chat Button */}
<a
  href="https://wa.me/919437401378?text=Hi%20Sir,%20I%20want%20to%20know%20about%20your%20IT%20training%20courses."
  target="_blank"
  rel="noopener noreferrer"
  className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white px-5 py-3 rounded-full shadow-xl flex items-center space-x-2 animate-bounce z-50 cursor-pointer"
>
  <img 
    src="/images/whatsapp.ico"
    alt="WhatsApp"
    className="w-7 h-7"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "https://placehold.co/40x40/25d366/ffffff?text=W";
    }}
  />
  <span className="font-bold text-lg">Chat Now</span>
</a>

      {/* 📄 Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8">
        <div className="max-w-6xl mx-auto px-6">
          <p>© 2022 Odia IT Training Hub. All rights reserved.</p>
          <p className="mt-2 text-sm">Empowering the next generation of IT professionals.</p>
        </div>
      </footer>
    </main>
  );
}
