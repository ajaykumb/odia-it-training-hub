import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const folders = [
{ id: "1GqgkVbMdi2rFdaPAqqtAWEq7Oe5hodZV", category: "SQL" },
{ id: "1Nxi5xpfGzmf_rWTibiCtunLjJDvaPw90", category: "Linux" },
{ id: "17suGKdJr8phfH0F5EHF1znRUdGfPnt5K", category: "PL/SQL" },
{ id: "1s_FpZdXhydo-zlUklhUW5Fpj1xm6kF1s", category: "Project" },
];

export default function Notifications() {
const router = useRouter();
const [notifications, setNotifications] = useState([]);
const API_KEY = "YOUR_GOOGLE_API_KEY";

useEffect(() => {
const token = localStorage.getItem("studentToken");
if (!token) router.push("/login");
}, []);

useEffect(() => {
async function fetchNotifications() {
const allNotifications = [];
for (let folder of folders) {
const res = await fetch(
`https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents&key=${API_KEY}&fields=files(id,name,webViewLink)`
);
const data = await res.json();
if (data.files) {
data.files.forEach((file) => {
allNotifications.push({
id: file.id,
title: `New PDF: ${file.name}`,
message: `${folder.category} notes are available`,
time: "Just now",
unread: true,
});
});
}
}
setNotifications(allNotifications);
}

```
fetchNotifications();
```

}, []);

return ( <main className="min-h-screen bg-gray-100 p-10 flex flex-col"> <h1 className="text-3xl font-bold text-blue-700 mb-6">Notifications</h1> <div className="flex flex-col gap-4">
{notifications.map((note) => ( <div
         key={note.id}
         className="bg-white p-4 rounded-xl shadow border flex flex-col md:flex-row justify-between items-start md:items-center"
       > <div> <h3 className="font-semibold text-gray-800">{note.title}</h3> <p className="text-gray-600">{note.message}</p> </div> <span className="text-gray-400 text-sm mt-2 md:mt-0">{note.time}</span> </div>
))} </div> <footer className="bg-gray-800 text-gray-300 text-center py-6 mt-10">
© 2022 Odia IT Training Hub. All rights reserved. </footer> </main>
);
}
