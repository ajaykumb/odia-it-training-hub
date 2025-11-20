export default function StudentLogin() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl border border-gray-200">
        
        {/* Back to Main */}
        <a href="/" className="text-blue-600 text-sm flex items-center mb-6 hover:underline">
          ← Back to Main Site
        </a>

        {/* Title */}
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Odia IT Training Hub Student Login
        </h2>
        <p className="text-center text-gray-600 mb-8 text-sm">
          Access your class notes & study materials
        </p>

        {/* Login Form */}
        <form className="space-y-5">
          {/* Student ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student ID
            </label>
            <input
              type="text"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your Student ID"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your Password"
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          © 2022 Odia IT Training Hub • All Rights Reserved
        </p>
      </div>
    </main>
  );
}
