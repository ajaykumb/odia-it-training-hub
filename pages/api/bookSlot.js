import { adminDb } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  // 🔒 Disable caching
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { candidateId, candidate, date, timeSlot } = req.body;

  if (!candidateId || !candidate || !date || !timeSlot) {
    return res.status(400).json({ error: "Missing data" });
  }

  const lockId = `${date}__${timeSlot}`;
  const lockRef = adminDb.collection("slotLocks").doc(lockId);
  const bookingRef = adminDb.collection("bookings").doc();

  try {
    await adminDb.runTransaction(async (tx) => {
      const lockSnap = await tx.get(lockRef);

      // ❌ Slot already booked
      if (lockSnap.exists) {
        throw new Error("SLOT_BOOKED");
      }

      // 🔒 Create slot lock
      tx.set(lockRef, {
        date,
        timeSlot,
        bookedBy: candidateId,
        createdAt: new Date(),
      });

      // ✅ Save booking
      tx.set(bookingRef, {
        candidateId,
        ...candidate,
        date,
        timeSlot,
        createdAt: new Date(),
      });
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    if (err.message === "SLOT_BOOKED") {
      return res.status(409).json({ error: "Slot already booked" });
    }

    console.error("BOOK SLOT ERROR:", err);
    return res.status(500).json({ error: "Booking failed" });
  }
}
