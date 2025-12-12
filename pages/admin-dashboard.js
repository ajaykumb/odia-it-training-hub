import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig"; 

// SEND APPROVAL EMAIL
const sendApprovalEmail = async (toEmail, name) => {
    try {
        await fetch("/api/sendApprovalEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toEmail, name })
        });
    } catch (error) {
        console.error("Approval Email Failed:", error);
    }
};

// SEND REJECT EMAIL
const sendRejectEmail = async (toEmail, name, reason) => {
    try {
        await fetch("/api/sendRejectEmail", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ toEmail, name, reason })
        });
    } catch (error) {
        console.error("Reject Email Failed:", error);
    }
};

export default function AdminDashboard() {
    const router = useRouter();

    const [pendingStudents, setPendingStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [approvingId, setApprovingId] = useState(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [error, setError] = useState("");

    // LOAD STUDENTS WHO ARE NOT APPROVED
    useEffect(() => {
        if (localStorage.getItem("adminToken") !== "VALID_ADMIN") {
            router.push("/admin-login");
            return;
        }

        const studentsRef = collection(db, "students");

        // FIXED QUERY
        const q = query(studentsRef, where("isApproved", "==", false));

        const unsubscribe = onSnapshot(
            q,
            (snapshot) => {
                const list = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || "N/A"
                }));
                setPendingStudents(list);
                setLoading(false);
            },
            (e) => {
                console.error(e);
                setError("Failed to load students.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // APPROVE STUDENT
    const handleApprove = async (id, name, email) => {
        setApprovingId(id);

        try {
            await updateDoc(doc(db, "students", id), {
                isApproved: true
            });

            await sendApprovalEmail(email, name);
        } catch (e) {
            console.error(e);
            setError("Approval failed.");
        }

        setApprovingId(null);
    };

    // REJECT STUDENT
    const handleReject = async (id, name, email) => {
        const reason = prompt("Enter rejection reason:");

        setRejectingId(id);

        try {
            await updateDoc(doc(db, "students", id), {
                isRejected: true,
                rejectionReason: reason || "Not provided"
            });

            await sendRejectEmail(email, name, reason);
        } catch (e) {
            console.error(e);
            setError("Rejection failed.");
        }

        setRejectingId(null);
    };

    if (loading)
        return <div className="min-h-screen flex items-center justify-center text-xl">Loading…</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            <header className="flex justify-between items-center pb-6 border-b border-red-200 mb-8">
                <h1 className="text-4xl font-extrabold text-red-700">Admin Verification Dashboard</h1>

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
                    <p>{error}</p>
                </div>
            )}

            <h2 className="text-2xl font-semibold mb-4">
                Pending Students ({pendingStudents.length})
            </h2>

            {pendingStudents.length === 0 ? (
                <div className="bg-green-100 border p-4 rounded text-center">
                    No pending students.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingStudents.map((s) => (
                        <div key={s.id} className="bg-white p-6 rounded-xl shadow-lg border">

                            <p className="text-lg font-bold text-red-600">{s.name}</p>
                            <p className="text-gray-700 text-sm mb-4">
                                <strong>Email:</strong> {s.email}
                            </p>

                            <div className="flex gap-3">

                                {/* APPROVE BUTTON */}
                                <button
                                    onClick={() => handleApprove(s.id, s.name, s.email)}
                                    disabled={approvingId === s.id}
                                    className={`flex-1 py-2 rounded-lg font-semibold ${
                                        approvingId === s.id
                                            ? "bg-gray-400"
                                            : "bg-green-500 text-white hover:bg-green-600"
                                    }`}
                                >
                                    {approvingId === s.id ? "Approving…" : "Approve"}
                                </button>

                                {/* REJECT BUTTON */}
                                <button
                                    onClick={() => handleReject(s.id, s.name, s.email)}
                                    disabled={rejectingId === s.id}
                                    className={`flex-1 py-2 rounded-lg font-semibold ${
                                        rejectingId === s.id
                                            ? "bg-gray-400"
                                            : "bg-red-500 text-white hover:bg-red-600"
                                    }`}
                                >
                                    {rejectingId === s.id ? "Rejecting…" : "Reject"}
                                </button>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
