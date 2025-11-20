import { 
  BoltIcon, AcademicCapIcon, MapPinIcon, GlobeAltIcon, 
  UsersIcon, CheckCircleIcon, ArrowRightIcon, StarIcon, 
  LightBulbIcon, PhoneIcon 
} from '@heroicons/react/24/solid';

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
        console.log("Success! Your details have been submitted.");
        e.target.reset();
      } else {
        console.error("Failed to send.");
      }
    } catch (error) {
      console.error("Network error.");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800 overflow-x-hidden">

      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-blue-700/95 backdrop-blur-sm text-white py-4 shadow-xl">
        <div className="w-full max-w-7xl mx-auto flex justify-between items-center px-4">

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
              className="ml-6 bg-white text-blue-700 px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition shadow-md"
            >
              Login
            </a>
          </nav>

          <a href="#contact" className="md:hidden bg-yellow-400 text-blue-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-yellow-300 transition">
            Enroll
          </a>

        </div>
      </header>

      {/* HERO SECTION — SAFARI-FIXED */}
      <section className="bg-blue-800 text-white relative overflow-hidden py-32 md:py-40">
        <div className="max-w-6xl mx-auto px-6 text-center relative">

          <p className="text-xl font-medium text-yellow-400 mb-2">
            Your Career Starts Here
          </p>

          {/* SAFARI-SAFE HEADING */}
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 leading-[1.2] tracking-normal">
            <span className="block md:inline">
              Learn IT in <span className="text-yellow-300">Odia</span> — 
            </span>
            <span className="block md:inline">
              Real-Time, Hands-On Training
            </span>
          </h2>

          <p className="text-2xl mb-10 max-w-3xl mx-auto">
            Upskill with practical training designed for freshers & working
            professionals, delivered in <strong>Odia and English</strong>.
          </p>

          <a
            href="#contact"
            className="bg-yellow-400 text-blue-800 px-10 py-4 rounded-full font-bold text-xl shadow-2xl hover:bg-yellow-300 transition transform hover:scale-105"
          >
            Get Started Now <ArrowRightIcon className="w-5 h-5 inline ml-2" />
          </a>

        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-blue-700 mb-4 text-center">
            Our Commitment
          </h3>
          <p className="text-xl text-gray-600 mb-10 text-center max-w-4xl mx-auto">
            We provide practical and customizable IT training sessions...
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 border-b-4 border-blue-500 rounded-lg shadow-md">
              <p className="text-5xl text-blue-500 mb-3">🗣️</p>
              <h4 className="text-xl font-bold mb-2">Local Language</h4>
              <p className="text-gray-600">Training in Odia + English.</p>
            </div>
            <div className="p-6 border-b-4 border-yellow-500 rounded-lg shadow-md">
              <p className="text-5xl text-yellow-500 mb-3">🛠️</p>
              <h4 className="text-xl font-bold mb-2">Practical Training</h4>
              <p className="text-gray-600">Hands-on real projects.</p>
            </div>
            <div className="p-6 border-b-4 border-green-500 rounded-lg shadow-md">
              <p className="text-5xl text-green-500 mb-3">🤝</p>
              <h4 className="text-xl font-bold mb-2">Support</h4>
              <p className="text-gray-600">Lifetime career support.</p>
            </div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section id="courses" className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold text-blue-700 mb-14 text-center">
            Master These In-Demand Technologies
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <div 
                key={index}
                className="bg-white p-6 shadow-xl rounded-xl border-t-8 border-blue-600 hover:shadow-2xl transition transform hover:scale-[1.02]"
              >
                <div className="flex items-center space-x-4">
                  {course.icon}
                  <p className="text-xl font-bold">{course.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEW BATCH (unchanged except formatting) */}
      <section id="developer-focus" className="py-20 bg-gradient-to-br from-purple-800 to-indigo-900 text-white relative">
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <h3 className="text-4xl md:text-5xl font-extrabold mb-4 text-yellow-300">
            <LightBulbIcon className="w-10 h-10 inline-block mr-3 text-red-400" />
            Software Developers: New Batch Launching Soon!
          </h3>

          <p className="text-xl md:text-2xl text-pink-200 mb-8">
            📢 Don't miss out! Spread the word!
          </p>

          {/* ... YOU CAN KEEP THE SAME CONTENT HERE ... */}

          <a
            href="tel:9437401378"
            className="inline-flex items-center bg-red-500 text-white px-8 py-4 rounded-full font-black text-xl shadow-lg hover:bg-red-600 transition transform hover:scale-105"
          >
            <PhoneIcon className="w-7 h-7 mr-3" />
            Call to Enroll: 9437401378
          </a>
        </div>
      </section>

      {/* PLACEMENT */}
      <section id="placement" className="py-20 bg-green-700 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h3 className="text-4xl font-extrabold mb-4">Your Success is Our Mission</h3>
          <p className="text-xl mb-10">
            We're building careers with real-time projects...
          </p>

          <p className="text-6xl font-extrabold text-yellow-300">95%+</p>
          <p className="text-xl mt-2">Placement Success Rate</p>

          <a 
            href="/success"
            className="mt-10 inline-block bg-yellow-400 text-green-800 px-8 py-3 rounded-full font-bold hover:bg-yellow-300 transition"
          >
            View Success Stories
          </a>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <h3 className="text-4xl font-extrabold text-blue-700 mb-12 text-center">
            Ready to Start Your IT Career?
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Contact details */}
            <div className="p-8 bg-blue-50 rounded-xl shadow-lg">
              <h4 className="text-2xl font-bold text-blue-700 mb-6">
                Connect with Our Team
              </h4>

              <div className="space-y-4">
                <p className="text-lg"><strong>Email:</strong> trainingaj.group@gmail.com</p>
                <p className="text-lg"><strong>Contact:</strong> 9437401378 / 9040833981</p>
                <p className="text-lg"><strong>Locations:</strong> Bhubaneswar & Bangalore</p>
              </div>

              {/* Social icons */}
              <div className="mt-8 border-t pt-4">
                <h5 className="text-xl font-bold text-blue-700 mb-4">Follow Us</h5>
                <div className="flex space-x-6">
                  <img src="/images/instagram.ico" className="w-7 h-7" />
                  <img src="/images/whatsapp.ico" className="w-7 h-7" />
                  <img src="/images/youtube.ico" className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-gray-100 p-8 rounded-xl shadow-2xl">
              <h4 className="text-2xl font-extrabold text-blue-700 mb-6">
                Submit Your Inquiry
              </h4>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="name" placeholder="Your Name" className="w-full p-3 border rounded-lg" required />
                <input type="email" name="email" placeholder="Your Email" className="w-full p-3 border rounded-lg" required />
                <input type="tel" name="phone" placeholder="Your Phone" className="w-full p-3 border rounded-lg" required />
                <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg font-bold hover:bg-blue-700">
                  Request a Free Demo Class
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8">
        <p>© 2022 Odia IT Training Hub. All rights reserved.</p>
        <p className="mt-2 text-sm">Empowering the next generation of IT professionals.</p>
      </footer>

    </main>
  );
}
