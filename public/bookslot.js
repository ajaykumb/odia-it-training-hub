(function waitForFirebase() {
  if (
    typeof window.firebaseGetBookedSlots !== "function" ||
    typeof window.firebaseAddBooking !== "function"
  ) {
    setTimeout(waitForFirebase, 50);
    return;
  }

  /* ================= DATA ================= */
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

  /* ================= BODY RESET ================= */
  document.body.style.margin = "0";
  document.body.style.minHeight = "100vh";
  document.body.style.fontFamily = "Arial, sans-serif";
  document.body.style.background =
    "linear-gradient(135deg,#1f3c88,#4f6df5)";
  document.body.style.display = "flex";
  document.body.style.flexDirection = "column";

  /* ================= RUNNING TOP BANNER ================= */
  const banner = document.createElement("div");
  banner.style.background = "linear-gradient(90deg,#0f2a66,#1f3c88)";
  banner.style.color = "#fff";
  banner.style.padding = "10px 0";
  banner.style.overflow = "hidden";
  banner.style.whiteSpace = "nowrap";
  banner.style.fontSize = "14px";
  banner.style.fontWeight = "500";

  banner.innerHTML = `
    <div style="
      display:inline-block;
      padding-left:100%;
      animation: scrollBanner 18s linear infinite;
    ">
      📢 Limited interview slots available. Book early to avoid missing your opportunity.
    </div>
  `;

  document.body.appendChild(banner);

  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes scrollBanner {
      0% { transform: translateX(0); }
      100% { transform: translateX(-100%); }
    }
  `;
  document.head.appendChild(style);

  /* ================= MAIN WRAPPER ================= */
  const page = document.createElement("div");
  page.style.flex = "1";
  page.style.display = "flex";
  page.style.alignItems = "center";
  page.style.justifyContent = "center";
  page.style.padding = "40px 16px";

  document.body.appendChild(page);

  /* ================= CARD ================= */
  const container = document.createElement("div");
  container.style.width = "100%";
  container.style.maxWidth = "520px";
  container.style.background = "#fff";
  container.style.padding = "32px";
  container.style.borderRadius = "14px";
  container.style.boxShadow = "0 20px 50px rgba(0,0,0,0.25)";

  container.innerHTML = `
    <h2 style="text-align:center;color:#1f3c88;margin-bottom:6px">
      Book Interview Slot
    </h2>
    <p style="text-align:center;color:#666;font-size:14px">
      Step 2 of 2 · Choose your interview date & time
    </p>

    <div style="background:#f5f7ff;padding:14px;border-radius:8px;margin:20px 0">
      <strong>${candidate.name}</strong><br/>
      <span style="font-size:13px">${candidate.email}</span>
    </div>

    <label style="font-weight:bold">Select Interview Date</label>
    <input type="date" id="date"
      style="width:100%;padding:12px;margin-top:6px;border-radius:8px;border:1px solid #ccc"/>

    <div id="slots"
      style="margin-top:18px;display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
    </div>

    <button id="submitBtn" disabled
      style="
        margin-top:22px;
        width:100%;
        padding:14px;
        background:#ccc;
        color:#fff;
        border:none;
        border-radius:8px;
        font-size:15px;
        cursor:not-allowed">
      Confirm Slot
    </button>

    <p style="text-align:center;margin-top:12px;font-size:12px;color:#777">
      🔒 Your information is safe. No spam. No sharing.
    </p>
  `;

  page.appendChild(container);

  /* ================= ELEMENTS ================= */
  const dateInput = container.querySelector("#date");
  const slotsDiv = container.querySelector("#slots");
  const submitBtn = container.querySelector("#submitBtn");

  /* ================= EVENTS ================= */
  dateInput.onchange = async (e) => {
    selectedDate = e.target.value;
    selectedTime = "";

    submitBtn.disabled = true;
    submitBtn.style.background = "#ccc";
    submitBtn.style.cursor = "not-allowed";

    slotsDiv.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;color:#666">
        ⏳ Loading available slots...
      </div>
    `;

    await loadSlots();
  };

  async function loadSlots() {
    const bookedSlots =
      await window.firebaseGetBookedSlots(selectedDate);

    slotsDiv.innerHTML = "";

    TIME_SLOTS.forEach((time) => {
      const btn = document.createElement("button");
      btn.innerText = time;
      btn.style.padding = "12px";
      btn.style.borderRadius = "8px";
      btn.style.border = "1px solid #1f3c88";
      btn.style.background = "#fff";
      btn.style.cursor = "pointer";

      if (bookedSlots.includes(time)) {
        btn.disabled = true;
        btn.innerText += " (Booked)";
        btn.style.background = "#eee";
        btn.style.color = "#999";
        btn.style.cursor = "not-allowed";
      } else {
        btn.onclick = () => selectSlot(btn, time);
      }

      slotsDiv.appendChild(btn);
    });
  }

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
      <h2 style="text-align:center;color:#1f3c88">✅ Slot Confirmed</h2>
      <div style="background:#f5f7ff;padding:15px;border-radius:8px;margin:20px 0;text-align:center">
        <strong>${selectedDate}</strong><br/>
        ${selectedTime}
      </div>
      <p style="text-align:center;font-size:13px">
        📧 Confirmation email sent
      </p>
    `;
  };
})();
