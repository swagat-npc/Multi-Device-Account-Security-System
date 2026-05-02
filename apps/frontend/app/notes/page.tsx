"use client";

import { apiFetch } from "@/lib/api";
import { getMe } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotesPage() {
  const router = useRouter();

  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    console.log("Fetching notes...");
    const user = await getMe();
    console.log("Reached outside to fetch notes");

    if (!user) {
      router.push("/login");
      return;
    }


    const res = await apiFetch("/notes");

    const data = await res.json().catch(() => null);

    if (res.ok) {
      setNotes(data);
    }
      
    setLoading(false);    
  }

  if (loading) return (
    <div className="min-h-screen w-full items-center justify-center bg-gray-100 text-gray-900 p-8">
      <div className="text-2xl font-bold mb-8">Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen w-full items-center justify-center bg-gray-100 text-gray-900 p-8">
      <div className="text-2xl font-bold mb-8">My Notes</div>

      {notes.map((note) => (
        <div key={note._id} className="p-4 bg-white rounded shadow mb-4">
          <p>{note.content}</p>
        </div>
      ))}
    </div>
  );
}
