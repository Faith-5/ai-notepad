import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Save,
  Trash2,
  Sparkles,
  Loader2,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNotes } from "@/hooks/useNotes";
import { useAiAssist } from "@/hooks/useAiAssist";
import { toast } from "sonner";

export default function NoteEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isNew = id === "new";
  const { getNote, saveNote, deleteNote } = useNotes();
  const { assist, loading: aiLoading } = useAiAssist();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isNew && id) {
      const note = getNote(id);
      if (note) {
        setTitle(note.title);
        setContent(note.content);
      }
    }
  }, [id, isNew, getNote]);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Please add a title");
      return;
    }
    setSaving(true);
    try {
      const result = await saveNote({
        id: isNew ? undefined : id,
        title,
        content,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      toast.success("Note saved");
      if (isNew && result) {
        navigate(`/note/${result.id}`, { replace: true });
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!id || isNew) return;
    try {
      await deleteNote(id);
      toast.success("Note deleted");
      navigate("/dashboard");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleAiAssist = async () => {
    try {
      const result = await assist(content, "Improve this note");
      setAiResult(result);
    } catch {
      toast.error("AI assistance failed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="h-14 border-b border-border flex items-center px-4 gap-2 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/dashboard")}
          className="gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back</span>
        </Button>

        <div className="flex-1" />

        {!isNew && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            className="text-muted-foreground hover:text-destructive gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className="gap-1.5"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <Check className="w-4 h-4 text-success" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">{saved ? "Saved" : "Save"}</span>
        </Button>

        <Button
          onClick={handleAiAssist}
          disabled={aiLoading || !content.trim()}
          className="bg-accent text-accent-foreground hover:bg-accent/90 gap-2 ai-glow-subtle"
          size="sm"
        >
          {aiLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">AI Assist</span>
        </Button>
      </header>

      {/* Editor */}
      <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto p-4 sm:p-8">
        <Input
          placeholder="Untitled Note"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl sm:text-3xl font-bold border-none shadow-none px-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/40"
        />

        <textarea
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 mt-4 w-full resize-none bg-transparent text-foreground placeholder:text-muted-foreground/40 focus:outline-none text-base leading-relaxed min-h-[300px]"
        />
      </div>

      {/* AI Result Panel */}
      <AnimatePresence>
        {aiResult && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-accent/30 shadow-xl"
          >
            <div className="max-w-4xl mx-auto p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-accent">
                  <Sparkles className="w-4 h-4" />
                  <span className="font-semibold text-sm">AI Suggestion</span>
                </div>
                <button
                  onClick={() => setAiResult(null)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground font-sans leading-relaxed">
                {aiResult}
              </pre>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => {
                    setContent((prev) => prev + "\n\n" + aiResult);
                    setAiResult(null);
                    toast.success("Applied to note");
                  }}
                >
                  Apply
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setAiResult(null)}
                >
                  Dismiss
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete confirmation */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-card rounded-xl p-6 max-w-sm w-full border border-border shadow-xl"
            >
              <h3 className="text-lg font-semibold mb-2">Delete Note</h3>
              <p className="text-sm text-muted-foreground mb-6">
                This action cannot be undone. Are you sure?
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    handleDelete();
                  }}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
