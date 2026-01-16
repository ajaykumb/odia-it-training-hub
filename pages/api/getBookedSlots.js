import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../utils/firebaseConfig";

export default async function handler(req, res) {
  const { date } = req.query;

  if (!date) return res.status(400).json({ bookedSlots: [] });

  const q = query(
    collection(db, "slotLocks"),
    where("date", "==", date)
  );

  const snap = await getDocs(q);
  const bookedSlots = snap.docs.map(
    (d) => d.data().timeSlot
  );

  res.status(200).json({ bookedSlots });
}
