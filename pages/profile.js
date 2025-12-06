import { useEffect, useState } from "react";
import { auth, db, storage } from "../utils/firebaseConfig";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
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

  const [profile, setProfile] = useState({
    fullName: "",
    phone: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    courseName: "",
    batchName: "",
    batchTime: "",
    studentId: "",
    joinDate: "",
    totalClasses: 0,
    attendedClasses: 0,
    courseProgress: 0,
    totalFee: 0,
    paidAmount: 0,
    lastPaymentDate: "",
    certificateEligible: false,
    certificateUrl: "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ------------------ LOAD DATA ------------------ //
  useEffect(() => {
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      setUid(user.uid);
      setAuthEmail(user.email || "");

      try {
        const refDoc = doc(db, "students", user.uid);
        const snap = await getDoc(refDoc);

        if (snap.exists()) {
          setProfile((prev) => ({ ...prev, ...snap.data() }));
        } else {
          await setDoc(refDoc, {
            ...profile,
            email: user.email || "",
          });
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsub();
  }, []);

  // derived values
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

  // ------------------ HANDLERS ------------------ //

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  const handleProfilePicSelect = (e) => {
    if (e.target.files?.[0]) {
      setProfilePicFile(e.target.files[0]);
    }
  };

  const uploadProfilePic = async () => {
    if (!profilePicFile || !uid) return null;

    const storageRef = ref(
      storage,
      `profilePictures/${uid}/${profilePicFile.name}`
    );

    await uploadBytes(storageRef, profilePicFile);
    const url = await getDownloadURL(storageRef);
    return url;
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!uid) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      let photoURL = profile.photoURL || "";

      if (profilePicFile) {
        photoURL = await uploadProfilePic();
      }

      const dataToSave = {
        ...profile,
        attendancePercent,
        pendingAmount,
        photoURL,
        email: authEmail,
      };

      const refDoc = doc(db, "students", uid);
      await updateDoc(refDoc, dataToSave);

      setProfile((prev) => ({ ...prev, photoURL }));
      setMessage("Profile updated successfully.");
      setProfilePicFile(null);
    } catch (err) {
      console.error(err);
      setError("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (!auth.currentUser) {
        setError("No user logged in.");
        return;
      }

      if (!oldPassword || !newPassword) {
        setError("Please fill all password fields.");
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("New password and confirm password do not match.");
        return;
      }

      const credential = EmailAuthProvider.credential(
        authEmail,
        oldPassword
      );

      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);

      setMessage("Password changed successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setError("Failed to change password. Check old password.");
    }
  };

  if (loading) {
    return <div className="profile-page">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      {(message || error) && (
        <div className="profile-alerts">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-error">{error}</div>}
        </div>
      )}

      {/* ---------------- PROFILE HEADER ---------------- */}
      <section className="card profile-header">
        <div className="profile-header-left">
          <div className="profile-avatar-wrapper">
            <img
              src={
                profile.photoURL ||
                "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(profile.fullName || "Student")
              }
              className="profile-avatar"
              alt="Profile"
            />
            <label className="btn-secondary small">
              Change Photo
              <input type="file" hidden accept="image/*" onChange={handleProfilePicSelect} />
            </label>
          </div>

          <div>
            <h2 className="profile-name">{profile.fullName || "Student Name"}</h2>
            <p className="profile-course">{profile.courseName || "Course not set"}</p>
            <p className="profile-batch">
              {profile.batchName && profile.batchTime
                ? `${profile.batchName} • ${profile.batchTime}`
                : "Batch not set"}
            </p>
          </div>
        </div>

        <div className="profile-header-right">
          <p><strong>Student ID:</strong> {profile.studentId || "N/A"}</p>
          <p><strong>Join Date:</strong> {profile.joinDate || "N/A"}</p>
          <p><strong>Email:</strong> {authEmail}</p>
        </div>
      </section>

      {/* ---------------- FORM SECTIONS ---------------- */}
      <form onSubmit={handleSaveProfile}>
        <div className="profile-grid">

          {/* 1. PERSONAL INFO */}
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

          {/* 2. COURSE & PROGRESS */}
          <section className="card">
            <h3>Course & Progress</h3>

            <div className="grid-2">
              <div className="form-group">
                <label>Course Name</label>
                <input name="courseName" value={profile.courseName} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Batch Name</label>
                <input name="batchName" value={profile.batchName} onChange={handleChange} />
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
                  value={profile.courseProgress}
                  onChange={handleNumberChange}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${profile.courseProgress}%` }} />
            </div>
          </section>

          {/* 3. ATTENDANCE */}
          <section className="card">
            <h3>Attendance</h3>

            <div className="grid-3">
              <div className="stat">
                <label>Total Classes</label>
                <input name="totalClasses" type="number" value={profile.totalClasses} onChange={handleNumberChange} />
              </div>

              <div className="stat">
                <label>Attended</label>
                <input name="attendedClasses" type="number" value={profile.attendedClasses} onChange={handleNumberChange} />
              </div>

              <div className="stat">
                <label>Attendance %</label>
                <p>{attendancePercent}%</p>
              </div>
            </div>
          </section>

          {/* 4. CERTIFICATE */}
          <section className="card">
            <h3>Certificate</h3>

            <p>
              Status:{" "}
              <strong>
                {profile.certificateEligible ? "Eligible" : "Not eligible"}
              </strong>
            </p>

            <div className="form-group">
              <label>Certificate URL</label>
              <input name="certificateUrl" value={profile.certificateUrl} onChange={handleChange} />
            </div>

            <label>
              <input
                type="checkbox"
                checked={profile.certificateEligible}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    certificateEligible: e.target.checked,
                  }))
                }
              />{" "}
              Mark as eligible
            </label>

            {profile.certificateEligible && profile.certificateUrl && (
              <a href={profile.certificateUrl} target="_blank" className="btn-primary">
                Download Certificate
              </a>
            )}
          </section>

          {/* 5. PAYMENT */}
          <section className="card">
            <h3>Payment Details</h3>

            <div className="grid-3">
              <div className="stat">
                <label>Total Fee</label>
                <input name="totalFee" type="number" value={profile.totalFee} onChange={handleNumberChange} />
              </div>

              <div className="stat">
                <label>Paid Amount</label>
                <input name="paidAmount" type="number" value={profile.paidAmount} onChange={handleNumberChange} />
              </div>

              <div className="stat">
                <label>Pending</label>
                <p>₹{pendingAmount}</p>
              </div>
            </div>

            <label>Last Payment Date</label>
            <input type="date" name="lastPaymentDate" value={profile.lastPaymentDate} onChange={handleChange} />
          </section>

          {/* 6. SUPPORT */}
          <section className="card">
            <h3>Support</h3>

            <button type="button" className="btn-primary">
              Chat Support
            </button>

            <button type="button" className="btn-secondary">
              Raise Ticket
            </button>

            <button type="button" className="btn-secondary">
              Contact Admin
            </button>
          </section>

          {/* SECURITY SETTINGS */}
          <section className="card">
            <h3>Security Settings</h3>

            <form onSubmit={handleChangePassword}>
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

              <button type="submit" className="btn-primary">
                Change Password
              </button>
            </form>
          </section>
        </div>

        {/* SAVE BUTTON */}
        <button type="submit" className="btn-primary save-btn" disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
}
