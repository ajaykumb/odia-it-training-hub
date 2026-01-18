(function () {
  try {
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
    container.style.boxShadow =
      "0 20px 50px rgba(0,0,0,0.25)";

    container.innerHTML = `
      <h2 style="text-align:center;color:#1f3c88">Book Interview Slot</h2>

      <div style="background:#f5f7ff;padding:15px;border-radius:8px;margin:20px 0;font-size:14px">
        <strong>${candidate.name}</strong><br/>
        ${candidate.email}
      </div>

      <label>Select Date</label>
      <input type="date" id="date"
        style="width:100%;padding:10px;margin:8px 0;border-radius:6px"/>

      <div id="slots"
        style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:15px"></div>

      <button id="submitBtn" disabled
        style="width:100%;margin-top:20px;padding:12px;border:none;border-radius:6px;background:#ccc;color:#fff">
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

      let bookedSlots = [];
      try {
        const res = await fetch(
          `/api/getBookedSlots?date=${selectedDate}`
        );
        const data = await res.json();
        bookedSlots = data.bookedSlots || [];
      } catch {
        bookedSlots = [];
      }

      slotsDiv.innerHTML = "";

      TIME_SLOTS.forEach((time) => {
        const btn = document.createElement("button");
        btn.innerText = time;
        btn.style.padding = "10px";
        btn.style.borderRadius = "6px";
        btn.style.border = "1px solid #1f3c88";

        if (bookedSlots.includes(time)) {
          btn.disabled = true;
          btn.innerText += " (Booked)";
          btn.style.background = "#eee";
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
    }

    submitBtn.onclick = async () => {
      if (!selectedDate || !selectedTime) return;

      // last re-check
      const res = await fetch(
        `/api/getBookedSlots?date=${selectedDate}`
      );
      const data = await res.json();
      if ((data.bookedSlots || []).includes(selectedTime)) {
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
  } catch (err) {
    console.error("❌ bookslot.js fatal error:", err);
    document.body.innerHTML =
      "<h3 style='color:white;text-align:center;margin-top:40px'>Something went wrong. Please refresh.</h3>";
  }
})();
