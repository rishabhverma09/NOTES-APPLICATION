import React, { useState, useEffect } from "react";

/**
 * NoteForm Component (Modal dialog for creating and editing notes):
 *
 * @param {boolean} isOpen - Whether modal is visible
 * @param {function} onClose - Closes the modal
 * @param {function} onSubmit - Handler for submit ({ title, content })
 * @param {object|null} initialData - Note object if editing, or null if creating
 * @param {boolean} isLoading - Loading state during API request
 */
const NoteForm = ({ isOpen, onClose, onSubmit, initialData = null, isLoading = false }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const isEditing = Boolean(initialData && (initialData._id || initialData.id));

  // Pre-fill fields when editing, or reset when creating
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
    } else {
      setTitle("");
      setContent("");
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Please enter a note title.");
      return;
    }

    if (!content.trim()) {
      setError("Please enter note content.");
      return;
    }

    setError("");
    await onSubmit({
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="presentation">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {isEditing ? "Edit Note" : "Create New Note"}
          </h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close dialog"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="form-group">
            <label htmlFor="note-title-input" className="form-label">
              Title <span className="required-star">*</span>
            </label>
            <input
              id="note-title-input"
              type="text"
              className="form-input"
              placeholder="e.g., Grocery List or Project Roadmap"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
              autoFocus
              maxLength={120}
            />
          </div>

          <div className="form-group">
            <label htmlFor="note-content-input" className="form-label">
              Content <span className="required-star">*</span>
            </label>
            <textarea
              id="note-content-input"
              className="form-textarea"
              placeholder="Write your note details here..."
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              id="save-note-btn"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="btn-loading">
                  <span className="spinner-sm"></span> Saving...
                </span>
              ) : isEditing ? (
                "Update Note"
              ) : (
                "Save Note"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
