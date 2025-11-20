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
  CheckCircleIcon as CheckCircleSolid,
} from "@heroicons/react/24/solid";

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
      console.error("An error occurred. Please check your network connection.", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800 tracking-tight">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-blue-700/95 backdrop-blur-sm text-white py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center px-6">
          {/* Left: Logo */}
          <div className="flex items-center flex-shrink-0">
            <a href="#" className="flex items-center space-x-4 group">
              <img
                src="/images/logo.png"
                alt="Odia IT Training Hub Logo"
                className="w-12 h-12"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/48x48/ffffff/000000?text=O";
                }}
              />
              <span className="text-xl md:text-2xl font-extrabold text-yellow-300 group-hover:text-yellow-400">
                Odia IT Training Hub
              </span>
            </a>
          </div>

          {/* Center: Scrollable Nav (always visible; horizontal scroll on small screens) */}
          <nav
            aria-label="Main navigation"
            className="flex-1 mx-8"
          >
            <div
              className="overflow-x-auto whitespace-nowrap -mx-2 px-2"
              // Small visual tweak to help iOS scrolling smoothness
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="inline-flex items-center space-x-8">
                <a href="#about" className="text-lg font-medium hover:text-yellow-300 px-2 py-1 whitespace-nowrap">About</a>
                <a href="#courses" className="text-lg font-medium hover:text-yellow-300 px-2 py-1 whitespace-nowrap">Courses</a>
                <a href="#developer-focus" className="text-lg font-medium hover:text-red-300 px-2 py-1 whitespace-nowrap">New Batch</a>
                <a href="#placement" className="text-lg font-medium hover:text-yellow-300 px-2 py-1 whitespace-nowrap">Success</a>
                <a href="#contact" className="text-lg font-medium hover:text-yellow-300 px-2 py-1 whitespace-nowrap">Contact</a>
                {/* Keep Login as a pill all the time */}
                <a
                  href="/login"
                  className="ml-4 inline-block bg-white text-blue-700 px-5 py-2 rounded-full font-bold hover:bg-gray-200 whitespace-nowrap shadow-md"
                >
                  Login
                </a>
              </div>
            </div>
          </nav>

          {/* Right: For small screens we also show Enroll quick link (keeps layout compact) */}
          <div className="flex-shrink-0">
            <a
              href="#contact"
              className="hidden md:inline-block bg-yellow-400 text-blue-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-300 transition"
            >
              Enroll
            </a>
            {/* On very small screens we keep Enroll visible to the right of nav (so user can quick-tap) */}
            <a
              href="#contact"
              className="md:hidden bg-yellow-400 text-blue-800 px-3 py-2 rounded-lg font-bold text-sm hover:bg-yellow-300 transition ml-2"
            >
              Enroll
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-blue-800 text-white relative overflow-hidden py-28 md:py-40">
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <p className="text-xl font-medium text-yellow-400 mb-2">Your Career Starts Here</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
            Learn IT in <span className="text-yellow-300">Odia</span> — <span className="hidden md:inline">Real-Time, Hands-On Training</span>
          </h1>
          <p className="text-lg md:text-2xl mb-8 max-w-3xl mx-auto">
            Upskill with practical training designed for freshers & working professionals, delivered in <strong>Odia and English</strong>.
          </p>
          <a
            href="#contact"
            className="bg-yellow-400 text-blue-800 px-8 py-3 rounded-full font-bold text-lg shadow-2xl hover:bg-yellow-300 transition transform hover:scale-[1.02]"
          >
            Get Started Now <ArrowRightIcon className="w-5 h-5 inline ml-2" />
          </a>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">Our Commitment</h2>
          <p className="text-xl text-gray-600 mb-10 text-center max-w-4xl mx-auto">
            We provide practical and customizable IT training sessions, focusing on <strong>job-readiness</strong> with real-time project exposure.
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

      {/* Courses */}
      <section id="courses" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-blue-700 mb-14 text-center">Master These In-Demand Technologies</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition border-t-8 border-blue-600"
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

      {/* New Batch */}
      <section id="developer-focus" className="py-20 bg-gradient-to-br from-purple-800 to-indigo-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10 flex items-center justify-center pointer-events-none">
          <StarIcon className="w-72 h-72 text-yellow-300" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h3 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight text-yellow-300">
            <LightBulbIcon className="w-10 h-10 inline-block mr-3 text-red-400" />
            Software Developers: New Batch Launching Soon!
          </h3>
          <p className="text-xl md:text-2xl font-semibold text-pink-200 mb-8">📢 Don't miss out! Spread the word in your network!</p>

          <div className="bg-gradient-to-br from-indigo-700 to-purple-700 p-8 md:p-10 rounded-3xl shadow-xl border-b-8 border-red-500">
            <h4 className="text-2xl md:text-3xl font-extrabold mb-6 text-yellow-400">✨ Essential Skills for Next-Gen Software Developers ✨</h4>
            <p className="text-lg md:text-xl mb-8 italic text-purple-200">Master these core technologies to build, deploy, and excel in real-world IT projects.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-8">
              <div className="flex items-start space-x-3 text-lg md:text-xl text-white">
                <CheckCircleSolid className="w-6 h-6 text-green-400 mt-1" />
                <p><strong>Python (Core Concepts)</strong> — foundation for automation, data, and backend.</p>
              </div>
              <div className="flex items-start space-x-3 text-lg md:text-xl text-white">
                <CheckCircleSolid className="w-6 h-6 text-green-400 mt-1" />
                <p><strong>Git & GitHub</strong> — version control and collaboration essentials.</p>
              </div>
              <div className="flex items-start space-x-3 text-lg md:text-xl text-white">
                <CheckCircleSolid className="w-6 h-6 text-green-400 mt-1" />
                <p><strong>Docker</strong> — containerization for real-time deployment and DevOps.</p>
              </div>
              <div className="flex items-start space-x-3 text-lg md:text-xl text-white">
                <CheckCircleSolid className="w-6 h-6 text-green-400 mt-1" />
                <p><strong>Java (Core & OOP)</strong> — enterprise application development stronghold.</p>
              </div>
            </div>

            <a
              href="tel:9437401378"
              className="inline-flex items-center bg-red-500 text-white px-8 py-4 rounded-full font-black text-xl md:text-2xl shadow-lg"
            >
              <PhoneIcon className="w-7 h-7 mr-3" />
              Call to Enroll: 9437401378
            </a>
          </div>
        </div>
      </section>

      {/* Placement */}
      <section id="placement" className="py-20 bg-green-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold mb-4">Your Success is Our Mission</h3>
          <p className="text-xl leading-relaxed mb-10">
            We're not just training, we're building careers. Our rigorous process includes real-time projects, focused interview preparation, and resume building.
          </p>

          <div className="mb-12">
            <p className="text-6xl font-extrabold text-yellow-300">95%+</p>
            <p className="text-xl font-medium mt-2">Placement Success Rate in the Last 3 Years</p>
          </div>

          <a href="/success" className="bg-yellow-400 text-green-800 px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-300 transition shadow-lg">
            View Successful Candidates Stories
          </a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-blue-700 mb-12 text-center">Ready to Start Your IT Career?</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Details Column */}
            <div className="p-8 bg-blue-50 rounded-xl shadow-lg">
              <h4 className="text-2xl font-bold text-blue-700 mb-6">Connect with Our Team</h4>
              <div className="space-y-4">
                <p className="text-lg"><strong>Email:</strong> trainingaj.group@gmail.com</p>
                <p className="text-lg"><strong>Contact:</strong> +91 9437401378 / +91 9040833981</p>
                <p className="text-lg"><strong>Locations:</strong> Bhubaneswar & Bangalore</p>
              </div>

              <div className="mt-8 pt-4 border-t border-blue-200">
                <h5 className="text-xl font-bold text-blue-700 mb-4">Follow Us</h5>
                <div className="flex space-x-6">
                  <a href="https://www.instagram.com/odiaittraininghub" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <img
                      src="/images/instagram.ico"
                      alt="Instagram"
                      className="w-7 h-7"
                      onError={(e) => (e.target.src = "https://placehold.co/30x30/d81b60/ffffff?text=I")}
                    />
                  </a>

                  <a href="https://wa.me/919437401378" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <img
                      src="/images/whatsapp.ico"
                      alt="WhatsApp"
                      className="w-7 h-7"
                      onError={(e) => (e.target.src = "https://placehold.co/30x30/25d366/ffffff?text=W")}
                    />
                  </a>

                  <a href="https://youtube.com/@odiaittraininghub" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <img
                      src="/images/youtube.ico"
                      alt="YouTube"
                      className="w-7 h-7"
                      onError={(e) => (e.target.src = "https://placehold.co/30x30/ff0000/ffffff?text=Y")}
                    />
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form Column */}
            <div className="bg-gray-100 p-8 rounded-xl shadow-2xl">
              <h4 className="text-2xl font-extrabold text-blue-700 mb-6">Submit Your Inquiry</h4>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Your Full Name" className="w-full p-3 border border-gray-300 rounded-lg" required />
                <input type="email" name="email" placeholder="Your Email Address" className="w-full p-3 border border-gray-300 rounded-lg" required />
                <input type="tel" name="phone" placeholder="Your Phone Number" className="w-full p-3 border border-gray-300 rounded-lg" required />
                <button type="submit" className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-blue-700">
                  Request a Free Demo Class
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex justify-center space-x-8 mb-6">
            <a href="https://www.instagram.com/odiaittraininghub" target="_blank" rel="noopener noreferrer">
              <img src="/images/instagram.ico" className="w-7 h-7" onError={(e) => (e.target.src = "https://placehold.co/30x30/d81b60/ffffff?text=I")} />
            </a>
            <a href="https://wa.me/919437401378" target="_blank" rel="noopener noreferrer">
              <img src="/images/whatsapp.ico" className="w-7 h-7" onError={(e) => (e.target.src = "https://placehold.co/30x30/25d366/ffffff?text=W")} />
            </a>
            <a href="https://youtube.com/@odiaittraininghub" target="_blank" rel="noopener noreferrer">
              <img src="/images/youtube.ico" className="w-7 h-7" onError={(e) => (e.target.src = "https://placehold.co/30x30/ff0000/ffffff?text=Y")} />
            </a>
          </div>

          <p>© 2022 Odia IT Training Hub. All rights reserved.</p>
          <p className="mt-2 text-sm">Empowering the next generation of IT professionals.</p>
        </div>
      </footer>
    </main>
  );
}
