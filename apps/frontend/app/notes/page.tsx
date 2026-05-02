"use client";

import { apiFetch } from "@/lib/api";
import { getMe } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Note = {
  id: string;
  content: string;
};

export default function NotesPage() {
  const router = useRouter();

  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const user = await getMe();

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

  async function createNote() {
    if (!newNote.trim()) return;

    const res = await apiFetch("/notes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newNote }),
    });

    if (res.ok) {
      const createdNote = await res.json();
      setNotes((prev) => [...prev, createdNote]);
      setNewNote("");
    }
  }

  async function deleteNote(id: string) {
    const res = await apiFetch(`/notes/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setNotes((prev) => prev.filter((note) => note._id !== id));
    }
  }

  async function updateNote(id: string, content: string) {
    const res = await apiFetch(`/notes/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (res.ok) {
      setNotes((prev) =>
        prev.map((note) => (note._id === id ? { ...note, content } : note)),
      );
    }
  }

  if (loading)
    return (
      <div className="min-h-screen w-full items-center justify-center bg-gray-100 text-gray-900 p-8">
        <div className="text-2xl font-bold mb-8">Loading...</div>
      </div>
    );

  return (
    <div className="min-h-screen w-full items-center justify-center bg-gray-100 text-gray-900 p-8">
      <div className="text-2xl font-bold mb-8">My Notes</div>
      <div className="mb-4">
        <input
          type="text"
          placeholder="New note content"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none text-gray-700"
        />
        <button
          onClick={createNote}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Note
        </button>
      </div>

      {notes.map((note) => (
        <div className="w-full max-w-2xl relative">
          <div key={note._id} className="p-4 bg-white rounded shadow mb-4">
            <input
              type="text"
              value={note.content}
              onChange={(e) => updateNote(note._id, e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none text-gray-700"
            />
          </div>
          <button
            onClick={() => deleteNote(note._id)}
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded absolute -right-5 -top-6"
          >
            X
          </button>
        </div>
      ))}
    </div>
  );
}
