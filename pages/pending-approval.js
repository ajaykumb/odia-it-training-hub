import { useEffect, useState } from "react";

export default function PendingApproval() {
    const [email, setEmail] = useState("");

    useEffect(() => {
        // Retrieve the email used during signup from local storage
        const storedEmail = localStorage.getItem("signup-email");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
            style={{ backgroundImage: "url('/images/background.jpg')" }}
        >
            <div className="bg-white bg-opacity-95 backdrop-blur-xl shadow-2xl rounded-2xl p-8 w-full max-w-lg text-center">
                <div className="text-6xl mb-6" role="img" aria-label="Clock">⏳</div>
                
                <h2 className="text-3xl font-bold mb-3 text-yellow-700">
                    Verification Pending
                </h2>
                
                <p className="text-gray-700 mb-6">
                    Thank you for signing up! We're thrilled to have you join the Odia IT Training Hub.
                </p>

                <p className="text-gray-700 mb-8 font-medium">
                    Your account, {email || 'registered email address'}, is currently awaiting approval from an administrator.
                    You will receive an email confirmation once your account is verified.
                </p>

                <p className="text-sm text-gray-500">
                    If you have any questions, please contact:  
                    <a href="mailto:trainingaj.group@gmail.com" className="text-blue-600 underline">
                        trainingaj.group@gmail.com
                    </a>.
                </p>

                
                <div className="mt-8">
                    <a href="/login" className="text-blue-600 hover:text-blue-800 font-semibold text-sm">
                        Go back to Login
                    </a>
                </div>
            </div>
        </div>
    );
}
