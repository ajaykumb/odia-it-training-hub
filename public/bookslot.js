import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../src/firebase";
import { sendTeacherMail, sendStudentMail } from "../src/email";

if (typeof window !== "undefined") {
  (function () {
    const candidate =
      JSON.parse(localStorage.getItem("candidateData"));
    const candidateId =
      localStorage.getItem("candidateId");

    if (!candidate || !candidateId) {
      window.location.href = "/interviewregister";
      return;
    }

    const TIME_SLOTS = [
      "10:00 AM - 10:30 AM",
      "10:30 AM - 11:00 AM",
      "11:00 AM - 11:30 AM",
      "02:00 PM - 02:30 PM",
      "02:30 PM - 03:00 PM",
    ];

    const container = document.createElement("div");
    container.innerHTML = `
      <h2>Book Interview Slot</h2>
      <input type="date" id="date"/>
      <div id="slots"></div>
    `;
    document.body.appendChild(container);

    document
      .getElementById("date")
      .addEventListener("change", loadSlots);

    async function loadSlots(e) {
      const date = e.target.value;
      const slotsDiv = document.getElementById("slots");
      slotsDiv.innerHTML = "";

      for (const time of TIME_SLOTS) {
        const q = query(
          collection(db, "bookings"),
          where("date", "==", date),
          where("timeSlot", "==", time)
        );

        const snap = await getDocs(q);
        const div = document.createElement("div");
        div.innerText = time;

        if (!snap.empty) {
          div.innerText += " (Booked)";
          div.style.background = "#ffcdd2";
        } else {
          div.onclick = () => bookSlot(date, time);
        }

        slotsDiv.appendChild(div);
      }
    }

    async function bookSlot(date, time) {
      await addDoc(collection(db, "bookings"), {
        candidateId,
        ...candidate,
        date,
        timeSlot: time,
        createdAt: serverTimestamp(),
      });

      await sendTeacherMail({
        ...candidate,
        date,
        time,
      });

      await sendStudentMail({
        ...candidate,
        date,
        time,
      });

      alert("✅ Slot booked successfully. Email sent.");
    }
  })();
}
