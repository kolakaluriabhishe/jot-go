import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotes } from '@/hooks/useNotes';
import { ThemeToggle } from '@/components/ThemeToggle';
import { NoteCard } from '@/components/NoteCard';
import { NoteInput } from '@/components/NoteInput';
import { LogOut, Sparkles, FileText, Loader2, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Notes = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { notes, loading: notesLoading, error, createNote, deleteNote, refreshNotes } = useNotes();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleDeleteNote = async (noteId: string) => {
    setDeletingId(noteId);
    const result = await deleteNote(noteId);
    
    if (result.success) {
      toast({
        title: 'Note deleted',
        description: 'Your note has been removed.',
      });
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete note',
        variant: 'destructive',
      });
    }
    
    setDeletingId(null);
  };

  const handleCreateNote = async (content: string) => {
    const result = await createNote(content);
    
    if (result.success) {
      toast({
        title: 'Note saved! ✨',
        description: 'Your thought has been captured.',
      });
    }
    
    return result;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-soft">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Create & Save</h1>
              <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-none">
                {user?.email}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="p-2.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all duration-200 hover:scale-105 active:scale-95"
              aria-label="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-8">
        {/* Create note section */}
        <section className="mb-10 animate-fade-in">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            New Note
          </h2>
          <div className="gradient-card rounded-2xl p-6 shadow-soft border border-border/50">
            <NoteInput onSubmit={handleCreateNote} />
          </div>
        </section>

        {/* Notes list section */}
        <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">
              Your Notes
              {notes.length > 0 && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({notes.length})
                </span>
              )}
            </h2>
            <button
              onClick={refreshNotes}
              disabled={notesLoading}
              className="p-2 rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
              aria-label="Refresh notes"
            >
              <RefreshCw className={`w-4 h-4 text-muted-foreground ${notesLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Loading state */}
          {notesLoading && notes.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm animate-fade-in mb-4">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!notesLoading && notes.length === 0 && !error && (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-secondary flex items-center justify-center">
                <FileText className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No notes yet</h3>
              <p className="text-muted-foreground">
                Start by creating your first note above!
              </p>
            </div>
          )}

          {/* Notes grid */}
          {notes.length > 0 && (
            <div className="space-y-4">
              {notes.map((note, index) => (
                <div
                  key={note.id}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <NoteCard
                    note={note}
                    onDelete={handleDeleteNote}
                    isDeleting={deletingId === note.id}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-muted-foreground text-sm border-t border-border">
        <p>Create & Save • Your notes, your way</p>
      </footer>
    </div>
  );
};

export default Notes;
