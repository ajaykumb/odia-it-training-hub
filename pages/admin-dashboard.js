import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig"; 

// ✅ REAL EMAIL FUNCTION (calls API route)
const sendApprovalEmail = async (toEmail, name) => {
    try {
        const res = await fetch("/api/sendApprovalEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toEmail, name })
        });

        const data = await res.json();
        console.log("Email API Response:", data);

        if (!res.ok) {
            console.error("Email API Error:", data.error);
        }
    } catch (error) {
        console.error("Email Send Failed:", error);
    }
};

export default function AdminDashboard() {
    const router = useRouter();
    const [pendingStudents, setPendingStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState(null); 
    const [error, setError] = useState(null);

    // Load pending students
    useEffect(() => {
        if (localStorage.getItem("adminToken") !== "VALID_ADMIN") {
            router.push("/admin-login");
            return;
        }

        const studentsRef = collection(db, "students");
        const q = query(studentsRef, where("isApproved", "==", false));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const students = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || 'N/A'
                }));
                setPendingStudents(students);
                setLoading(false);
                setError(null);
            },
            (error) => {
                console.error("Error loading students:", error);
                setError("Failed to load students. Check Firestore Rules.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [router]);

    const handleApprove = async (studentId, name, email) => {
        setError(null);
        setApprovingId(studentId);

        try {
            const ref = doc(db, "students", studentId);

            await updateDoc(ref, { isApproved: true });

            // 👉 SEND EMAIL after approval
            await sendApprovalEmail(email, name);

            console.log(`Approved: ${name}`);
        } catch (error) {
            console.error("Approval Error:", error);
            setError(`Approval failed for ${name}. Check Firestore permissions.`);
        } finally {
            setApprovingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-xl text-gray-600">
                Loading Admin Dashboard...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="flex justify-between items-center pb-6 border-b border-red-200 mb-8">
                <h1 className="text-4xl font-extrabold text-red-700">
                    Admin Verification Dashboard
                </h1>
                <button
                    onClick={() => {
                        localStorage.removeItem("adminToken");
                        router.push("/admin-login");
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                >
                    Logout
                </button>
            </header>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 p-4 mb-6">
                    <p className="font-bold">Error</p>
                    <p>{error}</p>
                </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Pending Student Accounts ({pendingStudents.length})
            </h2>

            {pendingStudents.length === 0 ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-10 text-center">
                    <span className="font-semibold">All clear!</span> No pending students.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingStudents.map((s) => (
                        <div key={s.id} className="bg-white p-6 rounded-xl shadow-lg border hover:shadow-xl">
                            <p className="text-lg font-bold text-red-600 mb-1">{s.name}</p>
                            <p className="text-gray-600 mb-4 text-sm">
                                <strong>Email:</strong> {s.email}
                            </p>

                            <button
                                onClick={() => handleApprove(s.id, s.name, s.email)}
                                disabled={approvingId === s.id}
                                className={`w-full py-2 rounded-lg font-semibold ${
                                    approvingId === s.id
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-500 text-white hover:bg-green-600"
                                }`}
                            >
                                {approvingId === s.id ? "Approving..." : "Approve Student"}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
