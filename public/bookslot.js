if (typeof window !== "undefined") {
  (function () {
    const candidate = JSON.parse(localStorage.getItem("candidateData"));
    const candidateId = localStorage.getItem("candidateId");

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

    let selectedDate = "";
    let selectedTime = "";

    /* ================= PAGE BASE ================= */
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
      <h2 style="text-align:center;color:#1f3c88">
        Book Interview Slot
      </h2>
      <p style="text-align:center;font-size:14px;color:#555">
        Step 2 of 2 · Select Date & Time
      </p>

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

      <label><strong>Select Interview Date</strong></label>
      <input type="date" id="date"
        style="width:100%;padding:10px;margin:8px 0 15px;border-radius:6px;border:1px solid #ccc"/>

      <div id="slots"
        style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">
      </div>

      <button id="submitBtn"
        disabled
        style="
          width:100%;
          margin-top:20px;
          padding:12px;
          border:none;
          border-radius:6px;
          background:#ccc;
          color:#fff;
          font-size:15px;
          cursor:not-allowed">
        Confirm Slot
      </button>
    `;

    document.body.appendChild(container);

    document
      .getElementById("date")
      .addEventListener("change", async (e) => {
        selectedDate = e.target.value;
        selectedTime = "";
        document.getElementById("submitBtn").disabled = true;
        document.getElementById("submitBtn").style.background = "#ccc";
        document.getElementById("submitBtn").style.cursor = "not-allowed";

        await loadSlots(selectedDate);
      });

    /* ================= LOAD SLOTS (WITH FIRESTORE CHECK) ================= */
    async function loadSlots(date) {
      const slotsDiv = document.getElementById("slots");
      slotsDiv.innerHTML = "";

      const bookedSlots = await fetchBookedSlots(date);

      TIME_SLOTS.forEach((time) => {
        const slot = document.createElement("button");
        slot.innerText = time;
        slot.style.padding = "10px";
        slot.style.borderRadius = "6px";
        slot.style.border = "1px solid #1f3c88";
        slot.style.fontSize = "13px";

        if (bookedSlots.includes(time)) {
          // ❌ Already booked
          slot.disabled = true;
          slot.style.background = "#eee";
          slot.style.color = "#999";
          slot.style.cursor = "not-allowed";
          slot.innerText += " (Booked)";
        } else {
          // ✅ Available
          slot.style.background = "#fff";
          slot.style.color = "#1f3c88";
          slot.style.cursor = "pointer";

          slot.onclick = () => selectSlot(slot, time);
        }

        slotsDiv.appendChild(slot);
      });
    }

    function selectSlot(slot, time) {
      selectedTime = time;

      document
        .querySelectorAll("#slots button")
        .forEach((btn) => {
          btn.style.background = "#fff";
          btn.style.color = "#1f3c88";
        });

      slot.style.background = "#1f3c88";
      slot.style.color = "#fff";

      const submitBtn = document.getElementById("submitBtn");
      submitBtn.disabled = false;
      submitBtn.style.background = "#1f3c88";
      submitBtn.style.cursor = "pointer";
    }

    /* ================= CONFIRM BOOKING ================= */
    document
      .getElementById("submitBtn")
      .addEventListener("click", async () => {
        if (!selectedDate || !selectedTime) return;

try {
  await window.firebaseAddBooking({
    candidateId,
    candidate,
    date: selectedDate,
    timeSlot: selectedTime,
  });
  showSuccess();
} catch {
  alert("❌ Slot already booked. Please select another time.");
  await loadSlots(selectedDate);
}


        showSuccess();
      });

    /* ================= SUCCESS + RESCHEDULE ================= */
    function showSuccess() {
      container.innerHTML = `
        <h2 style="text-align:center;color:#1f3c88">
          ✅ Slot Confirmed
        </h2>

        <div style="
          background:#f5f7ff;
          padding:15px;
          border-radius:8px;
          margin:20px 0;
          font-size:14px">
          <strong>Date:</strong> ${selectedDate}<br/>
          <strong>Time:</strong> ${selectedTime}
        </div>

        <p style="text-align:center;font-size:13px">
          📧 Confirmation email sent.<br/>
          Please be available on time.
        </p>

        <button id="rescheduleBtn"
          style="
            width:100%;
            margin-top:15px;
            padding:10px;
            border-radius:6px;
            border:1px solid #1f3c88;
            background:#fff;
            color:#1f3c88;
            cursor:pointer">
          Reschedule Interview
        </button>
      `;

      document
        .getElementById("rescheduleBtn")
        .onclick = () => {
          document.body.innerHTML = "";
          location.reload(); // re-enable all logic
        };
    }

    /* ================= FIRESTORE QUERY ================= */
    async function fetchBookedSlots(date) {
      try {
        const res = await fetch(
          `/api/getBookedSlots?date=${date}`
        );
        const data = await res.json();
        return data.bookedSlots || [];
      } catch {
        return [];
      }
    }
  })();
}
