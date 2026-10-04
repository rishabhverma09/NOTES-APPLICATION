import React from "react";

/**
 * Helper to format ISO timestamps into clean, human-readable date/time strings.
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "N/A";
  }
};

/**
 * NoteCard Component:
 * Displays a single note with its title, safe JSX content, created/updated dates,
 * and action buttons for editing and deleting.
 *
 * @param {object} note - Note data object { _id, title, content, createdAt, updatedAt }
 * @param {function} onEdit - Callback when Edit is clicked
 * @param {function} onDelete - Callback when Delete is clicked
 * @param {boolean} isDeleting - True if this note is currently being deleted
 */
const NoteCard = ({ note, onEdit, onDelete, isDeleting = false }) => {
  const noteId = note._id || note.id;

  return (
    <article className="note-card" id={`note-card-${noteId}`}>
      <div className="note-card-header">
        <h3 className="note-title">{note.title}</h3>
      </div>

      <div className="note-card-body">
        {/* Render note content safely using standard React JSX text */}
        <p className="note-content">{note.content}</p>
      </div>

      <div className="note-card-footer">
        <div className="note-metadata">
          <div className="meta-item" title="Date created">
            <span className="meta-label">Created:</span>
            <span className="meta-value">{formatDate(note.createdAt)}</span>
          </div>
          {note.updatedAt && (
            <div className="meta-item" title="Date last updated">
              <span className="meta-label">Updated:</span>
              <span className="meta-value">{formatDate(note.updatedAt)}</span>
            </div>
          )}
        </div>

        <div className="note-actions">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => onEdit(note)}
            disabled={isDeleting}
            title="Edit note"
            aria-label={`Edit ${note.title}`}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginRight: "4px" }}
            >
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
            </svg>
            Edit
          </button>

          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(note)}
            disabled={isDeleting}
            title="Delete note"
            aria-label={`Delete ${note.title}`}
          >
            {isDeleting ? (
              <span className="spinner-sm"></span>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ marginRight: "4px" }}
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default NoteCard;
