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
    container.style.maxWidth = "400px";
    container.style.margin = "40px auto";

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
        const slot = document.createElement("div");
        slot.style.padding = "8px";
        slot.style.margin = "6px 0";
        slot.style.cursor = "pointer";
        slot.style.background = "#e3f2fd";
        slot.innerText = time;

        // TODO: optional Firestore check to disable booked slots

        slot.onclick = () => bookSlot(date, time);
        slotsDiv.appendChild(slot);
      }
    }

    async function bookSlot(date, time) {
      // Save booking
      await window.firebaseAddBooking({
        candidateId,
        ...candidate,
        date,
        timeSlot: time,
      });

      // Send emails
      await window.sendTeacherMail({
        ...candidate,
        date,
        time,
      });

      await window.sendStudentMail({
        ...candidate,
        date,
        time,
      });

      alert("✅ Slot booked successfully. Confirmation email sent.");
    }
  })();
}
