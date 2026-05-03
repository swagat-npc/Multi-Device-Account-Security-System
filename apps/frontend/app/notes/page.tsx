"use client";

import { apiFetch } from "@/lib/api";
import { getMe } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Note = {
  _id: string;
  content: string;
  isHidden: boolean;
};

export default function NotesPage() {
  const router = useRouter();

  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [editNote, setEditNote] = useState<string[]>([]);
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

  async function deleteNote(note: Note) {
    const res = await apiFetch(`/notes/${note._id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setNotes((prev) => prev.filter((n) => n._id !== note._id));
    }
  }

  async function updateNote(note: Note) {
    const res = await apiFetch(`/notes/${note._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: note.content, isHidden: note.isHidden }),
    });

    if (res.ok) {
      setNotes((prev) =>
        prev.map((n) => (n._id === note._id ? { ...n, content: note.content, isHidden: note.isHidden } : n)),
      );
    }
  }

  async function hideNote(note: Note) {
    updateNote({ ...note, isHidden: !note.isHidden });
  }

  function editAction(id: string) {
    if (editNote.includes(id)) {
      setEditNote((prev) => prev.filter((noteId) => noteId !== id));
    } else {
      setEditNote((prev) => [...prev, id]);
    }
  }

  function saveAction(note: Note) { 
    updateNote(note);
    editAction(note._id);
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
      {notes.map((note) => {
        const isEditing = editNote.includes(note._id);

        return (
          <div key={note._id} className={"w-full max-w-2xl relative " + (note.isHidden ? 'opacity-50' : '')}>
            <div className="p-4 bg-white rounded shadow mb-4 flex flex-col">
              <div className="w-full">
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      value={note.content}
                      onChange={(e) =>
                        setNotes((prev) =>
                          prev.map((n) =>
                            n._id === note._id
                              ? { ...n, content: e.target.value }
                              : n,
                          ),
                        )
                      }
                      className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none text-gray-700"
                    />
                  </div>
                ) : (
                  <div className="w-full px-4 py-3 bg-gray-200 mt-2 text-gray-700">
                    {note.content}
                  </div>
                )}
              </div>
              <div className="btn-container flex gap-4 self-end mt-2">
                {isEditing ? (
                  <button
                    onClick={() => saveAction(note)}
                    className="mt-2 bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded cursor-pointer"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => editAction(note._id)}
                    className="mt-2 bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => deleteNote(note)}
                  className="mt-2 bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded cursor-pointer"
                >
                  Delete
                </button>
                <button
                  onClick={() => hideNote(note)}
                  className="mt-2 bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded cursor-pointer"
                >
                  {note.isHidden ? "Unhide" : "Hide"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
      ;
    </div>
  );
}
