import { useState, useCallback } from "react";

export function useAiAssist() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const assist = useCallback(async (content: string, instruction?: string): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder: replace with api.aiAssist(content, instruction)
      await new Promise((r) => setTimeout(r, 1500));
      return `✨ AI Suggestion:\n\nBased on your note, here are some improvements:\n\n- Consider adding more detail to your key points\n- The structure could benefit from subheadings\n- Try breaking long paragraphs into bullet points\n\n(This is a placeholder response — connect to your FastAPI backend's /api/ai-assist endpoint)`;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { assist, loading, error };
}
