import { BoltIcon, AcademicCapIcon, MapPinIcon, GlobeAltIcon, UsersIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

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
        alert("Success! Your details have been submitted. We'll be in touch soon.");
        e.target.reset();
      } else {
        alert("Failed to send. Please ensure all fields are correct and try again.");
      }
    } catch (error) {
      alert("An error occurred. Please check your network connection.");
    }
  };


  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800 tracking-tight">
      
      {/* 🚀 Header - Sticky and Blurry */}
      <header className="sticky top-0 z-50 bg-blue-700/95 backdrop-blur-sm text-white py-4 shadow-xl">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
          <a href="#" className="text-3xl font-extrabold text-yellow-300 hover:text-yellow-400 transition">Odia IT Hub</a>
          <nav className="space-x-8 text-lg font-medium hidden md:flex">
            <a href="#about" className="hover:text-yellow-300 transition">About</a>
            <a href="#courses" className="hover:text-yellow-300 transition">Courses</a>
            <a href="#placement" className="hover:text-yellow-300 transition">Success</a>
            <a href="#contact" className="hover:text-yellow-300 transition">Contact</a>
          </nav>
          <a href="#contact" className="md:hidden bg-yellow-400 text-blue-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-300 transition">Enroll</a>
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
            Upskill with practical training designed for freshers & working professionals, delivered in **Odia and English**.
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

      {/* 📞 Contact Section - Clean Form with Clear Contact Info */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-blue-700 mb-12 text-center">Ready to Start Your IT Career?</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Contact Details Column */}
            <div className="p-8 bg-blue-50 rounded-xl shadow-lg">
                <h4 className="text-2xl font-bold text-blue-700 mb-6">Connect with Our Team</h4>
                <div className="space-y-4">
                    <p className="text-lg flex items-center space-x-3"><span className="text-blue-500 font-bold">📧</span> <strong>Email: </strong> trainingaj.group@gmail.com</p>
                    <p className="text-lg flex items-center space-x-3"><span className="text-blue-500 font-bold">📞</span> <strong>Contact: </strong> +91 9437401378 / +91 9040833981</p>
                    <p className="text-lg flex items-center space-x-3"><span className="text-blue-500 font-bold">📍</span> <strong>Locations: </strong> Bhubaneswar & Bangalore</p>
                </div>

                <div className="mt-8 pt-4 border-t border-blue-200">
                    <h5 className="text-xl font-bold text-blue-700 mb-4">Follow Us</h5>
                    <div className="flex space-x-6 text-2xl">
                        <a href="https://www.instagram.com/odiaittraininghub" className="text-pink-600 hover:text-pink-400 transition" aria-label="Instagram">📸</a>
                        <a href="https://wa.me/919437401378" className="text-green-600 hover:text-green-400 transition" aria-label="WhatsApp">🟢</a>
                        <a href="https://youtube.com/@odiaittraininghub" className="text-red-600 hover:text-red-400 transition" aria-label="YouTube">▶️</a>
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

      {/* 📄 Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8">
        <div className="max-w-6xl mx-auto px-6">
            <p>© 2025 Odia IT Training Hub. All rights reserved.</p>
            <p className="mt-2 text-sm">Empowering the next generation of IT professionals.</p>
        </div>
      </footer>
    </main>
  );
}
