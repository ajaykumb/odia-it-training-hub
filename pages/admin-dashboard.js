import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig"; 

// Placeholder for approval email
const sendApprovalEmail = (toEmail, name) => {
    console.log(`
        EMAIL SIMULATION: Sending approval confirmation to ${name} (${toEmail}).
        Message: Congratulations! Your account has been approved. You can now log in to the student dashboard.
    `);
};


export default function AdminDashboard() {
    const router = useRouter();
    const [pendingStudents, setPendingStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    // Track which student ID is currently being approved to disable only that button
    const [approvingId, setApprovingId] = useState(null); 
    const [error, setError] = useState(null); // New state for displaying errors

    // Effect to check admin token and subscribe to Firestore changes
    useEffect(() => {
        // 1. Basic Admin Token Check
        if (localStorage.getItem("adminToken") !== "VALID_ADMIN") {
            router.push("/admin-login");
            return;
        }

        // 2. Subscribe to students who are NOT approved
        const studentsRef = collection(db, "students");
        // NOTE: Admin needs Read permission on all /students/{userId} documents for this query to work.
        const q = query(studentsRef, where("isApproved", "==", false));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const students = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A'
            }));
            setPendingStudents(students);
            setLoading(false);
            // Clear any general loading or fetching errors
            setError(null); 
        }, (error) => {
            console.error("Error fetching pending students:", error);
            setError("Failed to load students: Check console and Firestore Rules.");
            setLoading(false);
        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();
    }, [router]);

    const handleApprove = async (studentId, name, email) => {
        setError(null); // Clear previous errors
        setApprovingId(studentId); // Start approving process, disable this button
        try {
            const studentDocRef = doc(db, "students", studentId);
            
            // This update relies on the specific security rule added above.
            await updateDoc(studentDocRef, {
                isApproved: true,
            });
            
            // Send email confirmation
            sendApprovalEmail(email, name);

            console.log(`Student ${studentId} (${name}) approved successfully.`);
        } catch (error) {
            console.error("Error approving student:", error);
            setError(`Approval failed for ${name}. Error: Missing or insufficient permissions. Please publish the updated Firestore Security Rules.`);
        } finally {
            setApprovingId(null); // Finish approving process
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/admin-login");
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">Loading Admin Dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center pb-6 border-b border-red-200 mb-8">
                <h1 className="text-4xl font-extrabold text-red-700">
                    Admin Verification Dashboard
                </h1>
                <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                >
                    Logout
                </button>
            </header>
            
            {/* Display General Error Message */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p className="font-bold">Database Error</p>
                    <p>{error}</p>
                </div>
            )}


            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Pending Student Accounts ({pendingStudents.length})
            </h2>

            {pendingStudents.length === 0 ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center mt-10">
                    <span className="font-semibold">All clear!</span> No students are currently awaiting approval.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingStudents.map((student) => (
                        <div key={student.id} className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition duration-300">
                            <p className="text-lg font-bold text-red-600 mb-1">{student.name}</p>
                            <p className="text-gray-600 mb-4 text-sm">
                                <span className="font-semibold">Student ID (Email):</span> {student.email}
                            </p>
                            <div className="text-sm text-gray-500 space-y-1 mb-6">
                                <p><strong>Phone:</strong> {student.phone}</p>
                                <p><strong>Signed Up:</strong> {student.createdAt}</p>
                            </div>

                            <button
                                onClick={() => handleApprove(student.id, student.name, student.email)}
                                className={`w-full py-2 rounded-lg transition font-semibold ${
                                    approvingId === student.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                                disabled={approvingId === student.id}
                            >
                                {approvingId === student.id ? 'Approving...' : 'Approve Student'}
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            <footer className="text-center text-gray-400 text-sm mt-12 pt-6 border-t border-gray-200">
                Odia IT Training Hub Admin Console
            </footer>
        </div>
    );
}
