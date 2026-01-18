import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";

export default async function handler(req, res) {
  // ❗ Disable cache so UI is always fresh
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ bookedSlots: [] });
  }

  try {
    const q = query(
      collection(db, "bookings"),
      where("date", "==", date)
    );

    const snap = await getDocs(q);

    const bookedSlots = snap.docs.map(
      (doc) => doc.data().timeSlot
    );

    return res.status(200).json({ bookedSlots });
  } catch (err) {
    console.error("getBookedSlots error:", err);
    return res.status(500).json({ bookedSlots: [] });
  }
}
