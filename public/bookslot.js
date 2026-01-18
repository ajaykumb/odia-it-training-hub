(function waitForFirebase() {
  if (
    typeof window.firebaseGetBookedSlots !== "function" ||
    typeof window.firebaseAddBooking !== "function"
  ) {
    setTimeout(waitForFirebase, 50);
    return;
  }

  /* ================= SAFE START ================= */
  const candidateRaw = localStorage.getItem("candidateData");
  const candidateId = localStorage.getItem("candidateId");

  if (!candidateRaw || !candidateId) {
    window.location.href = "/interviewregister";
    return;
  }

  const candidate = JSON.parse(candidateRaw);

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
  document.body.style.margin = "0";
  document.body.style.minHeight = "100vh";
  document.body.style.fontFamily = "Arial, sans-serif";
  document.body.style.background =
    "linear-gradient(135deg,#1f3c88,#4f6df5)";

  /* ================= WRAPPER ================= */
  const wrapper = document.createElement("div");
  wrapper.style.minHeight = "100vh";
  wrapper.style.display = "flex";
  wrapper.style.alignItems = "center";
  wrapper.style.justifyContent = "center";
  wrapper.style.padding = "24px";

  /* ================= CARD ================= */
  const container = document.createElement("div");
  container.style.maxWidth = "560px";
  container.style.width = "100%";
  container.style.background = "#ffffff";
  container.style.padding = "34px";
  container.style.borderRadius = "16px";
  container.style.boxShadow = "0 25px 60px rgba(0,0,0,0.3)";

  container.innerHTML = `
    <div style="text-align:center;margin-bottom:22px">
      <h2 style="color:#1f3c88;margin-bottom:6px">
        Book Interview Slot
      </h2>
      <p style="font-size:13px;color:#666">
        Step 2 of 2 · Choose your interview date & time
      </p>
    </div>

    <div style="
      background:#f5f7ff;
      padding:16px;
      border-radius:10px;
      margin-bottom:24px;
      font-size:14px">
      <strong>${candidate.name}</strong><br/>
      ${candidate.email}
    </div>

    <label style="font-weight:bold;font-size:14px">
      Select Interview Date
    </label>
    <input
      type="date"
      id="date"
      style="
        width:100%;
        padding:12px;
        margin-top:8px;
        border-radius:8px;
        border:1px solid #ccc;
        font-size:14px
      "
    />

    <div
      id="slots"
      style="
        margin-top:26px;
        display:grid;
        grid-template-columns:repeat(2,1fr);
        gap:12px
      "
    ></div>

    <button
      id="submitBtn"
      disabled
      style="
        margin-top:28px;
        width:100%;
        padding:14px;
        background:#ccc;
        color:#fff;
        border:none;
        border-radius:8px;
        font-size:16px;
        font-weight:bold;
        cursor:not-allowed
      "
    >
      Confirm Slot
    </button>

    <p style="
      margin-top:20px;
      font-size:12px;
      text-align:center;
      color:#777">
      🔒 Your information is safe. No spam. No sharing.
    </p>
  `;

  wrapper.appendChild(container);
  document.body.appendChild(wrapper);

  const dateInput = document.getElementById("date");
  const slotsDiv = document.getElementById("slots");
  const submitBtn = document.getElementById("submitBtn");

  /* ================= DATE CHANGE ================= */
  dateInput.onchange = async (e) => {
    selectedDate = e.target.value;
    selectedTime = "";

    submitBtn.disabled = true;
    submitBtn.style.background = "#ccc";
    submitBtn.style.cursor = "not-allowed";

    await loadSlots();
  };

  /* ================= LOAD SLOTS ================= */
  async function loadSlots() {
    slotsDiv.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;color:#666">
        ⏳ Loading available slots...
      </div>
    `;

    const bookedSlots =
      await window.firebaseGetBookedSlots(selectedDate);

    slotsDiv.innerHTML = "";

    TIME_SLOTS.forEach((time) => {
      const btn = document.createElement("button");
      btn.innerText = time;
      btn.style.padding = "12px";
      btn.style.borderRadius = "8px";
      btn.style.border = "1px solid #1f3c88";
      btn.style.fontSize = "14px";
      btn.style.transition = "all 0.2s ease";

      if (bookedSlots.includes(time)) {
        btn.disabled = true;
        btn.innerText += " (Booked)";
        btn.style.background = "#eee";
        btn.style.color = "#999";
        btn.style.cursor = "not-allowed";
      } else {
        btn.style.background = "#fff";
        btn.style.color = "#1f3c88";
        btn.style.cursor = "pointer";
        btn.onclick = () => selectSlot(btn, time);
      }

      slotsDiv.appendChild(btn);
    });
  }

  /* ================= SELECT SLOT ================= */
  function selectSlot(btn, time) {
    selectedTime = time;

    document.querySelectorAll("#slots button").forEach((b) => {
      b.style.background = "#fff";
      b.style.color = "#1f3c88";
    });

    btn.style.background = "#1f3c88";
    btn.style.color = "#fff";

    submitBtn.disabled = false;
    submitBtn.style.background = "#1f3c88";
    submitBtn.style.cursor = "pointer";
  }

  /* ================= CONFIRM ================= */
  submitBtn.onclick = async () => {
    if (!selectedDate || !selectedTime) return;

    const latest =
      await window.firebaseGetBookedSlots(selectedDate);

    if (latest.includes(selectedTime)) {
      alert("❌ Slot already booked. Choose another.");
      await loadSlots();
      return;
    }

    await window.firebaseAddBooking({
      candidateId,
      ...candidate,
      date: selectedDate,
      timeSlot: selectedTime,
    });

    container.innerHTML = `
      <div style="text-align:center">
        <h2 style="color:#1f3c88">✅ Slot Confirmed</h2>

        <div style="
          background:#f5f7ff;
          padding:18px;
          border-radius:10px;
          margin:22px 0;
          font-size:15px">
          <strong>${selectedDate}</strong><br/>
          ${selectedTime}
        </div>

        <p style="font-size:13px;color:#555">
          📧 Confirmation email has been sent.<br/>
          Please be available on time.
        </p>
      </div>
    `;
  };
})();
