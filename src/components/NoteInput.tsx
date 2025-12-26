import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface NoteInputProps {
  onSubmit: (content: string) => Promise<{ success: boolean; error?: string }>;
}

export const NoteInput = ({ onSubmit }: NoteInputProps) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Please write something first');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await onSubmit(content);

    if (result.success) {
      setContent('');
    } else {
      setError(result.error || 'Failed to save note');
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError(null);
          }}
          placeholder="What's on your mind? ✨"
          className="w-full min-h-[140px] p-4 rounded-xl bg-card border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none text-foreground placeholder:text-muted-foreground"
          disabled={isSubmitting}
        />
      </div>
      
      {error && (
        <p className="text-destructive text-sm animate-fade-in">{error}</p>
      )}
      
      <button
        type="submit"
        disabled={isSubmitting || !content.trim()}
        className="w-full sm:w-auto px-6 py-3 gradient-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Save Note
          </>
        )}
      </button>
    </form>
  );
};
