import { useState, useEffect } from "react";
import {
  BoltIcon,
  AcademicCapIcon,
  MapPinIcon,
  GlobeAltIcon,
  UsersIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
  LightBulbIcon,
  PhoneIcon,
} from "@heroicons/react/24/solid";

export default function Home() {

  /* ================= FESTIVE POPUP STATE ================= */
  const [showFestivePopup, setShowFestivePopup] = useState(false);

  // ✅ ADD THIS LINE HERE
  const [openAccess, setOpenAccess] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const today = new Date();
    const disableDate = new Date("2026-01-01");


    if (today < disableDate) {
      setShowFestivePopup(true);

      const timer = setTimeout(() => {
        setShowFestivePopup(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, []);
  /* ====================================================== */

  // ================= COURSES =================
  const courses = [
    { title: "Oracle SQL & PL/SQL", icon: <BoltIcon className="w-6 h-6 text-yellow-500" /> },
    { title: "Unix/Linux & Shell Scripting", icon: <AcademicCapIcon className="w-6 h-6 text-green-500" /> },
    { title: "ITIL & Batch Tools (Autosys, Control-M)", icon: <UsersIcon className="w-6 h-6 text-red-500" /> },
    { title: "ETL Processes & DevOps Tools", icon: <GlobeAltIcon className="w-6 h-6 text-purple-500" /> },
    { title: "Real-Time Projects & Resume Prep", icon: <CheckCircleIcon className="w-6 h-6 text-cyan-500" /> },
    { title: "Interview Q&A & Doubt-Clearing", icon: <BoltIcon className="w-6 h-6 text-orange-500" /> },
    { title: "Splunk, Dynatrace, ServiceNow", icon: <MapPinIcon className="w-6 h-6 text-blue-500" /> },
  ];

  // ================= CONTACT FORM =================
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

      if (res.ok) e.target.reset();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800 tracking-tight overflow-x-hidden">

      
      {/* 🚀 Header - Sticky and Blurry */}
<header className="sticky top-0 z-50 bg-blue-700/95 backdrop-blur-sm text-white py-4 shadow-xl">
  <div className="max-w-7xl mx-auto flex justify-between items-center px-4">

    {/* LOGO */}
    <a href="#" className="flex items-center space-x-3">
      <img src="/images/logo.png" alt="Logo" className="w-10 h-10" />
      <span className="text-xl font-extrabold text-yellow-300">
        Odia IT Training Hub
      </span>
    </a>

    {/* DESKTOP NAV */}
    <nav className="hidden md:flex items-center space-x-8 text-lg font-medium">
      <a href="#about">About</a>
      <a href="#courses">Courses</a>
      <a href="#developer-focus">New Batch</a>
      <a href="#placement">Success</a>
      <a href="#contact">Contact</a>

      {/* DESKTOP ACCESS PORTAL */}
      <div className="relative">
        <button
          onClick={() => setOpenAccess(!openAccess)}
          className="bg-yellow-400 text-blue-800 px-5 py-2 rounded-full font-bold flex items-center gap-2"
        >
          Access Portal ▾
        </button>

        {openAccess && (
          <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-xl shadow-xl overflow-hidden">
            <a href="/login" className="block px-5 py-3 hover:bg-blue-50">
              🎓 Student Login
            </a>
            <a href="/admin/all-answers" className="block px-5 py-3 hover:bg-red-50">
              🛡️ Admin Login
            </a>
            <a href="/register" className="block px-5 py-3 bg-yellow-100 font-bold">
              📝 New Student Register
            </a>
          </div>
        )}
      </div>
    </nav>

    {/* 📱 MOBILE HAMBURGER */}
    <button
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      className="md:hidden bg-yellow-400 text-blue-800 px-4 py-2 rounded-lg font-bold"
    >
      ☰
    </button>
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
  href="/register"
  className="bg-yellow-400 text-blue-800 px-10 py-4 rounded-full font-bold text-xl shadow-2xl hover:bg-yellow-300 transition-all transform hover:scale-105 animate-pulse"
>
  Register Now <ArrowRightIcon className="w-5 h-5 inline ml-2" />
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
      {/* --- */}

{/* ⭐ PREMIUM TICKET SIMULATOR PREVIEW SECTION */}
<section 
  id="ticket-simulator-preview" 
  className="py-24 bg-gradient-to-br from-blue-50 via-white to-blue-100 relative overflow-hidden"
>
  {/* Background Glow Circles */}
  <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
  <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-300 rounded-full blur-3xl opacity-20"></div>

  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10 items-center">

    {/* Left Side Illustration */}
    <div className="flex justify-center md:justify-start">
      <div className="bg-white shadow-2xl rounded-3xl p-6 border-t-8 border-blue-600 max-w-md hover:shadow-blue-300 transition-all duration-300">
        <img 
          src="/images/ticket-simulator-preview.png"
          onError={(e)=> e.target.src="https://placehold.co/500x350/1e40af/ffffff?text=Ticket+Simulator"}
          alt="IT Ticket Simulator Preview"
          className="rounded-2xl shadow-lg"
        />
      </div>
    </div>

    {/* Right Side Content */}
    <div className="text-center md:text-left">

      <h3 className="text-4xl md:text-5xl font-extrabold text-blue-700 leading-tight mb-6">
        Real-Time IT<br />
        <span className="text-blue-900">Ticket Simulator</span>
      </h3>
      
<p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-lg">
  In our coaching center, you will work on <strong>real production issues</strong> exactly like those handled in top IT companies.  
  You will learn the complete L1 and L2 workflow — how engineers <strong>analyze logs, identify root causes, apply fixes, and close tickets with industry-standard procedures.</strong>
</p>

<p className="text-lg text-gray-600 leading-relaxed mb-10 max-w-lg">
  These <strong>authentic industry tickets</strong>, practiced directly in our classes, will help you <strong>communicate confidently in interviews</strong>,  
  troubleshoot real-time issues in your job, and perform like an <strong>experienced IT engineer from Day 1.</strong>
</p>

      <a 
        href="/tickets"
        className="inline-flex items-center bg-red-600 text-white px-10 py-4 rounded-full font-bold text-xl shadow-xl hover:bg-red-700 hover:shadow-red-300 transition-all transform hover:scale-105"
      >
        🔧 Open Real-Time Ticket Simulator
      </a>

    </div>

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
            <a
  href="/register"
  className="inline-flex items-center mt-6 bg-yellow-400 text-indigo-900 px-8 py-4 rounded-full font-black text-xl shadow-xl hover:bg-yellow-300 transition-all transform hover:scale-105"
>
  🎓 Register for Upcoming Batch
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
      
      {/* ================= FESTIVE POPUP (FIXED LOCATION) ================= */}
      {showFestivePopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm">

          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="snowflake"
              style={{
                left: `${Math.random() * 100}vw`,
                animationDuration: `${5 + Math.random() * 5}s`,
                fontSize: `${12 + Math.random() * 10}px`,
              }}
            >
              ❄
            </div>
          ))}

          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-[90%] overflow-hidden animate-scale-in">
            <button
              onClick={() => setShowFestivePopup(false)}
              className="absolute top-3 right-3 bg-red-600 text-white w-8 h-8 rounded-full font-bold"
            >
              ✕
            </button>

            <img
              src="/images/christmas-newyear-popup.jpg"
              alt="Merry Christmas and Happy New Year"
              className="w-full"
            />

            <div className="p-6 text-center">
              <h3 className="text-2xl font-extrabold text-red-600">🎄 Merry Christmas</h3>
              <h4 className="text-xl font-bold text-blue-700">🎉 Happy New Year 2026</h4>
            </div>
          </div>
        </div>
      )}

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
