// pages/your-business-google.js

const YourBusinessOnGooglePage = () => {
  return (
    <section className="py-12 bg-white border-t border-gray-300">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4 text-blue-700">Your Business on Google</h2>
        <p className="text-lg mb-6 text-gray-700">Visit our Google profile and leave a review or read what others are saying.</p>
        <a
          href="https://g.page/r/CWcjQQA9KaYKEAE/review"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition"
        >
          Visit Our Google Profile
        </a>
      </div>
    </section>
  );
};

export default YourBusinessOnGooglePage;
