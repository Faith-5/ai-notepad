import { useState, useEffect, useCallback } from "react";
import type { Note } from "@/types";

const DUMMY_NOTES: Note[] = [
  {
    id: "1",
    title: "Project Planning",
    content: "Break down the AI Notepad project into sprints. Focus on core editor functionality first, then add AI features.\n\nKey milestones:\n- Week 1: Auth + basic CRUD\n- Week 2: Editor polish\n- Week 3: AI integration",
    created_at: "2026-02-28T10:00:00Z",
    updated_at: "2026-03-01T14:30:00Z",
  },
  {
    id: "2",
    title: "Meeting Notes — Team Sync",
    content: "Discussed API architecture with the backend team. Agreed on REST endpoints for notes CRUD and a separate AI endpoint.\n\nAction items:\n- Finalize auth flow\n- Set up CI/CD pipeline",
    created_at: "2026-02-25T09:00:00Z",
    updated_at: "2026-02-27T11:15:00Z",
  },
  {
    id: "3",
    title: "Research: LLM Integration",
    content: "Explored different approaches for AI-assisted writing. Options include GPT-4, Claude, and open-source models.\n\nPros of Claude:\n- Better at following instructions\n- Longer context window",
    created_at: "2026-02-20T16:00:00Z",
    updated_at: "2026-02-22T09:45:00Z",
  },
  {
    id: "4",
    title: "Quick Ideas",
    content: "- Add markdown support to the editor\n- Voice-to-text feature for mobile\n- Smart tagging with AI\n- Export notes as PDF",
    created_at: "2026-02-18T08:00:00Z",
    updated_at: "2026-02-18T08:30:00Z",
  },
];

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setNotes(DUMMY_NOTES);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const saveNote = useCallback(async (note: Partial<Note> & { title: string; content: string }) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const now = new Date().toISOString();
      if (note.id) {
        setNotes((prev) =>
          prev.map((n) => (n.id === note.id ? { ...n, ...note, updated_at: now } : n))
        );
        return { ...note, updated_at: now } as Note;
      } else {
        const newNote: Note = {
          id: String(Date.now()),
          title: note.title,
          content: note.content,
          created_at: now,
          updated_at: now,
        };
        setNotes((prev) => [newNote, ...prev]);
        return newNote;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } finally {
      setLoading(false);
    }
  }, []);

  const getNote = useCallback(
    (id: string) => notes.find((n) => n.id === id) || null,
    [notes]
  );

  return { notes, loading, error, fetchNotes, saveNote, deleteNote, getNote };
}
