import { useState, useEffect, useCallback } from 'react';
import { supabase, Note } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Fetch all notes for the current user
  const fetchNotes = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) {
        throw fetchError;
      }

      setNotes(data || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch notes';
      setError(message);
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Create a new note
  const createNote = async (content: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'You must be logged in to create notes' };
    }

    if (!content.trim()) {
      return { success: false, error: 'Note content cannot be empty' };
    }

    try {
      const { data, error: insertError } = await supabase
        .from('notes')
        .insert([{ user_id: user.id, content: content.trim() }])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      // Add new note to the beginning of the list
      setNotes(prev => [data, ...prev]);
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create note';
      console.error('Error creating note:', err);
      return { success: false, error: message };
    }
  };

  // Delete a note
  const deleteNote = async (noteId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'You must be logged in to delete notes' };
    }

    try {
      const { error: deleteError } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (deleteError) {
        throw deleteError;
      }

      // Remove note from the list
      setNotes(prev => prev.filter(note => note.id !== noteId));
      return { success: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete note';
      console.error('Error deleting note:', err);
      return { success: false, error: message };
    }
  };

  // Fetch notes on mount and when user changes
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    loading,
    error,
    createNote,
    deleteNote,
    refreshNotes: fetchNotes,
  };
};
