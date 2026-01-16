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

    /* ========== PAGE STYLES ========== */
    document.body.style.background =
      "linear-gradient(135deg,#1f3c88,#4f6df5)";
    document.body.style.minHeight = "100vh";
    document.body.style.margin = "0";
    document.body.style.fontFamily = "Arial";

    const container = document.createElement("div");
    container.style.maxWidth = "520px";
    container.style.margin = "40px auto";
    container.style.background = "#fff";
    container.style.padding = "30px";
    container.style.borderRadius = "12px";
    container.style.boxShadow =
      "0 20px 50px rgba(0,0,0,0.25)";

    container.innerHTML = `
      <h2 style="color:#1f3c88;text-align:center">
        Book Interview Slot
      </h2>

      <p style="text-align:center;color:#555;font-size:14px">
        Step 2 of 2 · Select your preferred date & time
      </p>

      <!-- Candidate Summary -->
      <div style="
        background:#f5f7ff;
        padding:15px;
        border-radius:8px;
        margin:20px 0;
        font-size:14px">
        <strong>Candidate Details</strong><br/>
        👤 ${candidate.name}<br/>
        📧 ${candidate.email}<br/>
        📱 ${candidate.phone}
      </div>

      <!-- Date Picker -->
      <label style="font-size:14px;font-weight:bold">
        Select Interview Date
      </label>
      <input
        type="date"
        id="date"
        style="
          width:100%;
          padding:10px;
          margin:8px 0 15px;
          border-radius:6px;
          border:1px solid #ccc"
      />

      <!-- Slots -->
      <div
        id="slots"
        style="
          display:grid;
          grid-template-columns:repeat(2,1fr);
          gap:10px"
      ></div>

      <!-- Info -->
      <div style="
        margin-top:20px;
        background:#f1f5ff;
        padding:12px;
        border-radius:8px;
        font-size:13px">
        ✔ Instant email confirmation<br/>
        ✔ Expert interview support & representation<br/>
        ✔ Professional & confidential process
      </div>
    `;

    document.body.appendChild(container);

    document
      .getElementById("date")
      .addEventListener("change", loadSlots);

    function loadSlots(e) {
      const date = e.target.value;
      const slotsDiv = document.getElementById("slots");
      slotsDiv.innerHTML = "";

      TIME_SLOTS.forEach((time) => {
        const slot = document.createElement("button");
        slot.innerText = time;
        slot.style.padding = "10px";
        slot.style.borderRadius = "6px";
        slot.style.border = "1px solid #1f3c88";
        slot.style.background = "#fff";
        slot.style.color = "#1f3c88";
        slot.style.cursor = "pointer";
        slot.style.fontSize = "13px";

        slot.onmouseenter = () => {
          slot.style.background = "#1f3c88";
          slot.style.color = "#fff";
        };
        slot.onmouseleave = () => {
          slot.style.background = "#fff";
          slot.style.color = "#1f3c88";
        };

        slot.onclick = () => bookSlot(date, time);
        slotsDiv.appendChild(slot);
      });
    }

    async function bookSlot(date, time) {
      if (!date) {
        alert("Please select a date first");
        return;
      }

      await window.firebaseAddBooking({
        candidateId,
        ...candidate,
        date,
        timeSlot: time,
      });

      container.innerHTML = `
        <h2 style="color:#1f3c88;text-align:center">
          ✅ Slot Confirmed
        </h2>
        <p style="text-align:center">
          Your interview slot has been successfully booked.
        </p>

        <div style="
          background:#f5f7ff;
          padding:15px;
          border-radius:8px;
          margin-top:20px;
          font-size:14px">
          <strong>Date:</strong> ${date}<br/>
          <strong>Time:</strong> ${time}
        </div>

        <p style="text-align:center;margin-top:20px;font-size:13px">
          📧 Confirmation email has been sent.<br/>
          Please be available on time.
        </p>
      `;
    }
  })();
}
