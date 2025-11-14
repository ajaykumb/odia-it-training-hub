
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gray-50 text-gray-800 min-h-screen">
      <header className="flex items-center justify-between bg-white shadow-md p-4">
        <div className="flex items-center space-x-2">
          <Image src="/images/logo.jpg" alt="Odia IT Training Hub Logo" width={60} height={60} className="rounded-full"/>
          <h1 className="text-2xl font-bold text-blue-700">Odia IT Training Hub</h1>
        </div>
        <a href="#contact" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Contact</a>
      </header>

      <section className="relative w-full h-[400px]">
        <Image src="/images/banner.jpg" alt="Training Banner" layout="fill" objectFit="cover"/>
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-white text-3xl md:text-5xl font-bold text-center px-4">
            Learn IT in Odia — Hands-on Training for Bright Careers
          </h2>
        </div>
      </section>

      <section className="max-w-5xl mx-auto p-6">
        <h3 className="text-2xl font-semibold text-blue-700 mb-4">🎓 About Odia IT Training Hub</h3>
        <p className="text-lg mb-4">
          Odia IT Training Hub provides hands-on, customizable IT training sessions in both Odia and English. 
          Our courses are designed for both freshers and professionals who aim to upskill for IT industry success.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Oracle SQL & PL/SQL</li>
          <li>Unix/Linux & Shell Scripting</li>
          <li>ITIL Processes & Batch Tools (Autosys, Control-M)</li>
          <li>ETL Processes & DevOps Tools</li>
          <li>Real-Time Projects & Resume Preparation</li>
          <li>Daily Interview Questions & Doubt-Clearing Sessions</li>
          <li>Tools: Splunk, Dynatrace, ServiceNow</li>
        </ul>
      </section>

      <section className="bg-blue-50 py-8">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">💼 100% Job Placement Commitment</h3>
          <p className="text-lg">
            We ensure every student is job-ready with real-time project exposure, resume guidance, 
            and placement assistance until they get placed successfully.
          </p>
        </div>
      </section>

      <section id="contact" className="max-w-5xl mx-auto p-6 text-center">
        <h3 className="text-2xl font-semibold text-blue-700 mb-2">📞 Contact Us</h3>
        <p>Email: <a href="mailto:odiaittraininghub@gmail.com" className="text-blue-600">odiaittraininghub@gmail.com</a></p>
        <p>Phone: +91 9437401378</p>
        <p>Location: Bhubaneswar, Odisha</p>
      </section>

      <footer className="bg-gray-800 text-white text-center py-4 mt-6">
        © {new Date().getFullYear()} Odia IT Training Hub. All rights reserved.
      </footer>
    </main>
  );
}
