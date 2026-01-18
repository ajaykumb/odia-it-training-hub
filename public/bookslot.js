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

  document.body.innerHTML = "";
  document.body.style.background =
    "linear-gradient(135deg,#1f3c88,#4f6df5)";
  document.body.style.minHeight = "100vh";
  document.body.style.fontFamily = "Arial";

  const container = document.createElement("div");
  container.style.maxWidth = "520px";
  container.style.margin = "40px auto";
  container.style.background = "#fff";
  container.style.padding = "30px";
  container.style.borderRadius = "12px";

  container.innerHTML = `
    <h2 style="text-align:center;color:#1f3c88">Book Interview Slot</h2>

    <div style="background:#f5f7ff;padding:15px;border-radius:8px;margin:20px 0">
      <strong>${candidate.name}</strong><br/>
      ${candidate.email}
    </div>

    <label>Select Date</label>
    <input type="date" id="date" style="width:100%;padding:10px"/>

    <div id="slots" style="margin-top:15px;display:grid;grid-template-columns:repeat(2,1fr);gap:10px"></div>

    <button id="submitBtn" disabled style="margin-top:20px;width:100%;padding:12px;background:#ccc;color:#fff;border:none;border-radius:6px">
      Confirm Slot
    </button>
  `;

  document.body.appendChild(container);

  const dateInput = document.getElementById("date");
  const slotsDiv = document.getElementById("slots");
  const submitBtn = document.getElementById("submitBtn");

  dateInput.onchange = async (e) => {
    selectedDate = e.target.value;
    selectedTime = "";
    submitBtn.disabled = true;
    submitBtn.style.background = "#ccc";
    await loadSlots();
  };

  async function loadSlots() {
    slotsDiv.innerHTML = "Loading...";

    const bookedSlots =
      await window.firebaseGetBookedSlots(selectedDate);

    slotsDiv.innerHTML = "";

    TIME_SLOTS.forEach((time) => {
      const btn = document.createElement("button");
      btn.innerText = time;
      btn.style.padding = "10px";
      btn.style.borderRadius = "6px";

      if (bookedSlots.includes(time)) {
        btn.disabled = true;
        btn.innerText += " (Booked)";
        btn.style.background = "#eee";
        btn.style.cursor = "not-allowed";
      } else {
        btn.style.background = "#fff";
        btn.onclick = () => selectSlot(btn, time);
      }

      slotsDiv.appendChild(btn);
    });
  }

  function selectSlot(btn, time) {
    selectedTime = time;

    document.querySelectorAll("#slots button").forEach((b) => {
      b.style.background = "#fff";
    });

    btn.style.background = "#1f3c88";
    btn.style.color = "#fff";

    submitBtn.disabled = false;
    submitBtn.style.background = "#1f3c88";
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
      <p style="text-align:center">${selectedDate} · ${selectedTime}</p>
      <p style="text-align:center;font-size:13px">📧 Confirmation email sent</p>
    `;
  };
})();
