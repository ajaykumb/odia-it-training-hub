import {
  doc,
  runTransaction,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { candidateId, candidate, date, timeSlot } = req.body;

  if (!candidateId || !candidate || !date || !timeSlot) {
    return res.status(400).json({ error: "Missing data" });
  }

  const lockId = `${date}__${timeSlot}`;
  const lockRef = doc(db, "slotLocks", lockId);

  try {
    await runTransaction(db, async (tx) => {
      const lockSnap = await tx.get(lockRef);

      // ❌ Slot already booked
      if (lockSnap.exists()) {
        throw new Error("SLOT_BOOKED");
      }

      // 🔒 Create lock
      tx.set(lockRef, {
        date,
        timeSlot,
        bookedBy: candidateId,
        createdAt: serverTimestamp(),
      });

      // ✅ Save booking
      const bookingRef = doc(collection(db, "bookings"));
      tx.set(bookingRef, {
        candidateId,
        ...candidate,
        date,
        timeSlot,
        createdAt: serverTimestamp(),
      });
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    if (err.message === "SLOT_BOOKED") {
      return res.status(409).json({ error: "Slot already booked" });
    }

    console.error(err);
    return res.status(500).json({ error: "Booking failed" });
  }
}
