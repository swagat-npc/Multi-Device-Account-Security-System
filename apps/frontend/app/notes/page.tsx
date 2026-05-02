"use client";

import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function NotesPage() {
    const router = useRouter();

  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const res = await apiFetch("http://localhost:3001/notes", {
      method: "GET",
      credentials: "include",
    });
    
    const data = await res.json().catch(() => null);

    if (res.ok) {
        setNotes(data);
    } else {
        router.push("/login");
    }
  }

  return (
    <div className="min-h-screen w-full items-center justify-center bg-gray-100 text-gray-900 p-8">
      <div className="text-2xl font-bold mb-8">My Notes</div>

        {
            notes.map((note) => (
                <div key={note._id} className="p-4 bg-white rounded shadow mb-4">
                    <p>{note.content}</p>
                </div>
            ))
        }

    </div>
  );
}
