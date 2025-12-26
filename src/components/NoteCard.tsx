import { Note } from '@/lib/supabase';
import { Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export const NoteCard = ({ note, onDelete, isDeleting }: NoteCardProps) => {
  const formattedDate = format(new Date(note.created_at), 'MMM d, yyyy • h:mm a');

  return (
    <div className="group gradient-card rounded-xl p-5 shadow-soft hover:shadow-medium transition-all duration-300 animate-scale-in border border-border/50">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-foreground whitespace-pre-wrap break-words leading-relaxed">
            {note.content}
          </p>
          <p className="text-muted-foreground text-sm mt-3">
            {formattedDate}
          </p>
        </div>
        <button
          onClick={() => onDelete(note.id)}
          disabled={isDeleting}
          className="flex-shrink-0 p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Delete note"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
