import { BriefcaseIcon, CurrencyDollarIcon, UserGroupIcon, HomeIcon, ArrowLeftIcon, PhoneIcon } from '@heroicons/react/24/solid';

export default function Success() {
  const students = [
    { name: "Abhijit", company: "Clover", package: "8.0 LPA", iconColor: "text-blue-600" },
    { name: "Bijay", company: "Infosys", package: "7.5 LPA", iconColor: "text-red-600" },
    { name: "Yas", company: "ANZ", package: "7.0 LPA", iconColor: "text-indigo-600" },
    { name: "S Pahi", company: "Indigo", package: "6.0 LPA", iconColor: "text-purple-600" },
    { name: "Dipti R", company: "Hiiden Company", package: "6.0 LPA", iconColor: "text-cyan-600" },
    { name: "Satya AXE", company: "Airtel client", package: "6.0 LPA", iconColor: "text-yellow-600" },
  ];

  return (
    <main className="min-h-screen bg-gray-50 font-sans text-gray-800">

      {/* ⬅️ Top Navigation Bar (New Feature) */}
      <nav className="bg-white shadow-md py-3 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <a href="/" className="flex items-center text-blue-600 hover:text-blue-800 transition font-medium">
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            Back to Main Site
          </a>
          <a href="#contact" className="flex items-center text-green-600 hover:text-green-800 transition font-medium">
            <PhoneIcon className="w-5 h-5 mr-1" />
            Enroll Now
          </a>
        </div>
      </nav>

      {/* 🌟 High-Impact Header Section */}
      <section className="bg-gradient-to-r from-blue-700 to-green-600 text-white py-20 shadow-xl">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-extrabold mb-3">Our Successful Candidates</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            These students achieved their career goals through our real-time, hands-on training. You could be next!
          </p>
        </div>
      </section>

      {/* --- */}

      {/* 📈 Trust Builder Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            {/* Success Rate */}
            <div className="p-4 rounded-xl border border-blue-100">
                <p className="text-5xl font-black text-blue-600">95%+</p>
                <p className="text-lg font-medium text-gray-600 mt-1">Placement Success Rate</p>
            </div>
            
            {/* Average Package */}
            <div className="p-4 rounded-xl border border-green-100">
                <p className="text-5xl font-black text-green-600">7.0 LPA</p>
                <p className="text-lg font-medium text-gray-600 mt-1">Average Starting Package</p>
            </div>
            
            {/* Total Students */}
            <div className="p-4 rounded-xl border border-yellow-100">
                <p className="text-5xl font-black text-yellow-600">50+</p>
                <p className="text-lg font-medium text-gray-600 mt-1">Students Placed Annually</p>
            </div>
        </div>
      </section>

      {/* --- */}

      {/* 🏅 Alumni Grid Section (Achievement Cards) */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">Recent Placements</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {students.map((s, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow-xl border-t-8 border-green-500 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
              >
                {/* Name and Icon */}
                <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-extrabold text-gray-900">{s.name}</h3>
                    {/* Placeholder for student avatar */}
                    <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold ${s.iconColor}`}>
                        {s.name[0]}
                    </div>
                </div>

                {/* Placement Details */}
                <div className="space-y-3">
                    <p className="flex items-center text-lg text-gray-700">
                      <BriefcaseIcon className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" />
                      <span className="font-semibold">Company:</span> <span className="ml-1 font-bold text-blue-800">{s.company}</span>
                    </p>
                    <p className="flex items-center text-xl font-bold text-gray-900">
                      <CurrencyDollarIcon className="w-6 h-6 text-yellow-500 mr-2 flex-shrink-0" />
                      <span className="font-semibold">Package:</span> <span className="ml-1 text-green-700">{s.package}</span>
                    </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- */}

      {/* 🚀 Final Call to Action (Updated for Contact Page) */}
      <section className="bg-blue-600 text-white text-center py-16 mt-10">
        <h2 className="text-3xl font-bold mb-4">Want to Join This League of Success?</h2>
        <a 
          href="/#contact" // Assumes the Contact section is on the main page, linked via ID
          className="bg-yellow-400 text-blue-900 px-8 py-4 mt-4 rounded-full font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 flex items-center justify-center max-w-sm mx-auto space-x-2"
        >
          <PhoneIcon className="w-6 h-6" />
          <span>Enroll Today and Get Started →</span>
        </a>
      </section>

      <footer className="bg-gray-800 text-gray-300 text-center py-6">
        © 2025 Odia IT Training Hub. All rights reserved.
      </footer>
    </main>
  );
}
