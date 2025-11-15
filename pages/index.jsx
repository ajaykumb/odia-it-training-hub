import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-gray-800">
      {/* Header */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">Odia IT Training Hub</h1>
          <nav className="space-x-6 text-lg font-medium">
            <a href="#about" className="hover:text-yellow-300">About</a>
            <a href="#courses" className="hover:text-yellow-300">Courses</a>
            <a href="#contact" className="hover:text-yellow-300">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20 shadow-inner">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Learn IT in Odia — Hands-on Training</h2>
          <p className="text-xl mb-6">Upskill yourself with real-time IT training designed for freshers & professionals</p>
          <a href="#contact" className="bg-yellow-400 text-blue-800 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition">Get Started</a>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-blue-700 mb-6">About Us</h3>
          <p className="text-lg leading-7">
            Odia IT Training Hub provides practical and customizable IT training sessions in both Odia and English. Our programs are crafted for freshers,
            working professionals, and anyone looking to build a successful IT career.
          </p>
        </div>
      </section>

      {/* Courses Section */}
      <section id="courses" className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-blue-700 mb-10 text-center">Courses We Offer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Oracle SQL & PL/SQL",
              "Unix/Linux & Shell Scripting",
              "ITIL Processes & Batch Tools (Autosys, Control-M)",
              "ETL Processes & DevOps Tools",
              "Real-Time Projects & Resume Preparation",
              "Daily Interview Questions & Doubt-Clearing Sessions",
              "Splunk, Dynatrace, ServiceNow"
            ].map((course, index) => (
              <div key={index} className="bg-white p-6 shadow-md rounded-xl border-l-4 border-blue-600 hover:shadow-lg transition">
                <p className="text-lg font-semibold">{course}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Section */}
      <section className="py-16 bg-blue-600 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">100% Job Placement Commitment</h3>
        <p className="max-w-3xl mx-auto text-lg leading-7">
          We ensure every student becomes job-ready with real-time projects, interview preparation, resume building, and lifetime placement support.
        </p>
      </section>

      {/* Contact Section */}
<section id="contact" className="py-16 bg-white">
  <div className="max-w-6xl mx-auto px-4">
    <h3 className="text-3xl font-bold text-blue-700 mb-6">Contact Us</h3>

    <p className="text-lg mb-2"><strong>Email:</strong> trainingaj.group@gmail.com</p>
    <p className="text-lg mb-2"><strong>Phone:</strong> +91 9437401378</p>
    <p className="text-lg mb-2"><strong>Phone:</strong> +91 9040833981</p>
    <p className="text-lg mb-6"><strong>Location:</strong> Bhubaneswar & Bangalore</p>

    {/* Social Links */}
    <div className="flex space-x-6 text-xl mb-10">
      <a href="https://www.instagram.com/odiaittraininghub" className="text-pink-600 font-semibold hover:text-pink-400">Instagram</a>
      <a href="https://wa.me/919437401378" className="text-green-600 font-semibold hover:text-green-400">WhatsApp</a>
      <a href="https://youtube.com/@odiaittraininghub" className="text-red-600 font-semibold hover:text-red-400">YouTube</a>
    </div>

    {/* Contact Form Added Here */}
    <form
      className="bg-gray-100 p-6 rounded-xl shadow-md"
      onSubmit={async (e) => {
        e.preventDefault();

        const data = {
          name: e.target.name.value,
          email: e.target.email.value,
          phone: e.target.phone.value,
        };

        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (res.ok) {
          alert("Thank you! Your details have been submitted.");
          e.target.reset();
        } else {
          alert("Failed to send. Please try again.");
        }
      }}
    >
      <h4 className="text-2xl font-bold text-blue-700 mb-4">Submit Your Details</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="p-3 border rounded-lg"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="p-3 border rounded-lg"
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Your Phone Number"
          className="p-3 border rounded-lg"
          required
        />
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-500"
      >
        Submit
      </button>
    </form>

  </div>
</section>
      

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-10">
        © 2025 Odia IT Training Hub. All rights reserved.
      </footer>
    </main>
  );
}
