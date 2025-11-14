import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gray-50 text-gray-800 min-h-screen">

      {/* HEADER */}
      <header className="flex items-center justify-between bg-white shadow-md p-4">
        <h1 className="text-xl md:text-2xl font-bold text-blue-700">
          Odia IT Training Hub
        </h1>

        {/* Small logo in corner */}
        <Image
          src="/images/logo.jpg"
          alt="Odia IT Training Hub Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
      </header>

      {/* BANNER WITH SMALL ICON IN CORNER */}
      <section className="relative w-full h-[350px] flex items-center justify-center bg-black">
        <Image
          src="/images/banner.jpg"
          alt="Training Banner"
          layout="fill"
          objectFit="cover"
          className="opacity-70"
        />

        {/* Overlay Title */}
        <h2 className="absolute text-white text-3xl md:text-5xl font-bold text-center px-4">
          Learn IT in Odia — Hands-on Training for Bright Careers
        </h2>

        {/* Small corner image */}
        <div className="absolute top-4 right-4">
          <Image
            src="/images/logo.jpg"
            alt="Small Corner Logo"
            width={50}
            height={50}
            className="rounded-full shadow-md"
          />
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="max-w-5xl mx-auto p-6 flex flex-col md:flex-row gap-6">

        {/* TEXT FIRST */}
        <div className="flex-1">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">
            🎓 About Odia IT Training Hub
          </h3>
          <p className="text-lg mb-4">
            Odia IT Training Hub provides hands-on, customizable IT training sessions in both Odia 
            and English. Our courses are designed for both freshers and professionals who aim to 
            upskill for IT industry success.
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
        </div>

        {/* SMALL SIDE IMAGE */}
        <div className="w-[120px] mx-auto md:mx-0">
          <Image
            src="/images/about.jpg"
            alt="About Training"
            width={120}
            height={120}
            className="rounded-lg shadow-md"
          />
        </div>
      </section>

      {/* JOB PLACEMENT */}
      <section className="bg-blue-50 py-8">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-semibold text-blue-700 mb-4">
            💼 100% Job Placement Commitment
          </h3>
          <p className="text-lg">
            We ensure every student is job-ready with real-time project exposure, resume guidance, 
            and placement assistance until they get placed successfully.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-5xl mx-auto p-6 text-center">
        <h3 className="text-2xl font-semibold text-blue-700 mb-2">
          📞 Contact Us
        </h3>
        <p>Email: <a href="mailto:odiaittraininghub@gmail.com" className="text-blue-600">odiaittraininghub@gmail.com</a></p>
        <p>Phone: +91 9437401378</p>
        <p>Location: Bhubaneswar, Odisha</p>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-white text-center py-4 mt-6">
        © {new Date().getFullYear()} Odia IT Training Hub. All rights reserved.
      </footer>
    </main>
  );
}
