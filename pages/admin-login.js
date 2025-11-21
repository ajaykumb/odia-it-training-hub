import { useState } from "react";
import { useRouter } from "next/router";

// Use Firebase Authentication for production admin accounts.
const ADMIN_ID = "trainingaj.group@gmail.com";
const ADMIN_PASSWORD = "Ajay@12345";

export default function AdminLogin() {
    const router = useRouter();
    const [adminId, setAdminId] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        // Simple validation check against hardcoded values
        if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
            // Success: Store token and redirect
            localStorage.setItem("adminToken", "VALID_ADMIN");
            router.push("/admin-dashboard");
        } else {
            setError("Invalid Admin ID or Password.");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-sm">
                
                <h2 className="text-3xl font-extrabold text-center mb-2 text-red-600">
                    Admin Portal
                </h2>
                <h3 className="text-lg text-center mb-8 text-gray-600">
                    Verification Dashboard Access
                </h3>

                <form onSubmit={handleLogin}>
                    <label className="text-gray-700 font-medium text-sm">Admin ID (Email)</label>
                    <input
                        type="email"
                        placeholder="admin@hub.com"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-red-500 focus:border-red-500"
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        required
                    />

                    <label className="text-gray-700 font-medium text-sm">Password</label>
                    <input
                        type="password"
                        placeholder="admin123"
                        className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-red-500 focus:border-red-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    {error && <p className="text-red-600 mb-4 text-sm">{error}</p>}

                    <button
                        className={`w-full text-white py-3 rounded-lg transition text-lg font-semibold ${
                            loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 shadow-md hover:shadow-lg'
                        }`}
                        disabled={loading}
                    >
                        {loading ? 'Verifying...' : 'Admin Login'}
                    </button>
                </form>

                <p className="text-center text-gray-400 text-xs mt-6">
                    Hardcoded Credentials: ID: admin@hub.com | Pass: admin123
                </p>
                <div className="mt-4 text-center">
                    <a href="/login" className="text-sm text-blue-500 hover:underline">
                        ← Student Login
                    </a>
                </div>
            </div>
        </div>
    );
}
