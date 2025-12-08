import { BoltIcon, AcademicCapIcon, MapPinIcon, GlobeAltIcon, UsersIcon, CheckCircleIcon, ArrowRightIcon, StarIcon, LightBulbIcon, PhoneIcon } from '@heroicons/react/24/solid';

export default function Home() {

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

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-blue-700/95 backdrop-blur-sm text-white py-4 shadow-xl">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4 overflow-x-hidden">

          <a href="#" className="flex items-center space-x-4 group">
            <img 
              src="/images/logo.png"
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

            <a
              href="/login"
              className="ml-6 bg-white text-blue-700 px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition-all shadow-md"
            >
              Login
            </a>
          </nav>

          {/* MOBILE LOGIN */}
          <a
            href="/login"
            className="md:hidden bg-white text-blue-700 px-4 py-2 rounded-lg font-bold text-sm shadow-md hover:bg-gray-200 transition"
          >
            Login
          </a>

        </div>
      </header>

      {/* HERO SECTION */}
      <section className="bg-blue-800 text-white relative overflow-hidden py-32 md:py-40">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <p className="text-xl font-medium text-yellow-400 mb-2">Your Career Starts Here</p>
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Learn IT in <span className="text-yellow-300">Odia</span> — 
            <br className='hidden md:block' /> Real-Time, Hands-On Training
          </h2>
          <p className="text-2xl mb-10 max-w-3xl mx-auto">
            Upskill with practical training designed for freshers & working professionals, delivered in Odia and English.
          </p>
          <a
            href="#contact"
            className="bg-yellow-400 text-blue-800 px-10 py-4 rounded-full font-bold text-xl shadow-2xl hover:bg-yellow-300 transition-all transform hover:scale-105 animate-pulse"
          >
            Get Started Now <ArrowRightIcon className="w-5 h-5 inline ml-2" />
          </a>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">Our Commitment</h3>
          <p className="text-xl text-gray-600 mb-10 text-center max-w-4xl mx-auto">
            We provide practical and customizable IT training sessions focused on job-readiness.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border-b-4 border-blue-500 rounded-lg shadow-md hover:shadow-xl transition">🗣️ Local Language Support</div>
            <div className="p-6 border-b-4 border-yellow-500 rounded-lg shadow-md hover:shadow-xl transition">🛠️ 100% Practical Training</div>
            <div className="p-6 border-b-4 border-green-500 rounded-lg shadow-md hover:shadow-xl transition">🤝 Lifetime Support</div>
          </div>
        </div>
      </section>

      {/* COURSES SECTION */}
      <section id="courses" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-blue-700 mb-14 text-center">Master These In-Demand Technologies</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div key={index} className="bg-white p-6 shadow-xl rounded-xl border-t-8 border-blue-600 hover:scale-[1.02] transition">
                <div className="flex items-center space-x-4">
                  {course.icon}
                  <p className="text-xl font-bold">{course.title}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ⭐⭐⭐ STUDENT PORTAL PREVIEW SECTION (ADDED) ⭐⭐⭐ */}
      <section id="portal-preview" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">

          <h3 className="text-4xl font-extrabold text-blue-700 text-center mb-6">
            Student Portal Preview
          </h3>
          <p className="text-xl text-gray-600 text-center mb-14 max-w-3xl mx-auto">
            Explore how students access materials, assignments, and support inside their learning portal.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

            {/* Dashboard */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-8 border-blue-600 hover:scale-[1.02] transition">
              <img
                src="/images/portal-dashboard.png"
                onError={(e)=>e.target.src="https://placehold.co/600x350/1e40af/ffffff?text=Dashboard"}
                className="rounded-lg shadow-md mb-5"
                alt="Dashboard"
              />
              <h4 className="text-xl font-bold text-blue-800">Dashboard Overview</h4>
              <p className="text-gray-600">All your classes, updates, and quick links — in one place.</p>
            </div>

            {/* Materials */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-8 border-yellow-500 hover:scale-[1.02] transition">
              <img
                src="/images/portal-materials.png"
                onError={(e)=>e.target.src="https://placehold.co/600x350/facc15/000000?text=Materials"}
                className="rounded-lg shadow-md mb-5"
                alt="Materials"
              />
              <h4 className="text-xl font-bold text-yellow-600">Study Materials</h4>
              <p className="text-gray-600">Notes, PDFs, assignments, recordings & project docs.</p>
            </div>

            {/* Assignments */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-8 border-purple-600 hover:scale-[1.02] transition">
              <img
                src="/images/portal-assignments.png"
                onError={(e)=>e.target.src="https://placehold.co/600x350/7c3aed/ffffff?text=Assignments"}
                className="rounded-lg shadow-md mb-5"
                alt="Assignments"
              />
              <h4 className="text-xl font-bold text-purple-700">Assignments & Tests</h4>
              <p className="text-gray-600">Submit tasks, take tests, and get detailed feedback.</p>
            </div>

            {/* Support */}
            <div className="bg-gray-50 p-6 rounded-xl shadow-lg border-l-8 border-red-600 hover:scale-[1.02] transition">
              <img
                src="/images/portal-support.png"
                onError={(e)=>e.target.src="https://placehold.co/600x350/d97706/ffffff?text=Support"}
                className="rounded-lg shadow-md mb-5"
                alt="Support"
              />
              <h4 className="text-xl font-bold text-red-700">Support Ticket System</h4>
              <p className="text-gray-600">Raise issues anytime and get real-time help from mentors.</p>
            </div>

          </div>

        </div>
      </section>
      {/* ⭐⭐⭐ END OF PORTAL PREVIEW SECTION ⭐⭐⭐ */}

      {/* 🚀 Developer Focus Section */}
      {/* (Your original Developer Focus code here — unchanged) */}

      {/* PLACEMENT SECTION */}
      {/* (Unchanged) */}

      {/* CONTACT SECTION */}
      {/* (Unchanged) */}

      {/* FOOTER */}
      {/* (Unchanged) */}

    </main>
  );
}
