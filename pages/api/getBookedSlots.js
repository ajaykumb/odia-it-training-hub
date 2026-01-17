import { adminDb } from "../../utils/firebaseAdmin";

export default async function handler(req, res) {
  // 🔒 DISABLE CACHING COMPLETELY
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");

  const { date } = req.query;

  if (!date) {
    return res.status(400).json({ bookedSlots: [] });
  }

  try {
    const snap = await adminDb
      .collection("slotLocks")
      .where("date", "==", date)
      .get();

    const bookedSlots = snap.docs.map(
      (doc) => doc.data().timeSlot
    );

    return res.status(200).json({ bookedSlots });
  } catch (err) {
    console.error("GET BOOKED SLOTS ERROR:", err);
    return res.status(500).json({ bookedSlots: [] });
  }
}
