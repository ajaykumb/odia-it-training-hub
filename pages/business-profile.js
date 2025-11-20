const YourBusinessOnGooglePage = () => {
  return (
    <main className="bg-white">

      {/* 🔙 Back to Main Site */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <a
          href="/"
          className="flex items-center text-blue-600 hover:text-blue-800 text-lg font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Main Site
        </a>
      </div>

      {/* Existing Section */}
      <section className="py-12 bg-white border-t border-gray-300">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">
            Success Stories from Our Learners
          </h2>

          <p className="text-lg mb-6 text-gray-700">
            Visit our Google profile and leave a review or read what others are saying.
          </p>

          <a
            href="https://g.page/r/CWcjQQA9KaYKEAE/review"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
          >
            See Us on Google
          </a>
        </div>
      </section>

      {/* ⭐ Google Reviews Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-blue-700 mb-10 text-center">
            What Our Students Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

            {/* Review 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold mr-3">
                  S
                </div>
                <div>
                  <h3 className="font-bold text-lg">Sanjay Kumar Panda</h3>
                  <p className="text-sm text-gray-600">⭐⭐⭐⭐⭐ • 2 weeks ago</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Excellent IT training institute! The trainers are highly knowledgeable and explain every concept clearly.
                The sessions are practical and futuristic. Highly recommended!
              </p>
            </div>

            {/* Review 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold mr-3">
                  S
                </div>
                <div>
                  <h3 className="font-bold text-lg">Somya Ranjan Dhal</h3>
                  <p className="text-sm text-gray-600">⭐⭐⭐⭐⭐ • 2 weeks ago</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Your way of explaining complex topics made everything easy to understand.
                I gained valuable knowledge that will help in my career.
              </p>
            </div>

            {/* Review 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-lg font-bold mr-3">
                  J
                </div>
                <div>
                  <h3 className="font-bold text-lg">Jyotshna Rani Bhoi</h3>
                  <p className="text-sm text-gray-600">⭐⭐⭐⭐⭐ • 2 weeks ago</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                I am deeply grateful for your guidance. Your clear explanations made every topic simple.
                Thank you for supporting us always.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-8 mt-10">
        <div className="max-w-6xl mx-auto px-6">
          <p>© 2022 Odia IT Training Hub. All rights reserved.</p>
          <p className="mt-2 text-sm">Empowering the next generation of IT professionals.</p>
        </div>
      </footer>

    </main>
  );
};

export default YourBusinessOnGooglePage;
