import { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { doc, getDoc, setDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";

export default function Login() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [resetMessage, setResetMessage] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);


  // generate unique device id
  function generateDeviceId() {

    let deviceId = localStorage.getItem("deviceId");

    if (!deviceId) {

      deviceId = crypto.randomUUID();

      localStorage.setItem("deviceId", deviceId);

    }

    return deviceId;

  }



  // PASSWORD RESET
  const handlePasswordReset = async () => {

    if (!email) {

      setResetMessage("Enter email first");

      return;

    }

    try {

      await sendPasswordResetEmail(auth, email);

      setResetMessage("Reset link sent to email");

    }

    catch {

      setResetMessage("Failed to send email");

    }

  };



  // LOGIN
  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");

    setLoading(true);

    try {

      // firebase auth login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const user = userCredential.user;


      // get student record
      const q = query(

        collection(db, "students"),

        where("email", "==", email)

      );

      const snap = await getDocs(q);


      if (snap.empty) {

        throw new Error("student not found");

      }


      const studentDoc = snap.docs[0];

      const studentData = studentDoc.data();

      const studentId = studentDoc.id;



      // approval check
      if (!studentData.isApproved) {

        router.push("/pending-approval");

        return;

      }



      // ===========================
      // SINGLE DEVICE LOGIN CHECK
      // ===========================

      const sessionRef = doc(db, "activeSessions", studentId);

      const sessionSnap = await getDoc(sessionRef);


      if (sessionSnap.exists()) {

        setError("This ID already logged in another device");

        setLoading(false);

        return;

      }



      // allow login

      const deviceId = generateDeviceId();


      await setDoc(sessionRef, {

        deviceId: deviceId,

        loginTime: new Date()

      });



      localStorage.setItem("studentToken", "VALID_USER");

      localStorage.setItem("studentUID", studentId);

      localStorage.setItem("deviceId", deviceId);



      router.push("/student-dashboard");

    }

    catch (err) {

      let msg = "Invalid email or password";


      if (err.code === "auth/user-not-found") msg = "User not found";

      else if (err.code === "auth/wrong-password") msg = "Wrong password";

      else if (err.code === "auth/invalid-email") msg = "Invalid email";

      else if (err.message.includes("student not found")) msg = "Student not registered";


      setError(msg);

    }

    finally {

      setLoading(false);

    }

  };



  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-xl w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">

          Student Login

        </h2>



        <form onSubmit={handleLogin}>

          <input

            type="email"

            placeholder="Enter email"

            className="w-full p-3 border mb-3 rounded"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            required

          />



          <div className="relative">

            <input

              type={showPassword ? "text" : "password"}

              placeholder="Enter password"

              className="w-full p-3 border mb-3 rounded"

              value={password}

              onChange={(e)=>setPassword(e.target.value)}

              required

            />



            <span

              className="absolute right-3 top-3 cursor-pointer"

              onClick={()=>setShowPassword(!showPassword)}

            >

              {showPassword ? "🙈" : "👁"}

            </span>

          </div>



          {error &&

            <p className="text-red-500 mb-2">{error}</p>

          }



          {resetMessage &&

            <p className="text-green-600 mb-2">{resetMessage}</p>

          }



          <button

            disabled={loading}

            className="w-full bg-blue-600 text-white p-3 rounded"

          >

            {loading ? "Logging..." : "Login"}

          </button>

        </form>



        <p

          className="text-blue-600 mt-3 text-sm cursor-pointer"

          onClick={handlePasswordReset}

        >

          Forgot Password?

        </p>

      </div>

    </div>

  );

}
