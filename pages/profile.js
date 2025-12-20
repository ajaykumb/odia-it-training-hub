import { useEffect, useState } from "react";
import { auth, db, storage } from "../utils/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uid, setUid] = useState(null);
  const [authEmail, setAuthEmail] = useState("");
  const [profilePicFile, setProfilePicFile] = useState(null);

  // Main Profile States
  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",

    // course
    courseName: "",
    batch: "",
    batchTime: "",
    studentId: "",
    joinDate: "",

    // progress
    totalClasses: 0,
    attendedClasses: 0,
    courseProgress: 0,

    // fees
    totalFee: 0,
    paidAmount: 0,
    lastPaymentDate: "",

    // certificate
    certificateEligible: false,
    certificateUrl: "",

    // photo
    photoURL: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // 1️⃣ LOAD USER + LOAD FIRESTORE PROFILE
  // =====================================================
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      setUid(user.uid);
      setAuthEmail(user.email);

      try {
        const refDoc = doc(db, "students", user.uid);
        const snap = await getDoc(refDoc);

        if (snap.exists()) {
          // Load existing profile from Firestore
          setProfile((prev) => ({ ...prev, ...snap.data() }));
        } else {
          // Create a new empty profile record
          await setDoc(refDoc, {
            email: user.email,
            createdAt: new Date(),
          });
        }
      } catch (err) {
        console.error(err);
        setError("Error loading profile");
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Derived values
  const attendancePercent =
    profile.totalClasses > 0
      ? Math.round(
          (profile.attendedClasses / profile.totalClasses) * 100
        )
      : 0;

  const pendingAmount =
    profile.totalFee - profile.paidAmount > 0
      ? profile.totalFee - profile.paidAmount
      : 0;

  // =====================================================
  // 2️⃣ FORM INPUT HANDLERS
  // =====================================================
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleNumberChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: Number(e.target.value) || 0,
    });
  };

  const handleProfilePicSelect = (e) => {
    if (e.target.files?.[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  // Upload profile picture
  const uploadProfilePic = async () => {
    if (!profilePicFile || !uid) return profile.photoURL;

    const storageRef = ref(
      storage,
      `profilePictures/${uid}/${profilePicFile.name}`
    );

    await uploadBytes(storageRef, profilePicFile);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  };

  // =====================================================
  // 3️⃣ SAVE PROFILE (CORRECTED!)
  // =====================================================
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!uid) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      // Upload photo if selected
      let photoURL = profile.photoURL;
      if (profilePicFile) {
        photoURL = await uploadProfilePic();
      }

      const dataToSave = {
        ...profile,
        photoURL,
        attendancePercent,
        pendingAmount,
        updatedAt: new Date(),
      };

      // MAIN FIX 🔥
      await setDoc(doc(db, "students", uid), dataToSave, { merge: true });

      setMessage("Profile updated successfully ✔");
      setProfile((prev) => ({ ...prev, photoURL }));
    } catch (err) {
      console.error(err);
      setError("Failed to save profile");
    }

    setSaving(false);
  };

  // =====================================================
  // 4️⃣ CHANGE PASSWORD
  // =====================================================
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (!oldPassword || !newPassword || !confirmPassword) {
        return setError("Fill all password fields");
      }

      if (newPassword !== confirmPassword) {
        return setError("New passwords do not match");
      }

      const credential = EmailAuthProvider.credential(
        authEmail,
        oldPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      setMessage("Password updated successfully ✔");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError("Failed to change password");
    }
  };

  // =====================================================
  // 5️⃣ PAGE LOADING UI
  // =====================================================
  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Loading profile...
      </div>
    );
  }

  // =====================================================
  // 6️⃣ FINAL PAGE UI
  // =====================================================
  return (
    <div className="profile-page">
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-error">{error}</div>}

      {/* PROFILE HEADER */}
      <section className="card profile-header">
        <div className="profile-header-left">
          <img
            src={
              profile.photoURL ||
              `https://ui-avatars.com/api/?name=${profile.fullName || "Student"}`
            }
            className="profile-avatar"
          />
          <div>
            <h2 className="profile-name">{profile.fullName || "Student Name"}</h2>
            <p>{profile.courseName || "Course not set"}</p>
            <label className="btn-secondary small">
              Change Photo
              <input type="file" hidden onChange={handleProfilePicSelect} />
            </label>
          </div>
        </div>

        <div>
          <p><strong>Student ID: </strong>{profile.studentId || "N/A"}</p>
          <p><strong>Join Date: </strong>{profile.joinDate || "N/A"}</p>
          <p><strong>Email: </strong>{authEmail}</p>
        </div>
      </section>

      {/* FORM */}
      <form onSubmit={handleSaveProfile}>

        {/* PERSONAL INFORMATION */}
        <section className="card">
          <h3>Personal Information</h3>
          <div className="grid-2">
            <div className="form-group">
              <label>Full Name</label>
              <input name="fullName" value={profile.fullName} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input name="phone" value={profile.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={profile.gender} onChange={handleChange}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Birth</label>
              <input type="date" name="dob" value={profile.dob} onChange={handleChange} />
            </div>

            <div className="form-group form-full">
              <label>Address</label>
              <input name="address" value={profile.address} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>City</label>
              <input name="city" value={profile.city} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>State</label>
              <input name="state" value={profile.state} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Pincode</label>
              <input name="pincode" value={profile.pincode} onChange={handleChange} />
            </div>
          </div>
        </section>

        {/* COURSE & PROGRESS */}
        <section className="card">
          <h3>Course & Progress</h3>

          <div className="grid-2">
            <div className="form-group">
              <label>Course Name</label>
              <input name="courseName" value={profile.courseName} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Batch Name</label>
              <input name="batch" value={profile.batch} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Batch Time</label>
              <input name="batchTime" value={profile.batchTime} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Join Date</label>
              <input type="date" name="joinDate" value={profile.joinDate} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Course Progress (%)</label>
              <input
                type="number"
                name="courseProgress"
                min="0"
                max="100"
                value={profile.courseProgress}
                onChange={handleNumberChange}
              />
            </div>
          </div>

          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${profile.courseProgress}%` }}
            />
          </div>
        </section>

        {/* ATTENDANCE */}
        <section className="card">
          <h3>Attendance</h3>

          <div className="grid-3">
            <div className="stat">
              <label>Total Classes</label>
              <input
                name="totalClasses"
                type="number"
                value={profile.totalClasses}
                onChange={handleNumberChange}
              />
            </div>

            <div className="stat">
              <label>Attended</label>
              <input
                name="attendedClasses"
                type="number"
                value={profile.attendedClasses}
                onChange={handleNumberChange}
              />
            </div>

            <div className="stat">
              <label>Attendance</label>
              <p>{attendancePercent}%</p>
            </div>
          </div>
        </section>

        {/* CERTIFICATE */}
        <section className="card">
          <h3>Certificate</h3>

          <p>
            Status:{" "}
            {profile.certificateEligible ? "Eligible" : "Not Eligible"}
          </p>

          <label>
            <input
              type="checkbox"
              checked={profile.certificateEligible}
              onChange={(e) =>
                setProfile({ ...profile, certificateEligible: e.target.checked })
              }
            />{" "}
            Mark Eligible
          </label>

          <div className="form-group">
            <label>Certificate URL</label>
            <input
              name="certificateUrl"
              value={profile.certificateUrl}
              onChange={handleChange}
            />
          </div>

          {profile.certificateEligible && profile.certificateUrl && (
            <a href={profile.certificateUrl} target="_blank" className="btn-primary">
              Download Certificate
            </a>
          )}
        </section>

        {/* PAYMENT */}
        <section className="card">
          <h3>Payments</h3>

          <div className="grid-3">
            <div className="stat">
              <label>Total Fee</label>
              <input
                type="number"
                name="totalFee"
                value={profile.totalFee}
                onChange={handleNumberChange}
              />
            </div>

            <div className="stat">
              <label>Paid Amount</label>
              <input
                type="number"
                name="paidAmount"
                value={profile.paidAmount}
                onChange={handleNumberChange}
              />
            </div>

            <div className="stat">
              <label>Pending</label>
              <p>₹{pendingAmount}</p>
            </div>
          </div>

          <label>Last Payment Date</label>
          <input
            type="date"
            name="lastPaymentDate"
            value={profile.lastPaymentDate}
            onChange={handleChange}
          />
        </section>

        {/* PASSWORD */}
        <section className="card">
          <h3>Security</h3>

          <input
            type="password"
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button type="button" className="btn-primary" onClick={handleChangePassword}>
            Change Password
          </button>
        </section>

        <div className="profile-save-bar">
          <button type="submit" className="btn-primary">
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
