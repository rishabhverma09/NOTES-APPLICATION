import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import NoteCard from "../components/NoteCard";
import NoteForm from "../components/NoteForm";
import { getNotes, searchNotes, createNote, updateNote, deleteNote } from "../services/api";

/**
 * Dashboard Page:
 * Displays user's notes grid, search capabilities, create/edit modals,
 * and delete confirmation workflow.
 */
const Dashboard = () => {
  const [notes, setNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Notification banners (success or error)
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // Modal state for Create / Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Delete confirmation modal state
  const [deletingNote, setDeletingNote] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  /**
   * Display temporary feedback notification that automatically clears
   */
  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback((current) => (current?.message === message ? null : current));
    }, 4000);
  };

  /**
   * Fetch all notes from backend
   */
  const fetchAllNotes = useCallback(async () => {
    setIsLoadingNotes(true);
    try {
      const data = await getNotes();
      // Ensure data is an array
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      showFeedback("error", err.message || "Failed to load notes. Please refresh.");
    } finally {
      setIsLoadingNotes(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchAllNotes();
  }, [fetchAllNotes]);

  /**
   * Handle Search execution
   */
  const handleSearch = async (term) => {
    const trimmed = term.trim();
    setSearchTerm(trimmed);

    if (!trimmed) {
      fetchAllNotes();
      return;
    }

    setIsSearching(true);
    try {
      const data = await searchNotes(trimmed);
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      showFeedback("error", err.message || "Failed to search notes.");
    } finally {
      setIsSearching(false);
    }
  };

  /**
   * Handle Search Clear
   */
  const handleClearSearch = () => {
    setSearchTerm("");
    fetchAllNotes();
  };

  /**
   * Open modal to create a new note
   */
  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  /**
   * Open modal to edit an existing note
   */
  const handleOpenEditModal = (note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  /**
   * Close Create/Edit modal
   */
  const handleCloseFormModal = () => {
    if (!isSubmittingForm) {
      setIsFormOpen(false);
      setEditingNote(null);
    }
  };

  /**
   * Submit Create or Update note
   */
  const handleFormSubmit = async (formData) => {
    setIsSubmittingForm(true);
    try {
      if (editingNote) {
        // Update existing note
        const noteId = editingNote._id || editingNote.id;
        await updateNote(noteId, formData);
        showFeedback("success", "Note updated successfully");
      } else {
        // Create new note
        await createNote(formData);
        showFeedback("success", "Note created successfully");
      }

      setIsFormOpen(false);
      setEditingNote(null);

      // Refresh notes list (maintain search if active, or reload all)
      if (searchTerm) {
        await handleSearch(searchTerm);
      } else {
        await fetchAllNotes();
      }
    } catch (err) {
      showFeedback("error", err.message || "Failed to save note. Please try again.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  /**
   * Prompt confirmation before deleting
   */
  const handlePromptDelete = (note) => {
    setDeletingNote(note);
  };

  /**
   * Confirm deletion
   */
  const handleConfirmDelete = async () => {
    if (!deletingNote) return;

    setIsDeleting(true);
    try {
      const noteId = deletingNote._id || deletingNote.id;
      await deleteNote(noteId);
      showFeedback("success", "Note deleted successfully");
      setDeletingNote(null);

      // Refresh notes list
      if (searchTerm) {
        await handleSearch(searchTerm);
      } else {
        await fetchAllNotes();
      }
    } catch (err) {
      showFeedback("error", err.message || "Failed to delete note. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Top Navigation */}
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-container">
          {/* Feedback Banner */}
          {feedback && (
            <div
              className={`feedback-banner feedback-${feedback.type}`}
              role="alert"
            >
              <span>{feedback.message}</span>
              <button
                type="button"
                className="feedback-dismiss"
                onClick={() => setFeedback(null)}
                aria-label="Dismiss message"
              >
                &times;
              </button>
            </div>
          )}

          {/* Action & Search Section */}
          <div className="dashboard-actions-bar">
            <div className="dashboard-search-wrapper">
              <SearchBar
                value={searchTerm}
                onSearch={handleSearch}
                onClear={handleClearSearch}
                isSearching={isSearching}
              />
            </div>

            <button
              id="create-note-btn"
              className="btn btn-primary create-btn"
              onClick={handleOpenCreateModal}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginRight: "6px" }}
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Create Note
            </button>
          </div>

          {/* Active Search status indicator */}
          {searchTerm && (
            <div className="search-status-bar">
              <span>
                Showing results for "<strong>{searchTerm}</strong>"
              </span>
              <button
                className="btn-link"
                onClick={handleClearSearch}
                type="button"
              >
                Clear filter
              </button>
            </div>
          )}

          {/* Notes Grid / States */}
          <section className="notes-section" aria-label="Notes List">
            {isLoadingNotes ? (
              <div className="loading-state">
                <div className="spinner-lg"></div>
                <p>Loading your notes...</p>
              </div>
            ) : isSearching ? (
              <div className="loading-state">
                <div className="spinner-lg"></div>
                <p>Searching...</p>
              </div>
            ) : notes.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <svg
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                  </svg>
                </div>
                {searchTerm ? (
                  <>
                    <h3 className="empty-title">No notes found</h3>
                    <p className="empty-subtitle">
                      No notes matched your search term "{searchTerm}". Try a different keyword or clear the search.
                    </p>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={handleClearSearch}
                    >
                      View All Notes
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="empty-title">No notes yet</h3>
                    <p className="empty-subtitle">
                      Capture your thoughts, ideas, tasks, or study material in one clean place.
                    </p>
                    <button
                      id="create-first-note-btn"
                      className="btn btn-primary"
                      onClick={handleOpenCreateModal}
                    >
                      Create your first note
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="notes-grid">
                {notes.map((note) => (
                  <NoteCard
                    key={note._id || note.id}
                    note={note}
                    onEdit={handleOpenEditModal}
                    onDelete={handlePromptDelete}
                    isDeleting={isDeleting && (deletingNote?._id === note._id || deletingNote?.id === note.id)}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Create / Edit Note Modal */}
      <NoteForm
        isOpen={isFormOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        initialData={editingNote}
        isLoading={isSubmittingForm}
      />

      {/* Delete Confirmation Modal */}
      {deletingNote && (
        <div
          className="modal-overlay"
          onClick={() => !isDeleting && setDeletingNote(null)}
          role="presentation"
        >
          <div
            className="modal-container modal-confirm"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-delete-title"
          >
            <div className="confirm-icon-danger">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 id="confirm-delete-title" className="confirm-title">
              Delete Note
            </h3>
            <p className="confirm-message">
              Are you sure you want to delete this note?
            </p>
            <p className="confirm-note-preview">"{deletingNote.title}"</p>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setDeletingNote(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-delete-btn"
                className="btn btn-danger"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <span className="btn-loading">
                    <span className="spinner-sm"></span> Deleting...
                  </span>
                ) : (
                  "Delete Note"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
