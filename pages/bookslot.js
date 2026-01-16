// bookslot.js
if (typeof window !== "undefined") {
  (function () {
    // ====== STYLE ======
    const style = document.createElement("style");
    style.innerHTML = `
      .bs-container {
        width: 360px;
        margin: 40px auto;
        padding: 25px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        font-family: Arial;
      }
      .bs-container h2 {
        text-align: center;
        margin-bottom: 15px;
      }
      .bs-container input {
        width: 100%;
        padding: 8px;
        margin-bottom: 15px;
      }
      .bs-slot {
        background: #e3f2fd;
        padding: 10px;
        margin-bottom: 8px;
        border-radius: 6px;
        text-align: center;
        cursor: pointer;
      }
      .bs-slot:hover {
        background: #90caf9;
      }
      .bs-booked {
        background: #ffcdd2;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);

    // ====== ROOT ======
    const root =
      document.getElementById("root") ||
      document.body;

    const container = document.createElement("div");
    container.className = "bs-container";
    container.innerHTML = `
      <h2>📅 Interview Slot Booking</h2>
      <label>Select Date</label>
      <input type="date" id="bs-date" />
      <div id="bs-slots"></div>
    `;

    root.appendChild(container);

    // ====== LOGIC ======
    const TIME_SLOTS = [
      "10:00 AM - 10:30 AM",
      "10:30 AM - 11:00 AM",
      "11:00 AM - 11:30 AM",
      "02:00 PM - 02:30 PM",
      "02:30 PM - 03:00 PM",
    ];

    const dateInput = document.getElementById("bs-date");
    const slotsDiv = document.getElementById("bs-slots");

    let bookings = {};

    dateInput.addEventListener("change", () => {
      renderSlots(dateInput.value);
    });

    function renderSlots(date) {
      slotsDiv.innerHTML = "";

      TIME_SLOTS.forEach((time) => {
        const slot = document.createElement("div");
        slot.className = "bs-slot";
        slot.innerText = time;

        if (bookings[date]?.includes(time)) {
          slot.classList.add("bs-booked");
          slot.innerText += " (Booked)";
        } else {
          slot.onclick = () => bookSlot(date, time);
        }

        slotsDiv.appendChild(slot);
      });
    }

    function bookSlot(date, time) {
      if (!date) {
        alert("Please select a date first");
        return;
      }

      if (
        confirm(`Confirm interview slot?\n\nDate: ${date}\nTime: ${time}`)
      ) {
        if (!bookings[date]) bookings[date] = [];
        bookings[date].push(time);
        alert("✅ Slot booked successfully");
        renderSlots(date);
      }
    }
  })();
}
